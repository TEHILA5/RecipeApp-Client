// ===============================================
// IngredientList - רשימת מרכיבים במתכון
// ===============================================
import type { RecipeIngredient } from '../types/recipe.types';

interface IngredientListProps {
  ingredients: RecipeIngredient[];
}

const importanceColors: Record<string, string> = {
  Essential: '#fee2e2',
  Recommended: '#fef3c7',
  Optional: '#f0fdf4',
};
const importanceText: Record<string, string> = {
  Essential: '#991b1b',
  Recommended: '#92400e',
  Optional: '#166534',
};

export default function IngredientList({ ingredients }: IngredientListProps) {
  if (!ingredients?.length) {
    return (
      <p style={{ color: '#9ca3af', textAlign: 'center', fontFamily: "'Nunito',sans-serif" }}>
        No ingredients listed.
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {ingredients.map((ing, i) => (
        <div key={i} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px', borderRadius: '14px',
          background: '#fdf2f8', border: '1px solid #fce7f3',
          fontFamily: "'Nunito',sans-serif",
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '1.2rem' }}>🥄</span>
            <span style={{ fontWeight: 600, color: '#1f2937' }}>
              {ing.ingredientName || `Ingredient #${ing.ingredientId}`}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: 700, color: '#d4547a', fontSize: '0.95rem' }}>
              {ing.quantity} {ing.unit}
            </span>
            {ing.importance && (
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '3px 10px', borderRadius: '999px',
                background: importanceColors[ing.importance] ?? '#fdf2f8',
                color: importanceText[ing.importance] ?? '#831843',
                letterSpacing: '0.05em',
              }}>
                {ing.importance}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
