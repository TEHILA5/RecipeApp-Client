import { Link } from 'react-router-dom';
import './ManageIngredients.css';

export default function ManageIngredients() {
  return (
    <div className="mi-page">
      <div className="mi-inner">
        <h1 className="mi-title">
          Manage Ingredients
          <img src="/src/assets/icons/tip-salt.png" alt="" className="mi-title-icon" />
        </h1>
        <div className="mi-card">
          <p className="mi-desc">Add, edit, or remove ingredients from the system.</p>
          <Link to="/admin/ingredients" className="mi-btn">
            <img src="/src/assets/icons/tip-salt.png" alt="" className="mi-btn-icon" />
            Go to Ingredients Manager
          </Link>
        </div>
      </div>
    </div>
  );
}