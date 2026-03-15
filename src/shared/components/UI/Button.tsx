// ===============================================
// Button - כפתור גנרי
// ===============================================
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}

const variants = {
  primary: { background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white', border: 'none', boxShadow: '0 4px 14px rgba(212,84,122,0.3)' },
  outline: { background: 'white', color: '#d4547a', border: '2px solid #fce7f3', boxShadow: 'none' },
  danger:  { background: '#fee2e2', color: '#991b1b', border: 'none', boxShadow: 'none' },
  ghost:   { background: 'transparent', color: '#6b7280', border: '2px solid #e5e7eb', boxShadow: 'none' },
};

const sizes = {
  sm: { padding: '6px 16px', fontSize: '0.78rem' },
  md: { padding: '10px 24px', fontSize: '0.9rem' },
  lg: { padding: '14px 32px', fontSize: '1rem' },
};

export default function Button({
  children, onClick, type = 'button',
  variant = 'primary', size = 'md',
  disabled = false, loading = false,
  fullWidth = false, style,
}: ButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        borderRadius: '999px',
        fontFamily: "'Nunito',sans-serif",
        fontWeight: 700,
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.7 : 1,
        transition: 'all 0.2s',
        width: fullWidth ? '100%' : undefined,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        ...variants[variant],
        ...sizes[size],
        ...style,
      }}
    >
      {loading ? '...' : children}
    </button>
  );
}
