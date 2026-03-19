import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { removeBookmark } from '../../../api/userActionApi';
import { CATEGORY_EMOJIS, LEVEL_LABELS } from '../../recipe/types/recipe.types';
import StarRating from '../../../shared/components/StarRating';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import Loading from '../../../shared/components/UI/Loading';
import ErrorMessage from '../../../shared/components/UI/ErrorMessage';
import { fetchSavedRecipes, removeSavedRecipe } from '../redux/userSlice';
import './MyFavorites.css';

export default function MyFavorites() {
  const dispatch = useAppDispatch();
  const saved = useAppSelector((s) => s.user.savedRecipes);
  const loading = useAppSelector((s) => s.user.loadingSaved);
  const { data: recipes = [] } = useGetRecipesQuery();

  const [error, setError] = useState('');
  const [removingId, setRemovingId] = useState<number | null>(null);

  useEffect(() => { dispatch(fetchSavedRecipes()); }, [dispatch]);

  const handleRemove = async (recipeId: number) => {
    setRemovingId(recipeId);
    try {
      await removeBookmark(recipeId);
      dispatch(removeSavedRecipe(recipeId));
    } catch {
      setError('Failed to remove recipe');
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) return <Loading size="md" />;
  if (error) return <ErrorMessage message={error} />;

  if (saved.length === 0) return (
    <div className="favorites-empty">
      <div>🔖</div>
      <h3>No saved recipes yet</h3>
      <p>Browse recipes and tap the bookmark to save your favorites!</p>
      <Link to="/recipes" className="browse-btn">Browse Recipes →</Link>
    </div>
  );

  return (
    <div className="favorites-grid">
      {saved.map((item) => {
        const recipe = recipes.find((r) => r.id === item.recipeId);
        const emoji = CATEGORY_EMOJIS[recipe?.category as keyof typeof CATEGORY_EMOJIS] ?? '🍰';
        const level = LEVEL_LABELS[recipe?.level as 1 | 2 | 3] ?? 'Easy';
        const removing = removingId === item.recipeId;
        const imgSrc = recipe?.arrImage || item.recipeImageUrl;
        const desc = recipe?.description
          ? recipe.description.length > 80 ? `${recipe.description.substring(0, 80)}...` : recipe.description
          : null;

        return (
          <div key={item.id} className={`favorite-card ${removing ? 'removing' : ''}`}>
            <Link to={`/recipes/${item.recipeId}`}>
              <div className="favorite-img">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={item.recipeName}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                      (img.nextElementSibling as HTMLElement)?.style.setProperty('display', 'flex');
                    }}
                  />
                ) : null}
                <div className={`favorite-img-fallback ${imgSrc ? 'hidden' : ''}`}>{emoji}</div>
              </div>

              <div className="favorite-body">
                <StarRating rating={recipe?.averageRating} showCount={recipe?.commentCount} />
                <h3>{item.recipeName}</h3>
                {desc && <p>{desc}</p>}
                <div className="favorite-meta">
                  {recipe?.totalTime && <span>⏱️ {recipe.totalTime} min</span>}
                  {recipe?.level    && <span>👨‍🍳 {level}</span>}
                  {recipe?.servings && <span>🍽️ {recipe.servings}</span>}
                </div>
              </div>
            </Link>

            <div className="favorite-actions">
              <button
                onClick={() => handleRemove(item.recipeId!)}
                disabled={removing}
                className={`remove-btn ${removing ? 'removing' : ''}`}
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
