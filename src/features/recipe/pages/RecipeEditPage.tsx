import { useParams, useNavigate, Link } from 'react-router-dom';
import { useGetRecipeByIdQuery, useUpdateRecipeMutation } from '../redux/recipeSlice';
import RecipeForm from '../components/RecipeForm';
import type { RecipeCreateDto, RecipeUpdateDto } from '../types/recipe.types';
import pageIcon from '../../../assets/icons/state-confused.png';
import editIcon from '../../../assets/icons/profile-edit.png';
import './RecipeEditPage.css';

export default function RecipeEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: recipe, isLoading, error } = useGetRecipeByIdQuery(Number(id), { skip: !id });
  const [updateRecipe, { isLoading: saving }] = useUpdateRecipeMutation();

  const handleSubmit = async (data: RecipeCreateDto | RecipeUpdateDto) => {
    if (!id) return;
    try {
      await updateRecipe({ id: Number(id), data: data as RecipeUpdateDto }).unwrap();
      navigate(`/recipes/${id}`);
    } catch (err) {
      console.error('Failed to update recipe:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="recipe-edit-state">
        <div className="spinner" />
        <p>Loading recipe...</p>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="recipe-edit-state">
        <img src={pageIcon} alt="Not found" className="state-emoji" />
        <h2>Recipe Not Found</h2>
        <button className="back-btn" onClick={() => navigate('/recipes')}>← Back to Recipes</button>
      </div>
    );
  }

  const initialData = {
    name: recipe.name,
    description: recipe.description,
    tags: recipe.tags ?? [],
    category: recipe.category,
    instructions: recipe.instructions,
    arrImage: recipe.arrImage ?? '',
    servings: recipe.servings,
    level: recipe.level,
    prepTime: recipe.prepTime,
    totalTime: recipe.totalTime,
    ingredients: recipe.ingredients?.map((ing) => ({
      ingredientId: ing.ingredientId,
      ingredientName: ing.ingredientName ?? '',
      quantity: Number(ing.quantity),
      unit: ing.unit,
      importance: (ing.importance ?? 'Essential') as 'Essential' | 'Recommended' | 'Optional',
    })) ?? [],
  };

  return (
    <div className="recipe-edit-page">
      <div className="recipe-edit-header">
        <div className="recipe-edit-header-inner">
          <nav className="breadcrumb">
            <Link to="/recipes">Recipes</Link>
            <span>›</span>
            <Link to={`/recipes/${id}`}>{recipe.name}</Link>
            <span>›</span>
            <span>Edit</span>
          </nav>
          <h1>
            Edit <span>{recipe.name}</span>
            <img src={editIcon} alt="Edit" className="recipe-edit-header-icon" />
          </h1>
          <p>Make changes and save your recipe</p>
        </div>
      </div>

      <RecipeForm
        key={recipe.id}
        initialData={initialData}
        onSubmit={handleSubmit}
        loading={saving}
        submitLabel="Save Changes"
      />
    </div>
  );
}