import { baseApi } from './baseApi';

export interface UserDto {
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface UserUpdateDto {
  name?: string;
  email?: string;
  phone?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateMe: builder.mutation<UserDto, UserUpdateDto>({
      query: (body) => ({ url: '/user/me', method: 'PATCH', body }),
    }),

    deleteMe: builder.mutation<void, void>({
      query: () => ({ url: '/user/me', method: 'DELETE' }),
    }),
  }),
});

export const {
  useUpdateMeMutation,
  useDeleteMeMutation,
} = userApi;