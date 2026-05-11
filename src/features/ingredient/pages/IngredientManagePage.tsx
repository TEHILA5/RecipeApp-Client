import { useState } from 'react';
import {
  useGetAllIngredientsQuery,
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
} from '../../../api/ingredientApi';
import IngredientCard from '../components/IngredientCard';
import IngredientForm from '../components/IngredientForm';
import './IngredientManagePage.css';

export default function IngredientManagePage() {
  const { data: ingredients = [], isLoading } = useGetAllIngredientsQuery();
  const [createIngredient, { isLoading: creating, error: createError }] = useCreateIngredientMutation();
  const [updateIngredient] = useUpdateIngredientMutation();

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (name: string) => {
    await createIngredient({ name }).unwrap();
    setShowAddForm(false);
  };

  const handleUpdate = async (id: number, name: string) => {
    await updateIngredient({ id, data: { name } }).unwrap();
  };

  return (
    <div className="ingredient-page">
      <div className="ingredient-header">
        <div className="ingredient-header-inner">
          <div className="header-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
            <img src="/src/assets/icons/nav-admin.png" alt="" style={{ width: '40px', height: '40px', objectFit: 'contain', verticalAlign: 'middle' }} />
            {' '}Admin → Ingredients</div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '4px', }}> Manage 
            <span>Ingredients</span> 
            <img src="/src/assets/icons/calc-spoon.png" alt="Ingredient" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            </h1>
          <p>{ingredients.length} ingredients in the system</p>
        </div>
      </div>

      <div className="ingredient-body">
        <div className="search-bar">
          <div className="search-input-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredients..."
            />
            <span>
              <img src="/src/assets/icons/search-icon.png" alt="Search" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            </span>
          </div>
          <button
            className={`add-btn ${showAddForm ? 'cancel' : ''}`}
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ?
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
            <img src="/src/assets/icons/cancel-x.png" alt="" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }} />
            {' '}Cancel </div>
             :
             <div style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
            <img src="/src/assets/icons/action-add.png" alt="" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }} />
            {' '}Add Ingredient</div>
            }
          </button>
        </div>

        {showAddForm && (
          <div className="add-form-card">
            <p className="add-form-title">
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
            <img src="/src/assets/icons/action-new.png" alt="" style={{ width: '30px', height: '30px', objectFit: 'contain', verticalAlign: 'middle' }} />
            {' '}New Ingredient</div>
            </p>
            {createError && <div className="save-error">Failed to create ingredient</div>}
            <IngredientForm
              onSave={handleCreate}
              onCancel={() => setShowAddForm(false)}
              saving={creating}
              placeholder="Enter ingredient name..."
            />
          </div>
        )}

        {isLoading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
          </div>
        ) : (
          <>
            <div className="results-count">
              Showing {filtered.length} of {ingredients.length} ingredients
            </div>

            <div className="ingredient-list">
              {[...filtered]
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((ing) => (
                  <IngredientCard key={ing.id} id={ing.id} name={ing.name} onUpdate={handleUpdate} />
                ))}
            </div>

            {filtered.length === 0 && (
              <div className="empty-state">
                <div><img src="/src/assets/icons/calc-spoon.png" alt="No ingredients" style={{ width: '20px', height: '20px', objectFit: 'contain' }} /></div>
                <p>No ingredients match your search</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
