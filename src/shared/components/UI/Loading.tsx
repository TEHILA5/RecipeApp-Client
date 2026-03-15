// ===============================================
// Loading - ספינר טעינה
// ===============================================
interface LoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  fullPage?: boolean;
}

const sizes = { sm: 24, md: 36, lg: 50 };

export default function Loading({
  message,
  size = 'md',
  color = '#d4547a',
  fullPage = false,
}: LoadingProps) {
  const px = sizes[size];

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      minHeight: fullPage ? '60vh' : undefined,
      padding: '40px',
      fontFamily: "'Nunito',sans-serif",
      color: '#9ca3af',
    }}>
      <div style={{
        width: px, height: px,
        border: `${size === 'sm' ? 2 : 3}px solid #fce7f3`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
        marginBottom: message ? '12px' : 0,
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      {message && <p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>{message}</p>}
    </div>
  );
}
