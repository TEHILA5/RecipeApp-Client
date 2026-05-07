import { useState } from 'react';
import { useGetAllIngredientsQuery } from '../../../api/ingredientApi';
import IngredientSearch from '../components/IngredientSearch';
import './IngredientListPage.css';

export default function IngredientListPage() {
  const { data: ingredients = [], isLoading, error } = useGetAllIngredientsQuery();
  const [search, setSearch] = useState('');

  const filtered = [...ingredients]
    .filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="ilp-page">
      <div className="ilp-hero">
        <div className="ilp-hero-inner">
          <h1 className="ilp-title">Our <span>Ingredients</span></h1>
          <p className="ilp-subtitle">Browse all {ingredients.length} ingredients in our recipes</p>
        </div>
      </div>

      <div className="ilp-content">
        <div className="ilp-search-card">
          <IngredientSearch
            value={search}
            onChange={setSearch}
            total={ingredients.length}
            filtered={filtered.length}
          />
        </div>

        {isLoading && (
          <div className="ilp-loading">
            <div className="ilp-spinner" />
          </div>
        )}

        {error && <div className="ilp-error">⚠️ Failed to load ingredients</div>}

        {!isLoading && (
          <div className="ilp-grid">
            {filtered.map((ing) => (
              <div key={ing.id} className="ilp-item">
                <span className="ilp-item-icon">🧂</span>
                <span className="ilp-item-name">{ing.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
