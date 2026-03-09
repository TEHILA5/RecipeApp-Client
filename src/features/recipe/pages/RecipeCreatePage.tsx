// ===============================================
// RecipeCreatePage - יצירת מתכון חדש
// ===============================================
import { useNavigate } from 'react-router-dom';
import { useCreateRecipeMutation } from '../redux/recipeSlice';
import RecipeForm from '../components/RecipeForm';
import type { RecipeCreateDto, RecipeUpdateDto } from '../types/recipe.types';

export default function RecipeCreatePage() {
  const navigate = useNavigate();

  // RTK Query - mutation ליצירה
  const [createRecipe, { isLoading: loading }] = useCreateRecipeMutation();

  const handleSubmit = async (data: RecipeCreateDto | RecipeUpdateDto) => {
    try {
      const result = await createRecipe(data as RecipeCreateDto).unwrap();
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
        onSubmit={handleSubmit}
        loading={loading}
        submitLabel="Create Recipe"
      />
    </div>
  );
}
