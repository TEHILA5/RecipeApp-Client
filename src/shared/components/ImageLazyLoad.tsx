import { useState, useRef, useEffect, ReactNode } from 'react';
import './ImageLazyLoad.css';

interface ImageLazyLoadProps {
  src: string;
  alt: string;
  fallback?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ImageLazyLoad({
  src,
  alt,
  fallback = '🍰',
  className,
  style,
}: ImageLazyLoadProps) {
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="lazy-img">
      {!loaded && !error && (
        <div className="lazy-img__placeholder" />
      )}

      {error && (
        <div className="lazy-img__fallback">{fallback}</div>
      )}

      {visible && !error && (
        <img
          src={src}
          alt={alt}
          className={`lazy-img__img ${loaded ? 'lazy-img__img--loaded' : ''} ${className ?? ''}`}
          style={style}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
