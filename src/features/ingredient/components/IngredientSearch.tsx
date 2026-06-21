import './IngredientSearch.css';

interface IngredientSearchProps {
  value: string;
  onChange: (value: string) => void;
  total: number;
  filtered: number;
}

export default function IngredientSearch({ value, onChange, total, filtered }: IngredientSearchProps) {
  return (
    <div className="ingredient-search">
      <div className="search-input-wrap">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search ingredients..."
        />
        <span>
          <img src="/src/assets/icons/search-icon.png" alt="Search" className="icon-sm" />
        </span>
      </div>

      <span className="search-count">
        {value ? `${filtered} of ${total}` : `${total} ingredients`}
      </span>

      {value && (
        <button className="clear-btn" onClick={() => onChange('')}>
          ✕ Clear
        </button>
      )}
    </div>
  );
}