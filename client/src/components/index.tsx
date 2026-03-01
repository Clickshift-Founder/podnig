// src/components/index.tsx
import { Product } from '../types/product';
import { formatNGN } from '../utils/styles';
import { PRODUCT_EMOJIS } from '../utils/mockData';

interface ProductCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: () => void;
}

export function ProductCard({ product, onClick, onAddToCart }: ProductCardProps) {
  const emoji = { Electronics:'📱',Fashion:'👘',Beauty:'🧴',Home:'🏠',Food:'🍲',Sports:'⚽',Books:'📚',Automotive:'🚗' }[product.category] || '📦';
  const isSponsored = product.sponsoredListing?.isActive;

  return (
    <div onClick={onClick} style={{
      background: 'white', borderRadius: 16, overflow: 'hidden',
      border: '1px solid #E5E7E0', cursor: 'pointer',
      transition: 'all 0.25s', position: 'relative',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 48px rgba(10,79,47,0.18)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
    >
      {/* Image */}
      <div style={{ height: 190, background: 'linear-gradient(135deg,#e8f4ef,#d1e8db)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 72, position: 'relative' }}>
        {emoji}
        {isSponsored && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: 'linear-gradient(90deg,#FF6B00,#F59E0B)', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 100 }}>⚡ SPONSORED</div>
        )}
        {!isSponsored && (
          <div style={{ position: 'absolute', top: 10, left: 10, background: '#1A8A52', color: 'white', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 100 }}>🔥 HOT</div>
        )}
        {product.stock < 5 && product.stock > 0 && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: '#FEF3C7', color: '#92400E', fontSize: 10, fontWeight: 800, padding: '3px 9px', borderRadius: 100 }}>Only {product.stock} left</div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
          {product.seller.storeName}
          {product.seller.isVerified && <span style={{ color: '#1A8A52' }}>✓</span>}
        </div>
        <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3, color: '#1C2B22' }}>{product.name}</div>
        <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 22, fontWeight: 900, color: '#0A4F2F', marginBottom: 12 }}>
          ₦{product.price.toLocaleString()}
          {product.comparePrice && <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 400, textDecoration: 'line-through', marginLeft: 6, fontFamily: 'Satoshi' }}>₦{product.comparePrice.toLocaleString()}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#FF6B00' }}>★ {product.averageRating} <span style={{ color: '#9CA3AF', fontWeight: 400 }}>({product.reviewCount})</span></div>
            <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>📍 {product.location}</div>
          </div>
          <button onClick={e => { e.stopPropagation(); onAddToCart(); }} style={{
            background: '#0A4F2F', color: 'white', border: 'none',
            padding: '8px 16px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'Satoshi', transition: 'background 0.2s',
          }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1A8A52')}
            onMouseLeave={e => (e.currentTarget.style.background = '#0A4F2F')}
          >Add</button>
        </div>
      </div>
    </div>
  );
}

// ─── WALLET CARD ─────────────────────────────────────────────────
interface WalletCardProps {
  balance: number;
  escrowBalance: number;
  va?: { accountNumber: string; bankName: string; accountName: string } | null;
  onDeposit?: () => void;
  onWithdraw?: () => void;
}

