import { Link } from 'react-router-dom';
import { useGetRecipesQuery } from '../../recipe/redux/recipeSlice';
import { useGetMySavedRecipesQuery, useRemoveBookmarkMutation } from '../../../api/userActionApi';
import { CATEGORY_IMAGES, LEVEL_LABELS } from '../../recipe/types/recipe.types';
import StarRating from '../../../shared/components/StarRating';
import Loading from '../../../shared/components/UI/Loading';
import ErrorMessage from '../../../shared/components/UI/ErrorMessage';
import './MyFavorites.css';

export default function MyFavorites() {
  const { data: saved = [], isLoading, isError } = useGetMySavedRecipesQuery();
  const { data: recipes = [] } = useGetRecipesQuery();
  const [removeBookmark, { isLoading: removing }] = useRemoveBookmarkMutation();

  if (isLoading) return <Loading size="md" />;
  if (isError) return <ErrorMessage message="Failed to load saved recipes" />;

  if (saved.length === 0) return (
    <div className="favorites-empty">
      <div>
        <img
          src="/src/assets/icons/recipe-bookmark.png"
          alt="No favorites"
          className="favorites-empty-img"
        />
      </div>
      <h3>No saved recipes yet</h3>
      <p>Browse recipes and tap the bookmark to save your favorites!</p>
      <Link to="/recipes" className="browse-btn">Browse Recipes →</Link>
    </div>
  );

  return (
    <div className="favorites-grid">
      {saved.map((item) => {
        const recipe = recipes.find((r) => r.id === item.recipeId);
        const img = CATEGORY_IMAGES[recipe?.category as keyof typeof CATEGORY_IMAGES] ?? '/src/assets/images/recipe-placeholder.png';
        const level = LEVEL_LABELS[recipe?.level as 1 | 2 | 3] ?? 'Easy';
        const levelIcon = recipe?.level === 2
          ? '/src/assets/icons/meta-level-medium.png'
          : recipe?.level === 3
            ? '/src/assets/icons/meta-level-hard.png'
            : '/src/assets/icons/meta-level-easy.png';
        const levelAlt = recipe?.level === 2 ? 'Medium' : recipe?.level === 3 ? 'Hard' : 'Easy';
        const isRemoving = removing;
        const imgSrc = recipe?.arrImage || item.recipeImageUrl;
        const desc = recipe?.description
          ? recipe.description.length > 80 ? `${recipe.description.substring(0, 80)}...` : recipe.description
          : null;

        return (
          <div key={item.id} className={`favorite-card ${isRemoving ? 'removing' : ''}`}>
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
                <div className={`favorite-img-fallback ${imgSrc ? 'hidden' : ''}`}>
                  <img src={img} alt={item.recipeName} className="favorite-fallback-icon" />
                </div>
              </div>

              <div className="favorite-body">
                <StarRating rating={recipe?.averageRating} showCount={recipe?.commentCount} />
                <h3>{item.recipeName}</h3>
                {desc && <p>{desc}</p>}
                <div className="favorite-meta">
                  {recipe?.totalTime && (
                    <span className="favorite-meta-item">
                      <img src="/src/assets/icons/meta-time.png" alt="Time" className="favorite-meta-icon" />
                      {recipe.totalTime} min
                    </span>
                  )}
                  {recipe?.level && (
                    <span className="favorite-meta-item">
                      <img src={levelIcon} alt={levelAlt} className="favorite-meta-icon" />
                      {level}
                    </span>
                  )}
                  {recipe?.servings && (
                    <span className="favorite-meta-item">
                      <img src="/src/assets/icons/meta-servings.png" alt="Servings" className="favorite-meta-icon" />
                      {recipe.servings}
                    </span>
                  )}
                </div>
              </div>
            </Link>

            <div className="favorite-actions">
              <button
                onClick={() => removeBookmark(item.recipeId!)}
                disabled={isRemoving}
                className={`remove-btn ${isRemoving ? 'removing' : ''}`}
              >
                {isRemoving ? 'Removing...' : (
                  <>
                    <img src="/src/assets/icons/recipe-bookmark.png" alt="" className="favorite-meta-icon" />
                    {' '}Remove from Saved
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}