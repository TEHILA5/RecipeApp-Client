// ===============================================
// RecipeDetailPage - Page wrapper
// ===============================================
import { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchRecipeById, clearCurrentRecipe } from '../redux/recipeSlice';
import RecipeDetail from '../components/RecipeDetail';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { currentRecipe, loading, error } = useAppSelector((state) => state.recipes);

  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(Number(id)));
    }
    return () => {
      dispatch(clearCurrentRecipe());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Nunito',sans-serif", color: '#9ca3af',
      }}>
        <div style={{
          width: '50px', height: '50px', border: '4px solid #fce7f3',
          borderTopColor: '#d4547a', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite', marginBottom: '16px',
        }} />
        <p>Loading recipe...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Nunito',sans-serif", padding: '40px 20px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontFamily: "'Dancing Script',cursive", fontSize: '2rem', color: '#d4547a', marginBottom: '12px' }}>
          Recipe Not Found
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>{error}</p>
        <button
          onClick={() => navigate('/recipes')}
          style={{
            padding: '12px 32px', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #e8799a, #d4547a)',
            color: 'white', fontFamily: "'Nunito',sans-serif",
            fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
          }}
        >
          ← Back to Recipes
        </button>
      </div>
    );
  }

  if (!currentRecipe) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--soft-pink, #fdf2f8)', paddingTop: 'var(--nav-height, 70px)' }}>
      {/* Breadcrumb */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px 24px 0' }}>
        <nav style={{ fontSize: '0.85rem', color: '#9ca3af', fontFamily: "'Nunito',sans-serif" }}>
          <Link to="/" style={{ color: '#d4547a', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link to="/recipes" style={{ color: '#d4547a', textDecoration: 'none', fontWeight: 600 }}>Recipes</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span>{currentRecipe.name}</span>
        </nav>
      </div>

      <RecipeDetail recipe={currentRecipe} />
    </div>
  );
}
