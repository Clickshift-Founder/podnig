// server/controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { createStaticVirtualAccount } = require('../services/flutterwaveService');
const notificationService = require('../services/notificationService');

const prisma = new PrismaClient();

// ─── REGISTER ─────────────────────────────────────────────────────
// On registration:
//  1. Create user
//  2. Create wallet
//  3. Auto-generate Flutterwave static VA
//  4. If seller, create seller profile
exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, role = 'BUYER', storeName, bvn } = req.body;

    // Validate
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    // Check existing
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 12);

    // Create user + wallet in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, passwordHash, firstName, lastName, phone, role },
      });

      const wallet = await tx.wallet.create({ data: { userId: user.id } });

      let sellerProfile = null;
      if (role === 'SELLER' && storeName) {
        const storeSlug = storeName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        sellerProfile = await tx.sellerProfile.create({
          data: { userId: user.id, storeName, storeSlug },
        });
      }

      return { user, wallet, sellerProfile };
    });

    // Create Flutterwave Static VA (async — don't block response)
    // We do this outside the transaction so a FLW failure doesn't roll back user creation
    createStaticVirtualAccount({
      email,
      name: `${firstName} ${lastName}`,
      userId: result.user.id,
      bvn, // CBN regulation: BVN required for NGN static VA. If not provided, prompt later.
    }).then(async (va) => {
      await prisma.wallet.update({
        where: { userId: result.user.id },
        data: {
          vaAccountNumber: va.accountNumber,
          vaBankName: va.bankName,
          vaBankCode: va.bankCode,
          vaAccountName: va.accountName,
          vaReference: va.reference,
          vaCreatedAt: new Date(),
        },
      });

      // Welcome notification
      await notificationService.send(result.user.id, {
        title: '🎉 Welcome to PODnig!',
        message: `Your wallet is ready! Bank: ${va.bankName}, Account: ${va.accountNumber}. Transfer any amount to top up instantly.`,
        type: 'SYSTEM',
        data: { va },
      });
    }).catch(err => {
      // Log but don't fail — prompt user to set up VA later
      console.error('[VA Creation Failed]', err.message);
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: result.user.id, role: result.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Account created! Your virtual account is being set up.',
      token,
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
      },
    });
  } catch (err) {
    console.error('[Register Error]', err);
    return res.status(500).json({ success: false, message: 'Registration failed. Please try again.' });
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
      include: { wallet: true, sellerProfile: true },
    });

    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
    if (user.isBanned) return res.status(403).json({ success: false, message: `Account suspended: ${user.banReason || 'Policy violation'}` });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        wallet: {
          balance: Number(user.wallet?.balance || 0) / 100, // Convert kobo → NGN
          escrowBalance: Number(user.wallet?.escrowBalance || 0) / 100,
          va: user.wallet?.vaAccountNumber ? {
            accountNumber: user.wallet.vaAccountNumber,
            bankName: user.wallet.vaBankName,
            accountName: user.wallet.vaAccountName,
          } : null,
        },
        sellerProfile: user.sellerProfile ? { storeName: user.sellerProfile.storeName, storeSlug: user.sellerProfile.storeSlug, isVerified: user.sellerProfile.isVerified } : null,
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({ success: false, message: 'Login failed' });
  }
};

// ─── GET CURRENT USER ────────────────────────────────────────────
exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { wallet: true, sellerProfile: true },
    });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch user' });
  }
};