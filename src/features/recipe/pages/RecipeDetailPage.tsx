// ===============================================
// RecipeDetailPage - Page wrapper
// ===============================================
import { Link } from 'react-router-dom';
import Loading from '../../../shared/components/UI/Loading';
import { useRecipeDetail } from '../hooks/useRecipeDetail';
import RecipeDetail from '../components/RecipeDetail';

export default function RecipeDetailPage() {
  const { recipe, isLoading, error, handleCommentAdded, navigate } = useRecipeDetail();

  if (isLoading) return <Loading message="Loading recipe..." size="lg" fullPage />;

  if (error || !recipe) {
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
        <button onClick={() => navigate('/recipes')} style={{
          padding: '12px 32px', borderRadius: '999px', border: 'none',
          background: 'linear-gradient(135deg, #e8799a, #d4547a)',
          color: 'white', fontFamily: "'Nunito',sans-serif", fontWeight: 700, cursor: 'pointer',
        }}>
          ← Back to Recipes
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--soft-pink, #fdf2f8)', paddingTop: 'var(--nav-height, 70px)' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '16px 24px 0' }}>
        <nav style={{ fontSize: '0.85rem', color: '#9ca3af', fontFamily: "'Nunito',sans-serif" }}>
          <Link to="/" style={{ color: '#d4547a', textDecoration: 'none', fontWeight: 600 }}>Home</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <Link to="/recipes" style={{ color: '#d4547a', textDecoration: 'none', fontWeight: 600 }}>Recipes</Link>
          <span style={{ margin: '0 8px' }}>›</span>
          <span>{recipe.name}</span>
        </nav>
      </div>
      <RecipeDetail recipe={recipe} onCommentAdded={handleCommentAdded} />
    </div>
  );
}
