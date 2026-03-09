// ===============================================
// MyFavorites - Saved recipes component
// ===============================================
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { getMySavedRecipes, removeBookmark } from '../../../api/userActionApi';
import { CATEGORY_EMOJIS, LEVEL_LABELS } from '../../recipe/types/recipe.types';
import type { UserActionDto } from '../../recipe/types/userAction.types';
import StarRating from '../../../shared/components/StarRating';

export default function MyFavorites() {
  // ✅ RTK Query - מחליף את dispatch(fetchAllRecipes())
  // רק קוראים את הקאש - לא עושים dispatch ידני
  const { data: recipes = [] } = useGetRecipesQuery();

  const [saved, setSaved] = useState<UserActionDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => {
    getMySavedRecipes()
      .then((data) => setSaved(data))
      .catch(() => setError('Failed to load saved recipes'))
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (recipeId: number) => {
    setRemovingId(recipeId);
    try {
      await removeBookmark(recipeId);
      setSaved((prev) => prev.filter((s) => s.recipeId !== recipeId));
    } catch {
      setError('Failed to remove recipe');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#9ca3af' }}>
        <div style={{
          width: 40, height: 40, border: '3px solid #fce7f3',
          borderTopColor: '#d4547a', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', margin: '0 auto 12px',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) return (
    <div style={{ padding: '20px', background: '#fee2e2', borderRadius: '12px', color: '#991b1b', textAlign: 'center' }}>
      ⚠️ {error}
    </div>
  );

  if (saved.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔖</div>
      <h3 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '1.8rem', color: '#d4547a', marginBottom: '8px' }}>
        No saved recipes yet
      </h3>
      <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
        Browse recipes and tap the bookmark to save your favorites!
      </p>
      <Link to="/recipes" style={{
        padding: '12px 28px', borderRadius: '999px',
        background: 'linear-gradient(135deg, #e8799a, #d4547a)',
        color: 'white', textDecoration: 'none',
        fontFamily: "'Nunito',sans-serif", fontWeight: 700,
      }}>
        Browse Recipes →
      </Link>
    </div>
  );

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    }}>
      {saved.map((item) => {
        // ✅ שולף פרטים מהקאש של RTK Query - לא צריך dispatch
        const fullRecipe = recipes.find((r) => r.id === item.recipeId);
        const emoji = CATEGORY_EMOJIS[fullRecipe?.category as keyof typeof CATEGORY_EMOJIS] ?? '🍰';
        const levelLabel = LEVEL_LABELS[fullRecipe?.level as 1 | 2 | 3] ?? 'Easy';
        const removing = removingId === item.recipeId;

        return (
          <div key={item.id} style={{
            background: 'white', borderRadius: '20px', overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(212,84,122,0.08)',
            opacity: removing ? 0.5 : 1, transition: 'all 0.3s',
          }}>
            <Link to={`/recipes/${item.recipeId}`} style={{ textDecoration: 'none', display: 'block' }}>
              {/* Image */}
              <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
                {fullRecipe?.arrImage || item.recipeImageUrl ? (
                  <img
                    src={fullRecipe?.arrImage || item.recipeImageUrl}
                    alt={item.recipeName}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      (img.nextElementSibling as HTMLElement)?.style.setProperty('display', 'flex');
                    }}
                  />
                ) : null}
                <div style={{
                  width: '100%', height: '100%',
                  background: 'linear-gradient(135deg, #f9e4ec, #e8c49a)',
                  display: fullRecipe?.arrImage || item.recipeImageUrl ? 'none' : 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '64px',
                }}>
                  {emoji}
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: '16px 18px 10px' }}>
                <div style={{ marginBottom: '8px' }}>
                  <StarRating
                    rating={fullRecipe?.averageRating}
                    showCount={fullRecipe?.commentCount}
                  />
                </div>
                <h3 style={{
                  fontFamily: "'Dancing Script',cursive", fontSize: '1.3rem',
                  color: '#1f2937', marginBottom: '6px', lineHeight: 1.2,
                }}>
                  {item.recipeName}
                </h3>
                {fullRecipe?.description && (
                  <p style={{ fontSize: '0.82rem', color: '#9ca3af', lineHeight: 1.5, marginBottom: '10px' }}>
                    {fullRecipe.description.length > 80
                      ? `${fullRecipe.description.substring(0, 80)}...`
                      : fullRecipe.description}
                  </p>
                )}
                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#6b7280', fontWeight: 600 }}>
                  {fullRecipe?.totalTime && <span>⏱️ {fullRecipe.totalTime} min</span>}
                  {fullRecipe?.level && <span>👨‍🍳 {levelLabel}</span>}
                  {fullRecipe?.servings && <span>🍽️ {fullRecipe.servings}</span>}
                </div>
              </div>
            </Link>

            {/* Remove button */}
            <div style={{ padding: '0 18px 16px' }}>
              <button
                onClick={() => handleRemove(item.recipeId!)}
                disabled={removing}
                style={{
                  width: '100%', padding: '9px', borderRadius: '999px',
                  border: '2px solid #fce7f3', background: 'white',
                  color: '#d4547a', fontFamily: "'Nunito',sans-serif",
                  fontWeight: 700, fontSize: '0.82rem',
                  cursor: removing ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { if (!removing) (e.currentTarget as HTMLButtonElement).style.background = '#fee2e2'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'white'; }}
              >
                {removing ? 'Removing...' : '🔖 Remove from Saved'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
