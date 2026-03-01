// src/pages/seller/SellerDashboard.tsx
import { useState } from 'react';
import { MetricCard, EscrowBadge, Modal, Toast } from '../../components/index';
import { MOCK_PRODUCTS, MOCK_ORDERS } from '../../utils/mockData';

type SellerView = 'overview' | 'inventory' | 'orders' | 'wallet' | 'boost' | 'disputes' | 'reviews' | 'analytics';

interface SellerDashboardProps { initialView?: SellerView; onNavigate?: (page: string) => void; }

const BOOST_PLANS = [
  { id: 'STARTER', label: 'Starter Boost', price: 1500, priceLabel: '₦1,500', duration: '3 Days', views: '~500 extra views', desc: 'Great for testing your listing visibility' },
  { id: 'PRO', label: 'Pro Boost', price: 5000, priceLabel: '₦5,000', duration: '7 Days', views: '~2,000 extra views', desc: 'Most popular — perfect for new products', popular: true },
  { id: 'ELITE', label: 'Elite Boost', price: 15000, priceLabel: '₦15,000', duration: '30 Days', views: '~10,000 extra views', desc: 'Maximum visibility for your best sellers' },
];

export default function SellerDashboard({ initialView = 'overview', onNavigate }: SellerDashboardProps) {
  const [view, setView] = useState<SellerView>(initialView);
  const [toast, setToast] = useState<{ msg: string } | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showBoostModal, setShowBoostModal] = useState(false);
  const [selectedBoostProduct, setSelectedBoostProduct] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', comparePrice: '', category: 'Electronics', stock: '', description: '', location: '', sku: '' });

  const showToast = (msg: string) => { setToast({ msg }); setTimeout(() => setToast(null), 4000); };

  const navItems: { key: SellerView; icon: string; label: string; badge?: number }[] = [
    { key: 'overview', icon: '📊', label: 'Overview' },
    { key: 'inventory', icon: '📦', label: 'My Inventory', badge: MOCK_PRODUCTS.length },
    { key: 'orders', icon: '🛍️', label: 'Orders', badge: 5 },
    { key: 'wallet', icon: '💳', label: 'Earnings & Wallet' },
    { key: 'boost', icon: '⚡', label: 'Boost Listings' },
    { key: 'disputes', icon: '⚠️', label: 'Disputes', badge: 1 },
    { key: 'reviews', icon: '⭐', label: 'Reviews' },
    { key: 'analytics', icon: '📈', label: 'Analytics' },
  ];

  const categoryEmojis: Record<string, string> = { Electronics: '📱', Fashion: '👘', Beauty: '🧴', Home: '🏠', Food: '🍲' };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '256px 1fr', minHeight: 'calc(100vh - 68px)' }}>
      {toast && <Toast message={toast.msg} onClose={() => setToast(null)} />}

      {/* Add Product Modal */}
      <Modal isOpen={showAddProduct} onClose={() => setShowAddProduct(false)} title="📦 List New Product" subtitle="Add to your PODnig store">
        <div style={{ display: 'grid', gap: 0 }}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Product Name *</label>
            <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }} placeholder="e.g. iPhone 15 Pro Max 256GB" onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Price (₦) *</label>
              <input type="number" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }} placeholder="45000" />
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Compare Price (₦)</label>
              <input type="number" value={newProduct.comparePrice} onChange={e => setNewProduct(p => ({ ...p, comparePrice: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }} placeholder="50000 (original)" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Category *</label>
              <select value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }}>
                {['Electronics', 'Fashion', 'Beauty', 'Home', 'Food', 'Sports', 'Books', 'Automotive'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Stock Quantity *</label>
              <input type="number" value={newProduct.stock} onChange={e => setNewProduct(p => ({ ...p, stock: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }} placeholder="10" />
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Location *</label>
            <input value={newProduct.location} onChange={e => setNewProduct(p => ({ ...p, location: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none' }} placeholder="e.g. Ikeja, Lagos" onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Product Description *</label>
            <textarea value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} style={{ width: '100%', padding: '12px 16px', border: '2px solid #E5E7E0', borderRadius: 10, fontSize: 15, fontFamily: 'Satoshi', outline: 'none', resize: 'none', height: 90 }} placeholder="Describe your product clearly. Include condition, specs, and any relevant details." onFocus={e => e.target.style.borderColor = '#1A8A52'} onBlur={e => e.target.style.borderColor = '#E5E7E0'} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 700, display: 'block', marginBottom: 6 }}>Product Images</label>
            <div style={{ border: '2px dashed #E5E7E0', borderRadius: 10, padding: '24px', textAlign: 'center', cursor: 'pointer', color: '#9CA3AF', fontSize: 14, transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#1A8A52')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#E5E7E0')}
            >
              📸 Click to upload product images (max 5, 5MB each)
            </div>
          </div>
          <button onClick={() => { setShowAddProduct(false); showToast(`"${newProduct.name || 'New Product'}" listed successfully! 🎉 Pending approval.`); setNewProduct({ name: '', price: '', comparePrice: '', category: 'Electronics', stock: '', description: '', location: '', sku: '' }); }}
            style={{ width: '100%', padding: 15, background: '#0A4F2F', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cabinet Grotesk', fontSize: 16, fontWeight: 800, cursor: 'pointer' }}>
            📦 List Product →
          </button>
        </div>
      </Modal>

      {/* Boost Modal */}
      <Modal isOpen={showBoostModal} onClose={() => setShowBoostModal(false)} title="⚡ Boost Your Listing" subtitle="Appear at the top of search results and category pages">
        <div>
          {BOOST_PLANS.map(plan => (
            <div key={plan.id} onClick={() => { setShowBoostModal(false); showToast(`${plan.label} activated! Your listing is now sponsored ⚡`); }}
              style={{ border: `2px solid ${plan.popular ? '#F59E0B' : '#E5E7E0'}`, borderRadius: 14, padding: 18, marginBottom: 12, cursor: 'pointer', background: plan.popular ? '#FFFBEB' : 'white', position: 'relative', transition: 'all 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#0A4F2F')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = plan.popular ? '#F59E0B' : '#E5E7E0')}
            >
              {plan.popular && <div style={{ position: 'absolute', top: -10, right: 14, background: '#F59E0B', color: '#0D1F14', fontSize: 10, fontWeight: 800, padding: '3px 10px', borderRadius: 100 }}>⭐ Most Popular</div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 800, fontSize: 17 }}>{plan.label}</div>
                  <div style={{ fontSize: 13, color: '#9CA3AF', marginTop: 3 }}>{plan.duration} · {plan.views}</div>
                  <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>{plan.desc}</div>
                </div>
                <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 24, fontWeight: 900, color: '#0A4F2F', flexShrink: 0, marginLeft: 16 }}>{plan.priceLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      {/* SIDEBAR */}
      <div style={{ background: 'white', borderRight: '1px solid #E5E7E0', padding: '28px 16px', position: 'sticky', top: 68, height: 'calc(100vh - 68px)', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: 24 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #F59E0B, #FF6B00)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 20, marginBottom: 10 }}>T</div>
          <div style={{ fontWeight: 800, fontSize: 15 }}>TechNaija Store</div>
          <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>tech@naija.com</div>
          <div style={{ background: '#D1FAE5', color: '#065F46', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 100, display: 'inline-block', marginTop: 6 }}>✅ Verified Seller</div>
        </div>

        <div style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, padding: '0 8px', marginBottom: 8 }}>Seller Menu</div>
        {navItems.map(item => (
          <div key={item.key} onClick={() => setView(item.key)} style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '11px 14px', borderRadius: 10,
            cursor: 'pointer', transition: 'all 0.15s', marginBottom: 2, fontSize: 14, fontWeight: 600,
            background: view === item.key ? '#E8F4EE' : 'transparent',
            color: view === item.key ? '#0A4F2F' : '#9CA3AF',
          }}>
            <span style={{ fontSize: 17 }}>{item.icon}</span>
            <span style={{ flex: 1 }}>{item.label}</span>
            {item.badge ? <span style={{ background: '#F59E0B', color: '#0D1F14', fontSize: 11, fontWeight: 800, padding: '2px 6px', borderRadius: 100 }}>{item.badge}</span> : null}
          </div>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: 16 }}>
          <button onClick={() => setShowAddProduct(true)} style={{ width: '100%', padding: '12px', background: '#0A4F2F', color: 'white', border: 'none', borderRadius: 12, fontFamily: 'Cabinet Grotesk', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}>
            + Add New Product
          </button>
          <button onClick={() => setShowBoostModal(true)} style={{ width: '100%', padding: '10px', background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: 10, fontFamily: 'Cabinet Grotesk', fontWeight: 700, fontSize: 13, cursor: 'pointer', marginTop: 8 }}>
            ⚡ Boost Listing
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ padding: 32, background: '#F3F4EF', overflowY: 'auto' }}>

        {/* ── OVERVIEW ── */}
        {view === 'overview' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Seller Hub</h2>
                <p style={{ color: '#9CA3AF', fontSize: 14 }}>Your store performance at a glance</p>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setShowBoostModal(true)} style={{ padding: '10px 18px', background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Satoshi' }}>⚡ Boost Listing</button>
                <button onClick={() => setShowAddProduct(true)} style={{ padding: '10px 18px', background: '#0A4F2F', color: 'white', border: 'none', borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Cabinet Grotesk' }}>+ New Product</button>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              <MetricCard icon="💰" label="Total Earnings" value="₦2.4M" change="↑ 18% this month" changeType="up" />
              <MetricCard icon="🛍️" label="Total Orders" value="89" change="↑ 12 this week" changeType="up" />
              <MetricCard icon="⭐" label="Store Rating" value="4.9 ★" change="Excellent" changeType="up" />
              <MetricCard icon="📦" label="Active Listings" value="12" change="3 sponsored" changeType="neutral" />
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', padding: 24, marginBottom: 20 }}>
              <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Revenue — Last 7 Days</div>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, marginBottom: 8 }}>
                {[45,72,38,90,65,48,85].map((h, i) => (
                  <div key={i} style={{ flex: 1, borderRadius: '6px 6px 0 0', background: i === 6 ? '#0A4F2F' : 'linear-gradient(to top,#0D6B3E,#1A8A52)', height: `${h}%`, transition: 'opacity 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    title={`₦${(h * 5000).toLocaleString()}`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d} style={{ flex: 1, textAlign: 'center', fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>{d}</div>)}
              </div>
            </div>

            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', overflow: 'hidden' }}>
              <div style={{ padding: '18px 24px', borderBottom: '1px solid #E5E7E0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800 }}>Recent Orders</div>
                <button onClick={() => setView('orders')} style={{ fontSize: 13, color: '#0A4F2F', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}>View All →</button>
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#F3F4EF' }}>
                  {['Order', 'Product', 'Buyer', 'Amount', 'Status', 'Action'].map(h => (
                    <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 0.5 }}>{h}</th>
                  ))}
                </tr></thead>
                <tbody>
                  {MOCK_ORDERS.map(o => (
                    <tr key={o.id} style={{ borderTop: '1px solid #E5E7E0' }}>
                      <td style={{ padding: '13px 20px', fontFamily: 'Cabinet Grotesk', fontWeight: 700 }}>{o.orderRef}</td>
                      <td style={{ padding: '13px 20px', fontSize: 14 }}>{o.items[0]?.product.name}</td>
                      <td style={{ padding: '13px 20px', fontSize: 13, color: '#9CA3AF' }}>{o.buyer.firstName} {o.buyer.lastName}</td>
                      <td style={{ padding: '13px 20px', fontFamily: 'Cabinet Grotesk', fontWeight: 800 }}>₦{o.totalAmount.toLocaleString()}</td>
                      <td style={{ padding: '13px 20px' }}><EscrowBadge status={o.status} /></td>
                      <td style={{ padding: '13px 20px' }}>
                        {o.status === 'PAID_IN_ESCROW' && (
                          <button onClick={() => showToast(`Order ${o.orderRef} marked as dispatched! 📦`)} style={{ padding: '7px 14px', background: '#D1FAE5', color: '#065F46', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>Mark Dispatched</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── INVENTORY ── */}
        {view === 'inventory' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>My Inventory</h2>
                <p style={{ color: '#9CA3AF', fontSize: 14 }}>{MOCK_PRODUCTS.length} products · 3 sponsored</p>
              </div>
              <button onClick={() => setShowAddProduct(true)} style={{ padding: '11px 20px', background: '#0A4F2F', color: 'white', border: 'none', borderRadius: 12, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Cabinet Grotesk' }}>+ Add Product</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
              {MOCK_PRODUCTS.map(p => (
                <div key={p.id} style={{ background: 'white', borderRadius: 14, border: '1px solid #E5E7E0', overflow: 'hidden' }}>
                  <div style={{ height: 140, background: 'linear-gradient(135deg,#e8f4ef,#d1e8db)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 56, position: 'relative' }}>
                    {categoryEmojis[p.category] || '📦'}
                    {p.sponsoredListing?.isActive && <div style={{ position: 'absolute', top: 8, right: 8, background: '#F59E0B', color: '#0D1F14', fontSize: 9, fontWeight: 800, padding: '2px 7px', borderRadius: 100 }}>⚡ BOOSTED</div>}
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 18, color: '#0A4F2F', marginBottom: 4 }}>₦{p.price.toLocaleString()}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginBottom: 12 }}>Stock: {p.stock} · ★ {p.averageRating}</div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => showToast('Edit mode opening...')} style={{ flex: 1, padding: '7px', background: '#F3F4EF', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>✏️ Edit</button>
                      <button onClick={() => setShowBoostModal(true)} style={{ padding: '7px 10px', background: '#FEF3C7', color: '#92400E', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>⚡</button>
                      <button onClick={() => showToast('Product deleted')} style={{ padding: '7px 10px', background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: 7, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>🗑</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BOOST ── */}
        {view === 'boost' && (
          <div style={{ animation: 'fadeIn 0.3s ease', maxWidth: 700 }}>
            <div style={{ marginBottom: 28 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Boost Your Listings</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Appear at the top of search results and category pages. Deducted from your wallet.</p>
            </div>
            <div style={{ display: 'grid', gap: 16, marginBottom: 32 }}>
              {BOOST_PLANS.map(plan => (
                <div key={plan.id} style={{ background: 'white', borderRadius: 16, border: `2px solid ${plan.popular ? '#F59E0B' : '#E5E7E0'}`, padding: 24, cursor: 'pointer', position: 'relative', transition: 'all 0.2s' }}
                  onClick={() => showToast(`${plan.label} activated! ⚡ ₦${plan.price.toLocaleString()} debited from wallet`)}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#0A4F2F')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = plan.popular ? '#F59E0B' : '#E5E7E0')}
                >
                  {plan.popular && <div style={{ position: 'absolute', top: -11, right: 20, background: '#F59E0B', color: '#0D1F14', fontSize: 11, fontWeight: 800, padding: '3px 12px', borderRadius: 100 }}>⭐ Most Popular</div>}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 20, fontWeight: 900, marginBottom: 4 }}>{plan.label}</div>
                      <div style={{ fontSize: 14, color: '#9CA3AF', marginBottom: 4 }}>{plan.duration} · {plan.views}</div>
                      <div style={{ fontSize: 13, color: '#9CA3AF' }}>{plan.desc}</div>
                    </div>
                    <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 28, fontWeight: 900, color: '#0A4F2F', flexShrink: 0, marginLeft: 24 }}>{plan.priceLabel}</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#E8F4EE', borderRadius: 14, padding: 20 }}>
              <div style={{ fontWeight: 700, color: '#0A4F2F', marginBottom: 4 }}>📊 How Boost works</div>
              <div style={{ fontSize: 13, color: '#0D6B3E', lineHeight: 1.6 }}>
                Sponsored listings appear at the top of category pages and search results. Impressions and click data are tracked in real-time. Funds are deducted from your wallet — no external payment needed.
              </div>
            </div>
          </div>
        )}

        {/* ── ANALYTICS ── */}
        {view === 'analytics' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Store Analytics</h2>
              <p style={{ color: '#9CA3AF', fontSize: 14 }}>Performance data for your store and listings</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
              <MetricCard icon="👁️" label="Total Views" value="24,100" change="↑ 34% this month" changeType="up" />
              <MetricCard icon="🛒" label="Add-to-Cart Rate" value="8.2%" change="↑ 1.1% vs last month" changeType="up" />
              <MetricCard icon="💰" label="Conversion Rate" value="3.7%" change="Industry avg: 2.1%" changeType="up" />
              <MetricCard icon="⭐" label="Avg. Review Score" value="4.9" changeType="up" />
            </div>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', padding: 24 }}>
              <div style={{ fontFamily: 'Cabinet Grotesk', fontSize: 18, fontWeight: 800, marginBottom: 18 }}>Top Products by Views</div>
              {MOCK_PRODUCTS.slice(0, 4).map((p, i) => (
                <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderTop: i > 0 ? '1px solid #E5E7E0' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#E8F4EE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 14, color: '#0A4F2F' }}>{i + 1}</div>
                  <div style={{ fontSize: 20 }}>{categoryEmojis[p.category] || '📦'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>₦{p.price.toLocaleString()} · ★ {p.averageRating}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Cabinet Grotesk', fontWeight: 900, fontSize: 16 }}>{(p.viewCount).toLocaleString()}</div>
                    <div style={{ fontSize: 11, color: '#9CA3AF' }}>views</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other views placeholder */}
        {(view === 'orders' || view === 'wallet' || view === 'disputes' || view === 'reviews') && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>
              {navItems.find(n => n.key === view)?.icon} {navItems.find(n => n.key === view)?.label}
            </h2>
            <p style={{ color: '#9CA3AF', marginBottom: 24 }}>Connect to backend API to load live data</p>
            <div style={{ background: 'white', borderRadius: 16, border: '1px solid #E5E7E0', padding: 60, textAlign: 'center', color: '#9CA3AF' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🔌</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Ready for backend</div>
              <div style={{ fontSize: 14 }}>This view loads data from <code style={{ background: '#F3F4EF', padding: '2px 6px', borderRadius: 4 }}>/api/orders/seller</code> and <code style={{ background: '#F3F4EF', padding: '2px 6px', borderRadius: 4 }}>/api/wallet</code></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}