import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { removeToast } from '../../../redux/slices/uiSlice';
import './Toast.css';

type ToastType = 'success' | 'error' | 'warning' | 'info';

const typeConfig: Record<ToastType, { icon: string }> = {
  success: { icon: '✅' },
  error:   { icon: '⚠️' },
  warning: { icon: '⚡' },
  info:    { icon: 'ℹ️' },
};

function ToastItem({ id, message, type, duration = 3000 }: {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => dispatch(removeToast(id)), duration);
    return () => clearTimeout(timer);
  }, [id, duration, dispatch]);

  return (
    <div className={`toast toast--${type}`}>
      <span>{typeConfig[type].icon}</span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={() => dispatch(removeToast(id))}>×</button>
    </div>
  );
}

export default function Toast() {
  const toasts = useAppSelector((s) => s.ui.toasts);

  if (!toasts.length) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
}
