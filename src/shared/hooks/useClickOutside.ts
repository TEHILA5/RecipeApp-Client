// ===============================================
// useClickOutside - Custom Hook לזיהוי לחיצה מחוץ לאלמנט
// ===============================================
import { useEffect, type RefObject } from 'react';

/**
 * Hook לזיהוי לחיצה מחוץ לאלמנט
 * @param ref - ref של האלמנט שרוצים לעקוב אחריו
 * @param callback - פונקציה שתרוץ בלחיצה מחוץ לאלמנט
 * @param enabled - האם ה-hook פעיל (ברירת מחדל: true)
 *
 * @example
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * useClickOutside(dropdownRef, () => setIsOpen(false), isOpen);
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  callback: () => void,
  enabled: boolean = true
): void {
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [ref, callback, enabled]);
}

export default useClickOutside;