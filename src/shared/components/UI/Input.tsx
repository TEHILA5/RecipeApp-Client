import type { InputHTMLAttributes } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="input-wrap">
      {label && <label className="input-label">{label}</label>}
      <input
        className={`input-field ${error ? 'input-error' : ''} ${className ?? ''}`}
        {...props}
      />
      {error && <p className="input-error-msg">{error}</p>}
    </div>
  );
}
