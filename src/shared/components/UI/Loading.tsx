import './Loading.css';

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
  const borderWidth = size === 'sm' ? 2 : 3;

  return (
    <div className={`loading ${fullPage ? 'loading--full' : ''}`}>
      <div
        className="loading__spinner"
        style={{ width: px, height: px, borderWidth, borderTopColor: color }}
      />
      {message && <p className="loading__message">{message}</p>}
    </div>
  );
}
