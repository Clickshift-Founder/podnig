// src/services/productService.ts
import api from './api';
import { Product, CreateProductInput } from '../types/product';

export const productService = {
  async getAll(params?: { category?: string; search?: string; page?: number; limit?: number }) {
    const res = await api.get<{ success: boolean; products: Product[]; total: number }>('/products', { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get<{ success: boolean; product: Product }>(`/products/${id}`);
    return res.data.product;
  },

  async getBySlug(slug: string) {
    const res = await api.get<{ success: boolean; product: Product }>(`/products/slug/${slug}`);
    return res.data.product;
  },

  async getMyProducts() {
    const res = await api.get<{ success: boolean; products: Product[] }>('/products/my/listings');
    return res.data.products;
  },

  async create(data: CreateProductInput, images: File[]) {
    const form = new FormData();
    Object.entries(data).forEach(([k, v]) => form.append(k, String(v)));
    images.forEach((img) => form.append('images', img));
    const res = await api.post<{ success: boolean; product: Product }>('/products', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.product;
  },

  async update(id: string, data: Partial<CreateProductInput>) {
    const res = await api.put<{ success: boolean; product: Product }>(`/products/${id}`, data);
    return res.data.product;
  },

  async delete(id: string) {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },

  async boostListing(productId: string, plan: 'STARTER' | 'PRO' | 'ELITE') {
    const res = await api.post(`/products/${productId}/boost`, { plan });
    return res.data;
  },
};

// src/services/walletService.ts
export const walletService = {
  async getWallet() {
    const res = await api.get('/wallet');
    return res.data;
  },

  async getTransactions(params?: { page?: number; limit?: number; type?: string }) {
    const res = await api.get('/wallet/transactions', { params });
    return res.data;
  },

  async initiateWithdrawal(data: {
    amount: number;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  }) {
    const res = await api.post('/wallet/withdraw', data);
    return res.data;
  },

  async getBanks() {
    const res = await api.get('/wallet/banks');
    return res.data;
  },

  async resolveAccount(accountNumber: string, bankCode: string) {
    const res = await api.post('/wallet/resolve-account', { accountNumber, bankCode });
    return res.data;
  },
};

// src/services/orderService.ts
export const orderService = {
  async createOrder(data: {
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress: { street: string; city: string; state: string; phone: string };
    notes?: string;
  }) {
    const res = await api.post('/orders', data);
    return res.data;
  },

  async getMyOrders(role: 'buyer' | 'seller', params?: { status?: string; page?: number }) {
    const res = await api.get(`/orders/${role}`, { params });
    return res.data;
  },

  async getById(id: string) {
    const res = await api.get(`/orders/${id}`);
    return res.data;
  },

  async confirmDispatch(orderId: string) {
    const res = await api.post(`/orders/${orderId}/dispatch`);
    return res.data;
  },

  async confirmDelivery(orderId: string) {
    const res = await api.post(`/orders/${orderId}/confirm-delivery`);
    return res.data;
  },

  async openDispute(orderId: string, data: { reason: string; details: string }) {
    const res = await api.post(`/orders/${orderId}/dispute`, data);
    return res.data;
  },
};

// src/services/adminService.ts
export const adminService = {
  async getMetrics() {
    const res = await api.get('/admin/metrics');
    return res.data;
  },

  async getSellers(params?: { status?: string; page?: number; search?: string }) {
    const res = await api.get('/admin/sellers', { params });
    return res.data;
  },

  async banSeller(userId: string, reason: string) {
    const res = await api.post(`/admin/sellers/${userId}/ban`, { reason });
    return res.data;
  },

  async unbanSeller(userId: string) {
    const res = await api.post(`/admin/sellers/${userId}/unban`);
    return res.data;
  },

  async getDisputes(params?: { status?: string; page?: number }) {
    const res = await api.get('/admin/disputes', { params });
    return res.data;
  },

  async resolveDispute(disputeId: string, data: { resolution: 'BUYER' | 'SELLER'; notes: string }) {
    const res = await api.post(`/admin/disputes/${disputeId}/resolve`, data);
    return res.data;
  },

  async getAllOrders(params?: { status?: string; page?: number }) {
    const res = await api.get('/admin/orders', { params });
    return res.data;
  },

  async getFinancials() {
    const res = await api.get('/admin/financials');
    return res.data;
  },

  async getSponsoredListings() {
    const res = await api.get('/admin/sponsored');
    return res.data;
  },
};