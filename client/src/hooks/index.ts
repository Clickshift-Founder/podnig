// src/hooks/index.ts

// ─── Re-export context hooks ──────────────────────────────────────────────────
export { useAuth } from '../context/AuthContext';
export { useWallet } from '../context/WalletContext';
export { useCart } from '../context/CartContext';

// ─── useOrders ────────────────────────────────────────────────────────────────
import { useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/index';

export function useOrders(role: 'buyer' | 'seller', filters?: { status?: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.getMyOrders(role, filters);
      setOrders(data.orders);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  }, [role, filters?.status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return { orders, isLoading, error, refetch: fetchOrders };
}

// ─── useNotifications ─────────────────────────────────────────────────────────
export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'SUCCESS' | 'ERROR' | 'INFO' | 'WARNING';
}

let notifId = 0;

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const dismiss = (id: string) =>
    setNotifications(prev => prev.filter(n => n.id !== id));

  const notify = (msg: Omit<AppNotification, 'id'>) => {
    const id = String(++notifId);
    setNotifications(prev => [...prev, { ...msg, id }]);
    setTimeout(() => dismiss(id), 4000);
  };

  const success = (title: string, message: string) => notify({ type: 'SUCCESS', title, message });
  const error   = (title: string, message: string) => notify({ type: 'ERROR',   title, message });
  const info    = (title: string, message: string) => notify({ type: 'INFO',    title, message });

  return { notifications, notify, dismiss, success, error, info };
}