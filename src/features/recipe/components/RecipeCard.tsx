import { Link } from 'react-router-dom';
import type { Recipe } from '../types/recipe.types';
import { LEVEL_LABELS, CATEGORY_IMAGES } from '../types/recipe.types';
import StarRating from '../../../shared/components/StarRating';
import ImageLazyLoad from '../../../shared/components/ImageLazyLoad';

interface RecipeCardProps {
  recipe: Recipe;
  badge?: string;
}

export default function RecipeCard({ recipe, badge }: RecipeCardProps) {
  const categoryImg = CATEGORY_IMAGES[recipe.category];
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';

  const fallback = categoryImg
    ? <img src={categoryImg} alt={recipe.category} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
    : '🍰';

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="card-img-wrap" style={{ aspectRatio: '4/3' }}>
        <ImageLazyLoad
          src={recipe.arrImage}
          alt={recipe.name}
          fallback={fallback}
        />
        {badge && <div className="card-badge">{badge}</div>}
      </div>

      <div className="card-body">
        <div className="card-rating">
          <StarRating rating={recipe.averageRating} showCount={recipe.commentCount} />
        </div>
        <h3 className="card-title">{recipe.name}</h3>
        <p className="card-desc">
          {recipe.description.length > 100
            ? `${recipe.description.substring(0, 100)}...`
            : recipe.description}
        </p>
        <div className="card-meta">
          <span className="meta-item"><span className="meta-icon">⏱️</span> {recipe.prepTime} min</span>
          <span className="meta-item"><span className="meta-icon">👨‍🍳</span> {levelLabel}</span>
          {recipe.servings && (
            <span className="meta-item"><span className="meta-icon">🍽️</span> {recipe.servings}</span>
          )}
        </div>
      </div>
    </Link>
  );
}