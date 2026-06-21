import { useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAppSelector } from '../../../redux/hooks';
import { useRecipes } from '../hooks/useRecipes';
import RecipeCard from '../components/RecipeCard';
import RecipeFilters from '../components/RecipeFilters';
import PageHeader from '../../../shared/components/UI/PageHeader';
import type { RecipeCategory } from '../types/recipe.types';
import './RecipeListPage.css';

import searchIcon  from '../../../assets/icons/search-icon.png';
import emptyIcon   from '../../../assets/icons/page-about.png';

type SortOption = 'newest' | 'rating' | 'time' | 'name';

export default function RecipeListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAdmin } = useAppSelector((s) => s.auth);

  const {
    recipes, totalCount, filters, searchTerm, sortBy,
    isLoading, error,
    setSearchTerm, setSortBy, setFilters, resetFilters,
  } = useRecipes();

  useEffect(() => {
    const cat = searchParams.get('category') as RecipeCategory | null;
    setFilters({ ...filters, category: cat || null });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setSearchParams(newFilters.category ? { category: newFilters.category } : {});
  };

  const handleClearFilters = () => {
    resetFilters();
    setSearchParams({});
  };

  const errorMessage = error
    ? (error as { status?: number; error?: string })?.error ?? 'Failed to load recipes'
    : null;

  const hasActiveFilters = filters.category || filters.level || filters.maxTime || searchTerm;

  return (
    <div className="recipe-list-page">
      <PageHeader
        layout="split"
        size="full"
        padding="large"
        align="left"
        title={<>All <span>Recipes</span></>}
        subtitle={`Discover ${totalCount} delicious dessert recipes`}
        action={
          isAdmin ? (
            <Link to="/recipes/create" className="btn-add-recipe">
              <span>+</span> Add New Recipe
            </Link>
          ) : undefined
        }
      />

      <div className="filters-section">
        <div className="search-bar-wrapper">
          <input
            type="text"
            placeholder="Search recipes by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>

        <RecipeFilters filters={filters} onFilterChange={handleFilterChange} onClear={handleClearFilters} />

        <div className="sort-section">
          <label htmlFor="sort" className="sort-label">Sort by:</label>
          <select id="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="sort-select">
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rated</option>
            <option value="time">Quickest</option>
            <option value="name">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
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
          <button onClick={handleClearFilters} className="clear-all-btn">Clear All</button>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          <span>
            <img src="/src/assets/icons/profile-warning.png" alt="Error" className="error-icon" />
          </span> {errorMessage}
        </div>
      )}

      {isLoading && (
        <div className="loading-state">
          <div className="spinner-large" />
          <p>Loading delicious recipes...</p>
        </div>
      )}

      {!isLoading && recipes.length > 0 && (
        <div className="recipes-grid">
          {recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
        </div>
      )}

      {!isLoading && recipes.length === 0 && !error && (
        <div className="no-results">
          <img src={emptyIcon} alt="No recipes" className="no-results-icon" />
          <h3>No recipes found</h3>
          <p>Try adjusting your filters or search term</p>
          <button onClick={handleClearFilters} className="btn-outline">Clear Filters</button>
        </div>
      )}
    </div>
  );
}