// ===============================================
// Formatting - פורמט תאריך ומספרים
// ===============================================

/**
 * פורמט תאריך לתצוגה
 * לדוגמה: "March 14, 2026"
 */
export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * פורמט תאריך קצר
 * לדוגמה: "14/03/2026"
 */
export const formatShortDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('he-IL');
};

/**
 * פורמט זמן בדקות לתצוגה
 * לדוגמה: 90 → "1h 30m"
 */
export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

/**
 * פורמט דירוג לתצוגה
 * לדוגמה: 4.567 → "4.6"
 */
export const formatRating = (rating: number | undefined): string => {
  if (!rating) return '—';
  return rating.toFixed(1);
};

/**
 * קיצור טקסט ארוך
 * לדוגמה: truncate("Hello World", 5) → "Hello..."
 */
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};