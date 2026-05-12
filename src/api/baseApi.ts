import { createApi, fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:7244/api';

const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});

const baseQueryWithLogoutOn401: BaseQueryFn = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const { logout } = await import('../features/auth/redux/authSlice');
    api.dispatch(logout());
    window.location.href = '/login'; 
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithLogoutOn401,
  tagTypes: ['Recipes', 'Recipe', 'Ingredients', 'Conversions', 'Users', 'SavedRecipes', 'Comments', 'WeeklyStats'],
  endpoints: () => ({}),
});