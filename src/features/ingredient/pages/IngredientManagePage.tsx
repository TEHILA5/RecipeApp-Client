// ===============================================
// IngredientManagePage - Admin ingredient management
// ===============================================
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  fetchAllIngredients,
  createNewIngredient,
  updateExistingIngredient,
} from '../redux/ingredientSlice';
import IngredientCard from '../components/IngredientCard';
import IngredientSearch from '../components/IngredientSearch';
import IngredientForm from '../components/IngredientForm';

export default function IngredientManagePage() {
  const dispatch = useAppDispatch();
  const { ingredients, loading, error, saving, saveError } = useAppSelector(
    (state) => state.ingredients
  );

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    dispatch(fetchAllIngredients());
  }, [dispatch]);

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleCreate = async (name: string) => {
    await dispatch(createNewIngredient(name)).unwrap();
    setShowAddForm(false);
    showSuccess(`✅ "${name}" added successfully!`);
  };

  const handleUpdate = async (id: number, name: string) => {
    await dispatch(updateExistingIngredient({ id, name })).unwrap();
    showSuccess(`✅ Ingredient updated successfully!`);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        padding: '48px 64px 36px',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#1f2937', marginBottom: '8px', lineHeight: 1.1,
          }}>
            Manage <span style={{ color: '#d4547a' }}>Ingredients</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>
            Add and edit ingredients used across all recipes
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Success message */}
        {successMsg && (
          <div style={{
            padding: '14px 20px', borderRadius: '12px',
            background: '#dcfce7', border: '1px solid #86efac',
            color: '#166534', fontWeight: 600, marginBottom: '20px',
            fontSize: '0.9rem',
          }}>
            {successMsg}
          </div>
        )}

        {/* Error message */}
        {(error || saveError) && (
          <div style={{
            padding: '14px 20px', borderRadius: '12px',
            background: '#fee2e2', border: '1px solid #fecaca',
            color: '#991b1b', fontWeight: 600, marginBottom: '20px',
            fontSize: '0.9rem',
          }}>
            ⚠️ {error || saveError}
          </div>
        )}

        {/* Toolbar */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '24px',
          boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '20px',
          display: 'flex', flexDirection: 'column', gap: '16px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <IngredientSearch
              value={search}
              onChange={setSearch}
              total={ingredients.length}
              filtered={filtered.length}
            />
            <button
              onClick={() => { setShowAddForm(true); setSearch(''); }}
              style={{
                padding: '12px 24px', borderRadius: '999px', border: 'none',
                background: 'linear-gradient(135deg, #e8799a, #d4547a)',
                color: 'white', fontFamily: "'Nunito',sans-serif",
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px',
                boxShadow: '0 4px 14px rgba(212,84,122,0.3)',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              ➕ Add Ingredient
            </button>
          </div>

          {/* Add form */}
          {showAddForm && (
            <div style={{
              padding: '16px 18px', borderRadius: '14px',
              background: '#fdf2f8', border: '2px solid #e8799a',
            }}>
              <p style={{ margin: '0 0 10px', fontWeight: 700, color: '#d4547a', fontSize: '0.85rem' }}>
                🧂 New Ingredient
              </p>
              <IngredientForm
                onSave={handleCreate}
                onCancel={() => setShowAddForm(false)}
                saving={saving}
                placeholder="e.g. Vanilla Extract"
              />
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid #fce7f3',
              borderTopColor: '#d4547a', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
            }} />
            Loading ingredients...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Ingredients list */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧂</div>
                <p style={{ fontWeight: 600 }}>
                  {search ? `No ingredients matching "${search}"` : 'No ingredients yet'}
                </p>
              </div>
            ) : (
              filtered
                .slice()
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((ingredient) => (
                  <IngredientCard
                    key={ingredient.id}
                    id={ingredient.id}
                    name={ingredient.name}
                    onUpdate={handleUpdate}
                  />
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
