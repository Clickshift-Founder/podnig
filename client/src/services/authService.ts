// src/services/authService.ts
import api from './api';
import { AuthUser } from '../types/user';

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'BUYER' | 'SELLER';
  storeName?: string;
  bvn?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: AuthUser;
  message?: string;
}

export const authService = {
  async register(data: RegisterPayload): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  async me(): Promise<AuthUser> {
    const res = await api.get<{ success: boolean; user: AuthUser }>('/auth/me');
    return res.data.user;
  },

  async requestOtp(phone: string): Promise<{ success: boolean }> {
    const res = await api.post('/auth/otp/send', { phone });
    return res.data;
  },

  async verifyOtp(phone: string, otp: string): Promise<{ success: boolean }> {
    const res = await api.post('/auth/otp/verify', { phone, otp });
    return res.data;
  },

  logout() {
    localStorage.removeItem('podnig_token');
    localStorage.removeItem('podnig_user');
  },
};