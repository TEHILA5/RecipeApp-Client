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
  recipes: Recipe[];
  totalCount: number;
  filters: RecipeFilters;
  searchTerm: string;
  sortBy: SortOption;
  isLoading: boolean;
  error: unknown;
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

export function useRecipes(): UseRecipesReturn {
  const [filters, setFilters] = useState<RecipeFilters>(DEFAULT_FILTERS);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const debouncedSearch = useDebounce(searchTerm, 400);
  const { data: allRecipes = [], isLoading, error } = useGetRecipesQuery();

  const recipes = useMemo(() => {
    let result = [...allRecipes];

    if (filters.category) result = result.filter((r) => r.category === filters.category);
    if (filters.level)    result = result.filter((r) => r.level === filters.level);
    if (filters.maxTime)  result = result.filter((r) => r.totalTime <= filters.maxTime!);

    if (debouncedSearch.trim()) {
      const term = debouncedSearch.toLowerCase();
      result = result.filter(
        (r) => r.name.toLowerCase().includes(term)  
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':  return (b.averageRating || 0) - (a.averageRating || 0);
        case 'time':    return a.totalTime - b.totalTime;
        case 'name':    return a.name.localeCompare(b.name);
        default:        return b.id - a.id;
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