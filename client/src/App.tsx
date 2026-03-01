// src/App.tsx — PODnig Main Router
// PUBLIC FIRST: Visitors see the marketplace immediately.
// Auth is only triggered when they try to add to cart or checkout.

import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WalletProvider } from './context/WalletContext';
import { GLOBAL_STYLES } from './utils/styles';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import SellerDashboard from './pages/seller/SellerDashboard';
import BuyerApp from './pages/buyer/BuyerApp';

function LoadingScreen() {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0A4F2F' }}>
      <div style={{ textAlign:'center', color:'white' }}>
        <div style={{ fontFamily:'Cabinet Grotesk', fontSize:36, fontWeight:900, marginBottom:8 }}>
          POD<span style={{ color:'#F59E0B' }}>nig</span>
        </div>
        <div style={{ fontSize:14, opacity:0.5 }}>Loading...</div>
        <div style={{ marginTop:24, display:'flex', gap:6, justifyContent:'center' }}>
          {[0,1,2].map(i=>(
            <div key={i} style={{ width:8, height:8, borderRadius:'50%', background:'#F59E0B', animation:`pulse 1.2s ease ${i*0.2}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function AppRouter() {
  const { user, isLoading, isAuthenticated } = useAuth();
  // ⭐ Starts on 'home' — the public marketplace. No login wall.
  const [page, setPage] = useState<string>('home');

  const navigate = (p: string) => setPage(p);

  // After login redirect to correct dashboard
  useEffect(() => {
    if (isAuthenticated && user && (page === 'login' || page === 'register')) {
      const dest: Record<string, string> = { ADMIN:'admin/overview', SELLER:'seller/overview', BUYER:'home' };
      setPage(dest[user.role] || 'home');
    }
  }, [isAuthenticated, user]);

  if (isLoading) return <LoadingScreen />;

  // Full-screen auth pages
  if (page === 'login')    return <LoginPage    onNavigate={navigate} />;
  if (page === 'register') return <RegisterPage onNavigate={navigate} />;

  // Authenticated admin
  if (isAuthenticated && user?.role === 'ADMIN') {
    return <AdminDashboard initialView={(page.replace('admin/','') || 'overview') as any} />;
  }

  // Authenticated seller
  if (isAuthenticated && user?.role === 'SELLER') {
    return <SellerDashboard initialView={(page.replace('seller/','') || 'overview') as any} onNavigate={navigate} />;
  }

  // Everyone else (public visitors + logged-in buyers) → BuyerApp
  // BuyerApp shows products publicly; gates only at "Add to Cart" / "Checkout"
  return <BuyerApp page={page} onNavigate={navigate} />;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WalletProvider>
          <style>{GLOBAL_STYLES}</style>
          <AppRouter />
        </WalletProvider>
      </CartProvider>
    </AuthProvider>
  );
}