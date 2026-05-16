import RecipeModeration from '../components/RecipeModeration';
import './ManageRecipes.css';

export default function ManageRecipes() {
  return (
    <div className="manage-recipes-page">
      <div className="manage-recipes-container">
        <h1>
          Manage Recipes{' '}
          <img src="/src/assets/icons/page-about.png" alt="" className="manage-recipes-title-icon" />
        </h1>
        <RecipeModeration />
      </div>
    </div>
  );
}