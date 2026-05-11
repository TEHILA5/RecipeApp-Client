import RecipeCard from './RecipeCard';
import type { Recipe } from '../types/recipe.types';
import emptyIcon from '../../../assets/icons/page-about.png';

interface RecipeListProps {
  recipes: Recipe[];
  loading?: boolean;
  emptyMessage?: string;
}

export default function RecipeList({ recipes, loading, emptyMessage }: RecipeListProps) {
  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner-large" />
        <p>Loading recipes...</p>
      </div>
    );
  }

  if (recipes.length === 0) {
    return (
      <div className="no-results">
        <img src={emptyIcon} alt="No recipes" className="no-results-icon" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
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
