/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// Ingredient API Functions
// ===============================================
import axiosInstance, { handleApiError } from './axiosConfig';

export interface IngredientDto {
  id: number;
  name: string;
  category?: string;
  unit?: string;
}

export interface IngredientCreateDto {
  name: string;
  category?: string;
  unit?: string;
}

export interface IngredientUpdateDto {
  name?: string;
  category?: string;
  unit?: string;
}

// GET: api/Ingredient
export const getAllIngredients = async (): Promise<IngredientDto[]> => {
  try {
    const response = await axiosInstance.get<IngredientDto[]>('/ingredient');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/Ingredient/:id
export const getIngredientById = async (id: number): Promise<IngredientDto> => {
  try {
    const response = await axiosInstance.get<IngredientDto>(`/ingredient/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/Ingredient/by-name?name=flour
export const getIngredientByName = async (name: string): Promise<IngredientDto | null> => {
  try {
    const response = await axiosInstance.get<IngredientDto>(`/ingredient/by-name`, {
      params: { name },
    });
    return response.data;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw new Error(handleApiError(error));
  }
};

// POST: api/Ingredient - Admin only
export const createIngredient = async (data: IngredientCreateDto): Promise<IngredientDto> => {
  try {
    const response = await axiosInstance.post<IngredientDto>('/ingredient', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// PATCH: api/Ingredient/:id - Admin only
export const updateIngredient = async (id: number, data: IngredientUpdateDto): Promise<IngredientDto> => {
  try {
    const response = await axiosInstance.patch<IngredientDto>(`/ingredient/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// DELETE: api/Ingredient/:id - Admin only
export const deleteIngredient = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/ingredient/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const ingredientApi = {
  getAllIngredients,
  getIngredientById,
  getIngredientByName,
  createIngredient,
  updateIngredient,
  deleteIngredient,
};

export default ingredientApi;