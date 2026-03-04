// ===============================================
// StarRating - Shared dynamic star rating
// ===============================================

interface StarRatingProps {
  rating: number | null | undefined;
  showCount?: number | null;
  size?: 'sm' | 'md';
}

export default function StarRating({ rating, showCount, size = 'sm' }: StarRatingProps) {
  const fontSize = size === 'md' ? '1.1rem' : '0.9rem';

  if (!rating || rating === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[1,2,3,4,5].map((s) => (
          <span key={s} style={{ color: '#d1d5db', fontSize }}>★</span>
        ))}
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600, marginLeft: '2px' }}>
          No reviews yet
        </span>
      </div>
    );
  }

  const rounded = Math.round(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{ color: s <= rounded ? '#f59e0b' : '#d1d5db', fontSize }}>★</span>
      ))}
      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', marginLeft: '3px' }}>
        {rating.toFixed(1)}
      </span>
      {showCount ? (
        <span style={{ fontSize: '0.72rem', color: '#9ca3af', marginLeft: '2px' }}>
          ({showCount})
        </span>
      ) : null}
    </div>
  );
}
