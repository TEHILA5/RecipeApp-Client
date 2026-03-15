// ===============================================
// ImageLazyLoad - טעינה עצלה של תמונות
// רכיב חדש המשתמש ב-Intersection Observer API
// ===============================================
import { useState, useRef, useEffect } from 'react';

interface ImageLazyLoadProps {
  src: string;
  alt: string;
  fallback?: string; // emoji או תמונת ברירת מחדל
  className?: string;
  style?: React.CSSProperties;
  placeholderStyle?: React.CSSProperties;
}

export default function ImageLazyLoad({
  src,
  alt,
  fallback = '🍰',
  className,
  style,
  placeholderStyle,
}: ImageLazyLoadProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // ✅ Intersection Observer API - רכיב חדש שלא למדנו
  // מתחיל לטעון את התמונה רק כשהיא נכנסת ל-viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // מפסיק לצפות אחרי שנכנס לתצוגה
        }
      },
      { threshold: 0.1, rootMargin: '50px' } // מתחיל לטעון 50px לפני שנכנס לתצוגה
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  const defaultPlaceholder: React.CSSProperties = {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, #f9e4ec 25%, #fdf0f5 50%, #f9e4ec 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    ...placeholderStyle,
  };

  return (
    <div ref={imgRef} style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>

      {/* Placeholder - מוצג עד שהתמונה נטענת */}
      {(!isLoaded || !isVisible) && !hasError && (
        <div style={defaultPlaceholder}>
          {!isVisible && ''}
        </div>
      )}

      {/* Fallback - מוצג בשגיאה */}
      {hasError && (
        <div style={{ ...defaultPlaceholder, animation: 'none', background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)' }}>
          {fallback}
        </div>
      )}

      {/* התמונה עצמה - נטענת רק כשנכנסת ל-viewport */}
      {isVisible && !hasError && (
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            position: 'absolute',
            inset: 0,
            ...style,
          }}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}