export function WalletCard({ balance, escrowBalance, va, onDeposit, onWithdraw }: WalletCardProps) {
  const [copied, setCopied] = useState(false);
  const copy = (text: string) => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0A4F2F 0%, #0D6B3E 55%, #1a7a44 100%)',
      borderRadius: 24, padding: 32, color: 'white', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -60, left: '40%', width: 250, height: 250, borderRadius: '50%', background: 'rgba(245,158,11,0.07)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>
        <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>Available Balance</div>
        <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 44, fontWeight: 900, letterSpacing: -2, marginBottom: 4 }}>₦{balance.toLocaleString()}</div>
        <div style={{ fontSize: 13, opacity: 0.5, marginBottom: 28 }}>Escrow locked: ₦{escrowBalance.toLocaleString()}</div>
        <div style={{ display: 'flex', gap: 10, marginBottom: va ? 24 : 0 }}>
          {onDeposit && (
            <button onClick={onDeposit} style={{ flex: 1, padding: 12, borderRadius: 12, background: '#F59E0B', color: '#0D1F14', border: 'none', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Satoshi' }}>+ Deposit</button>
          )}
          {onWithdraw && (
            <button onClick={onWithdraw} style={{ flex: 1, padding: 12, borderRadius: 12, background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Satoshi' }}>↗ Withdraw</button>
          )}
        </div>
        {va && (
          <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 10, fontWeight: 700, opacity: 0.5, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>🏦 Your Static Virtual Account</div>
            {[
              { label: 'Bank', value: va.bankName },
              { label: 'Account Number', value: va.accountNumber, copyable: true },
              { label: 'Account Name', value: va.accountName },
            ].map(row => (
              <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: 12, opacity: 0.55 }}>{row.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 700, fontSize: 15 }}>{row.value}</span>
                  {row.copyable && (
                    <button onClick={() => copy(row.value)} style={{ background: copied ? '#F59E0B' : 'rgba(255,255,255,0.1)', color: copied ? '#0D1F14' : 'white', border: 'none', borderRadius: 6, padding: '3px 10px', fontSize: 11, cursor: 'pointer', transition: 'all 0.2s' }}>
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div style={{ marginTop: 10, padding: 10, background: 'rgba(245,158,11,0.1)', borderRadius: 8, fontSize: 12, opacity: 0.7 }}>
              ⚡ Transfer to this account to instantly credit your wallet. Works 24/7.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TRANSACTION TABLE ────────────────────────────────────────────
import { Transaction } from '../types/index';
import { useState } from 'react';

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

export function TransactionTable({ transactions, isLoading }: TransactionTableProps) {
  const typeColors: Record<string, string> = {
    CREDIT: '#10B981', ESCROW_RELEASE: '#10B981', REFUND: '#3B82F6',
    DEBIT: '#EF4444', WITHDRAWAL: '#EF4444', COMMISSION: '#F59E0B',
    ESCROW_LOCK: '#F59E0B', SPONSORED_LISTING: '#8B5CF6',
  };
  const typeIcons: Record<string, string> = {
    CREDIT: '📥', ESCROW_RELEASE: '🔓', REFUND: '↩️',
    DEBIT: '📤', WITHDRAWAL: '🏦', COMMISSION: '💸',
    ESCROW_LOCK: '🔒', SPONSORED_LISTING: '⚡',
  };

  if (isLoading) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#9CA3AF' }}>Loading transactions...</div>
  );

  if (transactions.length === 0) return (
    <div style={{ padding: 60, textAlign: 'center', color: '#9CA3AF' }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
      <div style={{ fontWeight: 600 }}>No transactions yet</div>
    </div>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#F3F4EF' }}>
            {['Type', 'Description', 'Amount', 'Balance After', 'Date'].map(h => (
              <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map(tx => (
            <tr key={tx.id} style={{ borderTop: '1px solid #E5E7E0' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAF7')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
            >
              <td style={{ padding: '14px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{typeIcons[tx.type] || '💰'}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: typeColors[tx.type] || '#9CA3AF' }}>{tx.type.replace(/_/g, ' ')}</span>
                </div>
              </td>
              <td style={{ padding: '14px 20px', fontSize: 13, color: '#1C2B22' }}>{tx.description}</td>
              <td style={{ padding: '14px 20px', fontFamily: 'Cabinet Grotesk', fontWeight: 800, fontSize: 15, color: typeColors[tx.type] || '#1C2B22' }}>
                {['CREDIT', 'ESCROW_RELEASE', 'REFUND'].includes(tx.type) ? '+' : '-'}₦{tx.amount.toLocaleString()}
              </td>
              <td style={{ padding: '14px 20px', fontFamily: 'Cabinet Grotesk', fontWeight: 700, fontSize: 14 }}>₦{tx.balanceAfter.toLocaleString()}</td>
              <td style={{ padding: '14px 20px', fontSize: 12, color: '#9CA3AF' }}>
                {new Date(tx.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: number;
}

export function Modal({ isOpen, onClose, title, subtitle, children, maxWidth = 520 }: ModalProps) {
  if (!isOpen) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'white', borderRadius: 24, padding: 32,
        maxWidth, width: '100%', position: 'relative', animation: 'fadeIn 0.2s ease',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: '#F3F4EF', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 22, fontWeight: 800, marginBottom: 4 }}>{title}</div>
        {subtitle && <div style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>{subtitle}</div>}
        {children}
      </div>
    </div>
  );
}

// ─── ESCROW BADGE ─────────────────────────────────────────────────
type OrderStatus = 'PENDING_PAYMENT' | 'PAID_IN_ESCROW' | 'SELLER_CONFIRMED_DISPATCH' | 'BUYER_CONFIRMED_DELIVERY' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED' | 'CANCELLED';

export function EscrowBadge({ status }: { status: OrderStatus }) {
  const config: Record<OrderStatus, { label: string; bg: string; color: string; icon: string }> = {
    PENDING_PAYMENT: { label: 'Awaiting Payment', bg: '#F3F4F6', color: '#374151', icon: '⏳' },
    PAID_IN_ESCROW: { label: 'In Escrow', bg: '#FEF3C7', color: '#92400E', icon: '🔒' },
    SELLER_CONFIRMED_DISPATCH: { label: 'Dispatched', bg: '#DBEAFE', color: '#1E40AF', icon: '📦' },
    BUYER_CONFIRMED_DELIVERY: { label: 'Delivery Confirmed', bg: '#D1FAE5', color: '#065F46', icon: '✅' },
    COMPLETED: { label: 'Completed', bg: '#D1FAE5', color: '#065F46', icon: '✅' },
    DISPUTED: { label: 'Disputed', bg: '#FEE2E2', color: '#991B1B', icon: '⚠️' },
    REFUNDED: { label: 'Refunded', bg: '#DBEAFE', color: '#1E40AF', icon: '↩️' },
    CANCELLED: { label: 'Cancelled', bg: '#F3F4F6', color: '#374151', icon: '✕' },
  };
  const c = config[status];
  return (
    <span style={{ padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700, background: c.bg, color: c.color }}>
      {c.icon} {c.label}
    </span>
  );
}

// ─── NOTIFICATION BELL ────────────────────────────────────────────
export function NotificationBell({ count = 0, onClick }: { count?: number; onClick?: () => void }) {
  return (
    <button onClick={onClick} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, padding: 4 }}>
      🔔
      {count > 0 && (
        <span style={{
          position: 'absolute', top: -2, right: -2,
          background: '#EF4444', color: 'white', borderRadius: '50%',
          width: 18, height: 18, fontSize: 10, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid white',
        }}>{count > 9 ? '9+' : count}</span>
      )}
    </button>
  );
}

// ─── TOAST NOTIFICATIONS ──────────────────────────────────────────
interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type = 'success', onClose }: ToastProps) {
  const configs = {
    success: { icon: '✅', border: '#10B981' },
    error: { icon: '❌', border: '#EF4444' },
    info: { icon: '💬', border: '#F59E0B' },
  };
  const c = configs[type];
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 300,
      background: '#0D1F14', color: 'white',
      padding: '14px 20px', borderRadius: 14,
      boxShadow: '0 12px 48px rgba(0,0,0,0.3)',
      display: 'flex', alignItems: 'center', gap: 10,
      animation: 'slideInRight 0.3s ease',
      borderLeft: `4px solid ${c.border}`,
      maxWidth: 340, fontSize: 14, fontWeight: 500,
    }}>
      <span style={{ fontSize: 18 }}>{c.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: 16, padding: '0 0 0 8px' }}>✕</button>
    </div>
  );
}

// ─── METRIC CARD ─────────────────────────────────────────────────
interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down' | 'neutral';
  onClick?: () => void;
}

export function MetricCard({ icon, label, value, change, changeType = 'neutral', onClick }: MetricCardProps) {
  return (
    <div onClick={onClick} style={{
      background: 'white', borderRadius: 16, padding: 22, border: '1px solid #E5E7E0',
      cursor: onClick ? 'pointer' : 'default', transition: 'all 0.2s',
    }}
      onMouseEnter={e => { if (onClick) (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { if (onClick) (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      <div style={{ fontSize: 24, marginBottom: 10 }}>{icon}</div>
      <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 28, fontWeight: 900, marginBottom: 4, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500 }}>{label}</div>
      {change && (
        <div style={{ fontSize: 12, fontWeight: 600, marginTop: 8, color: changeType === 'up' ? '#10B981' : changeType === 'down' ? '#EF4444' : '#9CA3AF' }}>
          {changeType === 'up' ? '↑' : changeType === 'down' ? '↓' : ''} {change}
        </div>
      )}
    </div>
  );
}

// ─── FORM INPUTS ─────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{label}</label>}
      <input {...props} style={{
        width: '100%', padding: '12px 16px', border: `2px solid ${error ? '#EF4444' : '#E5E7E0'}`,
        borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none',
        transition: 'border-color 0.2s', background: 'white',
        ...props.style,
      }}
        onFocus={e => !error && (e.target.style.borderColor = '#1A8A52')}
        onBlur={e => !error && (e.target.style.borderColor = '#E5E7E0')}
      />
      {error && <div style={{ fontSize: 12, color: '#EF4444', marginTop: 4 }}>{error}</div>}
    </div>
  );
}

export function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>{label}</label>}
      <select {...props} style={{
        width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0',
        borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none',
        appearance: 'none', background: 'white', cursor: 'pointer',
        ...props.style,
      }}>{children}</select>
    </div>
  );
}

export function Button({ children, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'danger' | 'amber' }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: '#0A4F2F', color: 'white' },
    ghost: { background: 'white', color: '#0A4F2F', border: '2px solid #0A4F2F' },
    danger: { background: '#FEE2E2', color: '#991B1B' },
    amber: { background: '#F59E0B', color: '#0D1F14' },
  };
  return (
    <button {...props} style={{
      padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14,
      cursor: 'pointer', border: 'none', fontFamily: 'Satoshi', transition: 'all 0.2s',
      ...styles[variant], ...props.style,
    }}>{children}</button>
  );
}