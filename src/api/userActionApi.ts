import { baseApi } from './baseApi';
import type { UserActionDto, BookCreateDto, CommentCreateDto, HistoryCreateDto } from '../features/recipe/types/userAction.types';
import { CATEGORY_TO_INT } from '../features/recipe/types/recipe.types';

export const userActionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMySavedRecipes: builder.query<UserActionDto[], void>({
      query: () => '/useraction/my-saved',
      providesTags: ['SavedRecipes'],
    }),

    getMyHistory: builder.query<UserActionDto[], void>({
      query: () => '/useraction/my-history',
    }),

    getMyComments: builder.query<UserActionDto[], void>({
      query: () => '/useraction/my-comments',
      providesTags: ['Comments'],
    }),

    getRecipeComments: builder.query<UserActionDto[], number>({
      query: (recipeId) => `/useraction/recipe/${recipeId}/comments`,
      providesTags: (_result, _error, recipeId) => [{ type: 'Comments', id: recipeId }],
    }),

    getUserPreferences: builder.query<unknown, void>({
      query: () => '/useraction/my-preferences',
    }),

    addBookmark: builder.mutation<UserActionDto, number>({
      query: (recipeId) => ({
        url: '/useraction/book',
        method: 'POST',
        body: { recipeId } as BookCreateDto,
      }),
      invalidatesTags: ['SavedRecipes'],
    }),

    removeBookmark: builder.mutation<void, number>({
      query: (recipeId) => ({
        url: `/useraction/book/recipe/${recipeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['SavedRecipes'],
    }),

    addComment: builder.mutation<UserActionDto, CommentCreateDto>({
      query: (body) => ({ url: '/useraction/comment', method: 'POST', body }),
      invalidatesTags: (_result, _error, { recipeId }) => ['Comments', { type: 'Comments', id: recipeId }],
    }),

    removeComment: builder.mutation<void, number>({
      query: (recipeId) => ({
        url: `/useraction/comment/recipe/${recipeId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Comments'],
    }),

    addHistory: builder.mutation<void, HistoryCreateDto>({
      query: (data) => ({
        url: '/useraction/history',
        method: 'POST',
        body: { category: CATEGORY_TO_INT[data.category] ?? 0 },
      }),
    }),
  }),
});

export const {
  useGetMySavedRecipesQuery,
  useGetMyHistoryQuery,
  useGetMyCommentsQuery,
  useGetRecipeCommentsQuery,
  useGetUserPreferencesQuery,
  useAddBookmarkMutation,
  useRemoveBookmarkMutation,
  useAddCommentMutation,
  useRemoveCommentMutation,
  useAddHistoryMutation,
} = userActionApi;