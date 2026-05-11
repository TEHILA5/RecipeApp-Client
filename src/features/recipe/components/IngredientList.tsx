import type { RecipeIngredient } from '../types/recipe.types';
import './IngredientList.css';

interface IngredientListProps {
  ingredients: RecipeIngredient[];
}

const IMPORTANCE_BG: Record<string, string> = {
  Essential:   '#fee2e2',
  Recommended: '#fef3c7',
  Optional:    '#f0fdf4',
};

const IMPORTANCE_COLOR: Record<string, string> = {
  Essential:   '#991b1b',
  Recommended: '#92400e',
  Optional:    '#166534',
};

export default function IngredientList({ ingredients }: IngredientListProps) {
  if (!ingredients?.length) {
    return <p className="il-empty">No ingredients listed.</p>;
  }

  return (
    <div className="il-list">
      {ingredients.map((ing, i) => (
        <div key={i} className="il-item">
          <div className="il-left">
            <span className="il-icon">
              <img src="/src/assets/icons/calc-spoon.png" alt="Ingredient" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
            </span>
            <span className="il-name">{ing.ingredientName || `Ingredient #${ing.ingredientId}`}</span>
          </div>
          <div className="il-right">
            <span className="il-qty">{ing.quantity} {ing.unit}</span>
            {ing.importance && (
              <span
                className="il-badge"
                style={{ background: IMPORTANCE_BG[ing.importance] ?? '#fdf2f8', color: IMPORTANCE_COLOR[ing.importance] ?? '#831843' }}
              >
                {ing.importance}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
