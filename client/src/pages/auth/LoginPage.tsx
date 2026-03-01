// src/pages/auth/LoginPage.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginPageProps { onNavigate: (page: string) => void; }

export default function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await login(email, password);
      // AuthContext sets user; App.tsx router picks up role and redirects
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left: Branding */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1F14 0%, #0A4F2F 60%, #1a7a44 100%)',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: 48, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'rgba(245,158,11,0.06)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

        <div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 28, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
          POD<span style={{ color: '#F59E0B' }}>nig</span>
        </div>

        <div>
          <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 44, fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
            Nigeria's Safest<br /><span style={{ color: '#F59E0B' }}>Marketplace</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 16, lineHeight: 1.6, marginBottom: 40 }}>
            Every naira protected by escrow. Verified sellers. Instant virtual accounts. Real-time payments.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: '🔒', title: 'Escrow Protected', desc: 'Money held until delivery' },
              { icon: '⚡', title: 'Instant Wallets', desc: 'NGN virtual account on signup' },
              { icon: '🛡️', title: 'Verified Sellers', desc: 'ID-verified, rated sellers' },
              { icon: '📲', title: 'Real-time Alerts', desc: 'SMS + email notifications' },
            ].map(f => (
              <div key={f.title} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'white', marginBottom: 2 }}>{f.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>
          © 2026 PODnig — Pay On Delivery Nigeria
        </div>
      </div>

      {/* Right: Login form */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 64px', background: '#FAFAF8' }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 32, fontWeight: 900, letterSpacing: -1, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ color: '#9CA3AF', fontSize: 15 }}>Sign in to your PODnig account</p>
          </div>

          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#991B1B' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Email Address</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="amaka@example.com"
                style={{ width: '100%', padding: '13px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#1A8A52'}
                onBlur={e => e.target.style.borderColor = '#E5E7E0'}
              />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>Password</label>
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••"
                style={{ width: '100%', padding: '13px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#1A8A52'}
                onBlur={e => e.target.style.borderColor = '#E5E7E0'}
              />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 16, background: loading ? '#9CA3AF' : '#0A4F2F',
              color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cabinet Grotesk',
              fontSize: 17, fontWeight: 800, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
            }}>
              {loading ? 'Signing in...' : 'Sign In to PODnig →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#9CA3AF' }}>
            Don't have an account?{' '}
            <button onClick={() => onNavigate('register')} style={{ color: '#0A4F2F', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontFamily: 'Satoshi' }}>
              Create one →
            </button>
          </div>

          {/* Demo login hints */}
          <div style={{ marginTop: 32, background: '#F3F4EF', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Demo Accounts</div>
            {[
              { label: 'Buyer', email: 'buyer@demo.com' },
              { label: 'Seller', email: 'seller@demo.com' },
              { label: 'Admin', email: 'admin@podnig.ng' },
            ].map(d => (
              <button key={d.label} onClick={() => { setEmail(d.email); setPassword('demo1234'); }} style={{
                display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none',
                padding: '6px 0', cursor: 'pointer', fontSize: 13, color: '#0A4F2F', fontFamily: 'Satoshi', fontWeight: 600,
              }}>→ {d.label}: {d.email}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}