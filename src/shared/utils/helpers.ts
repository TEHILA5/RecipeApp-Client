// ===============================================
// Helpers - פונקציות עזר גלובליות
// ===============================================

/**
 * בדיקה אם ערך הוא מספר חיובי תקין
 */
export const isPositiveNumber = (val: unknown): boolean => {
  return typeof val === 'number' && !isNaN(val) && val > 0;
};

/**
 * חישוב ממוצע דירוגים
 */
export const calcAverageRating = (ratings: number[]): number => {
  if (!ratings.length) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
};

/**
 * מיון מערך לפי שדה
 */
export const sortBy = <T>(arr: T[], key: keyof T, dir: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    if (a[key] < b[key]) return dir === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return dir === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * הסרת כפילויות ממערך
 */
export const unique = <T>(arr: T[]): T[] => [...new Set(arr)];

/**
 * המרת שגיאה לטקסט
 */
export const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === 'string') return err;
  return 'An unexpected error occurred';
};

/**
 * השהייה (לשימוש ב-async/await)
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));