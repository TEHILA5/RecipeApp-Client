// ===============================================
// RecipeModeration - טבלת מתכונים לניהול
// ===============================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery, useDeleteRecipeMutation } from '../../recipe/redux/recipeSlice';
import { CATEGORY_EMOJIS } from '../../recipe/types/recipe.types';

export default function RecipeModeration() {
  const { data: recipes = [], isLoading } = useGetRecipesQuery();
  const [deleteRecipe, { isLoading: deleting }] = useDeleteRecipeMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    setDeletingId(id);
    try { await deleteRecipe(id).unwrap(); }
    finally { setDeletingId(null); }
  };

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: 'white', borderRadius: '20px', boxShadow: '0 4px 20px rgba(212,84,122,0.07)', overflow: 'hidden' }}>
      <div style={{ padding: '20px 24px', borderBottom: '1px solid #fce7f3', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a' }}>
          All Recipes ({recipes.length})
        </h3>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div style={{ position: 'relative' }}>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recipes..."
              style={{ padding: '9px 36px 9px 14px', border: '2px solid #fce7f3', borderRadius: '999px', fontFamily: "'Nunito',sans-serif", fontSize: '0.85rem', outline: 'none', width: '220px' }} />
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
          </div>
          <Link to="/recipes/create" style={{ padding: '9px 20px', borderRadius: '999px', textDecoration: 'none', background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            ➕ Add Recipe
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
          <div style={{ width: '36px', height: '36px', border: '3px solid #fce7f3', borderTopColor: '#d4547a', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#fdf2f8' }}>
                {['Recipe', 'Category', 'Rating', 'Time', 'Actions'].map((h) => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((recipe, idx) => {
                const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
                const isDeleting = deletingId === recipe.id && deleting;
                return (
                  <tr key={recipe.id} style={{ borderTop: '1px solid #fce7f3', background: idx % 2 === 0 ? 'white' : '#fffbfd', opacity: isDeleting ? 0.5 : 1 }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden', background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          {recipe.arrImage ? <img src={recipe.arrImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.2rem' }}>{emoji}</span>}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9rem' }}>{recipe.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {recipe.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, background: '#fce7f3', color: '#d4547a' }}>{emoji} {recipe.category}</span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>⭐ {recipe.averageRating?.toFixed(1) ?? '—'}</td>
                    <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#6b7280' }}>⏱️ {recipe.totalTime}m</td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to={`/recipes/${recipe.id}/edit`} style={{ padding: '6px 16px', borderRadius: '999px', border: '2px solid #fce7f3', background: 'white', color: '#d4547a', textDecoration: 'none', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem' }}>✏️ Edit</Link>
                        <button onClick={() => handleDelete(recipe.id)} disabled={isDeleting}
                          style={{ padding: '6px 16px', borderRadius: '999px', border: 'none', background: '#fee2e2', color: '#991b1b', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem', cursor: isDeleting ? 'not-allowed' : 'pointer' }}>
                          {isDeleting ? '...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>No recipes match your search</div>}
        </div>
      )}
    </div>
  );
}
