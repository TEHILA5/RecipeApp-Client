// ===============================================
// IngredientListPage - Public ingredient browser
// ===============================================
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchAllIngredients } from '../redux/ingredientSlice';
import IngredientSearch from '../components/IngredientSearch';

export default function IngredientListPage() {
  const dispatch = useAppDispatch();
  const { ingredients, loading, error } = useAppSelector((state) => state.ingredients);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (ingredients.length === 0) dispatch(fetchAllIngredients());
  }, [dispatch, ingredients.length]);

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{
      minHeight: '100vh', background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)',
      fontFamily: "'Nunito', sans-serif",
    }}>
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        padding: '48px 64px 36px',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{
            fontFamily: "'Dancing Script', cursive",
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            color: '#1f2937', marginBottom: '8px',
          }}>
            Our <span style={{ color: '#d4547a' }}>Ingredients</span>
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '0.95rem', fontWeight: 500 }}>
            Browse all {ingredients.length} ingredients in our recipes
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          background: 'white', borderRadius: '20px', padding: '24px',
          boxShadow: '0 4px 20px rgba(212,84,122,0.07)', marginBottom: '20px',
        }}>
          <IngredientSearch
            value={search}
            onChange={setSearch}
            total={ingredients.length}
            filtered={filtered.length}
          />
        </div>

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

        {error && (
          <div style={{ padding: '16px', background: '#fee2e2', borderRadius: '12px', color: '#991b1b' }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '12px',
          }}>
            {filtered.sort((a, b) => a.name.localeCompare(b.name)).map((ing) => (
              <div key={ing.id} style={{
                padding: '14px 18px', borderRadius: '14px',
                background: 'white', border: '1px solid #fce7f3',
                display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 2px 8px rgba(212,84,122,0.05)',
              }}>
                <span style={{ fontSize: '1.1rem' }}>🧂</span>
                <span style={{ fontWeight: 600, color: '#1f2937', fontSize: '0.9rem' }}>{ing.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
