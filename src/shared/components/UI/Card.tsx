import type { ReactNode } from 'react';
import './Card.css';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
  padding?: string;
}

export default function Card({ children, style, hover = false, padding }: CardProps) {
  return (
    <div
      className={`card ${hover ? 'card-hover' : ''}`}
      style={{ padding, ...style }}
    >
      {children}
    </div>
  );
}
