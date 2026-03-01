// src/pages/admin/AdminDashboard.tsx
import { useState } from 'react';
import { MetricCard, EscrowBadge, Modal, Button, Toast } from '../../components/index';

type AdminView = 'overview' | 'sellers' | 'orders' | 'disputes' | 'financials' | 'sponsored' | 'reports' | 'settings';

interface AdminDashboardProps { initialView?: AdminView; }

const MOCK_SELLERS = [
  { id: 's1', storeName: 'TechNaija Store', email: 'tech@naija.com', sales: 89, revenue: 34265000, rating: 4.9, reports: 0, status: 'active', isVerified: true, sponsored: true, joinDate: 'Jan 15, 2026' },
  { id: 's2', storeName: 'NaturalNG Beauty', email: 'natural@ng.com', sales: 508, revenue: 2134000, rating: 4.7, reports: 1, status: 'active', isVerified: true, sponsored: false, joinDate: 'Jan 20, 2026' },
  { id: 's3', storeName: 'FakeSeller2024', email: 'fake@bad.com', sales: 12, revenue: 240000, rating: 2.1, reports: 3, status: 'auto-suspended', isVerified: false, sponsored: false, joinDate: 'Feb 1, 2026' },
  { id: 's4', storeName: 'Mama Bisi Fabrics', email: 'mama@bisi.com', sales: 267, revenue: 3337500, rating: 4.6, reports: 0, status: 'active', isVerified: false, sponsored: false, joinDate: 'Jan 10, 2026' },
  { id: 's5', storeName: 'GreenPower NG', email: 'green@power.ng', sales: 67, revenue: 9715000, rating: 4.7, reports: 0, status: 'active', isVerified: true, sponsored: true, joinDate: 'Feb 5, 2026' },
];

const MOCK_DISPUTES = [
  { id: 'd1', orderRef: 'POD-2835', buyer: 'Fatima A.', seller: 'NaturalNG Beauty', product: 'Shea Butter 500ml', amount: 4200, reason: 'Item not as described — received expired product', status: 'OPEN', date: 'Feb 22, 2026', evidence: 3 },
  { id: 'd2', orderRef: 'POD-2811', buyer: 'Chidi O.', seller: 'TechNaija Store', product: 'Samsung A55', amount: 385000, reason: 'Item never delivered. Seller marked as shipped but nothing arrived.', status: 'UNDER_REVIEW', date: 'Feb 19, 2026', evidence: 5 },
  { id: 'd3', orderRef: 'POD-2798', buyer: 'Grace E.', seller: 'Mama Bisi Fabrics', product: 'Ankara Set', amount: 12500, reason: 'Wrong size delivered', status: 'RESOLVED_BUYER', date: 'Feb 15, 2026', evidence: 2 },
];

const MOCK_ORDERS_ADMIN = [
  { id: 'o1', orderRef: 'POD-2847', buyer: 'Amaka Obi', seller: 'TechNaija Store', product: 'Samsung A55', amount: 385000, status: 'PAID_IN_ESCROW', date: 'Feb 24, 2026' },
  { id: 'o2', orderRef: 'POD-2841', buyer: 'Emeka K.', seller: "Kunle's Kicks", product: 'Leather Sneakers', amount: 28500, status: 'COMPLETED', date: 'Feb 23, 2026' },
  { id: 'o3', orderRef: 'POD-2835', buyer: 'Fatima A.', seller: 'NaturalNG Beauty', product: 'Shea Butter', amount: 4200, status: 'DISPUTED', date: 'Feb 22, 2026' },
  { id: 'o4', orderRef: 'POD-2829', buyer: 'Chidi O.', seller: 'GreenPower NG', product: 'Solar Generator', amount: 145000, status: 'SELLER_CONFIRMED_DISPATCH', date: 'Feb 21, 2026' },
];

