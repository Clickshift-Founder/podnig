export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export interface VirtualAccount {
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isBanned: boolean;
  createdAt: string;
}

export interface SellerProfile {
  id: string;
  storeName: string;
  storeSlug: string;
  storeDescription?: string;
  storeLogo?: string;
  isVerified: boolean;
  totalSales: number;
  totalRevenue: number;
  averageRating: number;
  reportCount: number;
}

export interface AuthUser extends User {
  wallet?: {
    balance: number;
    escrowBalance: number;
    va: VirtualAccount | null;
  };
  sellerProfile?: SellerProfile | null;
}