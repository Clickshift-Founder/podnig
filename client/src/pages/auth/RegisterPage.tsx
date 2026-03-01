// src/pages/auth/RegisterPage.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface RegisterPageProps { onNavigate: (page: string) => void; }

export default function RegisterPage({ onNavigate }: RegisterPageProps) {
  const { register } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [role, setRole] = useState<'BUYER' | 'SELLER' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '',
    storeName: '', storeDescription: '', bvn: '',
  });

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleRegister = async () => {
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
    if (!role) return;
    setLoading(true); setError('');
    try {
      await register({
        email: form.email, password: form.password,
        firstName: form.firstName, lastName: form.lastName,
        phone: form.phone, role,
        storeName: role === 'SELLER' ? form.storeName : undefined,
        bvn: form.bvn || undefined,
      });
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '13px 16px', border: '2px solid #E5E7E0',
    borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none',
    transition: 'border-color 0.2s', marginTop: 6,
  };
  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 700, display: 'block' };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
      {/* Left */}
      <div style={{ background: 'linear-gradient(135deg, #0D1F14 0%, #0A4F2F 100%)', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, borderRadius: '50%', background: 'rgba(245,158,11,0.06)' }} />
        <div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 26, color: 'white', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#F59E0B', display: 'inline-block' }} />
          POD<span style={{ color: '#F59E0B' }}>nig</span>
        </div>

        <div>
          {/* Progress Steps */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
            {[
              { n: 1, label: 'Choose Role' },
              { n: 2, label: 'Your Details' },
              { n: 3, label: role === 'SELLER' ? 'Store Setup' : 'Wallet Setup' },
            ].map(s => (
              <div key={s.n} style={{ flex: 1 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%',
                  background: step >= s.n ? '#F59E0B' : 'rgba(255,255,255,0.12)',
                  color: step >= s.n ? '#0D1F14' : 'rgba(255,255,255,0.4)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 15, marginBottom: 6,
                  transition: 'all 0.3s',
                }}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <div style={{ fontSize: 11, fontWeight: 600, color: step >= s.n ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 38, fontWeight: 900, color: 'white', lineHeight: 1.1, letterSpacing: -1.5, marginBottom: 16 }}>
            {step === 1 && <>Join<br /><span style={{ color: '#F59E0B' }}>PODnig</span></>}
            {step === 2 && <>Your<br /><span style={{ color: '#F59E0B' }}>Details</span></>}
            {step === 3 && role === 'SELLER' ? <>Your<br /><span style={{ color: '#F59E0B' }}>Store</span></> : <>Your<br /><span style={{ color: '#F59E0B' }}>Wallet</span></>}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 15, lineHeight: 1.6 }}>
            {step === 1 && 'Are you shopping or selling? Choose your path.'}
            {step === 2 && 'Tell us a bit about yourself. All details are encrypted and secure.'}
            {step === 3 && role === 'SELLER' ? 'Set up your store. Buyers will see this on your profile.' : 'Your wallet and virtual account will be created automatically.'}
          </p>
        </div>

        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>© 2026 PODnig · All rights reserved</div>
      </div>

      {/* Right: Steps */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 64px', background: '#FAFAF8' }}>
        <div style={{ width: '100%', maxWidth: 440, animation: 'fadeIn 0.3s ease' }}>
          {error && (
            <div style={{ background: '#FEE2E2', border: '1px solid #FCA5A5', borderRadius: 10, padding: '12px 16px', marginBottom: 20, fontSize: 14, color: '#991B1B' }}>
              ⚠️ {error}
            </div>
          )}

          {/* ── STEP 1: Choose Role ── */}
          {step === 1 && (
            <>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 6 }}>I want to…</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 28 }}>Choose your role on the platform</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  {
                    r: 'BUYER', icon: '🛒', title: 'Shop & Buy',
                    desc: 'Browse thousands of products with full escrow protection. Your money is safe until delivery.',
                    perks: ['Escrow-protected payments', 'Dispute resolution', 'Instant wallet', 'Delivery tracking'],
                  },
                  {
                    r: 'SELLER', icon: '🏪', title: 'Sell & Earn',
                    desc: 'Create your store, list products, and get paid securely. Only 3% commission.',
                    perks: ['Free store setup', 'Only 3% commission', 'Instant settlements', 'Boost listings'],
                  },
                ].map(opt => (
                  <div key={opt.r} onClick={() => setRole(opt.r as 'BUYER' | 'SELLER')} style={{
                    border: `2px solid ${role === opt.r ? '#0A4F2F' : '#E5E7E0'}`,
                    background: role === opt.r ? '#E8F4EE' : 'white',
                    borderRadius: 16, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                      <span style={{ fontSize: 28, width: 52, height: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4EF', borderRadius: 12 }}>{opt.icon}</span>
                      <div>
                        <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800 }}>{opt.title}</div>
                        <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{opt.desc}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', width: 20, height: 20, borderRadius: '50%', border: `2px solid ${role === opt.r ? '#0A4F2F' : '#E5E7E0'}`, background: role === opt.r ? '#0A4F2F' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {role === opt.r && <span style={{ color: 'white', fontSize: 12 }}>✓</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {opt.perks.map(p => (
                        <span key={p} style={{ fontSize: 11, fontWeight: 600, background: role === opt.r ? '#D1E8DB' : '#F3F4EF', color: role === opt.r ? '#0A4F2F' : '#9CA3AF', padding: '3px 9px', borderRadius: 100 }}>✓ {p}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => { if (role) setStep(2); }} disabled={!role} style={{
                width: '100%', marginTop: 24, padding: 16, borderRadius: 12,
                background: role ? '#0A4F2F' : '#E5E7E0', color: role ? 'white' : '#9CA3AF',
                border: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 16, fontWeight: 800,
                cursor: role ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
              }}>
                Continue as {role === 'BUYER' ? 'Buyer' : role === 'SELLER' ? 'Seller' : '...'} →
              </button>
            </>
          )}

          {/* ── STEP 2: Personal Details ── */}
          {step === 2 && (
            <>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Personal Details</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>Your info is encrypted and never shared</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input style={inputStyle} placeholder="Amaka" value={form.firstName} onChange={e => update('firstName', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input style={inputStyle} placeholder="Obi" value={form.lastName} onChange={e => update('lastName', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Email Address</label>
                <input type="email" style={inputStyle} placeholder="amaka@example.com" value={form.email} onChange={e => update('email', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Phone Number</label>
                <input type="tel" style={inputStyle} placeholder="08012345678" value={form.phone} onChange={e => update('phone', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Password</label>
                <input type="password" style={inputStyle} placeholder="Minimum 8 characters" value={form.password} onChange={e => update('password', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>Confirm Password</label>
                <input type="password" style={inputStyle} placeholder="Repeat password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'white', border: '2px solid #E5E7E0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Satoshi' }}>← Back</button>
                <button onClick={() => {
                  if (!form.firstName || !form.email || !form.password) { setError('Please fill all fields'); return; }
                  if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
                  if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
                  setError('');
                  setStep(3);
                }} style={{ flex: 2, padding: 14, borderRadius: 12, background: '#0A4F2F', color: 'white', border: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                  Next: {role === 'SELLER' ? 'Store Setup' : 'Wallet Setup'} →
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3a: Seller Store Setup ── */}
          {step === 3 && role === 'SELLER' && (
            <>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Set Up Your Store</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>Buyers will see this when they visit your profile</p>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Store Name <span style={{ color: '#9CA3AF', fontWeight: 400 }}>*</span></label>
                <input style={inputStyle} placeholder="e.g. TechNaija Store" value={form.storeName} onChange={e => update('storeName', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={labelStyle}>Store Description</label>
                <textarea style={{ ...inputStyle, height: 80, resize: 'none' } as React.CSSProperties} placeholder="What do you sell? Why should buyers trust you?" value={form.storeDescription} onChange={e => update('storeDescription', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={labelStyle}>BVN <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(for virtual account — optional now)</span></label>
                <input style={inputStyle} placeholder="22212345678" value={form.bvn} onChange={e => update('bvn', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>🔒 Your BVN is encrypted. Required by CBN for NGN virtual account generation.</div>
              </div>
              <div style={{ background: '#E8F4EE', border: '1px solid #A7D5BB', borderRadius: 12, padding: 16, marginBottom: 20 }}>
                <div style={{ fontWeight: 700, color: '#0A4F2F', fontSize: 14, marginBottom: 4 }}>🏦 What happens next?</div>
                <div style={{ fontSize: 13, color: '#0D6B3E', lineHeight: 1.6 }}>
                  Your Wema Bank virtual account will be created within seconds of registration. Any bank transfer to it credits your PODnig wallet instantly — 24/7.
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'white', border: '2px solid #E5E7E0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Satoshi' }}>← Back</button>
                <button onClick={handleRegister} disabled={loading || !form.storeName} style={{
                  flex: 2, padding: 14, borderRadius: 12,
                  background: loading || !form.storeName ? '#E5E7E0' : '#0A4F2F',
                  color: loading || !form.storeName ? '#9CA3AF' : 'white',
                  border: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 15, fontWeight: 800,
                  cursor: loading || !form.storeName ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Creating your store...' : '🚀 Launch My Store →'}
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3b: Buyer Wallet Setup ── */}
          {step === 3 && role === 'BUYER' && (
            <>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 6 }}>Wallet Setup</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14, marginBottom: 24 }}>Your PODnig wallet is created automatically</p>
              <div style={{ marginBottom: 20 }}>
                <label style={labelStyle}>BVN <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional — for instant virtual account)</span></label>
                <input style={inputStyle} placeholder="22212345678" value={form.bvn} onChange={e => update('bvn', e.target.value)} onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
                <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 6 }}>Your BVN is encrypted. You can also add this later.</div>
              </div>
              {[
                { icon: '⚡', title: 'Instant Virtual Account', desc: 'Get a dedicated Wema Bank account. Transfer money anytime to top up.' },
                { icon: '🔒', title: 'Escrow Protection', desc: 'All purchases are held in escrow until you confirm delivery.' },
                { icon: '📲', title: 'Real-time Alerts', desc: 'SMS + email notifications for every wallet movement.' },
              ].map(f => (
                <div key={f.title} style={{ display: 'flex', gap: 14, marginBottom: 16 }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: '#E8F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{f.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>{f.title}</div>
                    <div style={{ fontSize: 13, color: '#9CA3AF', lineHeight: 1.4 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button onClick={() => setStep(2)} style={{ flex: 1, padding: 14, borderRadius: 12, background: 'white', border: '2px solid #E5E7E0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Satoshi' }}>← Back</button>
                <button onClick={handleRegister} disabled={loading} style={{
                  flex: 2, padding: 14, borderRadius: 12,
                  background: loading ? '#9CA3AF' : '#0A4F2F', color: 'white',
                  border: 'none', fontFamily: 'Cabinet Grotesk', fontSize: 15, fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                  {loading ? 'Creating account...' : '🛒 Start Shopping →'}
                </button>
              </div>
            </>
          )}

          <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: '#9CA3AF' }}>
            Already have an account?{' '}
            <button onClick={() => onNavigate('login')} style={{ color: '#0A4F2F', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'Satoshi' }}>Sign in →</button>
          </div>
        </div>
      </div>
    </div>
  );
}