/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// Recipe API Functions - FIXED
// ===============================================
import axiosInstance, { handleApiError } from './axiosConfig';
import type { Recipe, RecipeCreateDto, RecipeUpdateDto } from '../features/recipe/types/recipe.types';

// קבלת כל המתכונים
export const getAllRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<Recipe[]>('/recipe');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// קבלת מתכון לפי ID
export const getRecipeById = async (id: number): Promise<Recipe> => {
  try {
    const response = await axiosInstance.get<Recipe>(`/recipe/${id}`); // ✅ תוקן
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// יצירת מתכון חדש
export const createRecipe = async (recipeData: RecipeCreateDto): Promise<Recipe> => {
  try {
    const response = await axiosInstance.post<Recipe>('/recipe', recipeData);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// עדכון מתכון - השרת משתמש ב-PATCH ולא PUT
export const updateRecipe = async (id: number, recipeData: RecipeUpdateDto): Promise<Recipe> => {
  try {
    const response = await axiosInstance.patch<Recipe>(`/recipe/${id}`, recipeData); // ✅ תוקן: put→patch + template literal
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// מחיקת מתכון
export const deleteRecipe = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/recipe/${id}`); // ✅ תוקן
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// חיפוש מתכונים לפי קטגוריה
export const searchRecipesByCategory = async (category: string): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<Recipe[]>(`/recipe/category/${category}`); // ✅ תוקן
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// חיפוש מתכונים לפי מרכיבים
export const searchRecipesByIngredients = async (ingredients: string[]): Promise<Recipe[]> => {
  try {
    // ✅ תוקן: endpoint נכון + השרת מקבל List<string> ישירות, לא object
    const response = await axiosInstance.post<Recipe[]>('/recipe/search-by-ingredients', ingredients);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// קבלת המלצות אישיות
export const getRecommendedRecipes = async (): Promise<Recipe[]> => {
  try {
    const response = await axiosInstance.get<Recipe[]>('/recipe/recommended');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// חיפוש כללי לפי שם - client-side בלבד, אין endpoint בשרת
// ℹ️ השרת לא תומך ב /recipe/search?q=...
// לכן שולחים את כל המתכונים ומסננים מקומית
export const searchRecipes = async (searchTerm: string): Promise<Recipe[]> => {
  try {
    const all = await getAllRecipes();
    return all.filter(r =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const recipeApi = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  searchRecipesByCategory,
  searchRecipesByIngredients,
  getRecommendedRecipes,
  searchRecipes,
};

export default recipeApi;