// ===============================================
// useDebounce - Custom Hook לדחיית פעולה
// ===============================================
// שימושי לחיפוש - מחכה שהמשתמש יסיים להקליד

import { useState, useEffect } from 'react';

/**
 * Hook לדחיית ערך - שימושי לחיפוש
 * @param value - הערך לדחות
 * @param delay - זמן המתנה במילישניות
 * @returns הערך המדחה
 * 
 * @example
 * const [searchTerm, setSearchTerm] = useState('');
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchTerm) {
 *     // בצע חיפוש רק אחרי שהמשתמש הפסיק להקליד
 *     searchAPI(debouncedSearchTerm);
 *   }
 * }, [debouncedSearchTerm]);
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // יצירת טיימר
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // ניקוי - ביטול טיימר קודם
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}