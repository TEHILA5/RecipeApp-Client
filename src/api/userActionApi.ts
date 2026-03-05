/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// UserAction API - Bookmarks, Comments, History
// ===============================================
import axiosInstance, { handleApiError } from './axiosConfig';
import type { UserActionDto, BookCreateDto, CommentCreateDto, HistoryCreateDto } from '../features/recipe/types/userAction.types';

// GET: api/UserAction/my-saved
export const getMySavedRecipes = async (): Promise<UserActionDto[]> => {
  try {
    const response = await axiosInstance.get<UserActionDto[]>('/useraction/my-saved');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/UserAction/my-history
export const getMyHistory = async (): Promise<UserActionDto[]> => {
  try {
    const response = await axiosInstance.get<UserActionDto[]>('/useraction/my-history');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/UserAction/my-comments
export const getMyComments = async (): Promise<UserActionDto[]> => {
  try {
    const response = await axiosInstance.get<UserActionDto[]>('/useraction/my-comments');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// GET: api/UserAction/recipe/{recipeId}/comments - ציבורי לכולם
export const getRecipeComments = async (recipeId: number): Promise<UserActionDto[]> => {
  try {
    const response = await axiosInstance.get<UserActionDto[]>(`/useraction/recipe/${recipeId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST: api/UserAction/book
export const addBookmark = async (recipeId: number): Promise<UserActionDto> => {
  try {
    const dto: BookCreateDto = { recipeId };
    const response = await axiosInstance.post<UserActionDto>('/useraction/book', dto);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// DELETE: api/UserAction/book/recipe/{recipeId}
export const removeBookmark = async (recipeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/useraction/book/recipe/${recipeId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST: api/UserAction/comment
export const addComment = async (data: CommentCreateDto): Promise<UserActionDto> => {
  try {
    const response = await axiosInstance.post<UserActionDto>('/useraction/comment', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// DELETE: api/UserAction/comment/recipe/{recipeId}
export const removeComment = async (recipeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/useraction/comment/recipe/${recipeId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// POST: api/UserAction/history
export const addHistory = async (data: HistoryCreateDto): Promise<void> => {
  try {
    await axiosInstance.post('/useraction/history', data);
  } catch {
    // היסטוריה - שגיאה שקטה, לא קריטי
  }
};

// GET: api/UserAction/my-preferences
export const getUserPreferences = async () => {
  try {
    const response = await axiosInstance.get('/useraction/my-preferences');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
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