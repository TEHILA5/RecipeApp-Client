// ===============================================
// Card - כרטיס גנרי
// ===============================================
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: React.CSSProperties;
  hover?: boolean;
  padding?: string;
}

export default function Card({ children, style, hover = false, padding = '24px' }: CardProps) {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: '20px',
        padding,
        boxShadow: '0 4px 20px rgba(212,84,122,0.07)',
        transition: hover ? 'transform 0.2s, box-shadow 0.2s' : undefined,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(212,84,122,0.15)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        (e.currentTarget as HTMLElement).style.transform = 'none';
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(212,84,122,0.07)';
      } : undefined}
    >
      {children}
    </div>
  );
}
