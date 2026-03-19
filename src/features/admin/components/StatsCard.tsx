import Card from '../../../shared/components/UI/Card';
import './StatsCard.css';

interface StatsCardProps {
  emoji: string;
  value: string | number;
  label: string;
  color: string;
}

export default function StatsCard({ emoji, value, label, color }: StatsCardProps) {
  return (
    <Card>
      <div className="sc-emoji">{emoji}</div>
      <div className="sc-value" style={{ color }}>{value}</div>
      <div className="sc-label">{label}</div>
    </Card>
  );
}
