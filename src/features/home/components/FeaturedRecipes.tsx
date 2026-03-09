// ===============================================
// FeaturedRecipes - מתכונים מומלצים מהשרת
// ===============================================
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useGetRecommendedRecipesQuery } from '../../recipe/redux/recipeSlice';
import { type Recipe, LEVEL_LABELS, CATEGORY_EMOJIS } from '../../recipe/types/recipe.types';
import StarRating from '../../../shared/components/StarRating';

function FeaturedRecipeCard({ recipe }: { recipe: Recipe }) {
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
              if (fallback) fallback.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className="card-img"
          style={{
            background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)',
            display: recipe.arrImage ? 'none' : 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '72px',
          }}
        >
          {emoji}
        </div>
        <div className="card-badge">⭐ Featured</div>
      </div>

      <div className="card-body">
        <div className="card-rating">
          <StarRating rating={recipe.averageRating} showCount={recipe.commentCount} />
        </div>
        <h3 className="card-title">{recipe.name}</h3>
        <p className="card-desc">{recipe.description}</p>
        <div className="card-meta">
          <span className="meta-item"><span className="meta-icon">⏱️</span> {recipe.totalTime} min</span>
          <span className="meta-item"><span className="meta-icon">👨‍🍳</span> {levelLabel}</span>
          <span className="meta-item"><span className="meta-icon">🍽️</span> {recipe.servings}</span>
        </div>
      </div>
    </Link>
  );
}

function Skeleton() {
  return (
    <div className="recipe-card" style={{ pointerEvents: 'none' }}>
      <div style={{
        width: '100%', aspectRatio: '4/3',
        background: 'linear-gradient(90deg, #f9e4ec 25%, #fdf0f5 50%, #f9e4ec 75%)',
        backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite',
        borderRadius: '24px 24px 0 0',
      }} />
      <div className="card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ height: 12, width: '50%', background: '#f9e4ec', borderRadius: 8 }} />
        <div style={{ height: 22, width: '80%', background: '#f9e4ec', borderRadius: 8 }} />
        <div style={{ height: 14, width: '100%', background: '#f9e4ec', borderRadius: 8 }} />
        <div style={{ height: 14, width: '70%', background: '#f9e4ec', borderRadius: 8 }} />
      </div>
    </div>
  );
}

export default function FeaturedRecipes() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // ✅ RTK Query - מחליף את dispatch(fetchRecommendedRecipes())
  const {
    data: recommendedRecipes = [],
    isLoading: loading,
    error,
  } = useGetRecommendedRecipesQuery(undefined, {
    skip: !isAuthenticated, // לא טוען אם לא מחובר
  });

  if (!isAuthenticated) return null;

  return (
    <section className="section">
      <div className="section-header">
        <div className="section-eyebrow">✦ Just For You</div>
        <h2 className="section-title">Recommended <span>Recipes</span></h2>
        <div className="section-divider"></div>
      </div>

      {error && !loading && (
        <p style={{ textAlign: 'center', color: 'var(--deep-pink)', marginBottom: 24 }}>
          Could not load recommendations.{' '}
          <Link to="/recipes" className="btn-outline" style={{ display: 'inline' }}>Browse all recipes →</Link>
        </p>
      )}

      <div className="recipes-grid">
        {loading ? (
          <><Skeleton /><Skeleton /><Skeleton /></>
        ) : recommendedRecipes.length > 0 ? (
          recommendedRecipes.slice(0, 3).map((recipe) => (
            <FeaturedRecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p style={{ gridColumn: '1/-1', textAlign: 'center', color: 'var(--mid)', padding: '40px 0' }}>
            No recommendations yet — <Link to="/recipes">explore all recipes</Link> to get started!
          </p>
        )}
      </div>

      {recommendedRecipes.length > 3 && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <Link to="/recipes" className="btn-outline">See All Recommendations →</Link>
        </div>
      )}
    </section>
  );
}
