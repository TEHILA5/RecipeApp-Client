import type { ReactNode } from 'react';
import './ModalActions.css';

interface ModalActionsProps {
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmLoading?: boolean;
  confirmLoadingLabel?: string;
  confirmDisabled?: boolean;
  danger?: boolean;
  children?: ReactNode;
  className?: string;
}

export default function ModalActions({
  onCancel,
  onConfirm,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmLoading = false,
  confirmLoadingLabel,
  confirmDisabled = false,
  danger = false,
  children,
  className,
}: ModalActionsProps) {
  if (children) {
    return (
      <div className={['modal-actions', className].filter(Boolean).join(' ')}>
        {children}
      </div>
    );
  }

  return (
    <div className={['modal-actions', className].filter(Boolean).join(' ')}>
      <button type="button" className="modal-actions__cancel" onClick={onCancel}>
        {cancelLabel}
      </button>
      <button
        type="button"
        className={`modal-actions__confirm${danger ? ' modal-actions__confirm--danger' : ''}${confirmLoading ? ' modal-actions__confirm--loading' : ''}`}
        onClick={onConfirm}
        disabled={confirmLoading || confirmDisabled}
      >
        {confirmLoading ? (confirmLoadingLabel ?? `${confirmLabel}...`) : confirmLabel}
      </button>
    </div>
  );
}
