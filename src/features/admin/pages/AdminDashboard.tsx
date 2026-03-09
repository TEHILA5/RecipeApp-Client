// ===============================================
// AdminDashboard - עם RTK Query
// ===============================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery, useDeleteRecipeMutation } from '../../recipe/redux/recipeSlice';
import { useAppSelector } from '../../../redux/hooks';
import { CATEGORY_EMOJIS } from '../../recipe/types/recipe.types';

export default function AdminDashboard() {
  const { user } = useAppSelector((s) => s.auth);

  // ✅ RTK Query - מחליף את dispatch(fetchAllRecipes())
  const { data: recipes = [], isLoading: loadingRecipes } = useGetRecipesQuery();
  const [deleteRecipe, { isLoading: deleting }] = useDeleteRecipeMutation();

  const [activeTab, setActiveTab] = useState<'overview' | 'recipes' | 'ingredients'>('overview');
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [recipeSearch, setRecipeSearch] = useState('');

  const handleDeleteRecipe = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    setDeletingId(id);
    try {
      await deleteRecipe(id).unwrap();
    } finally {
      setDeletingId(null);
    }
  };

  const filteredRecipes = recipes.filter((r) =>
    r.name.toLowerCase().includes(recipeSearch.toLowerCase()) ||
    r.category.toLowerCase().includes(recipeSearch.toLowerCase())
  );

  // Stats מהקאש
  const stats = {
    totalRecipes: recipes.length,
    topCategory: recipes.length > 0
      ? Object.entries(
          recipes.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] ?? 0) + 1;
            return acc;
          }, {} as Record<string, number>)
        ).sort(([, a], [, b]) => b - a)[0]?.[0] ?? '—'
      : '—',
    avgRating: recipes.length > 0
      ? (recipes.reduce((sum, r) => sum + (r.averageRating || 0), 0) / recipes.length).toFixed(1)
      : '—',
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#fdf2f8',
      paddingTop: 'var(--nav-height, 70px)',
      fontFamily: "'Nunito', sans-serif",
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #4a2c3a, #6b3d52)',
        padding: '48px 24px 0',
        color: 'white',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '8px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', opacity: 0.7 }}>
            🛠️ Admin Panel
          </div>
          <h1 style={{
            fontFamily: "'Dancing Script',cursive",
            fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
            marginBottom: '8px', color: 'white',
          }}>
            Welcome back, <span style={{ color: '#e8799a' }}>{user?.name}</span>! 👑
          </h1>
          <p style={{ opacity: 0.7, fontSize: '0.95rem', marginBottom: '28px' }}>
            Manage your Sweet&Treat platform
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {([
              { key: 'overview', label: '📊 Overview' },
              { key: 'recipes', label: '🍰 Recipes' },
              { key: 'ingredients', label: '🧂 Ingredients' },
            ] as { key: typeof activeTab; label: string }[]).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                style={{
                  padding: '12px 24px', borderRadius: '12px 12px 0 0', border: 'none',
                  cursor: 'pointer', fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.88rem',
                  background: activeTab === key ? 'white' : 'rgba(255,255,255,0.1)',
                  color: activeTab === key ? '#d4547a' : 'rgba(255,255,255,0.7)',
                  borderBottom: activeTab === key ? '2px solid white' : '2px solid transparent',
                  marginBottom: '-2px', transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { label: 'Total Recipes', value: stats.totalRecipes, emoji: '🍰', color: '#d4547a' },
                { label: 'Top Category', value: stats.topCategory, emoji: '🏆', color: '#c4894a' },
                { label: 'Avg Rating', value: stats.avgRating, emoji: '⭐', color: '#f59e0b' },
              ].map(({ label, value, emoji, color }) => (
                <div key={label} style={{
                  padding: '24px', borderRadius: '20px',
                  background: 'white', boxShadow: '0 4px 20px rgba(212,84,122,0.07)',
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '12px' }}>{emoji}</div>
                  <div style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', fontWeight: 700, color }}>
                    {value}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#9ca3af', fontWeight: 600, marginTop: '4px' }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div style={{
              background: 'white', borderRadius: '20px', padding: '28px',
              boxShadow: '0 4px 20px rgba(212,84,122,0.07)',
            }}>
              <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a', marginBottom: '20px' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                <Link to="/recipes/create" style={{
                  padding: '12px 24px', borderRadius: '999px', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white',
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.9rem',
                  boxShadow: '0 4px 12px rgba(212,84,122,0.3)',
                }}>
                  ➕ Add New Recipe
                </Link>
                <button
                  onClick={() => setActiveTab('ingredients')}
                  style={{
                    padding: '12px 24px', borderRadius: '999px',
                    border: '2px solid #fce7f3', background: 'white',
                    color: '#d4547a', fontFamily: "'Nunito',sans-serif",
                    fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                  }}
                >
                  🧂 Manage Ingredients
                </button>
                <button
                  onClick={() => setActiveTab('recipes')}
                  style={{
                    padding: '12px 24px', borderRadius: '999px',
                    border: '2px solid #fce7f3', background: 'white',
                    color: '#d4547a', fontFamily: "'Nunito',sans-serif",
                    fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem',
                  }}
                >
                  🍰 View All Recipes
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Recipes Tab ── */}
        {activeTab === 'recipes' && (
          <div style={{
            background: 'white', borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(212,84,122,0.07)', overflow: 'hidden',
          }}>
            {/* Table Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid #fce7f3',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px',
            }}>
              <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a' }}>
                All Recipes ({recipes.length})
              </h3>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={recipeSearch}
                    onChange={(e) => setRecipeSearch(e.target.value)}
                    placeholder="Search recipes..."
                    style={{
                      padding: '9px 36px 9px 14px', border: '2px solid #fce7f3',
                      borderRadius: '999px', fontFamily: "'Nunito',sans-serif",
                      fontSize: '0.85rem', outline: 'none', width: '220px',
                    }}
                  />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>🔍</span>
                </div>
                <Link to="/recipes/create" style={{
                  padding: '9px 20px', borderRadius: '999px', textDecoration: 'none',
                  background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white',
                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                }}>
                  ➕ Add Recipe
                </Link>
              </div>
            </div>

            {/* Table */}
            {loadingRecipes ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
                <div style={{
                  width: '36px', height: '36px', border: '3px solid #fce7f3',
                  borderTopColor: '#d4547a', borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
                }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#fdf2f8' }}>
                      {['Recipe', 'Category', 'Rating', 'Time', 'Actions'].map((h) => (
                        <th key={h} style={{
                          padding: '12px 16px', textAlign: 'left',
                          fontSize: '0.78rem', fontWeight: 700, color: '#9ca3af',
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecipes.map((recipe, idx) => {
                      const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
                      const isDeleting = deletingId === recipe.id && deleting;
                      return (
                        <tr
                          key={recipe.id}
                          style={{
                            borderTop: '1px solid #fce7f3',
                            background: idx % 2 === 0 ? 'white' : '#fffbfd',
                            opacity: isDeleting ? 0.5 : 1, transition: 'opacity 0.2s',
                          }}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{
                                width: '40px', height: '40px', borderRadius: '10px', overflow: 'hidden',
                                background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              }}>
                                {recipe.arrImage
                                  ? <img src={recipe.arrImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                  : <span style={{ fontSize: '1.2rem' }}>{emoji}</span>
                                }
                              </div>
                              <div>
                                <div style={{ fontWeight: 700, color: '#1f2937', fontSize: '0.9rem' }}>{recipe.name}</div>
                                <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>ID: {recipe.id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{
                              padding: '4px 12px', borderRadius: '999px', fontSize: '0.78rem',
                              fontWeight: 700, background: '#fce7f3', color: '#d4547a',
                            }}>
                              {emoji} {recipe.category}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#f59e0b', fontWeight: 700 }}>
                            ⭐ {recipe.averageRating?.toFixed(1) ?? '—'}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: '0.85rem', color: '#6b7280' }}>
                            ⏱️ {recipe.totalTime}m
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <Link
                                to={`/recipes/${recipe.id}/edit`}
                                style={{
                                  padding: '6px 16px', borderRadius: '999px',
                                  border: '2px solid #fce7f3', background: 'white',
                                  color: '#d4547a', textDecoration: 'none',
                                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem',
                                }}
                              >
                                ✏️ Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteRecipe(recipe.id)}
                                disabled={isDeleting}
                                style={{
                                  padding: '6px 16px', borderRadius: '999px', border: 'none',
                                  background: '#fee2e2', color: '#991b1b',
                                  fontFamily: "'Nunito',sans-serif", fontWeight: 700, fontSize: '0.78rem',
                                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                                }}
                              >
                                {isDeleting ? '...' : '🗑️ Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {filteredRecipes.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                    No recipes match your search
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── Ingredients Tab ── */}
        {activeTab === 'ingredients' && (
          <div style={{
            background: 'white', borderRadius: '20px', padding: '32px',
            boxShadow: '0 4px 20px rgba(212,84,122,0.07)',
          }}>
            <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.5rem', color: '#d4547a', marginBottom: '16px' }}>
              Manage Ingredients 🧂
            </h3>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
              Add, edit, or remove ingredients from the system.
            </p>
            <Link
              to="/admin/ingredients"
              style={{
                display: 'inline-block', padding: '12px 28px', borderRadius: '999px',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #e8799a, #d4547a)', color: 'white',
                fontFamily: "'Nunito',sans-serif", fontWeight: 700,
                boxShadow: '0 4px 12px rgba(212,84,122,0.3)',
              }}
            >
              🧂 Go to Ingredients Manager
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
