import { Link } from 'react-router-dom'; 
import { useAppSelector } from '../../../redux/hooks';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { type Recipe, LEVEL_LABELS, CATEGORY_IMAGES } from '../../recipe/types/recipe.types';
import StarRating from '../../../shared/components/StarRating';
import Hero from '../components/Hero';
import CategoryGrid from '../components/CategoryGrid';
import FeaturedRecipes from '../components/FeaturedRecipes';
import RecipeCard from '../../recipe/components/RecipeCard';
import SectionHeader from '../../../shared/components/UI/SectionHeader';
import StatDisplay from '../../../shared/components/UI/StatDisplay';
import './HomePage.css';

function FeaturedCard({ recipe }: { recipe: Recipe }) {
  const image = CATEGORY_IMAGES[recipe.category] ?? '🍰';
  const levelLabel = LEVEL_LABELS[recipe.level as 1 | 2 | 3] ?? 'Easy';
  return (
    <article className="featured-wrap">
      <div className="featured-img-wrap">
        {recipe.arrImage ? (
          <img src={recipe.arrImage} alt={recipe.name} className="featured-img"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
        ) : (
          <div className="featured-img featured-img--fallback">
            <img src={image} alt={recipe.category} className="featured-fallback-icon" />
          </div>
        )}
      </div>
      <div className="featured-body">
        <div className="featured-badge featured-badge--lg">
          <img src="/src/assets/icons/rank-star.png" alt="" className="featured-badge-icon" />
          Featured
        </div>
        <h3 className="featured-title">{recipe.name}</h3>
        <p className="featured-desc">{recipe.description}</p>
        <div className="featured-stats">
          <StatDisplay variant="featured" value={<StarRating rating={recipe.averageRating} size="md" />} label="Rating" />
          <StatDisplay variant="featured" value={`${recipe.totalTime}m`} label="Time" />
          <StatDisplay variant="featured" value={recipe.servings} label="Servings" />
          <StatDisplay variant="featured" value={levelLabel} label="Level" />
        </div>
        <Link to={`/recipes/${recipe.id}`} className="btn-pink">View Recipe →</Link>
      </div>
    </article>
  );
}

function RecipeSkeleton() {
  return (
    <div className="recipe-card recipe-card--skeleton">
      <div className="skeleton-img-block" />
      <div className="card-body">
        <div className="skeleton-line skeleton-line--short" />
        <div className="skeleton-line skeleton-line--medium" />
        <div className="skeleton-line skeleton-line--full" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { data: recipes = [], isLoading: loading, error } = useGetRecipesQuery();
  const errorMessage = typeof error === 'string' ? error : error ? 'Failed to load recipes' : '';

  const byRating = [...recipes].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  const popularRecipes = byRating.slice(0, 3);
  const featuredRecipe = byRating[0] ?? null;
  const newestRecipes = [...recipes].sort((a, b) => b.id - a.id).slice(0, 3);

  return (
    <div className="home-page">
      <Hero />

      <section className="section">
        <SectionHeader eyebrow="✦ Most Loved" title={<>Popular <span>Recipes</span></>} />
        {error ? <div className="hp-error">{errorMessage}</div> : null}
        <div className="recipes-grid">
          {loading ? (
            <><RecipeSkeleton /><RecipeSkeleton /><RecipeSkeleton /></>
          ) : popularRecipes.length > 0 ? (
            popularRecipes.map((recipe, i) => {
              const badge = i === 0 ? (
                <div className="hp-badge">
                  <img src="/src/assets/icons/profile-trophy.png" alt="" className="hp-badge-icon" />
                  Top Rated
                </div>
              ) : (
                <div className="hp-badge">
                  <img src="/src/assets/icons/rank-star.png" alt="" className="hp-badge-icon" />
                  {recipe.averageRating?.toFixed(1) || '—'}
                </div>
              );
              return <RecipeCard key={recipe.id} recipe={recipe} badge={badge} />;
            })
          ) : (
            <div className="hp-empty">
              No recipes available yet. Check back soon!
              <img src="/src/assets/icons/state-empty.png" alt="No recipes" className="hp-empty-icon" />
            </div>
          )}
        </div>
        {recipes.length > 3 && (
          <div className="hp-see-all">
            <Link to="/recipes" className="btn-outline">See All {recipes.length} Recipes →</Link>
          </div>
        )}
      </section>

      {newestRecipes.length > 0 && (
        <section className="section section-bg">
          <SectionHeader eyebrow="✦ Fresh Bakes" title={<>Newest <span>Recipes</span></>} />
          <div className="recipes-grid">
            {newestRecipes.map((recipe, i) => (
              <RecipeCard key={recipe.id} recipe={recipe} badge={i === 0 ? (
                <div className="hp-badge">
                  <img src="/src/assets/icons/action-new.png" alt="" className="hp-badge-icon--lg" />
                  Just Added
                </div>
              ) : 'New'} />
            ))}
          </div>
        </section>
      )}

      {isAuthenticated && <FeaturedRecipes />}

      <CategoryGrid />

      <section className="section">
        <SectionHeader eyebrow="✦ Recipe of the Month" title={<>Featured <span>Dessert</span></>} />
        {loading ? (
          <div className="hp-loading">Loading...</div>
        ) : featuredRecipe ? (
          <FeaturedCard recipe={featuredRecipe} />
        ) : (
          <article className="featured-wrap">
            <div className="featured-img-wrap">
              <div className="featured-img featured-img--fallback">🍓</div>
            </div>
            <div className="featured-body">
              <div className="featured-badge featured-badge--lg">
                <img src="/src/assets/icons/rank-star.png" alt="" className="featured-badge-icon" />
                Featured
              </div>
              <h3 className="featured-title">No recipes yet</h3>
              <p className="featured-desc">Be the first to discover amazing dessert recipes!</p>
              {!isAuthenticated && <Link to="/register" className="btn-pink">Get Started Free →</Link>}
            </div>
          </article>
        )}
      </section>

      {!isAuthenticated && (
        <section className="cta-section">
          <div className="cta-content">
            <h2 className="cta-title">
              <img src="/src/assets/icons/sweet.png" alt="" className="cta-title-icon" />
              Ready to Start Baking?
            </h2>
            <p>Join thousands of home bakers and discover your next favorite recipe!</p>
            <Link to="/register" className="btn-pink btn-large">Create Free Account</Link>
          </div>
        </section>
      )}
    </div>
  );
}