// src/context/WalletContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Wallet, Transaction } from '../types/index';
import { walletService } from '../services/index';
import { useAuth } from './AuthContext';

interface WalletContextType {
  wallet: Wallet | null;
  transactions: Transaction[];
  isLoading: boolean;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const data = await walletService.getWallet();
      setWallet(data.wallet);
      const txData = await walletService.getTransactions({ limit: 20 });
      setTransactions(txData.transactions);
    } catch (err) {
      console.error('Wallet refresh failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { refresh(); }, [isAuthenticated]);

  return (
    <WalletContext.Provider value={{ wallet, transactions, isLoading, refresh }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}