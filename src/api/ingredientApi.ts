import { baseApi } from './baseApi';

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

export const ingredientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIngredients: builder.query<IngredientDto[], void>({
      query: () => '/ingredient',
      providesTags: ['Ingredients'],
    }),

    getIngredientById: builder.query<IngredientDto, number>({
      query: (id) => `/ingredient/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Ingredients', id }],
    }),

    getIngredientByName: builder.query<IngredientDto | null, string>({
      query: (name) => ({ url: '/ingredient/by-name', params: { name } }),
    }),

    createIngredient: builder.mutation<IngredientDto, IngredientCreateDto>({
      query: (body) => ({ url: '/ingredient', method: 'POST', body }),
      invalidatesTags: ['Ingredients'],
    }),

    updateIngredient: builder.mutation<IngredientDto, { id: number; data: IngredientUpdateDto }>({
      query: ({ id, data }) => ({ url: `/ingredient/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => ['Ingredients', { type: 'Ingredients', id }],
    }),

    deleteIngredient: builder.mutation<void, number>({
      query: (id) => ({ url: `/ingredient/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Ingredients'],
    }),
  }),
});

export const {
  useGetAllIngredientsQuery,
  useGetIngredientByIdQuery,
  useGetIngredientByNameQuery,
  useCreateIngredientMutation,
  useUpdateIngredientMutation,
  useDeleteIngredientMutation,
} = ingredientApi;