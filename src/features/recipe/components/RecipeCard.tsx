import { Link } from 'react-router-dom';
import type { Recipe } from '../types/recipe.types';
import { LEVEL_LABELS, CATEGORY_IMAGES } from '../types/recipe.types';
import StarRating from '../../../shared/components/StarRating';
import ImageLazyLoad from '../../../shared/components/ImageLazyLoad';
import './RecipeCard.css';

import timeIcon from '../../../assets/icons/meta-time.png';
import servingsIcon from '../../../assets/icons/meta-servings.png';
import levelEasyIcon from '../../../assets/icons/meta-level-easy.png';
import levelMediumIcon from '../../../assets/icons/meta-level-medium.png';
import levelHardIcon from '../../../assets/icons/meta-level-hard.png';

const LEVEL_ICONS: Record<number, string> = {
  1: levelEasyIcon,
  2: levelMediumIcon,
  3: levelHardIcon,
};

interface RecipeCardProps {
  recipe: Recipe;
  badge?: React.ReactNode;
}

export default function RecipeCard({ recipe, badge }: RecipeCardProps) {
  const categoryImg = CATEGORY_IMAGES[recipe.category];
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
  const levelIcon = LEVEL_ICONS[recipe.level] ?? levelEasyIcon;

  const fallback = categoryImg
    ? <img src={categoryImg} alt={recipe.category} className="card-fallback-icon" />
    : <span><img src="/src/assets/icons/page-about.png" alt="Recipe" className="card-fallback-icon" /></span>;

  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="card-img-wrap">
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
          <span className="meta-item">
            <img src={timeIcon} alt="Time" className="meta-icon" />
            {recipe.prepTime} min
          </span>
          <span className="meta-item">
            <img src={levelIcon} alt={levelLabel} className="meta-icon" />
            {levelLabel}
          </span>
          {recipe.servings && (
            <span className="meta-item">
              <img src={servingsIcon} alt="Servings" className="meta-icon" />
              {recipe.servings}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}