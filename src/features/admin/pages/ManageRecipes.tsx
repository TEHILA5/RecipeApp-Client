import RecipeModeration from '../components/RecipeModeration';
import './ManageRecipes.css';

export default function ManageRecipes() {
  return (
    <div className="manage-recipes-page">
      <div className="manage-recipes-container">
        <h1>
          Manage Recipes{' '}
          <img src="/src/assets/icons/page-about.png" alt="" style={{ width: '1em', height: '1em', objectFit: 'contain', verticalAlign: 'middle' }} />
        </h1>
        <RecipeModeration />
      </div>
    </div>
  );
}