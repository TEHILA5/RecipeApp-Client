// ===============================================
// RecipeEditPage - עריכת מתכון קיים
// ===============================================
import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { fetchRecipeById, updateExistingRecipe, clearCurrentRecipe } from '../redux/recipeSlice';
import RecipeForm from '../components/RecipeForm';
import type { RecipeCreateDto, RecipeUpdateDto } from '../types/recipe.types';

export default function RecipeEditPage() {
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

  const handleSubmit = async (data: RecipeCreateDto | RecipeUpdateDto) => {
    if (!id) return;
    try {
      await dispatch(updateExistingRecipe({ id: Number(id), data: data as RecipeUpdateDto })).unwrap();
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error('Failed to update recipe:', err);
    }
  };

  if (loading && !currentRecipe) {
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

  if (error || !currentRecipe) {
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
        <button
          onClick={() => navigate('/recipes')}
          style={{
            padding: '12px 32px', borderRadius: '999px', border: 'none',
            background: 'linear-gradient(135deg, #e8799a, #d4547a)',
            color: 'white', fontFamily: "'Nunito',sans-serif",
            fontWeight: 700, cursor: 'pointer',
          }}
        >
          ← Back to Recipes
        </button>
      </div>
    );
  }

  // Map currentRecipe to form initial data
  const initialData = {
    name: currentRecipe.name,
    description: currentRecipe.description,
    category: currentRecipe.category,
    instructions: currentRecipe.instructions,
    arrImage: currentRecipe.arrImage ?? '',
    servings: currentRecipe.servings,
    level: currentRecipe.level,
    prepTime: currentRecipe.prepTime,
    totalTime: currentRecipe.totalTime,
    ingredients: currentRecipe.ingredients?.map((ing) => ({
      ingredientId: ing.ingredientId,
      ingredientName: ing.ingredientName ?? '',
      quantity: Number(ing.quantity),
      unit: ing.unit,
      importance: (ing.importance ?? 'Essential') as 'Essential' | 'Recommended' | 'Optional',
    })) ?? [],
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--soft-pink, #fdf2f8)',
      paddingTop: 'var(--nav-height, 70px)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(232,121,154,0.08), rgba(232,196,154,0.08))',
        borderBottom: '2px solid rgba(232,121,154,0.1)',
        padding: '40px 24px',
        marginBottom: '8px',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          {/* Breadcrumb */}
          <nav style={{ fontSize: '0.85rem', color: '#9ca3af', fontFamily: "'Nunito',sans-serif", marginBottom: '12px' }}>
            <Link to="/recipes" style={{ color: '#d4547a', textDecoration: 'none', fontWeight: 600 }}>Recipes</Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <Link to={`/recipes/${id}`} style={{ color: '#d4547a', textDecoration: 'none', fontWeight: 600 }}>
              {currentRecipe.name}
            </Link>
            <span style={{ margin: '0 8px' }}>›</span>
            <span>Edit</span>
          </nav>

          <h1 style={{
            fontFamily: "'Dancing Script',cursive",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#1f2937', margin: '0 0 8px', lineHeight: 1.1,
          }}>
            Edit <span style={{ color: '#d4547a' }}>{currentRecipe.name}</span> ✏️
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontFamily: "'Nunito',sans-serif" }}>
            Make changes and save your recipe
          </p>
        </div>
      </div>

      <RecipeForm
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Save Changes"
      />
    </div>
  );
}
