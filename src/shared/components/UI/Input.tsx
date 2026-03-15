// ===============================================
// Input - שדה קלט מעוצב
// ===============================================
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, style, ...props }: InputProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      {label && (
        <label style={{
          fontSize: '0.78rem', fontWeight: 700, color: '#6b7280',
          letterSpacing: '0.07em', textTransform: 'uppercase',
          fontFamily: "'Nunito',sans-serif",
        }}>
          {label}
        </label>
      )}
      <input
        style={{
          width: '100%', padding: '12px 16px', borderRadius: '12px',
          border: `2px solid ${error ? '#ef4444' : '#fce7f3'}`,
          fontFamily: "'Nunito',sans-serif", fontSize: '0.95rem',
          outline: 'none', boxSizing: 'border-box',
          background: 'white', color: '#1f2937',
          transition: 'border-color 0.2s',
          ...style,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = error ? '#ef4444' : '#d4547a')}
        onBlur={(e) => (e.currentTarget.style.borderColor = error ? '#ef4444' : '#fce7f3')}
        {...props}
      />
      {error && (
        <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0, fontFamily: "'Nunito',sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
