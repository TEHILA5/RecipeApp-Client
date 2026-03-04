// ===============================================
// Recipe Card Component
// ===============================================
import { Link } from 'react-router-dom';
import type { Recipe } from '../types/recipe.types';
import { LEVEL_LABELS, CATEGORY_EMOJIS } from '../types/recipe.types';

interface RecipeCardProps {
  recipe: Recipe;
  badge?: string;
}

function StarRating({ rating }: { rating: number | null | undefined }) {
  // No rating yet
  if (!rating || rating === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {[1,2,3,4,5].map((s) => (
          <span key={s} style={{ color: '#d1d5db', fontSize: '0.9rem' }}>★</span>
        ))}
        <span style={{ fontSize: '0.75rem', color: '#9ca3af', fontWeight: 600 }}>No reviews yet</span>
      </div>
    );
  }

  const rounded = Math.round(rating);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
      {[1,2,3,4,5].map((s) => (
        <span key={s} style={{
          color: s <= rounded ? '#f59e0b' : '#d1d5db',
          fontSize: '0.9rem',
        }}>★</span>
      ))}
      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', marginLeft: '2px' }}>
        {rating.toFixed(1)}
      </span>
    </div>
  );
}

export default function RecipeCard({ recipe, badge }: RecipeCardProps) {
  const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="card-img-wrap">
        {recipe.arrImage ? (
          <img
            src={recipe.arrImage}
            alt={recipe.name}
            className="card-img"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = 'none';
              const fallback = img.nextElementSibling as HTMLElement;
              if (fallback) fallback.classList.remove('hidden');
            }}
          />
        ) : null}

        {/* Emoji fallback */}
        <div
          className={`card-img card-img-emoji ${recipe.arrImage ? 'hidden' : ''}`}
          style={{
            background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '72px',
          }}
        >
          {emoji}
        </div>

        {badge && <div className="card-badge">{badge}</div>}
      </div>

      <div className="card-body">
        {/* Rating */}
        <div className="card-rating">
          <StarRating rating={recipe.averageRating} />
          {recipe.commentCount ? (
            <span className="rating-count">({recipe.commentCount})</span>
          ) : null}
        </div>

        {/* Title */}
        <h3 className="card-title">{recipe.name}</h3>

        {/* Description */}
        <p className="card-desc">
          {recipe.description.length > 100
            ? `${recipe.description.substring(0, 100)}...`
            : recipe.description}
        </p>

        {/* Metadata */}
        <div className="card-meta">
          <span className="meta-item">
            <span className="meta-icon">⏱️</span> {recipe.totalTime} min
          </span>
          <span className="meta-item">
            <span className="meta-icon">👨‍🍳</span> {levelLabel}
          </span>
          {recipe.servings && (
            <span className="meta-item">
              <span className="meta-icon">🍽️</span> {recipe.servings}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
