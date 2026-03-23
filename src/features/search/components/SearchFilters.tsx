import type { RecipeCategory } from '../../recipe/types/recipe.types';
import { CATEGORY_EMOJIS, CATEGORY_IMAGES } from '../../recipe/types/recipe.types';
import './SearchFilters.css';

type SearchMode = 'name' | 'category' | 'ingredients';

const ALL_CATEGORIES: { value: RecipeCategory; label: string }[] = [
  { value: 'Sweats',              label: 'Sweets' },
  { value: 'Cakes',               label: 'Cakes' },
  { value: 'Cupcakes',            label: 'Cupcakes' },
  { value: 'Cheesecakes',         label: 'Cheesecakes' },
  { value: 'BundtCakes',          label: 'Bundt Cakes' },
  { value: 'Brownies',            label: 'Brownies' },
  { value: 'Cookies',             label: 'Cookies' },
  { value: 'Bars',                label: 'Bars' },
  { value: 'IceCream',            label: 'Ice Cream' },
  { value: 'Mousse',              label: 'Mousse' },
  { value: 'Puddings',            label: 'Puddings' },
  { value: 'Panna',               label: 'Panna Cotta' },
  { value: 'Tiramisu',            label: 'Tiramisu' },
  { value: 'FrozenDesserts',      label: 'Frozen Desserts' },
  { value: 'Pies',                label: 'Pies' },
  { value: 'Tarts',               label: 'Tarts' },
  { value: 'Crumbles',            label: 'Crumbles' },
  { value: 'FruitSalads',         label: 'Fruit Salads' },
  { value: 'Pastries',            label: 'Pastries' },
  { value: 'Donuts',              label: 'Donuts' },
  { value: 'Churros',             label: 'Churros' },
  { value: 'Crepes',              label: 'Crepes' },
  { value: 'Waffles',             label: 'Waffles' },
  { value: 'NoBakeCakes',         label: 'No-Bake Cakes' },
  { value: 'Truffles',            label: 'Truffles' },
  { value: 'EnergyBalls',         label: 'Energy Balls' },
  { value: 'SoufleeAndCustard',   label: 'Souflee & Custard' },
  { value: 'MilkDesserts',        label: 'Milk Desserts' },
  { value: 'JellyAndGelatin',     label: 'Jelly & Gelatin' },
  { value: 'TraditionalDesserts', label: 'Traditional Desserts' },
];

interface SearchFiltersProps {
  mode: SearchMode;
  categoryInput: RecipeCategory | '';
  onCategoryChange: (cat: RecipeCategory | '') => void;
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
      <p className="filter-hint">Select a category ({ALL_CATEGORIES.length} available):</p>
      <div className="category-chips">
        {ALL_CATEGORIES.map(({ value, label }) => {
          const img = CATEGORY_IMAGES[value];
          const active = categoryInput === value;
          return (
            <button
              key={value}
              onClick={() => onCategoryChange(active ? '' : value)}
              className={`category-chip ${active ? 'active' : ''}`}
            >
              {img
                ? <img src={img} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                : <span style={{ fontSize: '0.85rem' }}>{label}</span>
              }
            </button>
          );
        })}
      </div>
    </div>
  );

  if (mode === 'ingredients') return (
    <div>
      <p className="filter-hint">
        Add ingredients one by one and press <strong>+ Add</strong> (or Enter):
      </p>
      <div className="ingredient-input-row">
        <input
          type="text"
          value={ingredientInput}
          onChange={(e) => onIngredientInputChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onAddIngredient(); }}
          placeholder="e.g. chocolate, butter, eggs..."
          className="ingredient-input"
        />
        <button
          onClick={onAddIngredient}
          disabled={!ingredientInput.trim()}
          className={`add-btn ${ingredientInput.trim() ? 'active' : ''}`}
        >
          + Add
        </button>
      </div>

      {ingredientList.length > 0 && (
        <div className="ingredient-tags">
          {ingredientList.map((ing) => (
            <span key={ing} className="ingredient-tag">
              🧂 {ing}
              <button onClick={() => onRemoveIngredient(ing)}>×</button>
            </span>
          ))}
          <button className="clear-btn" onClick={onClearIngredients}>Clear all</button>
        </div>
      )}
    </div>
  );

  return null;
}
