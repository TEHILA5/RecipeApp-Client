// ===============================================
// useRecipeDetail - Custom hook for recipe detail
// ===============================================
import { useParams, useNavigate } from 'react-router-dom';
import { useGetRecipeByIdQuery, recipesApi } from '../redux/recipeSlice';
import { useAppDispatch } from '../../../redux/hooks';

export function useRecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: recipe, isLoading, error, refetch } = useGetRecipeByIdQuery(
    Number(id),
    { skip: !id }
  );

  // ✅ אחרי תגובה - מבטל cache ומרענן דירוג
  const handleCommentAdded = () => {
    dispatch(recipesApi.util.invalidateTags([
      'Recipes',
      { type: 'Recipe', id: Number(id) },
    ]));
    refetch();
  };

  return { id: Number(id), recipe, isLoading, error, handleCommentAdded, navigate };
}