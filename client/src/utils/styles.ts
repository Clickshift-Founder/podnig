// src/utils/styles.ts
export const COLORS = {
  green: '#0A4F2F',
  greenMid: '#0D6B3E',
  greenLight: '#1A8A52',
  amber: '#F59E0B',
  amberHot: '#FF6B00',
  amberGlow: '#FCD34D',
  white: '#FAFAF8',
  off: '#F3F4EF',
  muted: '#9CA3AF',
  dark: '#0D1F14',
  text: '#1C2B22',
  card: '#FFFFFF',
  border: '#E5E7E0',
} as const;

export const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cabinet+Grotesk:wght@400;500;700;800;900&family=Satoshi:wght@400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green: #0A4F2F; --green-mid: #0D6B3E; --green-light: #1A8A52;
    --amber: #F59E0B; --amber-hot: #FF6B00; --amber-glow: #FCD34D;
    --white: #FAFAF8; --off: #F3F4EF; --muted: #9CA3AF;
    --dark: #0D1F14; --text: #1C2B22; --border: #E5E7E0;
    --shadow: 0 4px 24px rgba(10,79,47,0.10);
    --shadow-lg: 0 12px 48px rgba(10,79,47,0.18);
    --radius: 16px; --radius-sm: 10px;
  }

  body { font-family: 'Satoshi', sans-serif; background: var(--off); color: var(--text); }
  .cabinet { font-family: 'Cabinet Grotesk', sans-serif; }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--off); }
  ::-webkit-scrollbar-thumb { background: var(--green-light); border-radius: 4px; }

  @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes slideRight { from { transform: translateX(-20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes pulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
  @keyframes slideInRight { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

  .animate-in { animation: fadeIn 0.3s ease forwards; }
`;

export const formatNGN = (amount: number): string =>
  `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 0 })}`;

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);