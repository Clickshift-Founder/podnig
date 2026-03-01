// server/services/trustAndSafetyService.js
// PODnig Trust & Safety Engine
// Answers: "How do we prevent buyers/sellers from bypassing the platform?"

/**
 * ─── ANTI-BYPASS STRATEGY OVERVIEW ────────────────────────────────
 * 
 * The challenge: Sellers will try to share WhatsApp, phone numbers,
 * or bank details to avoid PODnig's 3% fee. Here's our multi-layered
 * approach — no censorship, no gatekeeping that hurts UX, just
 * smart incentives and detection.
 *
 * LAYER 1: VALUE LOCK-IN (Best ROI, Non-intrusive)
 *   → Make the platform so valuable that bypassing isn't worth it
 *
 * LAYER 2: SMART DETECTION (Automated)
 *   → Detect and flag bypass attempts in messages
 *
 * LAYER 3: SELLER REPUTATION SYSTEM (Network Effect)
 *   → Verified reviews, star ratings ONLY from on-platform buyers
 *
 * LAYER 4: BUYER PROTECTION INCENTIVES (Trust Anchoring)
 *   → Escrow removes the #1 reason buyers go elsewhere: fear of fraud
 *
 * LAYER 5: REPORT SYSTEM (Community-powered)
 *   → Buyers/sellers can report off-platform solicitation
 **/

// ─── LAYER 2: MESSAGE SCANNING ───────────────────────────────────
const BYPASS_PATTERNS = [
  // Phone number patterns (Nigerian formats)
  /(\+?234|0)(7[0-9]|8[0-9]|9[0-9])\d{8}/g,
  // WhatsApp solicitation
  /whatsapp|whats.?app|wa\.me|chat.?on.?whats/gi,
  // Bank account solicitation
  /(\d{10})\s*(gtb|uba|access|zenith|first.?bank|fcmb|fidelity|sterling|opay|kuda|palmpay)/gi,
  // Instagram/Telegram
  /instagram|telegram|direct.?message|dm.?me|ig\.me/gi,
  // Outside-platform payment mentions
  /pay.?(me)?.?(directly|outside|off.?platform)|bank.?transfer.?directly/gi,
];

/**
 * Scan a message for bypass patterns.
 * Used in: product descriptions, seller messages, reviews.
 * Returns: { hasBypass: boolean, patterns: string[], severity: 'low'|'medium'|'high' }
 */
function scanForBypassAttempt(text) {
  const found = [];
  for (const pattern of BYPASS_PATTERNS) {
    const matches = text.match(pattern);
    if (matches) found.push(...matches);
  }

  let severity = 'low';
  if (found.length >= 3) severity = 'high';
  else if (found.length >= 1) severity = 'medium';

  return { hasBypass: found.length > 0, patterns: found, severity };
}

/**
 * Auto-moderate product description.
 * Redact detected bypass info before saving.
 */
function moderateProductDescription(description) {
  let moderated = description;
  let flagged = false;

  for (const pattern of BYPASS_PATTERNS) {
    if (pattern.test(moderated)) {
      flagged = true;
      moderated = moderated.replace(pattern, '[CONTACT INFO REMOVED]');
      pattern.lastIndex = 0; // Reset regex state
    }
  }

  return { moderated, flagged };
}

// ─── LAYER 3: VERIFIED REVIEW SYSTEM ─────────────────────────────
/**
 * Only buyers who completed an on-platform order can leave reviews.
 * This means reviews are a PODnig-exclusive trust signal.
 * Sellers NEED PODnig to build reputation.
 */
async function canLeaveReview(prisma, { buyerId, sellerId, productId }) {
  const completedOrder = await prisma.order.findFirst({
    where: {
      buyerId,
      sellerId,
      status: 'COMPLETED',
      items: { some: { productId } },
      review: null, // hasn't reviewed yet
    },
  });
  return { canReview: !!completedOrder, orderId: completedOrder?.id };
}

// ─── LAYER 4: BUYER PROTECTION FEATURES ──────────────────────────
// These are what make PODnig sticky for buyers:
// 1. Escrow (eliminates fraud fear)
// 2. Dispute resolution (accountability)
// 3. Verified reviews (trustworthy ratings)
// 4. Delivery tracking (visibility)
// 5. Instant refunds (safety net)
// None of these are available outside PODnig

// ─── LAYER 5: REPORT SYSTEM ──────────────────────────────────────
/**
 * When a user reports off-platform solicitation:
 * - Record the report
 * - If seller reaches 3 reports: auto-suspend pending review
 * - Notify admin immediately
 */
async function reportSellerBypassAttempt(prisma, { reporterId, sellerId, orderId, evidence }) {
  const report = await prisma.report.create({
    data: {
      reporterId,
      reportedId: sellerId,
      reason: 'OFF_PLATFORM_SOLICITATION',
      details: evidence,
      orderId,
    },
  });

  // Check total active reports for this seller
  const sellerProfile = await prisma.sellerProfile.findUnique({
    where: { userId: sellerId },
    select: { id: true, reportCount: true, storeName: true },
  });

  const newCount = sellerProfile.reportCount + 1;

  await prisma.sellerProfile.update({
    where: { userId: sellerId },
    data: { reportCount: newCount },
  });

  // AUTO-SUSPEND at 3 reports
  if (newCount >= 3) {
    await prisma.user.update({
      where: { id: sellerId },
      data: {
        isBanned: true,
        banReason: `Auto-suspended: ${newCount} reports for off-platform solicitation. Under admin review.`,
        bannedAt: new Date(),
      },
    });

    // TODO: Send email to seller & admin
    console.log(`[AUTO-BAN] Seller ${sellerProfile.storeName} auto-suspended after ${newCount} reports`);
  }

  return { report, totalReports: newCount, autoSuspended: newCount >= 3 };
}

// ─── SELLER COMMISSION RATIONALE ─────────────────────────────────
/**
 * Why sellers STAY on PODnig (the economic argument):
 * 
 * PODnig fee: 3%
 * 
 * vs. Costs of going off-platform:
 * - Fraud risk (no escrow) → sellers can be scammed too
 * - Lost reviews & reputation → cold start problem
 * - No payment infrastructure → slower settlements
 * - Buyer trust barrier → harder to close sales
 * - Dispute support → they're on their own
 * - Marketing (PODnig drives traffic to their store)
 * 
 * 3% is cheaper than building all of this themselves.
 * Our job: COMMUNICATE this value clearly in the UI.
 */

module.exports = {
  scanForBypassAttempt,
  moderateProductDescription,
  canLeaveReview,
  reportSellerBypassAttempt,
};