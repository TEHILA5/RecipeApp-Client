// ===============================================
// Recipe List Component - Grid Wrapper
// ===============================================
import RecipeCard from './RecipeCard';
import type { Recipe } from '../types/recipe.types';

interface RecipeListProps {
  recipes: Recipe[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function RecipeList({ recipes, loading, emptyMessage }: RecipeListProps) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-large"></div>
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="no-results">
        <div className="no-results-icon">🍰</div>
        <h3>No recipes found</h3>
        <p>{emptyMessage || 'Try adjusting your search or filters'}</p>
      </div>
    );
  }

  return (
    <div className="recipes-grid">
      {recipes.map((recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
}
