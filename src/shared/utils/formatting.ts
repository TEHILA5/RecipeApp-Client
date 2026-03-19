export const formatDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
};

export const formatShortDate = (dateStr: string | undefined): string => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('he-IL');
};

export const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
};

export const formatRating = (rating: number | undefined): string =>
  rating ? rating.toFixed(1) : '—';

export const truncate = (text: string, max: number): string =>
  text.length <= max ? text : `${text.substring(0, max)}...`;