export default function AdminDashboard({ initialView = 'overview' }: AdminDashboardProps) {
  const [view, setView] = useState<AdminView>(initialView);
  const [sellers, setSellers] = useState(MOCK_SELLERS);
  const [sellerFilter, setSellerFilter] = useState('all');
  const [sellerSearch, setSellerSearch] = useState('');
  const [disputeFilter, setDisputeFilter] = useState('all');
  const [toast, setToast] = useState<{ msg: string; type?: 'success' | 'error' } | null>(null);
  const [selectedSeller, setSelectedSeller] = useState<typeof MOCK_SELLERS[0] | null>(null);
  const [selectedDispute, setSelectedDispute] = useState<typeof MOCK_DISPUTES[0] | null>(null);
  const [banReason, setBanReason] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const banSeller = (id: string) => {
    setSellers(s => s.map(sel => sel.id === id ? { ...sel, status: 'banned' } : sel));
    setSelectedSeller(null);
    showToast('Seller banned and notified via email ⛔');
  };

  const unbanSeller = (id: string) => {
    setSellers(s => s.map(sel => sel.id === id ? { ...sel, status: 'active', reports: 0 } : sel));
    showToast('Seller reinstated ✅');
  };

  const verifySeller = (id: string) => {
    setSellers(s => s.map(sel => sel.id === id ? { ...sel, isVerified: true } : sel));
    showToast('Seller verified — badge applied ✅');
  };

  const navItems: { key: AdminView; icon: string; label: string; badge?: number }[] = [
    { key: 'overview', icon: '📊', label: 'Platform Overview' },
    { key: 'sellers', icon: '🏪', label: 'Manage Sellers', badge: sellers.filter(s => s.status === 'auto-suspended').length },
    { key: 'orders', icon: '📦', label: 'All Orders' },
    { key: 'disputes', icon: '⚠️', label: 'Disputes', badge: MOCK_DISPUTES.filter(d => d.status === 'OPEN').length },
    { key: 'financials', icon: '💰', label: 'Financials' },
    { key: 'sponsored', icon: '⚡', label: 'Sponsored Ads' },
    { key: 'reports', icon: '🚫', label: 'Reports & Bans', badge: sellers.filter(s => s.reports > 0).length },
    { key: 'settings', icon: '⚙️', label: 'Platform Settings' },
  ];

  const filteredSellers = sellers.filter(s => {
    const matchStatus = sellerFilter === 'all' || s.status === sellerFilter;
    const matchSearch = s.storeName.toLowerCase().includes(sellerSearch.toLowerCase()) || s.email.toLowerCase().includes(sellerSearch.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', minHeight: 'calc(100vh - 68px)', background: '#F3F4EF' }}>
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Modals */}
      <Modal isOpen={!!selectedSeller} onClose={() => { setSelectedSeller(null); setBanReason(''); }} title={`Seller: ${selectedSeller?.storeName}`} subtitle={selectedSeller?.email}>
        {selectedSeller && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'Total Sales', value: selectedSeller.sales },
                { label: 'Revenue', value: `₦${(selectedSeller.revenue / 1000).toFixed(0)}K` },
                { label: 'Rating', value: `★ ${selectedSeller.rating}` },
                { label: 'Reports', value: selectedSeller.reports },
              ].map(m => (
                <div key={m.label} style={{ background: '#F3F4EF', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 22, fontWeight: 900 }}>{m.value}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{m.label}</div>
                </div>
              ))}
            </div>
            {selectedSeller.status !== 'banned' ? (
              <>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Ban Reason</label>
                  <textarea value={banReason} onChange={e => setBanReason(e.target.value)} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontFamily: 'Satoshi', fontSize: 14, resize: 'none', height: 80, outline: 'none' }} placeholder="State reason for ban..." />
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  {!selectedSeller.isVerified && <button onClick={() => { verifySeller(selectedSeller.id); setSelectedSeller(null); }} style={{ flex: 1, padding: 12, background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>✅ Verify Seller</button>}
                  <button onClick={() => banSeller(selectedSeller.id)} style={{ flex: 1, padding: 12, background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>🚫 Ban Seller</button>
                </div>
              </>
            ) : (
              <button onClick={() => unbanSeller(selectedSeller.id)} style={{ width: '100%', padding: 12, background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>✅ Reinstate Seller</button>
            )}
          </div>
        )}
      </Modal>

      <Modal isOpen={!!selectedDispute} onClose={() => setSelectedDispute(null)} title={`Dispute: ${selectedDispute?.orderRef}`} subtitle={`Opened by ${selectedDispute?.buyer}`}>
        {selectedDispute && (
          <div>
            <div style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: '#92400E', marginBottom: 4 }}>Buyer's Claim</div>
              <div style={{ fontSize: 14, color: '#78350F', lineHeight: 1.5 }}>{selectedDispute.reason}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <div style={{ background: '#F3F4EF', borderRadius: 10, padding: 12 }}><div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>ORDER VALUE</div><div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 20, marginTop: 4 }}>₦{selectedDispute.amount.toLocaleString()}</div></div>
              <div style={{ background: '#F3F4EF', borderRadius: 10, padding: 12 }}><div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>EVIDENCE FILES</div><div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 20, marginTop: 4 }}>{selectedDispute.evidence} files</div></div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Resolution Notes</label>
              <textarea style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontFamily: 'Satoshi', fontSize: 14, resize: 'none', height: 80, outline: 'none' }} placeholder="Document your resolution decision..." />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setSelectedDispute(null); showToast('Resolved in favour of buyer — refund initiated ↩️'); }} style={{ flex: 1, padding: 12, background: '#DBEAFE', color: '#1E40AF', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>↩️ Refund Buyer</button>
              <button onClick={() => { setSelectedDispute(null); showToast('Resolved in favour of seller — funds released ✅'); }} style={{ flex: 1, padding: 12, background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>✅ Release to Seller</button>
            </div>
          </div>
        )}
      </Modal>

      {/* SIDEBAR */}
      <div style={{ background: 'white', borderRight: '1px solid #E5E7E0', padding: '28px 16px', position: 'sticky', top: 68, height: 'calc(100vh - 68px)', overflowY: 'auto' }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #0A4F2F, #1A8A52)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 20, marginBottom: 10 }}>A</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>PODnig Admin</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Super Administrator</div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, padding: '0 8px', marginBottom: 8 }}>Navigation</div>
        {navItems.map(item => (
          <div key={item.key} onClick={() => setView(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10,
            cursor: 'pointer', transition: 'all 0.15s', marginBottom: 2, fontSize: 14, fontWeight: 600,
            background: view === item.key ? '#E8F4EE' : 'transparent',
            color: view === item.key ? '#0A4F2F' : '#9CA3AF',
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? <span style={{ background: '#F59E0B', color: '#0D1F14', fontSize: 11, fontWeight: 800, padding: '2px 7px', borderRadius: 100 }}>{item.badge}</span> : null}
          </div>
        ))}

        <div style={{ marginTop: 24, padding: '14px 14px', background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>🚨 Action Required</div>
          <div style={{ fontSize: 12, color: '#78350F' }}>FakeSeller2024 auto-suspended — {MOCK_DISPUTES.filter(d => d.status === 'OPEN').length} open disputes pending review</div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: 32, overflowY: 'auto' }}>

        {/* ── OVERVIEW ── */}
        {view === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>Platform Overview</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Real-time platform health and metrics</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { icon: '💰', label: 'Platform GMV', value: '₦2.1B', change: '↑ 34% MoM', type: 'up' as const },
                { icon: '👥', label: 'Total Users', value: '12,441', change: '↑ 892 this week', type: 'up' as const },
                { icon: '🏪', label: 'Active Sellers', value: '4,213', change: '↑ 120 new', type: 'up' as const },
                { icon: '💸', label: 'Commission (MTD)', value: '₦63M', change: '↑ 28% MoM', type: 'up' as const },
              ].map(m => <MetricCard key={m.label} icon={m.icon} label={m.label} value={m.value} change={m.change} changeType={m.type} />)}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', padding: 24 }}>
                <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800, marginBottom: 18 }}>GMV — Last 12 Months</div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130, marginBottom: 8 }}>
                  {[30,45,60,55,72,85,92,78,95,88,100,94].map((h,i) => (
                    <div key={i} style={{ flex: 1, borderRadius: '6px 6px 0 0', background: i === 11 ? '#0A4F2F' : 'linear-gradient(to top,#0D6B3E,#1A8A52)', height: `${h}%`, transition: 'all 0.3s', cursor: 'pointer' }} title={`₦${(h * 21).toFixed(0)}M`} />
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['J','F','M','A','M','J','J','A','S','O','N','D'].map(d => <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: '#9CA3AF', fontWeight: 600 }}>{d}</div>)}
                </div>
              </div>
              <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', padding: 24 }}>
                <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800, marginBottom: 16 }}>Escrow Health</div>
                {[
                  { label: 'Active Escrows', value: '247', color: '#F59E0B' },
                  { label: 'Released Today', value: '89', color: '#10B981' },
                  { label: 'Disputed', value: '12', color: '#EF4444' },
                  { label: 'Avg. Resolution', value: '4.2 hrs', color: '#0A4F2F' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #E5E7E0' }}>
                    <span style={{ fontSize: 13, color: '#9CA3AF' }}>{row.label}</span>
                    <span style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 20, color: row.color }}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7E0', fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800 }}>Recent Activity</div>
              {MOCK_ORDERS_ADMIN.slice(0, 3).map(o => (
                <div key={o.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 24px', borderTop: '1px solid #E5E7E0', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{o.orderRef} — {o.product}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{o.buyer} → {o.seller}</div>
                  </div>
                  <div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 800 }}>₦{o.amount.toLocaleString()}</div>
                  <EscrowBadge status={o.status as any} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SELLERS ── */}
        {view === 'sellers' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, letterSpacing: -0.5, marginBottom: 4 }}>Seller Management</h2>
                <p style={{ color: '#9CA3AF', fontSize: 14 }}>{sellers.length} sellers · {sellers.filter(s => s.status === 'auto-suspended').length} need review</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <input value={sellerSearch} onChange={e => setSellerSearch(e.target.value)} placeholder="Search sellers..." style={{ padding: '9px 14px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 14, fontFamily: 'Satoshi', outline: 'none', width: 220 }} />
                <select value={sellerFilter} onChange={e => setSellerFilter(e.target.value)} style={{ padding: '9px 14px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 14, fontFamily: 'Satoshi', outline: 'none' }}>
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="auto-suspended">Suspended</option>
                  <option value="banned">Banned</option>
                </select>
              </div>
            </div>

            {/* Auto-ban alert */}
            {sellers.filter(s => s.status === 'auto-suspended').map(s => (
              <div key={s.id} style={{ background: '#FEF3C7', border: '1px solid #FCD34D', borderRadius: 12, padding: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: 22 }}>🚨</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: '#92400E' }}>Auto-Suspend: {s.storeName} ({s.reports} reports)</div>
                  <div style={{ fontSize: 13, color: '#78350F', marginTop: 2 }}>Suspended pending admin review. Rating: ★{s.rating}</div>
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => banSeller(s.id)} style={{ padding: '8px 14px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Confirm Ban</button>
                  <button onClick={() => unbanSeller(s.id)} style={{ padding: '8px 14px', background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Reinstate</button>
                </div>
              </div>
            ))}

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F3F4EF' }}>
                    {['Seller', 'Sales', 'Revenue', 'Rating', 'Reports', 'Status', 'Actions'].map(h => (
                      <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map(s => (
                    <tr key={s.id} style={{ borderTop: '1px solid #E5E7E0' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAF7')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{s.storeName} {s.isVerified && <span style={{ color: '#1A8A52', fontSize: 14 }}>✓</span>} {s.sponsored && <span style={{ fontSize: 10, background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: 100, fontWeight: 700 }}>⚡ Sponsored</span>}</div>
                        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{s.email} · Joined {s.joinDate}</div>
                      </td>
                      <td style={{ padding: '14px 18px', fontFamily: 'Cabinet Grotesk', fontWeight: 700 }}>{s.sales}</td>
                      <td style={{ padding: '14px 18px', fontFamily: 'Cabinet Grotesk', fontWeight: 700 }}>₦{(s.revenue / 1000).toFixed(0)}K</td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: s.rating >= 4 ? '#10B981' : '#EF4444' }}>★ {s.rating}</td>
                      <td style={{ padding: '14px 18px', fontWeight: 700, color: s.reports >= 3 ? '#EF4444' : s.reports > 0 ? '#F59E0B' : '#9CA3AF' }}>
                        {s.reports} {s.reports >= 3 ? '🚨' : s.reports > 0 ? '⚠️' : ''}
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                          background: s.status === 'banned' ? '#FEE2E2' : s.status === 'auto-suspended' ? '#FEF3C7' : '#D1FAE5',
                          color: s.status === 'banned' ? '#991B1B' : s.status === 'auto-suspended' ? '#92400E' : '#065F46',
                        }}>
                          {s.status === 'banned' ? '🚫 Banned' : s.status === 'auto-suspended' ? '⏸ Suspended' : '✅ Active'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 18px' }}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button onClick={() => setSelectedSeller(s)} style={{ padding: '6px 12px', background: '#F3F4EF', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Manage</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── DISPUTES ── */}
        {view === 'disputes' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Dispute Management</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>{MOCK_DISPUTES.filter(d => d.status === 'OPEN').length} open · Avg resolution: 4.2 hours</p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
              {['all', 'OPEN', 'UNDER_REVIEW', 'RESOLVED_BUYER', 'RESOLVED_SELLER'].map(f => (
                <button key={f} onClick={() => setDisputeFilter(f)} style={{
                  padding: '8px 16px', borderRadius: 100, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: '2px solid', transition: 'all 0.2s',
                  borderColor: disputeFilter === f ? '#0A4F2F' : '#E5E7E0',
                  background: disputeFilter === f ? '#0A4F2F' : 'white',
                  color: disputeFilter === f ? 'white' : '#9CA3AF',
                }}>{f === 'all' ? 'All' : f.replace(/_/g, ' ')}</button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {MOCK_DISPUTES.filter(d => disputeFilter === 'all' || d.status === disputeFilter).map(d => (
                <div key={d.id} style={{ background: 'white', borderRadius: 16, border: `1px solid ${d.status === 'OPEN' ? '#FCD34D' : '#E5E7E0'}`, padding: 20, cursor: 'pointer' }} onClick={() => setSelectedDispute(d)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <div>
                      <span style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 800, fontSize: 15 }}>{d.orderRef}</span>
                      <span style={{ marginLeft: 10, fontSize: 13, color: '#9CA3AF' }}>{d.product}</span>
                    </div>
                    <span style={{
                      padding: '4px 10px', borderRadius: 100, fontSize: 12, fontWeight: 700,
                      background: d.status === 'OPEN' ? '#FEF3C7' : d.status === 'UNDER_REVIEW' ? '#DBEAFE' : '#D1FAE5',
                      color: d.status === 'OPEN' ? '#92400E' : d.status === 'UNDER_REVIEW' ? '#1E40AF' : '#065F46',
                    }}>{d.status.replace(/_/g, ' ')}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#1C2B22', lineHeight: 1.5, marginBottom: 12 }}>{d.reason}</div>
                  <div style={{ display: 'flex', gap: 20, fontSize: 12, color: '#9CA3AF' }}>
                    <span>👤 {d.buyer}</span>
                    <span>🏪 {d.seller}</span>
                    <span>💰 ₦{d.amount.toLocaleString()}</span>
                    <span>📎 {d.evidence} files</span>
                    <span>📅 {d.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {view === 'orders' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>All Orders</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Monitor all platform transactions</p>
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F3F4EF' }}>
                  {['Order Ref', 'Product', 'Buyer', 'Seller', 'Amount', 'Status', 'Date'].map(h => (
                    <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {MOCK_ORDERS_ADMIN.map(o => (
                    <tr key={o.id} style={{ borderTop: '1px solid #E5E7E0' }}
                      onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#F9FAF7')}
                      onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = 'transparent')}
                    >
                      <td style={{ padding: '14px 20px', fontFamily: 'Cabinet Grotesk', fontWeight: 700 }}>{o.orderRef}</td>
                      <td style={{ padding: '14px 20px', fontSize: 14 }}>{o.product}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#9CA3AF' }}>{o.buyer}</td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#9CA3AF' }}>{o.seller}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'Cabinet Grotesk', fontWeight: 800 }}>₦{o.amount.toLocaleString()}</td>
                      <td style={{ padding: '14px 20px' }}><EscrowBadge status={o.status as any} /></td>
                      <td style={{ padding: '14px 20px', fontSize: 13, color: '#9CA3AF' }}>{o.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── FINANCIALS ── */}
        {view === 'financials' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Platform Financials</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Revenue, commissions, and escrow ledger</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { icon: '💰', label: 'Total GMV', value: '₦2.1B', change: '↑ 34%', type: 'up' as const },
                { icon: '💸', label: '3% Commission Earned', value: '₦63M', change: '₦4.2M today', type: 'up' as const },
                { icon: '🔒', label: 'Currently in Escrow', value: '₦847M', change: '247 orders', type: 'neutral' as const },
              ].map(m => <MetricCard key={m.label} {...m} />)}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              {[
                {
                  title: 'Revenue Breakdown',
                  rows: [
                    { label: 'Transaction Commission (3%)', value: '₦63,000,000', pct: '78%' },
                    { label: 'Sponsored Listings', value: '₦14,500,000', pct: '18%' },
                    { label: 'Seller Verification Fee', value: '₦3,200,000', pct: '4%' },
                  ],
                },
                {
                  title: 'Payout Summary',
                  rows: [
                    { label: 'Seller Withdrawals (MTD)', value: '₦1.2B', pct: '' },
                    { label: 'Avg Withdrawal Amount', value: '₦285,000', pct: '' },
                    { label: 'Pending Withdrawals', value: '₦34M', pct: '' },
                  ],
                },
              ].map(card => (
                <div key={card.title} style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', padding: 24 }}>
                  <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800, marginBottom: 18 }}>{card.title}</div>
                  {card.rows.map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #E5E7E0' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{row.label}</div>
                        {row.pct && <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 2 }}>{row.pct} of total</div>}
                      </div>
                      <div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 800, fontSize: 16 }}>{row.value}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SPONSORED ADS ── */}
        {view === 'sponsored' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Sponsored Listings</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Active boosts, impressions, and ad revenue</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 24 }}>
              <MetricCard icon="⚡" label="Active Boosts" value="47" />
              <MetricCard icon="👁️" label="Total Impressions" value="2.4M" change="↑ 12% this week" changeType="up" />
              <MetricCard icon="💰" label="Ad Revenue (MTD)" value="₦14.5M" change="↑ 22%" changeType="up" />
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7E0', fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800 }}>Active Sponsored Listings</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F3F4EF' }}>
                  {['Seller', 'Plan', 'Impressions', 'Clicks', 'CTR', 'Expires', 'Revenue'].map(h => (
                    <th key={h} style={{ padding: '12px 18px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {[
                    { seller: 'TechNaija Store', plan: 'PRO', impressions: '12,400', clicks: '892', ctr: '7.2%', expires: 'Mar 3, 2026', revenue: '₦5,000' },
                    { seller: 'GreenPower NG', plan: 'ELITE', impressions: '34,200', clicks: '2,100', ctr: '6.1%', expires: 'Mar 25, 2026', revenue: '₦15,000' },
                    { seller: 'NaturalNG Beauty', plan: 'STARTER', impressions: '4,800', clicks: '312', ctr: '6.5%', expires: 'Feb 27, 2026', revenue: '₦1,500' },
                  ].map(row => (
                    <tr key={row.seller} style={{ borderTop: '1px solid #E5E7E0' }}>
                      <td style={{ padding: '14px 18px', fontWeight: 700 }}>{row.seller}</td>
                      <td style={{ padding: '14px 18px' }}><span style={{ background: '#FEF3C7', color: '#92400E', fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 100 }}>⚡ {row.plan}</span></td>
                      <td style={{ padding: '14px 18px', fontFamily: 'Cabinet Grotesk', fontWeight: 700 }}>{row.impressions}</td>
                      <td style={{ padding: '14px 18px', fontFamily: 'Cabinet Grotesk', fontWeight: 700 }}>{row.clicks}</td>
                      <td style={{ padding: '14px 18px', color: '#10B981', fontWeight: 700 }}>{row.ctr}</td>
                      <td style={{ padding: '14px 18px', fontSize: 13, color: '#9CA3AF' }}>{row.expires}</td>
                      <td style={{ padding: '14px 18px', fontFamily: 'Cabinet Grotesk', fontWeight: 800, color: '#0A4F2F' }}>{row.revenue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── REPORTS ── */}
        {view === 'reports' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Reports & Bans</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Auto-ban triggers at 3 reports. Manual review here.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <MetricCard icon="📊" label="Total Reports (MTD)" value="34" change="↑ 8 this week" changeType="up" />
              <MetricCard icon="🚫" label="Sellers Banned" value="7" change="2 reinstated" changeType="neutral" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sellers.filter(s => s.reports > 0).map(s => (
                <div key={s.id} style={{ background: 'white', borderRadius: 14, border: `2px solid ${s.reports >= 3 ? '#FCA5A5' : '#FCD34D'}`, padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: 16 }}>{s.storeName}</div>
                      <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 2 }}>{s.email} · ★ {s.rating}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 28, fontWeight: 900, color: s.reports >= 3 ? '#EF4444' : '#F59E0B' }}>{s.reports}</div>
                      <div style={{ fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>REPORTS</div>
                    </div>
                  </div>
                  {s.reports >= 3 && <div style={{ background: '#FEE2E2', borderRadius: 8, padding: 10, marginTop: 12, fontSize: 13, color: '#991B1B', fontWeight: 600 }}>🚨 AUTO-SUSPEND TRIGGERED — Review required</div>}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => banSeller(s.id)} style={{ padding: '8px 14px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>🚫 Ban</button>
                    <button onClick={() => showToast(`Reports cleared for ${s.storeName}`)} style={{ padding: '8px 14px', background: '#F3F4EF', color: '#9CA3AF', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Clear Reports</button>
                    <button onClick={() => setSelectedSeller(s)} style={{ padding: '8px 14px', background: '#F3F4EF', color: '#1C2B22', border: 'none', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>View Profile</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS ── */}
        {view === 'settings' && (
          <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: 700 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Platform Settings</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Core configuration for PODnig</p>
            </div>
            {[
              { title: 'Commission Rate', desc: 'Percentage taken from each completed order', value: '3%', tag: 'Revenue' },
              { title: 'Auto-Ban Threshold', desc: 'Number of reports before automatic seller suspension', value: '3 reports', tag: 'Trust & Safety' },
              { title: 'Escrow Auto-Release', desc: 'Days after dispatch before auto-releasing to seller', value: '7 days', tag: 'Escrow' },
              { title: 'Dispute SLA', desc: 'Maximum hours admin has to resolve a dispute', value: '24 hours', tag: 'Disputes' },
              { title: 'Max Boost Duration (Elite)', desc: 'Maximum days for a sponsored listing', value: '30 days', tag: 'Ads' },
            ].map(s => (
              <div key={s.title} style={{ background: 'white', borderRadius: 14, border: '1px solid #E5E7E0', padding: 20, marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>{s.title}</span>
                    <span style={{ fontSize: 10, background: '#E8F4EE', color: '#0A4F2F', fontWeight: 700, padding: '2px 7px', borderRadius: 100 }}>{s.tag}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#9CA3AF' }}>{s.desc}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontFamily: 'Cabinet Grotesk', fontSize: 20, fontWeight: 900, color: '#0A4F2F' }}>{s.value}</span>
                  <button onClick={() => showToast('Settings updated (connect to backend)')} style={{ padding: '7px 14px', background: '#F3F4EF', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Edit</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}