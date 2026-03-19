/* eslint-disable @typescript-eslint/no-explicit-any */
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

export const getAllIngredients = async (): Promise<IngredientDto[]> => {
  try {
    const res = await axiosInstance.get<IngredientDto[]>('/ingredient');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getIngredientById = async (id: number): Promise<IngredientDto> => {
  try {
    const res = await axiosInstance.get<IngredientDto>(`/ingredient/${id}`);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getIngredientByName = async (name: string): Promise<IngredientDto | null> => {
  try {
    const res = await axiosInstance.get<IngredientDto>('/ingredient/by-name', { params: { name } });
    return res.data;
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw new Error(handleApiError(err));
  }
};

export const createIngredient = async (data: IngredientCreateDto): Promise<IngredientDto> => {
  try {
    const res = await axiosInstance.post<IngredientDto>('/ingredient', data);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const updateIngredient = async (id: number, data: IngredientUpdateDto): Promise<IngredientDto> => {
  try {
    const res = await axiosInstance.patch<IngredientDto>(`/ingredient/${id}`, data);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const deleteIngredient = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/ingredient/${id}`);
  } catch (err) {
    throw new Error(handleApiError(err));
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