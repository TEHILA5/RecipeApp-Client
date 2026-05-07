import { baseApi } from './baseApi';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  user: {
    id?: number;
    name: string;
    email: string;
    phone: string;
    isAdmin?: boolean;
  };
  token: string;
}

export interface UserDto {
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginPayload>({
      query: (credentials) => ({
        url: '/user/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    register: builder.mutation<LoginResponse, RegisterPayload>({
      query: (userData) => ({
        url: '/user/register',
        method: 'POST',
        body: userData,
      }),
    }),

    getMe: builder.query<UserDto, void>({
      query: () => '/user/me',
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
} = authApi;