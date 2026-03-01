// server/services/escrowService.js
// PODnig Escrow Engine
// This is the trust backbone. Every naira is accounted for.

const { PrismaClient } = require('@prisma/client');
const notificationService = require('./notificationService');

const COMMISSION_RATE = 0.03; // 3% platform fee

/**
 * LOCK funds into escrow when buyer pays.
 * Buyer wallet balance decreases, escrow balance increases.
 * Seller NOT credited yet — only after delivery confirmation.
 */
async function lockEscrow(prisma, { orderId, buyerId, sellerId, amount }) {
  return await prisma.$transaction(async (tx) => {
    const buyerWallet = await tx.wallet.findUnique({ where: { userId: buyerId }, select: { id: true, balance: true, escrowBalance: true } });
    const sellerWallet = await tx.wallet.findUnique({ where: { userId: sellerId } });

    if (!buyerWallet || buyerWallet.balance < BigInt(amount)) {
      throw new Error('INSUFFICIENT_BALANCE');
    }

    // Debit buyer's available balance, add to escrow
    await tx.wallet.update({
      where: { id: buyerWallet.id },
      data: {
        balance: buyerWallet.balance - BigInt(amount),
        escrowBalance: buyerWallet.escrowBalance + BigInt(amount),
      },
    });

    // Log transaction
    await tx.transaction.create({
      data: {
        walletId: buyerWallet.id,
        type: 'ESCROW_LOCK',
        amount: BigInt(amount),
        balanceBefore: buyerWallet.balance,
        balanceAfter: buyerWallet.balance - BigInt(amount),
        description: `Escrow locked for Order ${orderId}`,
        orderId,
      },
    });

    // Create escrow entry
    await tx.escrowEntry.create({
      data: {
        orderId,
        amount: BigInt(amount),
        buyerWalletId: buyerWallet.id,
        sellerWalletId: sellerWallet.id,
      },
    });

    // Update order status
    await tx.order.update({
      where: { id: orderId },
      data: { status: 'PAID_IN_ESCROW', paidAt: new Date() },
    });

    // Notify both parties
    await notificationService.send(buyerId, {
      title: '🔒 Payment in Escrow',
      message: `Your payment of ₦${(amount/100).toLocaleString()} is secured. Seller will be notified to dispatch.`,
      type: 'ESCROW',
      data: { orderId },
    });

    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: { include: { product: true } } } });
    const productName = order?.items?.[0]?.product?.name || 'your item';
    
    await notificationService.send(sellerId, {
      title: '📦 New Order! Prepare to Dispatch',
      message: `You have a new confirmed order for ${productName}. ₦${((amount*(1-COMMISSION_RATE))/100).toLocaleString()} will be released upon delivery.`,
      type: 'ORDER',
      data: { orderId },
    });

    return { success: true, escrowRef: orderId };
  });
}

/**
 * RELEASE escrow to seller when buyer confirms delivery.
 * Commission (3%) is deducted. Remainder goes to seller.
 * Auto-release after 7 days if buyer doesn't respond.
 */
