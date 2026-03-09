// ===============================================
// useRecipes - Custom Hook לניהול מתכונים
// ===============================================
// מרכז את כל הלוגיקה של סינון, מיון וחיפוש מתכונים
// במקום לפזר את הלוגיקה בתוך הקומפוננטה

import { useState, useMemo } from 'react';
import { useGetRecipesQuery } from '../redux/recipeSlice';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import type { Recipe, RecipeCategory, DifficultyLevel } from '../types/recipe.types';

type SortOption = 'newest' | 'rating' | 'time' | 'name';

interface RecipeFilters {
  category: RecipeCategory | null;
  level: DifficultyLevel | null;
  maxTime: number | null;
}

interface UseRecipesReturn {
  // Data
  recipes: Recipe[];
  totalCount: number;

  // State
  filters: RecipeFilters;
  searchTerm: string;
  sortBy: SortOption;

  // Loading / Error
  isLoading: boolean;
  error: unknown;

  // Setters
  setSearchTerm: (term: string) => void;
  setSortBy: (sort: SortOption) => void;
  setFilters: (filters: RecipeFilters) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: RecipeFilters = {
  category: null,
  level: null,
  maxTime: null,
};

/**
 * Hook לניהול רשימת המתכונים עם סינון, מיון וחיפוש
 *
 * @example
 * const { recipes, isLoading, searchTerm, setSearchTerm, filters, setFilters } = useRecipes();
 */
export function useRecipes(): UseRecipesReturn {
  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // דחיית החיפוש ב-400ms - לא לחפש בכל הקשה
  const debouncedSearch = useDebounce(searchTerm, 400);

  // שליפת כל המתכונים מהשרת
  const { data: allRecipes = [], isLoading, error } = useGetRecipesQuery();

  // סינון ומיון - מחושב מחדש רק כשמשתנה תלות
  const recipes = useMemo(() => {
    let result = [...allRecipes];

    // סינון לפי קטגוריה
    if (filters.category) {
      result = result.filter((r) => r.category === filters.category);
    }

    // סינון לפי רמת קושי
    if (filters.level) {
      result = result.filter((r) => r.level === filters.level);
    }

    // סינון לפי זמן מקסימלי
    if (filters.maxTime) {
      result = result.filter((r) => r.totalTime <= filters.maxTime!);
    }

    // חיפוש טקסט (עם debounce)
    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(term) ||
          r.description.toLowerCase().includes(term)
      );
    }

    // מיון
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return (b.averageRating || 0) - (a.averageRating || 0);
        case 'time':
          return a.totalTime - b.totalTime;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return b.id - a.id;
      }
    });

    return result;
  }, [allRecipes, filters, debouncedSearch, sortBy]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchTerm('');
    setSortBy('newest');
  };

  return {
    recipes,
    totalCount: recipes.length,
    filters,
    searchTerm,
    sortBy,
    isLoading,
    error,
    setSearchTerm,
    setSortBy,
    setFilters,
    resetFilters,
  };
}

export default useRecipes;