import type { ReactNode } from 'react';
import './StatDisplay.css';

export type StatDisplayVariant = 'featured' | 'profile' | 'admin';

interface StatDisplayProps {
  value: ReactNode;
  label: string;
  icon?: ReactNode;
  variant?: StatDisplayVariant;
  valueColor?: string;
  className?: string;
}

export default function StatDisplay({
  value,
  label,
  icon,
  variant = 'featured',
  valueColor,
  className,
}: StatDisplayProps) {
  return (
    <div className={['stat-display', `stat-display--${variant}`, className].filter(Boolean).join(' ')}>
      {icon && <div className="stat-display__icon">{icon}</div>}
      <div className="stat-display__value" style={valueColor ? { color: valueColor } : undefined}>{value}</div>
      <div className="stat-display__label">{label}</div>
    </div>
  );
}