async function releaseEscrow(prisma, { orderId, confirmedByBuyer = true }) {
  return await prisma.$transaction(async (tx) => {
    const escrow = await tx.escrowEntry.findUnique({ where: { orderId } });
    if (!escrow || escrow.status !== 'LOCKED') throw new Error('INVALID_ESCROW');

    const order = await tx.order.findUnique({ where: { id: orderId }, include: { buyer: true, seller: { include: { user: true } } } });

    const totalAmount = escrow.amount;
    const commission = BigInt(Math.round(Number(totalAmount) * COMMISSION_RATE));
    const sellerReceives = totalAmount - commission;

    // Credit seller wallet
    const sellerWallet = await tx.wallet.findUnique({ where: { id: escrow.sellerWalletId } });
    await tx.wallet.update({
      where: { id: escrow.sellerWalletId },
      data: {
        balance: sellerWallet.balance + sellerReceives,
        totalEarned: sellerWallet.totalEarned + sellerReceives,
      },
    });

    // Release from buyer's escrow balance
    const buyerWallet = await tx.wallet.findUnique({ where: { id: escrow.buyerWalletId } });
    await tx.wallet.update({
      where: { id: escrow.buyerWalletId },
      data: { escrowBalance: buyerWallet.escrowBalance - totalAmount },
    });

    // Log transactions
    await tx.transaction.create({
      data: {
        walletId: escrow.sellerWalletId,
        type: 'ESCROW_RELEASE',
        amount: sellerReceives,
        balanceBefore: sellerWallet.balance,
        balanceAfter: sellerWallet.balance + sellerReceives,
        description: `Escrow released for Order ${orderId} (3% commission deducted)`,
        orderId,
      },
    });

    await tx.transaction.create({
      data: {
        walletId: escrow.sellerWalletId,
        type: 'COMMISSION',
        amount: commission,
        balanceBefore: sellerWallet.balance + sellerReceives,
        balanceAfter: sellerWallet.balance + sellerReceives,
        description: `PODnig commission (3%) for Order ${orderId}`,
        orderId,
      },
    });

    // Update records
    await tx.escrowEntry.update({
      where: { orderId },
      data: { status: 'RELEASED', releasedAt: new Date() },
    });

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: 'COMPLETED',
        deliveredAt: confirmedByBuyer ? new Date() : order.deliveredAt,
        completedAt: new Date(),
      },
    });

    // Update seller stats
    await tx.sellerProfile.update({
      where: { id: order.sellerId },
      data: {
        totalSales: { increment: 1 },
        totalRevenue: { increment: sellerReceives },
      },
    });

    // Notify seller
    await notificationService.send(order.seller.user.id, {
      title: '💰 Payment Released!',
      message: `₦${(Number(sellerReceives)/100).toLocaleString()} has been added to your wallet for Order ${orderId}`,
      type: 'PAYMENT',
      data: { orderId, amount: Number(sellerReceives) },
    });

    return { success: true, sellerReceives: Number(sellerReceives), commission: Number(commission) };
  });
}

/**
 * REFUND buyer if dispute resolved in their favour.
 * Returns funds from escrow back to buyer's available balance.
 */
async function refundEscrow(prisma, { orderId, reason }) {
  return await prisma.$transaction(async (tx) => {
    const escrow = await tx.escrowEntry.findUnique({ where: { orderId } });
    if (!escrow || escrow.status !== 'LOCKED') throw new Error('INVALID_ESCROW');

    const order = await tx.order.findUnique({ where: { id: orderId } });

    const buyerWallet = await tx.wallet.findUnique({ where: { id: escrow.buyerWalletId } });
    await tx.wallet.update({
      where: { id: escrow.buyerWalletId },
      data: {
        balance: buyerWallet.balance + escrow.amount,
        escrowBalance: buyerWallet.escrowBalance - escrow.amount,
      },
    });

    await tx.transaction.create({
      data: {
        walletId: escrow.buyerWalletId,
        type: 'REFUND',
        amount: escrow.amount,
        balanceBefore: buyerWallet.balance,
        balanceAfter: buyerWallet.balance + escrow.amount,
        description: `Refund for Order ${orderId}: ${reason}`,
        orderId,
      },
    });

    await tx.escrowEntry.update({ where: { orderId }, data: { status: 'REFUNDED', releasedAt: new Date() } });
    await tx.order.update({ where: { id: orderId }, data: { status: 'REFUNDED' } });

    await notificationService.send(order.buyerId, {
      title: '✅ Refund Processed',
      message: `₦${(Number(escrow.amount)/100).toLocaleString()} has been refunded to your wallet`,
      type: 'PAYMENT',
      data: { orderId },
    });

    return { success: true };
  });
}

/**
 * AUTO-RELEASE job: runs every 6 hours.
 * If buyer hasn't confirmed within 7 days of dispatch,
 * funds auto-release to seller.
 */
async function autoReleaseExpiredEscrows(prisma) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const expiredOrders = await prisma.order.findMany({
    where: {
      status: 'SELLER_CONFIRMED_DISPATCH',
      dispatchedAt: { lte: sevenDaysAgo },
    },
    select: { id: true, buyerId: true, seller: { select: { userId: true } } },
  });

  for (const order of expiredOrders) {
    await releaseEscrow(prisma, { orderId: order.id, confirmedByBuyer: false });
    await notificationService.send(order.buyerId, {
      title: '⏰ Order Auto-Completed',
      message: 'Your order was auto-completed after 7 days. No dispute was raised.',
      type: 'ORDER',
      data: { orderId: order.id },
    });
  }

  return expiredOrders.length;
}

module.exports = { lockEscrow, releaseEscrow, refundEscrow, autoReleaseExpiredEscrows, COMMISSION_RATE };