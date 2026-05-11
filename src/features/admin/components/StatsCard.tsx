import Card from '../../../shared/components/UI/Card';
import './StatsCard.css';

interface StatsCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

export default function StatsCard({ icon, value, label, color }: StatsCardProps) {
  return (
    <Card>
      <div className="sc-emoji">
        <img src={icon} alt="" style={{ width: '2em', height: '2em', objectFit: 'contain' }} />
      </div>
      <div className="sc-value" style={{ color }}>{value}</div>
      <div className="sc-label">{label}</div>
    </Card>
  );
}
