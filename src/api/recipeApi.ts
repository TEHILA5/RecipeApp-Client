/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance, { handleApiError } from './axiosConfig';
import type { Recipe, RecipeCreateDto, RecipeUpdateDto } from '../features/recipe/types/recipe.types';
import { normalizeRecipe, CATEGORY_TO_INT, IMPORTANCE_TO_INT } from '../features/recipe/types/recipe.types';

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

export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const res = await axiosInstance.get<any[]>('/recipe');
    return res.data.map(normalizeRecipe);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getRecipeById = async (id: number): Promise<Recipe> => {
  try {
    const res = await axiosInstance.get<any>(`/recipe/${id}`);
    return normalizeRecipe(res.data);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const createRecipe = async (data: RecipeCreateDto): Promise<Recipe> => {
  try {
    const res = await axiosInstance.post<any>('/recipe', serializeForServer(data));
    return normalizeRecipe(res.data);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const updateRecipe = async (id: number, data: RecipeUpdateDto): Promise<Recipe> => {
  try {
    const res = await axiosInstance.patch<any>(`/recipe/${id}`, serializeForServer(data));
    return normalizeRecipe(res.data);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/recipe/${id}`);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const searchRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    const res = await axiosInstance.get<any[]>(`/recipe/category/${category}`);
    return res.data.map(normalizeRecipe);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const searchRecipesByIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    const res = await axiosInstance.post<any[]>('/recipe/search-by-ingredients', ingredients);
    return res.data.map(normalizeRecipe);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getRecommendedRecipes = async (): Promise<Recipe[]> => {
  try {
    const res = await axiosInstance.get<any[]>('/recipe/recommended');
    return res.data.map(normalizeRecipe);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const searchRecipes = async (term: string): Promise<Recipe[]> => {
  try {
    const all = await getAllRecipes();
    return all.filter((r) => r.name.toLowerCase().includes(term.toLowerCase()));
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const recipeApi = {
  getAllRecipes, getRecipeById, createRecipe, updateRecipe, deleteRecipe,
  searchRecipesByCategory, searchRecipesByIngredients, getRecommendedRecipes, searchRecipes,
};

export default recipeApi;