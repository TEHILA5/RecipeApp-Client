// ===============================================
// useLocalStorage - Custom Hook לשמירה ב-LocalStorage
// ===============================================

import { useState, useEffect } from 'react';

/**
 * Hook לשמירה והחזרה של ערכים מ-LocalStorage
 * @param key - המפתח ב-LocalStorage
 * @param initialValue - ערך התחלתי
 * @returns [value, setValue] - הערך ופונקציה לעדכון
 * 
 * @example
 * const [favorites, setFavorites] = useLocalStorage<number[]>('favoriteRecipes', []);
 * 
 * // הוספת מתכון למועדפים
 * setFavorites([...favorites, recipeId]);
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  // קבלת ערך התחלתי מ-LocalStorage או שימוש בערך ברירת המחדל
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // פונקציה לעדכון ערך
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // תמיכה בפונקציה או ערך ישיר
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // סנכרון עם שינויים מחלונות אחרים
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error('Error parsing storage event:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue] as const;
}