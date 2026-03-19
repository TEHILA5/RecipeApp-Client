/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance, { handleApiError } from './axiosConfig';
import type { UserActionDto, BookCreateDto, CommentCreateDto, HistoryCreateDto } from '../features/recipe/types/userAction.types';

export const getMySavedRecipes = async (): Promise<UserActionDto[]> => {
  try {
    const res = await axiosInstance.get<UserActionDto[]>('/useraction/my-saved');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getMyHistory = async (): Promise<UserActionDto[]> => {
  try {
    const res = await axiosInstance.get<UserActionDto[]>('/useraction/my-history');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getMyComments = async (): Promise<UserActionDto[]> => {
  try {
    const res = await axiosInstance.get<UserActionDto[]>('/useraction/my-comments');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const getRecipeComments = async (recipeId: number): Promise<UserActionDto[]> => {
  try {
    const res = await axiosInstance.get<UserActionDto[]>(`/useraction/recipe/${recipeId}/comments`);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const addBookmark = async (recipeId: number): Promise<UserActionDto> => {
  try {
    const res = await axiosInstance.post<UserActionDto>('/useraction/book', { recipeId } as BookCreateDto);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const removeBookmark = async (recipeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/useraction/book/recipe/${recipeId}`);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const addComment = async (data: CommentCreateDto): Promise<UserActionDto> => {
  try {
    const res = await axiosInstance.post<UserActionDto>('/useraction/comment', data);
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const removeComment = async (recipeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/useraction/comment/recipe/${recipeId}`);
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const addHistory = async (data: HistoryCreateDto): Promise<void> => {
  try {
    await axiosInstance.post('/useraction/history', data);
  } catch {
    // silent fail
  }
};

export const getUserPreferences = async () => {
  try {
    const res = await axiosInstance.get('/useraction/my-preferences');
    return res.data;
  } catch (err) {
    throw new Error(handleApiError(err));
  }
};

export const userActionApi = {
  getMySavedRecipes,
  getMyHistory,
  getMyComments,
  addBookmark,
  removeBookmark,
  addComment,
  removeComment,
  addHistory,
  getUserPreferences,
  getRecipeComments,
};

export default userActionApi;