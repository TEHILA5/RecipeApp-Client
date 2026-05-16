import { baseApi } from './baseApi';

export interface ConversionDto {
  id: number;
  ingredient1Name: string;
  ingredient2Name: string;
  conversionRatio: number;
  isBidirectional: boolean;
}

export interface UserAdminDto {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt?: string;
}

export interface WeeklyCategoryStats {
  week: string;
  weekLabel: string;
  category: string;
  categoryName: string;
  viewCount: number;
}

export interface ReplyDto {
  toEmail: string;
  toName: string;
  subject: string;
  replyContent: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllConversions: builder.query<ConversionDto[], void>({
      query: () => '/conversion',
      providesTags: ['Conversions'],
    }),

    getConversionById: builder.query<ConversionDto, number>({
      query: (id) => `/conversion/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Conversions', id }],
    }),

    createConversion: builder.mutation<ConversionDto, Omit<ConversionDto, 'id' | 'ingredient1Name' | 'ingredient2Name'> & { ingredientId1: number; ingredientId2: number }>({
      query: (body) => ({ url: '/conversion', method: 'POST', body }),
      invalidatesTags: ['Conversions'],
    }),

    updateConversion: builder.mutation<ConversionDto, { id: number; data: Partial<Pick<ConversionDto, 'conversionRatio' | 'isBidirectional'>> }>({
      query: ({ id, data }) => ({ url: `/conversion/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _error, { id }) => ['Conversions', { type: 'Conversions', id }],
    }),

    deleteConversion: builder.mutation<void, number>({
      query: (id) => ({ url: `/conversion/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Conversions'],
    }),
 
    getAllUsers: builder.query<UserAdminDto[], void>({
      query: () => '/user',
      providesTags: ['Users'],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({ url: `/user/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Users'],
    }),

    updateUser: builder.mutation<UserAdminDto, { id: number; data: Partial<UserAdminDto> }>({
      query: ({ id, data }) => ({ url: `/user/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: ['Users'],
    }),

    getWeeklyStats: builder.query<WeeklyCategoryStats[], void>({
      query: () => '/userAction/stats/weekly-categories',
      providesTags: ['WeeklyStats'],
    }),

    getAllIngredientsAdmin: builder.query<{ id: number; name: string }[], void>({
      query: () => '/ingredient',
      providesTags: ['Ingredients'],
    }),

    sendReply: builder.mutation<void, ReplyDto>({
      query: (body) => ({ url: '/contact/reply', method: 'POST', body }),
    }),
  }),
});

export const {
  useGetAllConversionsQuery,
  useGetConversionByIdQuery,
  useCreateConversionMutation,
  useUpdateConversionMutation,
  useDeleteConversionMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetWeeklyStatsQuery,
  useGetAllIngredientsAdminQuery,
  useSendReplyMutation,
} = adminApi;