// ===============================================
// Recipe List Page - Sweet&Treat
// ===============================================
import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useRecipes } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import RecipeFilters from '../components/RecipeFilters';
import type { RecipeCategory } from '../types/recipe.types';
import './RecipeListPage.css';

type SortOption = 'newest' | 'rating' | 'time' | 'name';

export default function RecipeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAppSelector((state) => state.auth);

  const {
    recipes,
    totalCount,
    filters,
    searchTerm,
    sortBy,
    isLoading,
    error,
    setSearchTerm,
    setSortBy,
    setFilters,
    resetFilters,
  } = useRecipes();

  // סינון לפי קטגוריה מ-URL בטעינה ראשונה
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') as RecipeCategory | null;
    if (categoryFromUrl && !filters.category) {
      setFilters({ ...filters, category: categoryFromUrl });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    if (newFilters.category) {
      setSearchParams({ category: newFilters.category });
    } else {
      setSearchParams({});
    }
  };

  const handleClearFilters = () => {
    resetFilters();
    setSearchParams({});
  };

  // המרת error מ-unknown למחרוזת תצוגה
  const errorMessage = error
    ? (error as { status?: number; error?: string })?.error ?? 'Failed to load recipes'
    : null;

  return (
    <div className="recipe-list-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-text">
            <h1 className="page-title">
              All <span>Recipes</span>
            </h1>
            <p className="page-subtitle">
              Discover {totalCount} delicious dessert recipes
            </p>
          </div>
          {isAdmin && (
            <Link to="/recipes/create" className="btn-add-recipe">
              <span>+</span> Add New Recipe
            </Link>
          )}
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="filters-section">
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search recipes by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <RecipeFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClear={handleClearFilters}
        />

        {/* Sort Dropdown */}
        <div className="sort-section">
          <label htmlFor="sort" className="sort-label">Sort by:</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="time">Quickest</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Active Filters Pills */}
      {(filters.category || filters.level || filters.maxTime || searchTerm) && (
        <div className="active-filters">
          <span className="filter-label">Active filters:</span>
          {filters.category && (
            <span className="filter-pill">
              Category: {filters.category}
              <button onClick={() => handleFilterChange({ ...filters, category: null })}>×</button>
            </span>
          )}
          {filters.level && (
            <span className="filter-pill">
              Level: {filters.level}
              <button onClick={() => setFilters({ ...filters, level: null })}>×</button>
            </span>
          )}
          {filters.maxTime && (
            <span className="filter-pill">
              Max time: {filters.maxTime}m
              <button onClick={() => setFilters({ ...filters, maxTime: null })}>×</button>
            </span>
          )}
          {searchTerm && (
            <span className="filter-pill">
              Search: "{searchTerm}"
              <button onClick={() => setSearchTerm('')}>×</button>
            </span>
          )}
          <button onClick={handleClearFilters} className="clear-all-btn">
            Clear All
          </button>
        </div>
      )}

      {/* Error */}
      {errorMessage && (
        <div className="error-message">
          <span>⚠️</span> {errorMessage}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading delicious recipes...</p>
        </div>
      )}

      {/* Recipes Grid */}
      {!isLoading && recipes.length > 0 && (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!isLoading && recipes.length === 0 && !error && (
        <div className="no-results">
          <div className="no-results-icon">🍰</div>
          <h3>No recipes found</h3>
          <p>Try adjusting your filters or search term</p>
          <button onClick={handleClearFilters} className="btn-outline">
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
