// src/components/Navbar.tsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { formatNGN, getInitials } from '../utils/styles';

interface NavbarProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  walletBalance?: number;
}

export default function Navbar({ onNavigate, currentPage, walletBalance = 0 }: NavbarProps) {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const buyerLinks = [
    { label: 'Shop', page: 'home' },
    { label: 'My Orders', page: 'buyer/orders' },
    { label: 'Wishlist', page: 'buyer/wishlist' },
  ];

  const sellerLinks = [
    { label: 'Dashboard', page: 'seller/overview' },
    { label: 'My Store', page: 'seller/inventory' },
    { label: 'Orders', page: 'seller/orders' },
  ];

  const adminLinks = [
    { label: 'Overview', page: 'admin/overview' },
    { label: 'Sellers', page: 'admin/sellers' },
    { label: 'Orders', page: 'admin/orders' },
    { label: 'Disputes', page: 'admin/disputes' },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : user?.role === 'SELLER' ? sellerLinks : buyerLinks;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(10,79,47,0.98)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
      height: 68, display: 'flex', alignItems: 'center',
      padding: '0 32px', gap: 16,
    }}>
      {/* Logo */}
      <div
        onClick={() => onNavigate(user?.role === 'ADMIN' ? 'admin/overview' : user?.role === 'SELLER' ? 'seller/overview' : 'home')}
        style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 24, color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, letterSpacing: '-0.5px', marginRight: 8 }}
      >
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', display: 'inline-block', marginBottom: 4 }} />
        POD<span style={{ color: '#F59E0B' }}>nig</span>
        {user?.role === 'ADMIN' && (
          <span style={{ background: '#F59E0B', color: '#0D1F14', fontSize: 10, fontWeight: 800, padding: '2px 7px', borderRadius: 100, marginLeft: 6 }}>ADMIN</span>
        )}
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {links.map(link => (
          <button key={link.page} onClick={() => onNavigate(link.page)} style={{
            color: currentPage === link.page ? '#F59E0B' : 'rgba(255,255,255,0.7)',
            background: currentPage === link.page ? 'rgba(245,158,11,0.12)' : 'transparent',
            border: 'none', padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
            fontSize: 14, fontWeight: 600, fontFamily: 'Satoshi', transition: 'all 0.2s',
          }}>{link.label}</button>
        ))}
      </div>

      {/* Right Side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {/* Wallet (not for admin) */}
        {user?.role !== 'ADMIN' && (
          <button onClick={() => onNavigate('wallet')} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 14, cursor: 'pointer',
            fontFamily: 'Cabinet Grotesk', fontWeight: 700, transition: 'all 0.2s',
          }}>
            <span>💳</span> {formatNGN(walletBalance)}
          </button>
        )}

        {/* Cart (buyers only) */}
        {user?.role === 'BUYER' && (
          <button onClick={() => onNavigate('cart')} style={{
            position: 'relative', background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 10, padding: '8px 14px', color: 'white', fontSize: 14, cursor: 'pointer', fontFamily: 'Satoshi',
          }}>
            🛒 Cart
            {count > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -6,
                background: '#FF6B00', color: 'white', borderRadius: '50%',
                width: 20, height: 20, fontSize: 11, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{count}</span>
            )}
          </button>
        )}

        {/* User avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            width: 38, height: 38, borderRadius: '50%',
            background: 'linear-gradient(135deg, #F59E0B, #FF6B00)',
            border: '2px solid rgba(255,255,255,0.2)',
            color: 'white', fontWeight: 800, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
          </button>
          {menuOpen && (
            <div style={{
              position: 'absolute', top: 48, right: 0, background: 'white',
              borderRadius: 14, boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
              minWidth: 200, overflow: 'hidden', border: '1px solid #E5E7E0',
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #E5E7E0', background: '#F9FAF7' }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.firstName} {user?.lastName}</div>
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{user?.email}</div>
                <div style={{ fontSize: 11, color: '#0A4F2F', fontWeight: 700, marginTop: 4, background: '#E8F4EE', padding: '2px 8px', borderRadius: 100, display: 'inline-block' }}>{user?.role}</div>
              </div>
              {[
                { label: '⚙️ Account Settings', page: 'settings' },
                { label: '🔔 Notifications', page: 'notifications' },
              ].map(item => (
                <button key={item.page} onClick={() => { onNavigate(item.page); setMenuOpen(false); }} style={{
                  width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                  textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: 'Satoshi',
                  color: '#1C2B22', transition: 'background 0.15s',
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#F3F4EF')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >{item.label}</button>
              ))}
              <button onClick={() => { logout(); setMenuOpen(false); }} style={{
                width: '100%', padding: '12px 16px', border: 'none', background: 'none',
                textAlign: 'left', cursor: 'pointer', fontSize: 14, fontFamily: 'Satoshi',
                color: '#991B1B', borderTop: '1px solid #E5E7E0',
              }}>🚪 Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}