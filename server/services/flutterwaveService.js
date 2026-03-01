// server/services/flutterwaveService.js
// Handles: Static Virtual Accounts, Payments, Webhooks, Withdrawals
const axios = require('axios');
const crypto = require('crypto');

const FLW_BASE = 'https://api.flutterwave.com/v3';
const FLW_SECRET = process.env.FLW_SECRET_KEY;

const flw = axios.create({
  baseURL: FLW_BASE,
  headers: { Authorization: `Bearer ${FLW_SECRET}`, 'Content-Type': 'application/json' },
});

// ─── VIRTUAL ACCOUNTS ─────────────────────────────────────────────
/**
 * Create a STATIC virtual account for a user on registration.
 * This is permanent — the same account forever.
 * Any transfer to it auto-credits the user's PODnig wallet.
 */
async function createStaticVirtualAccount({ email, name, userId, bvn = null }) {
  const payload = {
    email,
    is_permanent: true,             // STATIC — does not expire
    bvn,                            // Required by CBN for NGN accounts
    tx_ref: `PODNIG-VA-${userId}-${Date.now()}`,
    amount: null,                   // null = accept any amount
    currency: 'NGN',
    narration: `PODnig Wallet - ${name}`,
    // Flutterwave will send webhook when money arrives
  };

  try {
    const { data } = await flw.post('/virtual-account-numbers', payload);
    if (data.status === 'success') {
      return {
        accountNumber: data.data.account_number,
        bankName: data.data.bank_name,
        bankCode: data.data.bank_code,
        accountName: data.data.account_name,
        reference: data.data.order_ref,
        flwRef: data.data.flw_ref,
      };
    }
    throw new Error(data.message || 'VA creation failed');
  } catch (err) {
    // BVN not provided — use temporary VA approach
    // In production, prompt user to provide BVN for permanent VA
    console.error('[FLW VA Error]', err.response?.data || err.message);
    throw err;
  }
}

// ─── VERIFY WEBHOOK SIGNATURE ─────────────────────────────────────
/**
 * Flutterwave sends a signature in the verif-hash header.
 * Always verify before processing webhook.
 */
function verifyWebhookSignature(payload, signature) {
  const secretHash = process.env.FLW_WEBHOOK_SECRET;
  const hash = crypto.createHmac('sha256', secretHash).update(JSON.stringify(payload)).digest('hex');
  return hash === signature;
}

// ─── PROCESS WEBHOOK EVENT ────────────────────────────────────────
/**
 * Called by webhook controller. Routes to correct handler.
 * Events we care about:
 *   - charge.completed  → VA top-up → credit user wallet
 *   - transfer.completed → withdrawal → update withdrawal record
 */
async function processWebhookEvent(event, { prisma, notificationService }) {
  const { event: eventType, data } = event;

  if (eventType === 'charge.completed' && data.status === 'successful') {
    // Money arrived into a virtual account
    const txRef = data.tx_ref; // "PODNIG-VA-{userId}-{timestamp}"
    
    if (txRef && txRef.startsWith('PODNIG-VA-')) {
      const userId = txRef.split('-')[2];
      const amountInKobo = Math.round(data.amount * 100); // NGN → kobo
      
      await prisma.$transaction(async (tx) => {
        const wallet = await tx.wallet.findUnique({ where: { userId } });
        if (!wallet) return;

        const newBalance = wallet.balance + BigInt(amountInKobo);
        
        await tx.wallet.update({
          where: { id: wallet.id },
          data: { balance: newBalance, totalEarned: wallet.totalEarned + BigInt(amountInKobo) },
        });

        await tx.transaction.create({
          data: {
            walletId: wallet.id,
            type: 'CREDIT',
            amount: BigInt(amountInKobo),
            balanceBefore: wallet.balance,
            balanceAfter: newBalance,
            reference: data.flw_ref,
            description: `Wallet top-up via ${data.payment_type === 'banktransfer' ? 'Bank Transfer' : data.payment_type}`,
            metadata: { flwRef: data.flw_ref, channel: data.payment_type },
          },
        });

        // Real-time notification
        await notificationService.send(userId, {
          title: '💳 Wallet Credited',
          message: `₦${data.amount.toLocaleString()} has been added to your PODnig wallet`,
          type: 'PAYMENT',
          data: { amount: amountInKobo, reference: data.flw_ref },
        });
      });
    }
  }

  if (eventType === 'transfer.completed') {
    // Withdrawal completed
    const { reference, status, complete_message } = data;
    
    await prisma.withdrawal.updateMany({
      where: { flwRef: reference },
      data: {
        status: status === 'SUCCESSFUL' ? 'COMPLETED' : 'FAILED',
        failureReason: status !== 'SUCCESSFUL' ? complete_message : null,
        processedAt: new Date(),
      },
    });
  }
}

// ─── INITIATE WITHDRAWAL ──────────────────────────────────────────
async function initiateWithdrawal({ amount, bankCode, accountNumber, accountName, reference, narration }) {
  const { data } = await flw.post('/transfers', {
    account_bank: bankCode,
    account_number: accountNumber,
    amount: amount / 100, // kobo → NGN
    narration: narration || 'PODnig Withdrawal',
    currency: 'NGN',
    reference,
    callback_url: `${process.env.APP_URL}/api/webhooks/flutterwave`,
    beneficiary_name: accountName,
  });
  return data;
}

// ─── VERIFY TRANSACTION ──────────────────────────────────────────
async function verifyTransaction(transactionId) {
  const { data } = await flw.get(`/transactions/${transactionId}/verify`);
  return data;
}

// ─── LIST NIGERIAN BANKS ──────────────────────────────────────────
async function getNigerianBanks() {
  const { data } = await flw.get('/banks/NG');
  return data.data;
}

// ─── RESOLVE ACCOUNT NAME ────────────────────────────────────────
async function resolveAccountName({ accountNumber, bankCode }) {
  const { data } = await flw.post('/accounts/resolve', {
    account_number: accountNumber,
    account_bank: bankCode,
  });
  return data.data;
}

module.exports = {
  createStaticVirtualAccount,
  verifyWebhookSignature,
  processWebhookEvent,
  initiateWithdrawal,
  verifyTransaction,
  getNigerianBanks,
  resolveAccountName,
};