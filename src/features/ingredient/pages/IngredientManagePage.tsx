// ===============================================
// IngredientManagePage - Admin ingredient management
// (משתמש ב-createAsyncThunk - זה תקין, לא צריך שינוי)
// ===============================================
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
  fetchAllIngredients,
  createNewIngredient,
  updateExistingIngredient,
} from '../redux/ingredientSlice';
import IngredientCard from '../components/IngredientCard';
import IngredientForm from '../components/IngredientForm';

export default function IngredientManagePage() {
  const dispatch = useAppDispatch();
  const { ingredients, loading, error, saving, saveError } = useAppSelector((s) => s.ingredients);

  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (ingredients.length === 0) dispatch(fetchAllIngredients());
  }, [dispatch, ingredients.length]);

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async (name: string) => {
    await dispatch(createNewIngredient(name)).unwrap();
    setShowAddForm(false);
  };

  const handleUpdate = async (id: number, name: string) => {
    await dispatch(updateExistingIngredient({ id, name })).unwrap();
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        padding: '48px 24px 36px',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d4547a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
            🛠️ Admin → Ingredients
          </div>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            color: '#1f2937', marginBottom: '8px',
          }}>
            Manage <span style={{ color: '#d4547a' }}>Ingredients</span> 🧂
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>
            {ingredients.length} ingredients in the system
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Search + Add Bar */}
        <div style={{
          background: 'white', borderRadius: '20px', padding: '20px 24px',
          boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '20px',
          display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search ingredients..."
              style={{
                width: '100%', padding: '10px 40px 10px 16px',
                border: '2px solid #fce7f3', borderRadius: '999px',
                fontFamily: "'Nunito',sans-serif", fontSize: '0.9rem',
                background: 'white', outline: 'none', boxSizing: 'border-box',
              }}
            />
            <span style={{
              position: 'absolute', right: '14px', top: '50%',
              transform: 'translateY(-50%)', pointerEvents: 'none', fontSize: '0.9rem',
            }}>🔍</span>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              padding: '10px 24px', borderRadius: '999px', border: 'none',
              background: showAddForm ? '#e5e7eb' : 'linear-gradient(135deg, #e8799a, #d4547a)',
              color: showAddForm ? '#6b7280' : 'white',
              fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem',
              cursor: 'pointer', whiteSpace: 'nowrap',
              boxShadow: showAddForm ? 'none' : '0 4px 12px rgba(212,84,122,0.3)',
            }}
          >
            {showAddForm ? '✕ Cancel' : '➕ Add Ingredient'}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <div style={{
            background: 'white', borderRadius: '16px', padding: '20px 24px',
            boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '16px',
            border: '2px solid #e8799a',
          }}>
            <p style={{ fontWeight: 700, color: '#d4547a', marginBottom: '14px', fontSize: '0.9rem' }}>
              🆕 New Ingredient
            </p>
            {saveError && (
              <div style={{
                padding: '10px 16px', background: '#fee2e2', borderRadius: '10px',
                color: '#991b1b', fontSize: '0.82rem', marginBottom: '12px',
              }}>
                ⚠️ {saveError}
              </div>
            )}
            <IngredientForm
              onSave={handleCreate}
              onCancel={() => setShowAddForm(false)}
              saving={saving}
              placeholder="Enter ingredient name..."
            />
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{
            padding: '14px 20px', background: '#fee2e2', borderRadius: '14px',
            color: '#991b1b', marginBottom: '16px',
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
            <div style={{
              width: '40px', height: '40px', border: '3px solid #fce7f3',
              borderTopColor: '#d4547a', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {/* Ingredients List */}
        {!loading && (
          <>
            <div style={{
              fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600, marginBottom: '12px',
            }}>
              Showing {filtered.length} of {ingredients.length} ingredients
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {filtered
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((ing) => (
                  <IngredientCard
                    key={ing.id}
                    id={ing.id}
                    name={ing.name}
                    onUpdate={handleUpdate}
                  />
                ))}
            </div>

            {filtered.length === 0 && !loading && (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧂</div>
                <p>No ingredients match your search</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
