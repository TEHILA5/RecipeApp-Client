// ===============================================
// Home Page
// ===============================================
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { type Recipe, LEVEL_LABELS, CATEGORY_EMOJIS } from '../../recipe/types/recipe.types';
import StarRating from '../../../shared/components/StarRating';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedRecipes from '../components/FeaturedRecipes';
import './HomePage.css';

// ── כרטיס מתכון ──
function RecipeCard({ recipe, badge }: { recipe: Recipe; badge?: string }) {
  const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
  return (
    <Link to={`/recipes/${recipe.id}`} className="recipe-card">
      <div className="card-img-wrap">
        {recipe.arrImage ? (
          <img src={recipe.arrImage} alt={recipe.name} className="card-img"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling!.classList.remove('hidden');
            }} />
        ) : null}
        <div className={`card-img card-img-emoji ${recipe.arrImage ? 'hidden' : ''}`}
          style={{ background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '72px' }}>
          {emoji}
        </div>
        {badge && <div className="card-badge">{badge}</div>}
      </div>
      <div className="card-body">
        <div className="card-rating"><StarRating rating={recipe.averageRating} /></div>
        <h3 className="card-title">{recipe.name}</h3>
        <p className="card-desc">{recipe.description}</p>
        <div className="card-meta">
          <span className="meta-item"><span className="meta-icon">⏱️</span> {recipe.totalTime} min</span>
          <span className="meta-item"><span className="meta-icon">👨‍🍳</span> {levelLabel}</span>
          {recipe.servings && <span className="meta-item"><span className="meta-icon">🍽️</span> {recipe.servings}</span>}
        </div>
      </div>
    </Link>
  );
}

// ── Featured Card ──
function FeaturedCard({ recipe }: { recipe: Recipe }) {
  const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
  return (
    <div className="featured-wrap">
      <div className="featured-img-wrap">
        {recipe.arrImage ? (
          <img src={recipe.arrImage} alt={recipe.name} className="featured-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="featured-img"
            style={{ background: 'linear-gradient(135deg, #e8799a, #c4894a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '150px' }}>
            {emoji}
          </div>
        )}
      </div>
      <div className="featured-body">
        <div className="featured-badge">⭐ Featured</div>
        <h3 className="featured-title">{recipe.name}</h3>
        <p className="featured-desc">{recipe.description}</p>
        <div className="featured-stats">
          <div>
            <div className="feat-stat-val"><StarRating rating={recipe.averageRating} size="md" /></div>
            <div className="feat-stat-lbl">Rating</div>
          </div>
          <div>
            <div className="feat-stat-val">{recipe.totalTime}m</div>
            <div className="feat-stat-lbl">Time</div>
          </div>
          <div>
            <div className="feat-stat-val">{recipe.servings}</div>
            <div className="feat-stat-lbl">Servings</div>
          </div>
          <div>
            <div className="feat-stat-val">{levelLabel}</div>
            <div className="feat-stat-lbl">Level</div>
          </div>
        </div>
        <Link to={`/recipes/${recipe.id}`} className="btn-pink">View Recipe →</Link>
      </div>
    </div>
  );
}

function RecipeSkeleton() {
  return (
    <div className="recipe-card" style={{ pointerEvents: 'none' }}>
      <div style={{ width: '100%', aspectRatio: '4/3', background: 'linear-gradient(90deg, #f9e4ec 25%, #fdf0f5 50%, #f9e4ec 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
      <div className="card-body">
        <div style={{ height: 12, width: '60%', background: '#f9e4ec', borderRadius: 8, marginBottom: 12 }} />
        <div style={{ height: 20, width: '80%', background: '#f9e4ec', borderRadius: 8, marginBottom: 8 }} />
        <div style={{ height: 14, width: '100%', background: '#f9e4ec', borderRadius: 8 }} />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { data: recipes = [], isLoading: loading, error } = useGetRecipesQuery();

  const popularRecipes = [...recipes].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0)).slice(0, 3);
  const featuredRecipe = [...recipes].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))[0] ?? null;
  const newestRecipes = [...recipes].sort((a, b) => b.id - a.id).slice(0, 3);

  return (
    <div className="home-page">

      <Hero />

      {/* ── Popular Recipes ── */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">✦ Most Loved</div>
          <h2 className="section-title">Popular <span>Recipes</span></h2>
          <div className="section-divider"></div>
        </div>
        {error && <div style={{ textAlign: 'center', color: 'var(--deep-pink)', marginBottom: 24 }}>Failed to load recipes</div>}
        <div className="recipes-grid">
          {loading ? (
            <><RecipeSkeleton /><RecipeSkeleton /><RecipeSkeleton /></>
          ) : popularRecipes.length > 0 ? (
            popularRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe}
                badge={i === 0 ? '🏆 Top Rated' : `⭐ ${recipe.averageRating?.toFixed(1) || '—'}`} />
            ))
          ) : (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '40px', color: 'var(--mid)' }}>
              No recipes available yet. Check back soon! 🍰
            </div>
          )}
        </div>
        {recipes.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link to="/recipes" className="btn-outline">See All {recipes.length} Recipes →</Link>
          </div>
        )}
      </section>

      {/* ── Newest Recipes ── */}
      {newestRecipes.length > 0 && (
        <section className="section section-bg">
          <div className="section-header">
            <div className="section-eyebrow">✦ Fresh Bakes</div>
            <h2 className="section-title">Newest <span>Recipes</span></h2>
            <div className="section-divider"></div>
          </div>
          <div className="recipes-grid">
            {newestRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} badge={i === 0 ? '🆕 Just Added' : 'New'} />
            ))}
          </div>
        </section>
      )}

      {/* ── Recommended (מחובר בלבד) ── */}
      {isAuthenticated && <FeaturedRecipes />}

      <CategoryGrid />

      {/* ── Featured Recipe ── */}
      <section className="section">
        <div className="section-header">
          <div className="section-eyebrow">✦ Recipe of the Month</div>
          <h2 className="section-title">Featured <span>Dessert</span></h2>
          <div className="section-divider"></div>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--mid)' }}>Loading...</div>
        ) : featuredRecipe ? (
          <FeaturedCard recipe={featuredRecipe} />
        ) : (
          <div className="featured-wrap">
            <div className="featured-img-wrap">
              <div className="featured-img" style={{ background: 'linear-gradient(135deg, #e8799a, #c4894a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '150px' }}>🍓</div>
            </div>
            <div className="featured-body">
              <div className="featured-badge">⭐ Featured</div>
              <h3 className="featured-title">No recipes yet</h3>
              <p className="featured-desc">Be the first to discover amazing dessert recipes!</p>
              {!isAuthenticated && <Link to="/register" className="btn-pink">Get Started Free →</Link>}
            </div>
          </div>
        )}
      </section>

      {/* ── CTA ── */}
      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Start Baking? 🍰</h2>
            <p>Join thousands of home bakers and discover your next favorite recipe!</p>
            <Link to="/register" className="btn-pink btn-large">Create Free Account</Link>
          </div>
        </section>
      )}
    </div>
  );
}
