import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetRecipesQuery, useDeleteRecipeMutation } from '../../recipe/redux/recipeSlice';
import { CATEGORY_IMAGES } from '../../recipe/types/recipe.types';
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
            <span className="rm-search-icon">
              <img src="/src/assets/icons/search-icon.png" alt="Search" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
            </span>
          </div>
          <Link to="/recipes/create" className="rm-add-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
            <img src="/src/assets/icons/action-add.png" alt="" style={{ width: '18px', height: '18px', objectFit: 'contain', verticalAlign: 'middle' }} />
            {' '}Add Recipe
          </Link>
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
                const categoryImg = CATEGORY_IMAGES[recipe.category];
                const isDeleting = deletingId === recipe.id && deleting;
                return (
                  <tr key={recipe.id} className={`rm-row ${idx % 2 === 0 ? 'rm-row-even' : 'rm-row-odd'} ${isDeleting ? 'rm-row-deleting' : ''}`}>
                    <td className="rm-td">
                      <div className="rm-recipe-info" >
                        <div className="rm-thumb">
                          {recipe.arrImage
                            ? <img src={recipe.arrImage} alt="" className="rm-thumb-img" />
                            : categoryImg
                              ? <img src={categoryImg} alt={recipe.category} className="rm-thumb-img" />
                              : <span className="rm-thumb-emoji">🍰</span>
                          }
                        </div>
                        <div>
                          <div className="rm-recipe-name">{recipe.name}</div>
                          <div className="rm-recipe-id">ID: {recipe.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="rm-td">
                      <span className="rm-category-badge" style={{ display: 'flex', alignItems: 'left', gap: '4px', }}>
                        {recipe.category} 
                      </span>
                    </td>
                    <td className="rm-td rm-rating">
                      <img src="/src/assets/icons/rank-star.png" alt="Rating" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                      {' '}{recipe.averageRating?.toFixed(1) ?? '—'}
                    </td>
                    <td className="rm-td rm-time">
                      <img src="/src/assets/icons/meta-time.png" alt="Time" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                      {' '}{recipe.totalTime}m
                    </td>
                    <td className="rm-td">
                      <div className="rm-actions">
                        <Link to={`/recipes/${recipe.id}/edit`} className="rm-edit-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
                            <img src="/src/assets/icons/profile-edit.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                            {' '}Edit
                          </Link>
                        <button onClick={() => handleDelete(recipe.id)} disabled={isDeleting} className="rm-delete-btn" style={{ display: 'flex', alignItems: 'center', gap: '4px', }}>
                            {isDeleting ? '...' : (
                              <>
                                <img src="/src/assets/icons/action-delete.png" alt="" style={{ width: '20px', height: '20px', objectFit: 'contain', verticalAlign: 'middle' }} />
                                {' '}Delete
                              </>
                            )}
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