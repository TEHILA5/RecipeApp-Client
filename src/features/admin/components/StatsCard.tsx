import Card from '../../../shared/components/UI/Card';
import StatDisplay from '../../../shared/components/UI/StatDisplay';

interface StatsCardProps {
  icon: string;
  value: string | number;
  label: string;
  color: string;
}

export default function StatsCard({ icon, value, label, color }: StatsCardProps) {
  return (
    <Card>
      <StatDisplay
        variant="admin"
        icon={<img src={icon} alt="" />}
        value={value}
        label={label}
        valueColor={color}
      />
    </Card>
  );
}
