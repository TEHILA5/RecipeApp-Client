import type { ReactNode } from 'react';
import './FormField.css';

interface FormFieldProps {
  label: ReactNode;
  children: ReactNode;
  error?: string;
  required?: boolean;
  labelVariant?: 'default' | 'uppercase';
  className?: string;
}

export default function FormField({
  label,
  children,
  error,
  required,
  labelVariant = 'default',
  className,
}: FormFieldProps) {
  const labelText = required && typeof label === 'string' && !label.includes('*')
    ? `${label} *`
    : label;

  return (
    <div className={['form-field-row', className].filter(Boolean).join(' ')}>
      <label className={`form-field-row__label${labelVariant === 'uppercase' ? ' form-field-row__label--uppercase' : ''}`}>
        {labelText}
      </label>
      {children}
      {error ? <p className="form-field-row__error">{error}</p> : null}
    </div>
  );
}
