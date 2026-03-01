// server/jobs/cronJobs.js
// Automated background jobs — the platform runs itself
const cron = require('node-cron');
const { PrismaClient } = require('@prisma/client');
const { autoReleaseExpiredEscrows } = require('../services/escrowService');

const prisma = new PrismaClient();

function startCronJobs() {
  // ─── Auto-release escrow every 6 hours ──────────────────────────
  // If buyer hasn't confirmed delivery 7 days after dispatch → auto-release
  cron.schedule('0 */6 * * *', async () => {
    try {
      const released = await autoReleaseExpiredEscrows(prisma);
      if (released > 0) console.log(`[CRON] Auto-released ${released} expired escrows`);
    } catch (err) { console.error('[CRON] Auto-release failed:', err.message); }
  });

  // ─── Deactivate expired sponsored listings every hour ──────────
  cron.schedule('0 * * * *', async () => {
    try {
      const { count } = await prisma.sponsoredListing.updateMany({
        where: { isActive: true, endDate: { lte: new Date() } },
        data: { isActive: false },
      });
      if (count > 0) console.log(`[CRON] Deactivated ${count} expired sponsored listings`);
    } catch (err) { console.error('[CRON] Sponsored deactivation failed:', err.message); }
  });

  // ─── Daily: Check for sellers with 3+ reports → auto-suspend ────
  cron.schedule('0 2 * * *', async () => {
    try {
      const toSuspend = await prisma.sellerProfile.findMany({
        where: { reportCount: { gte: 3 }, user: { isBanned: false } },
        include: { user: true },
      });
      for (const seller of toSuspend) {
        await prisma.user.update({
          where: { id: seller.userId },
          data: { isBanned: true, banReason: 'Auto-suspended: 3+ reports. Under admin review.', bannedAt: new Date() },
        });
        console.log(`[CRON] Auto-banned seller: ${seller.storeName}`);
      }
    } catch (err) { console.error('[CRON] Auto-ban check failed:', err.message); }
  });

  console.log('⏰ PODnig cron jobs started');
}

module.exports = { startCronJobs };