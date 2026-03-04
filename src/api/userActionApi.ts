/* eslint-disable @typescript-eslint/no-explicit-any */
// ===============================================
// UserAction API - Bookmarks, Comments, History
// ===============================================
import axiosInstance, { handleApiError } from './axiosConfig';
import type { UserActionDto, BookCreateDto, CommentCreateDto, HistoryCreateDto } from '../features/recipe/types/userAction.types';

// קבלת כל הפעולות של המשתמש
export const getUserActions = async (): Promise<UserActionDto[]> => {
  try {
    const response = await axiosInstance.get<UserActionDto[]>('/useraction');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// קבלת פעולות לפי סוג
export const getUserActionsByType = async (type: 'Comment' | 'History' | 'Book'): Promise<UserActionDto[]> => {
  try {
    const response = await axiosInstance.get<UserActionDto[]>(`/useraction/type/${type}`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// קבלת תגובות של מתכון
export const getRecipeComments = async (recipeId: number): Promise<UserActionDto[]> => {
  try {
    const response = await axiosInstance.get<UserActionDto[]>(`/useraction/recipe/${recipeId}/comments`);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// הוספת מועדף (Book)
export const addBookmark = async (recipeId: number): Promise<UserActionDto> => {
  try {
    const dto: BookCreateDto = { recipeId };
    const response = await axiosInstance.post<UserActionDto>('/useraction/book', dto);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// הסרת מועדף
export const removeBookmark = async (recipeId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/useraction/book/${recipeId}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// הוספת תגובה + רייטינג
export const addComment = async (data: CommentCreateDto): Promise<UserActionDto> => {
  try {
    const response = await axiosInstance.post<UserActionDto>('/useraction/comment', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// הוספת היסטוריה
export const addHistory = async (data: HistoryCreateDto): Promise<UserActionDto> => {
  try {
    const response = await axiosInstance.post<UserActionDto>('/useraction/history', data);
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// מחיקת פעולה לפי ID
export const deleteUserAction = async (id: number): Promise<void> => {
  try {
    await axiosInstance.delete(`/useraction/${id}`);
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

// העדפות משתמש (לאלגוריתם המלצות)
export const getUserPreferences = async () => {
  try {
    const response = await axiosInstance.get('/useraction/preferences');
    return response.data;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};

export const userActionApi = {
  getUserActions,
  getUserActionsByType,
  getRecipeComments,
  addBookmark,
  removeBookmark,
  addComment,
  addHistory,
  deleteUserAction,
  getUserPreferences,
};

export default userActionApi;