// order.ts
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'PAID_IN_ESCROW'
  | 'SELLER_CONFIRMED_DISPATCH'
  | 'BUYER_CONFIRMED_DELIVERY'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REFUNDED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  product: { name: string; images: string[] };
  quantity: number;
  priceAtTime: number;
}

export interface Order {
  id: string;
  orderRef: string;
  buyerId: string;
  buyer: { firstName: string; lastName: string; email: string };
  sellerId: string;
  seller: { storeName: string };
  status: OrderStatus;
  subtotal: number;
  commissionAmount: number;
  totalAmount: number;
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    phone: string;
  };
  deliveryFee: number;
  notes?: string;
  items: OrderItem[];
  paidAt?: string;
  dispatchedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  createdAt: string;
}

// wallet.ts
export interface Wallet {
  id: string;
  balance: number;
  escrowBalance: number;
  totalEarned: number;
  totalWithdrawn: number;
  vaAccountNumber?: string;
  vaBankName?: string;
  vaAccountName?: string;
}

// transaction.ts
export type TransactionType =
  | 'CREDIT'
  | 'DEBIT'
  | 'ESCROW_LOCK'
  | 'ESCROW_RELEASE'
  | 'COMMISSION'
  | 'WITHDRAWAL'
  | 'REFUND'
  | 'SPONSORED_LISTING';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reference?: string;
  description: string;
  orderId?: string;
  createdAt: string;
}

export interface Withdrawal {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  requestedAt: string;
  processedAt?: string;
}