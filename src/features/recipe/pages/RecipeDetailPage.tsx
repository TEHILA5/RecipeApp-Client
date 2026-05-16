import { Link } from 'react-router-dom';
import Loading from '../../../shared/components/UI/Loading';
import { useRecipeDetail } from '../hooks/useRecipeDetail';
import RecipeDetail from '../components/RecipeDetail';
import pageIcon from '../../../assets/icons/state-empty.png';
import './RecipeDetailPage.css';

export default function RecipeDetailPage() {
  const { recipe, isLoading, error, handleCommentAdded, navigate } = useRecipeDetail();

  if (isLoading) return <Loading message="Loading recipe..." size="lg" fullPage />;

  if (error || !recipe) {
    return (
      <div className="rdp-not-found">
        <img src={pageIcon} alt="Not found" className="rdp-not-found-icon" />
        <h2 className="rdp-not-found-title">Recipe Not Found</h2>
        <button onClick={() => navigate('/recipes')} className="rdp-back-btn">← Back to Recipes</button>
      </div>
    );
  }

  return (
    <div className="rdp-page">
      <div className="rdp-breadcrumb-wrap">
        <nav className="rdp-breadcrumb">
          <Link to="/" className="rdp-crumb">Home</Link>
          <span className="rdp-sep">›</span>
          <Link to="/recipes" className="rdp-crumb">Recipes</Link>
          <span className="rdp-sep">›</span>
          <span>{recipe.name}</span>
        </nav>
      </div>
      <RecipeDetail recipe={recipe} onCommentAdded={handleCommentAdded} />
    </div>
  );
}