// ===============================================
// SearchFilters - סינון לפי קטגוריה / מרכיבים
// ===============================================
import type { RecipeCategory } from '../../recipe/types/recipe.types';
import { CATEGORY_EMOJIS } from '../../recipe/types/recipe.types';

type SearchMode = 'name' | 'category' | 'ingredients';

const ALL_CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: 'Sweats', label: 'Sweets' }, { value: 'Cakes', label: 'Cakes' },
  { value: 'Cupcakes', label: 'Cupcakes' }, { value: 'Cheesecakes', label: 'Cheesecakes' },
  { value: 'BundtCakes', label: 'Bundt Cakes' }, { value: 'Brownies', label: 'Brownies' },
  { value: 'Cookies', label: 'Cookies' }, { value: 'Bars', label: 'Bars' },
  { value: 'IceCream', label: 'Ice Cream' }, { value: 'Mousse', label: 'Mousse' },
  { value: 'Puddings', label: 'Puddings' }, { value: 'Panna', label: 'Panna Cotta' },
  { value: 'Tiramisu', label: 'Tiramisu' }, { value: 'FrozenDesserts', label: 'Frozen Desserts' },
  { value: 'Pies', label: 'Pies' }, { value: 'Tarts', label: 'Tarts' },
  { value: 'Crumbles', label: 'Crumbles' }, { value: 'FruitSalads', label: 'Fruit Salads' },
  { value: 'Pastries', label: 'Pastries' }, { value: 'Donuts', label: 'Donuts' },
  { value: 'Churros', label: 'Churros' }, { value: 'Crepes', label: 'Crepes' },
  { value: 'Waffles', label: 'Waffles' }, { value: 'NoBakeCakes', label: 'No-Bake Cakes' },
  { value: 'Truffles', label: 'Truffles' }, { value: 'EnergyBalls', label: 'Energy Balls' },
  { value: 'SoufleeAndCustard', label: 'Souflee & Custard' },
  { value: 'MilkDesserts', label: 'Milk Desserts' },
  { value: 'JellyAndGelatin', label: 'Jelly & Gelatin' },
  { value: 'TraditionalDesserts', label: 'Traditional Desserts' },
];

interface SearchFiltersProps {
  mode: SearchMode;
  // Category
  categoryInput: RecipeCategory | '';
  onCategoryChange: (cat: RecipeCategory | '') => void;
  // Ingredients
  ingredientInput: string;
  onIngredientInputChange: (val: string) => void;
  ingredientList: string[];
  onAddIngredient: () => void;
  onRemoveIngredient: (ing: string) => void;
  onClearIngredients: () => void;
}

export default function SearchFilters({
  mode,
  categoryInput, onCategoryChange,
  ingredientInput, onIngredientInputChange,
  ingredientList, onAddIngredient, onRemoveIngredient, onClearIngredients,
}: SearchFiltersProps) {

  if (mode === 'category') return (
    <div>
      <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '14px' }}>
        Select a category ({ALL_CATEGORIES.length} available):
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {ALL_CATEGORIES.map(({ value, label }) => {
          const emoji = CATEGORY_EMOJIS[value] ?? '🍰';
          const selected = categoryInput === value;
          return (
            <button key={value}
              onClick={() => onCategoryChange(selected ? '' : value)}
              style={{
                padding: '8px 18px', borderRadius: '999px',
                border: `2px solid ${selected ? '#d4547a' : '#fce7f3'}`,
                background: selected ? '#fce7f3' : 'white',
                color: selected ? '#d4547a' : '#6b7280',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
              }}>
              {emoji} {label}
            </button>
          );
        })}
      </div>
    </div>
  );

  if (mode === 'ingredients') return (
    <div>
      <p style={{ fontSize: '0.85rem', color: '#9ca3af', fontWeight: 600, marginBottom: '14px' }}>
        Add ingredients one by one and press <strong style={{ color: '#d4547a' }}>+ Add</strong> (or Enter):
      </p>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
        <input
          type="text" value={ingredientInput}
          onChange={(e) => onIngredientInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddIngredient(); }}
          placeholder="e.g. chocolate, butter, eggs..."
          style={{
            flex: 1, padding: '12px 18px', border: '2px solid #fce7f3',
            borderRadius: '999px', fontFamily: "'Nunito',sans-serif",
            fontSize: '0.92rem', background: '#fffbfd', outline: 'none',
            transition: 'border-color 0.2s', boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#d4547a')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#fce7f3')}
        />
        <button onClick={onAddIngredient} disabled={!ingredientInput.trim()}
          style={{
            padding: '12px 20px', borderRadius: '999px', border: 'none',
            background: ingredientInput.trim() ? 'linear-gradient(135deg, #e8799a, #d4547a)' : '#e5e7eb',
            color: ingredientInput.trim() ? 'white' : '#9ca3af',
            fontFamily: "'Nunito',sans-serif", fontWeight: 700,
            fontSize: '0.85rem', cursor: ingredientInput.trim() ? 'pointer' : 'not-allowed',
            whiteSpace: 'nowrap',
          }}>
          + Add
        </button>
      </div>

      {ingredientList.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {ingredientList.map((ing) => (
            <span key={ing} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '999px',
              background: '#fce7f3', color: '#d4547a', fontWeight: 700, fontSize: '0.82rem',
            }}>
              🧂 {ing}
              <button onClick={() => onRemoveIngredient(ing)}
                style={{ background: 'none', border: 'none', color: '#d4547a', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 0 }}>
                ×
              </button>
            </span>
          ))}
          <button onClick={onClearIngredients}
            style={{ padding: '6px 14px', borderRadius: '999px', border: '1.5px solid #e5e7eb', background: 'white', color: '#9ca3af', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>
            Clear all
          </button>
        </div>
      )}
    </div>
  );

  return null;
}
