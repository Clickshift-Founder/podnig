// src/pages/buyer/BuyerApp.tsx (completed)
import { useState } from 'react';
import Navbar from '../../components/Navbar';
import { ProductCard, WalletCard, Toast, EscrowBadge, MetricCard } from '../../components/index';
import { MOCK_PRODUCTS } from '../../utils/mockData';
import { useCart } from '../../context/CartContext';

interface BuyerAppProps { page: string; onNavigate: (p: string) => void; }

export default function BuyerApp({ page, onNavigate }: BuyerAppProps) {
  const { items: cartItems, addItem, removeItem, clearCart, total: cartTotal } = useCart();
  const [toast, setToast] = useState<{ msg: string } | null>(null);
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0]);
  const [walletBalance] = useState(145000);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const showToast = (msg: string) => { setToast({ msg }); setTimeout(() => setToast(null), 4000); };
  const cats = ['All', 'Electronics', 'Fashion', 'Beauty', 'Home', 'Food'];
  const catEmojis: Record<string, string> = { Electronics: '📱', Fashion: '👘', Beauty: '🧴', Home: '🏠', Food: '🍲' };
  const filtered = MOCK_PRODUCTS.filter(p => (category === 'All' || p.category === category) && (p.name.toLowerCase().includes(search.toLowerCase()) || p.seller.storeName.toLowerCase().includes(search.toLowerCase()))).sort((a, b) => (b.sponsoredListing?.isActive ? 1 : 0) - (a.sponsoredListing?.isActive ? 1 : 0));

  return (
    <div>
      {toast && <Toast message={toast.msg} onClose={() => setToast(null)} />}
      <Navbar onNavigate={onNavigate} currentPage={page} walletBalance={walletBalance} />
      <div style={{ paddingTop: 68 }}>

        {/* HOME */}
        {(page === 'home' || !page) && (
          <div>
            <div style={{ background: 'linear-gradient(135deg,#0D1F14 0%,#0A4F2F 60%,#1a7a44 100%)', padding: '80px 32px 70px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-30%', right: '-5%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(245,158,11,0.1) 0%,transparent 70%)' }} />
              <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 440px', gap: 48, alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '6px 16px', marginBottom: 24, color: '#FCD34D', fontSize: 13, fontWeight: 600 }}>
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F59E0B', display: 'inline-block', animation: 'pulse 2s infinite' }} />&nbsp;Nigeria's Safest Marketplace
                  </div>
                  <h1 style={{ fontFamily: 'Cabinet Grotesk', fontSize: 58, fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: -2, marginBottom: 18 }}>Shop Smarter,<br /><span style={{ color: '#F59E0B' }}>Pay Safer</span> with PODnig</h1>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 17, lineHeight: 1.6, marginBottom: 32 }}>Every naira is protected by escrow. Verified sellers. Instant virtual accounts. If anything goes wrong — we've got you.</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })} style={{ padding: '14px 28px', background: '#F59E0B', color: '#0D1F14', border: 'none', borderRadius: 12, fontFamily: 'Cabinet Grotesk', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>🛒 Start Shopping</button>
                    <button onClick={() => showToast('Create a Seller account to sell on PODnig!')} style={{ padding: '14px 28px', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: 'Satoshi' }}>💼 Sell on PODnig</button>
                  </div>
                  <div style={{ display: 'flex', gap: 32, marginTop: 44, paddingTop: 44, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    {[{val:'12,400+',lbl:'Buyers'},{val:'₦2.1B',lbl:'In Escrow'},{val:'4,200+',lbl:'Sellers'},{val:'0%',lbl:'Fraud Rate'}].map(s=><div key={s.lbl}><div style={{fontFamily:'Cabinet Grotesk',fontSize:26,fontWeight:900,color:'white'}}>{s.val}</div><div style={{fontSize:12,color:'rgba(255,255,255,0.45)',marginTop:2}}>{s.lbl}</div></div>)}
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 24 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>🔒 Live Escrow Flow</div>
                  {[
                    { icon:'💳', label:'Buyer pays via Wallet/VA', sub:'Funds locked in PODnig escrow', status:'Done ✓', statusColor:'#10B981', statusBg:'rgba(16,185,129,0.2)' },
                    { icon:'📦', label:'Seller ships item', sub:'Seller notified via wallet alert', status:'In Progress', statusColor:'#F59E0B', statusBg:'rgba(245,158,11,0.2)', active:true },
                    { icon:'✅', label:'Delivery confirmed', sub:'Funds auto-released (minus 3%)', status:'Pending', statusColor:'#9CA3AF', statusBg:'rgba(156,163,175,0.15)' },
                    { icon:'🏦', label:'Seller withdraws', sub:'Instant transfer via Flutterwave', status:'Pending', statusColor:'#9CA3AF', statusBg:'rgba(156,163,175,0.15)' },
                  ].map((step,i)=>(
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:12, background:step.active?'rgba(245,158,11,0.1)':'rgba(255,255,255,0.04)', border:`1px solid ${step.active?'rgba(245,158,11,0.25)':'rgba(255,255,255,0.06)'}`, borderRadius:12, padding:14, marginBottom:10 }}>
                      <div style={{ fontSize:20, width:36, height:36, background:'rgba(255,255,255,0.08)', borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>{step.icon}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600 }}>{step.label}</div>
                        <div style={{ color:'rgba(255,255,255,0.4)', fontSize:11, marginTop:2 }}>{step.sub}</div>
                      </div>
                      <div style={{ padding:'3px 9px', borderRadius:100, fontSize:11, fontWeight:700, background:step.statusBg, color:step.statusColor, flexShrink:0 }}>{step.status}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ padding:'0 32px', maxWidth:1200, margin:'0 auto' }}>
              <div style={{ background:'white', border:'2px solid #E5E7E0', borderRadius:16, padding:6, display:'flex', alignItems:'center', gap:10, boxShadow:'0 4px 24px rgba(10,79,47,0.1)', marginTop:-28, position:'relative', zIndex:10 }}>
                <span style={{ fontSize:20, paddingLeft:10 }}>🔍</span>
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search products, sellers, categories..." style={{ flex:1, border:'none', outline:'none', fontSize:15, fontFamily:'Satoshi', padding:'10px 8px', background:'transparent' }} />
                <button style={{ padding:'12px 24px', background:'#0A4F2F', color:'white', border:'none', borderRadius:12, fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Cabinet Grotesk' }}>Search PODnig</button>
              </div>
            </div>

            <div style={{ background:'#0A4F2F', padding:'40px 32px', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:24 }}>
              {[{icon:'🔒',title:'Escrow Protected',desc:'Money held until delivery confirmed'},{icon:'⚡',title:'Instant Virtual Accounts',desc:'Unique NGN account on registration'},{icon:'🛡️',title:'Seller Verification',desc:'ID-verified, rated sellers only'},{icon:'📲',title:'Real-Time Alerts',desc:'Instant SMS + email notifications'}].map(f=>(
                <div key={f.title} style={{ textAlign:'center', color:'white' }}>
                  <div style={{ fontSize:32, marginBottom:10 }}>{f.icon}</div>
                  <div style={{ fontFamily:'Cabinet Grotesk', fontWeight:800, fontSize:16, marginBottom:4 }}>{f.title}</div>
                  <div style={{ fontSize:12, opacity:0.55 }}>{f.desc}</div>
                </div>
              ))}
            </div>

            <div style={{ maxWidth:1200, margin:'0 auto', padding:'56px 32px' }}>
              <h2 style={{ fontFamily:'Cabinet Grotesk', fontSize:32, fontWeight:900, letterSpacing:-1, marginBottom:4 }}>Trending Products</h2>
              <p style={{ color:'#9CA3AF', fontSize:14, marginBottom:24 }}>⚡ Sponsored listings appear first · All prices in Naira</p>
              <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:28 }}>
                {cats.map(c=>(
                  <button key={c} onClick={()=>setCategory(c)} style={{ padding:'8px 18px', borderRadius:100, fontSize:14, fontWeight:600, cursor:'pointer', border:'2px solid', transition:'all 0.2s', borderColor:category===c?'#0A4F2F':'#E5E7E0', background:category===c?'#0A4F2F':'white', color:category===c?'white':'#1C2B22', fontFamily:'Satoshi' }}>{c}</button>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:20 }}>
                {filtered.map(p=>(
                  <ProductCard key={p.id} product={p}
                    onClick={()=>{ setSelectedProduct(p); onNavigate('product'); }}
                    onAddToCart={()=>{ addItem(p); showToast(`${p.name} added to cart! 🛒`); }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCT DETAIL */}
        {page === 'product' && selectedProduct && (
          <div>
            <div style={{ padding:'18px 32px', borderBottom:'1px solid #E5E7E0', background:'white', display:'flex', alignItems:'center', gap:10 }}>
              <button onClick={()=>onNavigate('home')} style={{ background:'#F3F4EF', border:'none', borderRadius:8, padding:'7px 14px', cursor:'pointer', fontWeight:600 }}>← Back</button>
              <span style={{ color:'#9CA3AF', fontSize:13 }}>Marketplace / {selectedProduct.category} / {selectedProduct.name}</span>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:48, padding:'48px 32px', maxWidth:1100, margin:'0 auto' }}>
              <div>
                <div style={{ height:380, background:'linear-gradient(135deg,#e8f4ef,#d1e8db)', borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:110, marginBottom:12 }}>{catEmojis[selectedProduct.category]||'📦'}</div>
                <div style={{ display:'flex', gap:8 }}>{[1,2,3].map(i=><div key={i} style={{ flex:1, height:70, borderRadius:10, background:'linear-gradient(135deg,#e8f4ef,#d1e8db)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, border:`2px solid ${i===1?'#1A8A52':'#E5E7E0'}`, cursor:'pointer' }}>{catEmojis[selectedProduct.category]}</div>)}</div>
              </div>
              <div>
                <h1 style={{ fontFamily:'Cabinet Grotesk', fontSize:28, fontWeight:900, letterSpacing:-0.5, lineHeight:1.2, marginBottom:10 }}>{selectedProduct.name}</h1>
                <div style={{ fontFamily:'Cabinet Grotesk', fontSize:40, fontWeight:900, color:'#0A4F2F', marginBottom:16 }}>₦{selectedProduct.price.toLocaleString()}{selectedProduct.comparePrice&&<span style={{ fontSize:18, color:'#9CA3AF', fontWeight:400, textDecoration:'line-through', marginLeft:12, fontFamily:'Satoshi' }}>₦{selectedProduct.comparePrice.toLocaleString()}</span>}</div>
                <div style={{ background:'#E8F4EE', border:'1px solid #A7D5BB', borderRadius:12, padding:16, marginBottom:16 }}>
                  <div style={{ fontWeight:700, color:'#0A4F2F', marginBottom:4 }}>🔒 Escrow Protected</div>
                  <div style={{ fontSize:13, color:'#0D6B3E', lineHeight:1.5 }}>Your payment is held securely. Released to seller only after you confirm delivery.</div>
                </div>
                <button onClick={()=>{ addItem(selectedProduct); showToast(`${selectedProduct.name} added! 🛒`); }} style={{ width:'100%', padding:17, background:'#0A4F2F', color:'white', border:'none', borderRadius:14, fontFamily:'Cabinet Grotesk', fontSize:17, fontWeight:800, cursor:'pointer', marginBottom:10 }}>🛒 Add to Cart</button>
                <button onClick={()=>{ addItem(selectedProduct); onNavigate('cart'); }} style={{ width:'100%', padding:15, background:'white', color:'#0A4F2F', border:'2px solid #0A4F2F', borderRadius:14, fontFamily:'Cabinet Grotesk', fontSize:16, fontWeight:800, cursor:'pointer' }}>⚡ Buy Now with Escrow</button>
              </div>
            </div>
          </div>
        )}

        {/* CART */}
        {page === 'cart' && (
          <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 32px' }}>
            <h2 style={{ fontFamily:'Cabinet Grotesk', fontSize:28, fontWeight:900, marginBottom:4 }}>🛒 Cart ({cartItems.length} items)</h2>
            {cartItems.length===0?(
              <div style={{ textAlign:'center', padding:80, color:'#9CA3AF' }}>
                <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
                <div style={{ fontSize:20, fontWeight:700, marginBottom:16 }}>Your cart is empty</div>
                <button onClick={()=>onNavigate('home')} style={{ padding:'12px 24px', background:'#0A4F2F', color:'white', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', fontFamily:'Cabinet Grotesk', fontSize:15 }}>Start Shopping</button>
              </div>
            ):(
              <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:24, marginTop:24 }}>
                <div>
                  {cartItems.map((item,i)=>(
                    <div key={i} style={{ background:'white', border:'1px solid #E5E7E0', borderRadius:14, padding:18, marginBottom:14, display:'flex', gap:14, alignItems:'center' }}>
                      <div style={{ width:72, height:72, background:'linear-gradient(135deg,#e8f4ef,#d1e8db)', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, flexShrink:0 }}>{catEmojis[item.category]||'📦'}</div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:15, marginBottom:4 }}>{item.name}</div>
                        <div style={{ fontFamily:'Cabinet Grotesk', fontWeight:900, fontSize:20, color:'#0A4F2F', marginTop:6 }}>₦{item.price.toLocaleString()}</div>
                      </div>
                      <button onClick={()=>removeItem(item.id)} style={{ background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:8, padding:8, cursor:'pointer', fontSize:16 }}>🗑</button>
                    </div>
                  ))}
                </div>
                <div style={{ background:'white', border:'1px solid #E5E7E0', borderRadius:16, padding:24, position:'sticky', top:88 }}>
                  <div style={{ fontFamily:'Cabinet Grotesk', fontSize:20, fontWeight:800, marginBottom:18 }}>Order Summary</div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:14 }}><span style={{ color:'#9CA3AF' }}>Subtotal</span><span style={{ fontWeight:700 }}>₦{cartTotal.toLocaleString()}</span></div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:16, fontSize:14 }}><span style={{ color:'#9CA3AF' }}>PODnig fee (3%)</span><span style={{ fontWeight:700 }}>₦{Math.round(cartTotal*0.03).toLocaleString()}</span></div>
                  <div style={{ borderTop:'2px solid #E5E7E0', paddingTop:14, display:'flex', justifyContent:'space-between', marginBottom:20 }}>
                    <span style={{ fontFamily:'Cabinet Grotesk', fontWeight:800, fontSize:18 }}>Total</span>
                    <span style={{ fontFamily:'Cabinet Grotesk', fontWeight:900, fontSize:24, color:'#0A4F2F' }}>₦{Math.round(cartTotal*1.03).toLocaleString()}</span>
                  </div>
                  <div style={{ background:'#E8F4EE', borderRadius:10, padding:12, marginBottom:16, fontSize:13, color:'#0D6B3E' }}>🔒 Payment goes into escrow. Released only after delivery confirmation.</div>
                  {walletBalance>=cartTotal*1.03?(
                    <button onClick={()=>{ clearCart(); showToast('Order placed! 🎉 Funds in escrow. Seller notified!'); onNavigate('buyer/orders'); }} style={{ width:'100%', padding:16, background:'#0A4F2F', color:'white', border:'none', borderRadius:12, fontFamily:'Cabinet Grotesk', fontWeight:800, fontSize:16, cursor:'pointer' }}>Pay ₦{Math.round(cartTotal*1.03).toLocaleString()} from Wallet</button>
                  ):(
                    <div>
                      <div style={{ background:'#FEF3C7', borderRadius:10, padding:12, marginBottom:12, fontSize:13, color:'#92400E' }}>⚠️ Insufficient wallet balance. Top up first.</div>
                      <button onClick={()=>onNavigate('wallet')} style={{ width:'100%', padding:14, background:'#F59E0B', color:'#0D1F14', border:'none', borderRadius:12, fontFamily:'Cabinet Grotesk', fontWeight:800, fontSize:15, cursor:'pointer' }}>💳 Top Up Wallet</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WALLET */}
        {page === 'wallet' && (
          <div style={{ maxWidth:900, margin:'0 auto', padding:'40px 32px' }}>
            <h2 style={{ fontFamily:'Cabinet Grotesk', fontSize:28, fontWeight:900, marginBottom:4 }}>💳 PODnig Wallet</h2>
            <p style={{ color:'#9CA3AF', marginBottom:28 }}>Powered by Flutterwave · Instant NGN settlement</p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, marginBottom:24 }}>
              <WalletCard balance={walletBalance} escrowBalance={530000} va={{ accountNumber:'0123456789', bankName:'Wema Bank', accountName:'PODNIG/AMAKA OBI' }} onDeposit={()=>showToast('Transfer to your virtual account to top up instantly ⚡')} onWithdraw={()=>showToast('Withdrawal initiated!')} />
              <div style={{ background:'white', border:'1px solid #E5E7E0', borderRadius:16, padding:22 }}>
                <div style={{ fontFamily:'Cabinet Grotesk', fontSize:17, fontWeight:800, marginBottom:18 }}>Wallet Summary</div>
                {[{label:'Total Received',value:'₦595,000',icon:'📥'},{label:'Total Spent',value:'₦450,000',icon:'📤'},{label:'In Escrow',value:'₦530,000',icon:'🔒'},{label:'Fees Paid',value:'₦13,500',icon:'💸'}].map(item=>(
                  <div key={item.label} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 0', borderBottom:'1px solid #E5E7E0' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}><span style={{ fontSize:20 }}>{item.icon}</span><span style={{ fontSize:14, fontWeight:600 }}>{item.label}</span></div>
                    <span style={{ fontFamily:'Cabinet Grotesk', fontWeight:800, fontSize:16 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* BUYER ORDERS */}
        {page === 'buyer/orders' && (
          <div style={{ maxWidth:1100, margin:'0 auto', padding:'40px 32px' }}>
            <h2 style={{ fontFamily:'Cabinet Grotesk', fontSize:28, fontWeight:900, marginBottom:4 }}>📦 My Orders</h2>
            <p style={{ color:'#9CA3AF', marginBottom:24 }}>Track your purchases and escrow status</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
              <MetricCard icon="📦" label="Total Orders" value="23" change="+3 this month" changeType="up" />
              <MetricCard icon="💰" label="Total Spent" value="₦847K" changeType="neutral" />
              <MetricCard icon="🔒" label="In Escrow" value="₦530K" change="2 active" changeType="neutral" />
            </div>
            <div style={{ background:'white', border:'1px solid #E5E7E0', borderRadius:16, overflow:'hidden' }}>
              <div style={{ padding:'18px 24px', borderBottom:'1px solid #E5E7E0', fontFamily:'Cabinet Grotesk', fontSize:18, fontWeight:800 }}>Order History</div>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead><tr style={{ background:'#F3F4EF' }}>{['Order','Product','Amount','Status','Date','Action'].map(h=><th key={h} style={{ padding:'12px 20px', textAlign:'left', fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:0.5 }}>{h}</th>)}</tr></thead>
                <tbody>
                  {[
                    { ref:'POD-2847', product:'Samsung Galaxy A55', amount:385000, status:'PAID_IN_ESCROW', date:'Feb 24' },
                    { ref:'POD-2841', product:'Leather Sneakers', amount:28500, status:'COMPLETED', date:'Feb 23' },
                    { ref:'POD-2835', product:'Shea Butter 500ml', amount:4200, status:'DISPUTED', date:'Feb 22' },
                    { ref:'POD-2829', product:'Solar Generator 300W', amount:145000, status:'SELLER_CONFIRMED_DISPATCH', date:'Feb 21' },
                  ].map(o=>(
                    <tr key={o.ref} style={{ borderTop:'1px solid #E5E7E0' }} onMouseEnter={e=>((e.currentTarget as HTMLElement).style.background='#F9FAF7')} onMouseLeave={e=>((e.currentTarget as HTMLElement).style.background='transparent')}>
                      <td style={{ padding:'14px 20px', fontFamily:'Cabinet Grotesk', fontWeight:700 }}>{o.ref}</td>
                      <td style={{ padding:'14px 20px', fontSize:14 }}>{o.product}</td>
                      <td style={{ padding:'14px 20px', fontFamily:'Cabinet Grotesk', fontWeight:800 }}>₦{o.amount.toLocaleString()}</td>
                      <td style={{ padding:'14px 20px' }}><EscrowBadge status={o.status as any} /></td>
                      <td style={{ padding:'14px 20px', fontSize:13, color:'#9CA3AF' }}>{o.date}</td>
                      <td style={{ padding:'14px 20px' }}>
                        {o.status==='SELLER_CONFIRMED_DISPATCH'&&<div style={{ display:'flex', gap:6 }}><button onClick={()=>showToast('Delivery confirmed! ✅')} style={{ padding:'7px 12px', background:'#D1FAE5', color:'#065F46', border:'none', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>Confirm Delivery</button><button onClick={()=>showToast('Dispute opened ⚠️')} style={{ padding:'7px 12px', background:'#FEE2E2', color:'#991B1B', border:'none', borderRadius:8, fontWeight:700, fontSize:12, cursor:'pointer' }}>Dispute</button></div>}
                        {o.status==='COMPLETED'&&<span style={{ fontSize:12, color:'#10B981', fontWeight:600 }}>✓ Complete</span>}
                        {o.status==='DISPUTED'&&<span style={{ fontSize:12, color:'#9CA3AF' }}>Under review</span>}
                        {o.status==='PAID_IN_ESCROW'&&<span style={{ fontSize:12, color:'#F59E0B', fontWeight:600 }}>Awaiting dispatch</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FALLBACK */}
        {!['home','product','cart','wallet','buyer/orders','buyer/wishlist'].includes(page) && page && (
          <div style={{ maxWidth:600, margin:'80px auto', padding:'0 32px', textAlign:'center', color:'#9CA3AF' }}>
            <div style={{ fontSize:64, marginBottom:16 }}>🔌</div>
            <div style={{ fontFamily:'Cabinet Grotesk', fontSize:24, fontWeight:800, marginBottom:8, color:'#1C2B22' }}>Coming Soon</div>
            <div style={{ fontSize:14, marginBottom:24 }}>This page connects to the backend API</div>
            <button onClick={()=>onNavigate('home')} style={{ padding:'12px 24px', background:'#0A4F2F', color:'white', border:'none', borderRadius:12, fontWeight:700, cursor:'pointer', fontFamily:'Cabinet Grotesk', fontSize:15 }}>← Back to Marketplace</button>
          </div>
        )}
      </div>
    </div>
  );
}