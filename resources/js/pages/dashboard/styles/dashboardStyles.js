export const DS = {
  header: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'flex-end', marginBottom: 32,
    flexWrap: 'wrap', gap: 16,
  },
  headerSub: {
    fontSize: 11, fontWeight: 700, color: '#c5a059',
    textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 6px',
  },
  headerTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: 30, fontWeight: 700, color: '#1a1a1a', margin: 0,
  },
  btnGold: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '11px 20px',
    background: 'linear-gradient(135deg, #c5a059, #e8c97a)',
    border: 'none', borderRadius: 12,
    color: '#fff', fontWeight: 700, fontSize: 14,
    cursor: 'pointer', fontFamily: 'inherit',
    boxShadow: '0 4px 14px rgba(197,160,89,0.3)',
  },
  btnOutline: {
    display: 'flex', alignItems: 'center', gap: 7,
    padding: '11px 20px', background: '#fff',
    border: '1.5px solid rgba(197,160,89,0.5)',
    borderRadius: 12, color: '#c5a059',
    fontWeight: 700, fontSize: 14,
    cursor: 'pointer', fontFamily: 'inherit',
  },
  statsGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 18, marginBottom: 24,
  },
  statCard: {
    background: '#fff', borderRadius: 18,
    padding: '22px 16px', textAlign: 'center',
    boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.04)',
  },
  statVal: {
    fontSize: 28, fontWeight: 800, color: '#1a1a1a',
    margin: '0 0 4px', fontFamily: 'Playfair Display, serif',
  },
  statLbl: {
    fontSize: 10, fontWeight: 700, color: '#bbb',
    textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0,
  },
  sectionTitle: {
    fontFamily: 'Playfair Display, serif',
    fontSize: 17, fontWeight: 700, color: '#1a1a1a',
    margin: 0,
  },
  tabBar: {
    display: 'flex', gap: 4, marginBottom: 16,
    borderBottom: '2px solid rgba(0,0,0,0.07)',
  },
  tab: {
    display: 'flex', alignItems: 'center', gap: 6,
    padding: '11px 18px',
    background: 'transparent', border: 'none',
    borderBottom: '2px solid transparent',
    marginBottom: -2, color: '#aaa',
    fontWeight: 600, fontSize: 14,
    cursor: 'pointer', fontFamily: 'inherit',
    transition: 'all 0.2s',
  },
  tabActive: { color: '#c5a059', borderBottomColor: '#c5a059' },
  tableCard: {
    background: '#fff', borderRadius: 20,
    boxShadow: '0 2px 14px rgba(0,0,0,0.06)',
    border: '1px solid rgba(0,0,0,0.04)',
    overflow: 'hidden',
  },
  table:   { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '13px 18px',
    background: '#fdfaf6',
    fontSize: 10, fontWeight: 700, color: '#bbb',
    textTransform: 'uppercase', letterSpacing: '0.08em',
    textAlign: 'left', borderBottom: '1px solid rgba(0,0,0,0.06)',
  },
  tr:      { borderBottom: '1px solid rgba(0,0,0,0.04)' },
  td:      { padding: '13px 18px', verticalAlign: 'middle' },
  thumb:   { width: 48, height: 48, borderRadius: 10, objectFit: 'cover' },
  artTitle:{ display: 'block', fontWeight: 600, color: '#1a1a1a', fontSize: 14 },
  artId:   { display: 'block', fontSize: 12, color: '#bbb', marginTop: 2 },
  dateText:{ fontSize: 13, color: '#888' },
  editBtn: {
    background: 'rgba(197,160,89,0.1)', border: 'none',
    borderRadius: 8, padding: '7px 9px',
    cursor: 'pointer', marginRight: 6,
  },
  deleteBtn: {
    background: 'rgba(229,57,53,0.08)', border: 'none',
    borderRadius: 8, padding: '7px 9px', cursor: 'pointer',
  },
  typeBadge: {
    display: 'inline-block', padding: '4px 11px',
    borderRadius: 99, fontSize: 12, fontWeight: 600,
  },
  empty: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '56px 20px', textAlign: 'center',
  },
};

export function typeBadgeColor(type) {
  const map = {
    Exposition: { background: 'rgba(33,150,243,0.1)',  color: '#1565c0' },
    Atelier:    { background: 'rgba(76,175,80,0.1)',   color: '#2e7d32' },
    Concert:    { background: 'rgba(156,39,176,0.1)',  color: '#6a1b9a' },
    Festival:   { background: 'rgba(255,152,0,0.1)',   color: '#e65100' },
  };
  return map[type] || { background: 'rgba(197,160,89,0.1)', color: '#c5a059' };
}