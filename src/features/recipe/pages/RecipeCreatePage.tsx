// ===============================================
// RecipeCreatePage - יצירת מתכון חדש
// ===============================================
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { createNewRecipe } from '../redux/recipeSlice';
import RecipeForm from '../components/RecipeForm';
import type { RecipeCreateDto } from '../types/recipe.types';

export default function RecipeCreatePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.recipes);

  const handleSubmit = async (data: RecipeCreateDto) => {
    try {
      const result = await dispatch(createNewRecipe(data)).unwrap();
      navigate(`/recipes/${result.id}`);
    } catch (error) {
      console.error('Failed to create recipe:', error);
    }
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
          <h1 style={{
            fontFamily: "'Dancing Script',cursive",
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            color: '#1f2937', margin: '0 0 8px', lineHeight: 1.1,
          }}>
            Create a New <span style={{ color: '#d4547a' }}>Recipe</span> ✨
          </h1>
          <p style={{ color: '#6b7280', margin: 0, fontFamily: "'Nunito',sans-serif" }}>
            Share your delicious creation with the Sweet&Treat community
          </p>
        </div>
      </div>

      <RecipeForm
        onSubmit={handleSubmit as (data: RecipeCreateDto | import('../types/recipe.types').RecipeUpdateDto) => Promise<void>}
        loading={loading}
        submitLabel="Create Recipe"
      />
    </div>
  );
}
