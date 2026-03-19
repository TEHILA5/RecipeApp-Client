import { useState } from 'react';
import { useAppDispatch } from '../../../redux/hooks';
import { setSearchTerm, setSelectedCategory } from '../redux/recipeSlice';
import { useDebounce } from '../../../shared/hooks/useDebounce';
import {
  useGetRecipesQuery,
  useGetRecipesByCategoryQuery,
  useSearchByIngredientsQuery,
} from '../redux/recipeSlice';
import type { Recipe, RecipeCategory } from '../types/recipe.types';

export type SearchMode = 'name' | 'category' | 'ingredients';

export function useRecipeSearch() {
  const dispatch = useAppDispatch();

  const [mode, setModeState] = useState<SearchMode>('name');
  const [nameInput, setNameInput] = useState('');
  const [categoryInput, setCategoryInput] = useState<RecipeCategory | ''>('');
  const [ingredientInput, setIngredientInput] = useState('');
  const [ingredientList, setIngredientList] = useState<string[]>([]);

  const debouncedName = useDebounce(nameInput, 400);

  const { data: allRecipes = [], isLoading: loadingAll } = useGetRecipesQuery(undefined, { skip: mode !== 'name' });
  const { data: categoryResults = [], isLoading: loadingCat } = useGetRecipesByCategoryQuery(categoryInput as string, { skip: mode !== 'category' || !categoryInput });
  const { data: ingredientResults = [], isLoading: loadingIng } = useSearchByIngredientsQuery(ingredientList, { skip: mode !== 'ingredients' || ingredientList.length === 0 });
  const { data: allRecipesForAlt = [] } = useGetRecipesQuery(undefined, { skip: mode !== 'ingredients' });

  const nameResults: Recipe[] = debouncedName
    ? allRecipes.filter((r) =>
        r.name.toLowerCase().includes(debouncedName.toLowerCase()) ||
        r.description.toLowerCase().includes(debouncedName.toLowerCase())
      )
    : [];

  const results: Recipe[] =
    mode === 'name'        ? nameResults :
    mode === 'category'    ? categoryResults :
    ingredientResults;

  const isLoading = loadingAll || loadingCat || loadingIng;

  const hasSearched =
    (mode === 'name'        && debouncedName.length > 0) ||
    (mode === 'category'    && !!categoryInput) ||
    (mode === 'ingredients' && ingredientList.length > 0);

  const setMode = (newMode: SearchMode) => {
    setModeState(newMode);
    setNameInput('');
    setCategoryInput('');
    setIngredientList([]);
    setIngredientInput('');
    dispatch(setSearchTerm(''));
    dispatch(setSelectedCategory(null));
  };

  const handleAddIngredient = () => {
    const trimmed = ingredientInput.trim();
    if (trimmed && !ingredientList.includes(trimmed)) {
      const next = [...ingredientList, trimmed];
      setIngredientList(next);
      dispatch(setSearchTerm(next.join(', ')));
    }
    setIngredientInput('');
  };

  const handleRemoveIngredient = (ing: string) => {
    const next = ingredientList.filter((i) => i !== ing);
    setIngredientList(next);
    dispatch(setSearchTerm(next.join(', ')));
  };

  const handleClearIngredients = () => {
    setIngredientList([]);
    dispatch(setSearchTerm(''));
  };

  const handleSetCategory = (cat: RecipeCategory | '') => {
    setCategoryInput(cat);
    dispatch(setSelectedCategory(cat || null));
  };

  return {
    mode, setMode,
    nameInput, setNameInput,
    categoryInput, handleSetCategory,
    ingredientInput, setIngredientInput,
    ingredientList,
    handleAddIngredient,
    handleRemoveIngredient,
    handleClearIngredients,
    results,
    allRecipesForAlt,
    isLoading,
    hasSearched,
  };
}