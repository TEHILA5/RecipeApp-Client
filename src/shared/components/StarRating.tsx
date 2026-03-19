import './StarRating.css';

interface StarRatingProps {
  rating: number | null | undefined;
  showCount?: number | null;
  size?: 'sm' | 'md';
}

const STARS = [1, 2, 3, 4, 5];

export default function StarRating({ rating, showCount, size = 'sm' }: StarRatingProps) {
  if (!rating) {
    return (
      <div className={`star-rating ${size}`}>
        {STARS.map((s) => <span key={s} className="star empty">★</span>)}
        <span className="no-reviews">No reviews yet</span>
      </div>
    );
  }

  const rounded = Math.round(rating);
  return (
    <div className={`star-rating ${size}`}>
      {STARS.map((s) => (
        <span key={s} className={`star ${s <= rounded ? 'filled' : 'empty'}`}>★</span>
      ))}
      <span className="rating-value">{rating.toFixed(1)}</span>
      {showCount && <span className="rating-count">({showCount})</span>}
    </div>
  );
}
