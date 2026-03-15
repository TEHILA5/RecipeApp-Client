// ===============================================
// Toast - הודעות מוקפצות
// ✅ משתמש ב-uiSlice מ-Redux
// ===============================================
import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { removeToast } from '../../../redux/slices/uiSlice';

const typeStyles = {
  success: { background: '#dcfce7', border: '1px solid #86efac', color: '#166534', icon: '✅' },
  error:   { background: '#fee2e2', border: '1px solid #fecaca', color: '#991b1b', icon: '⚠️' },
  warning: { background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', icon: '⚡' },
  info:    { background: '#ede9fe', border: '1px solid #c4b5fd', color: '#5b21b6', icon: 'ℹ️' },
};

function ToastItem({ id, message, type, duration = 3000 }: {
  id: string; message: string; type: keyof typeof typeStyles; duration?: number;
}) {
  const dispatch = useAppDispatch();
  const style = typeStyles[type];

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      padding: '12px 20px', borderRadius: '14px',
      background: style.background, border: style.border, color: style.color,
      fontFamily: "'Nunito',sans-serif", fontWeight: 600, fontSize: '0.9rem',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      animation: 'slideIn 0.3s ease',
      minWidth: '260px', maxWidth: '400px',
    }}>
      <span>{style.icon}</span>
      <span style={{ flex: 1 }}>{message}</span>
      <button onClick={() => dispatch(removeToast(id))}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '1.1rem', lineHeight: 1, opacity: 0.6 }}>
        ×
      </button>
    </div>
  );
}

export default function Toast() {
  const toasts = useAppSelector((s) => s.ui.toasts);

  if (!toasts.length) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', right: '24px',
      display: 'flex', flexDirection: 'column', gap: '10px',
      zIndex: 99999,
    }}>
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }`}</style>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}
