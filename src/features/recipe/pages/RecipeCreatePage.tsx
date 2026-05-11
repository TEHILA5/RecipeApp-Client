import { useNavigate } from 'react-router-dom';
import { useCreateRecipeMutation } from '../redux/recipeSlice';
import RecipeForm from '../components/RecipeForm';
import type { RecipeCreateDto, RecipeUpdateDto } from '../types/recipe.types';
import './RecipeCreatePage.css';

export default function RecipeCreatePage() {
  const navigate = useNavigate();
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
    <div className="recipe-create-page">
      <div className="recipe-create-header">
        <div className="recipe-create-header-inner">
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>Create a New <span>Recipe</span> 
          <img src="/src/assets/icons/ai-sparkle.png" alt="Sparkle" style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
          </h1>
          <p>Share your delicious creation with the Sweet&amp;Treat community</p>
        </div>
      </div>
      <RecipeForm onSubmit={handleSubmit} loading={loading} submitLabel="Create Recipe" />
    </div>
  );
}
