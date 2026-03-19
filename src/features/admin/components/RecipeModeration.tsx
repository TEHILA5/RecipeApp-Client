import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery, useDeleteRecipeMutation } from '../../recipe/redux/recipeSlice';
import { CATEGORY_EMOJIS } from '../../recipe/types/recipe.types';
import './RecipeModeration.css';

export default function RecipeModeration() {
  const { data: recipes = [], isLoading } = useGetRecipesQuery();
  const [deleteRecipe, { isLoading: deleting }] = useDeleteRecipeMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    setDeletingId(id);
    try { await deleteRecipe(id).unwrap(); }
    finally { setDeletingId(null); }
  };

  const filtered = recipes.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rm-wrapper">
      <div className="rm-header">
        <h3 className="rm-title">All Recipes ({recipes.length})</h3>
        <div className="rm-controls">
          <div className="rm-search-wrap">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search recipes..."
              className="rm-search"
            />
            <span className="rm-search-icon">🔍</span>
          </div>
          <Link to="/recipes/create" className="rm-add-btn">➕ Add Recipe</Link>
        </div>
      </div>

      {isLoading ? (
        <div className="rm-loading">
          <div className="rm-spinner" />
        </div>
      ) : (
        <div className="rm-table-wrap">
          <table className="rm-table">
            <thead>
              <tr className="rm-thead-row">
                {['Recipe', 'Category', 'Rating', 'Time', 'Actions'].map((h) => (
                  <th key={h} className="rm-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((recipe, idx) => {
                const emoji = CATEGORY_EMOJIS[recipe.category] ?? '🍰';
                const isDeleting = deletingId === recipe.id && deleting;
                return (
                  <tr key={recipe.id} className={`rm-row ${idx % 2 === 0 ? 'rm-row-even' : 'rm-row-odd'} ${isDeleting ? 'rm-row-deleting' : ''}`}>
                    <td className="rm-td">
                      <div className="rm-recipe-info">
                        <div className="rm-thumb">
                          {recipe.arrImage
                            ? <img src={recipe.arrImage} alt="" className="rm-thumb-img" />
                            : <span className="rm-thumb-emoji">{emoji}</span>}
                        </div>
                        <div>
                          <div className="rm-recipe-name">{recipe.name}</div>
                          <div className="rm-recipe-id">ID: {recipe.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="rm-td">
                      <span className="rm-category-badge">{emoji} {recipe.category}</span>
                    </td>
                    <td className="rm-td rm-rating">⭐ {recipe.averageRating?.toFixed(1) ?? '—'}</td>
                    <td className="rm-td rm-time">⏱️ {recipe.totalTime}m</td>
                    <td className="rm-td">
                      <div className="rm-actions">
                        <Link to={`/recipes/${recipe.id}/edit`} className="rm-edit-btn">✏️ Edit</Link>
                        <button
                          onClick={() => handleDelete(recipe.id)}
                          disabled={isDeleting}
                          className="rm-delete-btn"
                        >
                          {isDeleting ? '...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="rm-empty">No recipes match your search</div>
          )}
        </div>
      )}
    </div>
  );
}
