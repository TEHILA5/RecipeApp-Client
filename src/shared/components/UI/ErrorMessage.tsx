// ===============================================
// ErrorMessage - הצגת שגיאה
// ===============================================
interface ErrorMessageProps {
  message: string | null | undefined;
  style?: React.CSSProperties;
}

export default function ErrorMessage({ message, style }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div style={{
      padding: '12px 16px',
      borderRadius: '12px',
      background: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      fontWeight: 600,
      fontSize: '0.88rem',
      fontFamily: "'Nunito',sans-serif",
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      ...style,
    }}>
      ⚠️ {message}
    </div>
  );
}
