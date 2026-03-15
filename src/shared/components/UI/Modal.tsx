// ===============================================
// Modal - חלון מודאל גנרי
// ===============================================
import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({ isOpen, onClose, title, children, maxWidth = '480px' }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '20px',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        background: 'white', borderRadius: '24px', padding: '36px',
        maxWidth, width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        animation: 'fadeUp 0.2s ease',
        fontFamily: "'Nunito',sans-serif",
      }}>
        <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }`}</style>

        {title && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#1f2937', margin: 0 }}>
              {title}
            </h3>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.4rem', color: '#9ca3af', lineHeight: 1 }}>
              ×
            </button>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
