// ===============================================
// StatsCard - כרטיס סטטיסטיקה ל-Admin Overview
// ===============================================
import Card from '../../../shared/components/UI/Card'; 
interface StatsCardProps {
  emoji: string;
  value: string | number;
  label: string;
  color: string;
}

export default function StatsCard({ emoji, value, label, color }: StatsCardProps) {
  return (
    <Card> {/* ✅ Card component */}
      <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{emoji}</div>
      <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', fontWeight: 700, color }}>
        {value}
      </div>
      <div style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600, marginTop: '4px' }}>
        {label}
      </div>
    </Card>
  );
}
