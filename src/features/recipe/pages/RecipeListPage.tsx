// ===============================================
// Recipe List Page - Sweet&Treat
// ===============================================
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { fetchAllRecipes, searchByCategory } from '../redux/recipeSlice';
import RecipeCard from '../components/RecipeCard';
import RecipeFilters from '../components/RecipeFilters';
import type { RecipeCategory, DifficultyLevel } from '../types/recipe.types';
import './RecipeListPage.css';

type SortOption = 'newest' | 'rating' | 'time' | 'name';

export default function RecipeListPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { recipes, loading, error } = useAppSelector((state) => state.recipes);
  const { isAdmin } = useAppSelector((state) => state.auth);

  // Filters from URL or state
  const [filters, setFilters] = useState({
    category: searchParams.get('category') as RecipeCategory | null,
    level: null as DifficultyLevel | null,
    maxTime: null as number | null,
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [searchTerm, setSearchTerm] = useState('');

  // Load recipes on mount
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      dispatch(searchByCategory(category));
    } else if (recipes.length === 0) {
      dispatch(fetchAllRecipes());
    }
  }, [dispatch, searchParams, recipes.length]);

  // Apply filters & search
  const filteredRecipes = recipes.filter((recipe) => {
    // Category filter
    if (filters.category && recipe.category !== filters.category) {
      return false;
    }
    // Level filter
    if (filters.level && recipe.level !== filters.level) {
      return false;
    }
    // Time filter
    if (filters.maxTime && recipe.totalTime > filters.maxTime) {
      return false;
    }
    // Search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        recipe.name.toLowerCase().includes(term) ||
        recipe.description.toLowerCase().includes(term)
      );
    }
    return true;
  });

  // Apply sorting
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return (b.averageRating || 0) - (a.averageRating || 0);
      case 'time':
        return a.totalTime - b.totalTime;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'newest':
      default:
        return b.id - a.id; // assuming higher id = newer
    }
  });

  // Handle filter change
  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    // Update URL if category changed
    if (newFilters.category) {
      setSearchParams({ category: newFilters.category });
    } else {
      setSearchParams({});
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({ category: null, level: null, maxTime: null });
    setSearchTerm('');
    setSearchParams({});
  };

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
              Discover {sortedRecipes.length} delicious dessert recipes
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
              <button onClick={() => setFilters({ ...filters, category: null })}>×</button>
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
      {error && (
        <div className="error-message">
          <span>⚠️</span> Failed to load recipes: {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="loading-state">
          <div className="spinner-large"></div>
          <p>Loading delicious recipes...</p>
        </div>
      )}

      {/* Recipes Grid */}
      {!loading && sortedRecipes.length > 0 && (
        <div className="recipes-grid">
          {sortedRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}

      {/* No Results */}
      {!loading && sortedRecipes.length === 0 && !error && (
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
