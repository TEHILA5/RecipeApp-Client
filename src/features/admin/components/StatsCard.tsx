// ===============================================
// StatsCard - כרטיס סטטיסטיקה ל-Admin Overview
// ===============================================
interface StatsCardProps {
  emoji: string;
  value: string | number;
  label: string;
  color: string;
}

export default function StatsCard({ emoji, value, label, color }: StatsCardProps) {
  return (
    <div style={{
      padding: '24px', borderRadius: '20px',
      background: 'white', boxShadow: '0 4px 20px rgba(212,84,122,0.07)',
    }}>
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{emoji}</div>
      <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600, marginTop: '4px' }}>
        {label}
      </div>
    </div>
  );
}
