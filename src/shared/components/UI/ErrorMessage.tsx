import './ErrorMessage.css';

interface ErrorMessageProps {
  message: string | null | undefined;
  className?: string;
}

export default function ErrorMessage({ message, className }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`error-message ${className ?? ''}`}>
      <img src="/src/assets/icons/profile-warning.png" alt="" className="cp-icon-xs" />
      {message} 
    </div>
  );
}
