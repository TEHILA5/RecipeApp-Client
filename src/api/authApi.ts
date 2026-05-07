import { baseApi } from './baseApi';
import type { AuthResponse, LoginCredentials, RegisterData } from '../features/auth/types/auth.types';

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponse, RegisterData>({
      query: (data) => ({
        url: '/user/register',
        method: 'POST',
        body: data,
      }),
    }),

    getMe: builder.query<AuthResponse['user'], void>({
      query: () => '/user/me',
    }),

    resetPassword: builder.mutation<void, { email: string; newPassword: string }>({
      query: (body) => ({
        url: '/user/reset-password',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useResetPasswordMutation,
} = authApi;