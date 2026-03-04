/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// Recipe API Functions
// ===============================================
import axiosInstance, { handleApiError } from './axiosConfig';
import type { Recipe, RecipeCreateDto, RecipeUpdateDto } from '../features/recipe/types/recipe.types';
import { normalizeRecipe, CATEGORY_TO_INT, IMPORTANCE_TO_INT } from '../features/recipe/types/recipe.types';

// ── Helper: המר את ה-DTO לפני שליחה לשרת (string → int) ──
function serializeForServer(data: RecipeCreateDto | RecipeUpdateDto): any {
  return {
    ...data,
    category: data.category !== undefined ? CATEGORY_TO_INT[data.category] : undefined,
    ingredients: data.ingredients?.map((ing) => ({
      ...ing,
      importance: ing.importance ? IMPORTANCE_TO_INT[ing.importance] ?? 1 : 1,
    })),
  };
}

// GET: api/Recipe
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<any[]>('/recipe');
    return response.data.map(normalizeRecipe);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/Recipe/:id
export const getRecipeById = async (id: number): Promise<Recipe> => {
  try {
    const response = await axiosInstance.get<any>(`/recipe/${id}`);
    return normalizeRecipe(response.data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST: api/Recipe
export const createRecipe = async (recipeData: RecipeCreateDto): Promise<Recipe> => {
  try {
    const response = await axiosInstance.post<any>('/recipe', serializeForServer(recipeData));
    return normalizeRecipe(response.data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// PATCH: api/Recipe/:id
export const updateRecipe = async (id: number, recipeData: RecipeUpdateDto): Promise<Recipe> => {
  try {
    const response = await axiosInstance.patch<any>(`/recipe/${id}`, serializeForServer(recipeData));
    return normalizeRecipe(response.data);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// DELETE: api/Recipe/:id
export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/recipe/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/Recipe/category/:category
export const searchRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<any[]>(`/recipe/category/${category}`);
    return response.data.map(normalizeRecipe);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST: api/Recipe/search-by-ingredients
export const searchRecipesByIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.post<any[]>('/recipe/search-by-ingredients', ingredients);
    return response.data.map(normalizeRecipe);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/Recipe/recommended
export const getRecommendedRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<any[]>('/recipe/recommended');
    return response.data.map(normalizeRecipe);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// client-side search by name
export const searchRecipes = async (searchTerm: string): Promise<Recipe[]> => {
  try {
    const all = await getAllRecipes();
    return all.filter((r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const recipeApi = {
  getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe,
  searchRecipesByCategory, searchRecipesByIngredients, getRecommendedRecipes, searchRecipes,
};

export default recipeApi;