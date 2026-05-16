import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useGetRecommendedRecipesQuery } from '../../recipe/redux/recipeSlice';
import { type Recipe, LEVEL_LABELS, CATEGORY_IMAGES } from '../../recipe/types/recipe.types';
import StarRating from '../../../shared/components/StarRating';
import './FeaturedRecipes.css';

function RecipeCard({ recipe }: { recipe: Recipe }) {
  const image = CATEGORY_IMAGES[recipe.category] ?? '🍰';
  const level = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
  const levelIcon = recipe.level === 2
    ? '/src/assets/icons/meta-level-medium.png'
    : recipe.level === 3
      ? '/src/assets/icons/meta-level-hard.png'
      : '/src/assets/icons/meta-level-easy.png';
  const levelAlt = recipe.level === 2 ? 'Medium' : recipe.level === 3 ? 'Hard' : 'Easy';

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
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`card-img card-img-fallback ${recipe.arrImage ? 'hidden' : ''}`}>
          <img src={image} alt={recipe.category} className="card-img-fallback-icon" />
        </div>
        <div className="card-badge">
          <img src="/src/assets/icons/rank-star.png" alt="" className="card-badge-icon" />
          Featured
        </div>
      </div>

      <div className="card-body">
        <StarRating rating={recipe.averageRating} showCount={recipe.commentCount} />
        <h3 className="card-title">{recipe.name}</h3>
        <p className="card-desc">{recipe.description}</p>
        <div className="card-meta">
          <span className="meta-item">
            <img src="/src/assets/icons/meta-time.png" alt="Time" className="meta-icon" />
            {recipe.totalTime} min
          </span>
          <span className="meta-item">
            <img src={levelIcon} alt={levelAlt} className="meta-icon" />
            {level}
          </span>
          <span className="meta-item">
            <img src="/src/assets/icons/meta-servings.png" alt="Servings" className="meta-icon" />
            {recipe.servings}
          </span>
        </div>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="recipe-card skeleton-card">
      <div className="skeleton-img" />
      <div className="card-body skeleton-body">
        <div className="skeleton-line short" />
        <div className="skeleton-line medium" />
        <div className="skeleton-line full" />
        <div className="skeleton-line mid" />
      </div>
    </div>
  );
}

export default function FeaturedRecipes() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: recipes = [], isLoading, error } = useGetRecommendedRecipesQuery(undefined, {
    skip: !isAuthenticated,
  });

  if (!isAuthenticated) return null;

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-eyebrow">✦ Just For You</div>
        <h2 className="section-title">Recommended <span>Recipes</span></h2>
        <div className="section-divider" />
      </div>

      {Boolean(error) && !isLoading && (
        <p className="featured-error">
          Could not load recommendations.{" "}
          <Link to="/recipes" className="btn-outline inline">Browse all recipes →</Link>
        </p>
      )}

      <div className="recipes-grid">
        {isLoading ? (
          <><Skeleton /><Skeleton /><Skeleton /></>
        ) : recipes.length > 0 ? (
          recipes.slice(0, 3).map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
        ) : (
          <p className="featured-empty">
            No recommendations yet — <Link to="/recipes">explore all recipes</Link> to get started!
          </p>
        )}
      </div>

      {recipes.length > 3 && (
        <div className="featured-see-all">
          <Link to="/recipes" className="btn-outline">See All Recommendations →</Link>
        </div>
      )}
    </section>
  );
}