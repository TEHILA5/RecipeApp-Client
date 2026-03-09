// ===============================================
// Recipe Slice - RTK Query + Redux Slice
// ===============================================
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Recipe, RecipeCreateDto, RecipeUpdateDto, RecipeCategory } from '../types/recipe.types';
import { normalizeRecipe, CATEGORY_TO_INT, IMPORTANCE_TO_INT } from '../types/recipe.types';

// ── Helper: המר את ה-DTO לפני שליחה לשרת (string → int) ──
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function serializeForServer(data: RecipeCreateDto | RecipeUpdateDto): any {
  return {
    ...data,
    category: data.category !== undefined ? CATEGORY_TO_INT[data.category] : undefined,
    ingredients: data.ingredients?.map((ing) => ({
      ...ing,
      importance: ing.importance ? IMPORTANCE_TO_INT[ing.importance] ?? 1 : 1,
    })),
  };
}

const API_BASE_URL =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (import.meta as any).env?.VITE_API_BASE_URL || 'https://localhost:7244/api';

// ===============================================
// RTK Query API
// ===============================================

export const recipesApi = createApi({
  reducerPath: 'recipesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Recipes', 'Recipe'],

  endpoints: (builder) => ({

    // ---------- GET ALL ----------
    getRecipes: builder.query<Recipe[], void>({
      query: () => '/recipe',
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
      providesTags: ['Recipes'],
    }),

    // ---------- GET BY ID ----------
    getRecipeById: builder.query<Recipe, number>({
      query: (id) => `/recipe/${id}`,
      transformResponse: (raw: unknown) => normalizeRecipe(raw),
      providesTags: (_result, _error, id) => [{ type: 'Recipe', id }],
    }),

    // ---------- GET RECOMMENDED ----------
    getRecommendedRecipes: builder.query<Recipe[], void>({
      query: () => '/recipe/recommended',
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
    }),

    // ---------- GET BY CATEGORY ----------
    getRecipesByCategory: builder.query<Recipe[], string>({
      query: (category) => `/recipe/category/${category}`,
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
    }),

    // ---------- SEARCH BY INGREDIENTS ----------
    searchByIngredients: builder.query<Recipe[], string[]>({
      query: (ingredients) => ({
        url: '/recipe/search-by-ingredients',
        method: 'POST',
        body: ingredients,
      }),
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
    }),

    // ---------- CREATE ----------
    createRecipe: builder.mutation<Recipe, RecipeCreateDto>({
      query: (newRecipe) => ({
        url: '/recipe',
        method: 'POST',
        body: serializeForServer(newRecipe),
      }),
      transformResponse: (raw: unknown) => normalizeRecipe(raw),

      // Optimistic update - הוספה מיידית לרשימה
      async onQueryStarted(newRecipe, { dispatch, queryFulfilled }) {
        const tempId = Date.now();
        const patchResult = dispatch(
          recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
            draft.unshift({
              ...newRecipe,
              id: tempId,
              averageRating: 0,
              commentCount: 0,
            } as Recipe);
          })
        );

        try {
          const { data: createdRecipe } = await queryFulfilled;
          // החלפת ה-id הזמני ב-id האמיתי מהשרת
          dispatch(
            recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
              const index = draft.findIndex((r) => r.id === tempId);
              if (index !== -1) draft[index] = createdRecipe;
            })
          );
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ['Recipes'],
    }),

    // ---------- UPDATE ----------
    updateRecipe: builder.mutation<Recipe, { id: number; data: RecipeUpdateDto }>({
      query: ({ id, data }) => ({
        url: `/recipe/${id}`,
        method: 'PATCH',
        body: serializeForServer(data),
      }),
      transformResponse: (raw: unknown) => normalizeRecipe(raw),

      // Optimistic update - עדכון מיידי
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
            const index = draft.findIndex((r) => r.id === id);
            if (index !== -1) {
              draft[index] = { ...draft[index], ...data } as Recipe;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: (_result, _error, { id }) => [
        'Recipes',
        { type: 'Recipe', id },
      ],
    }),

    // ---------- DELETE ----------
    deleteRecipe: builder.mutation<void, number>({
      query: (id) => ({
        url: `/recipe/${id}`,
        method: 'DELETE',
      }),

      // Optimistic update - מחיקה מיידית מהרשימה
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
            const index = draft.findIndex((r) => r.id === id);
            if (index !== -1) draft.splice(index, 1);
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ['Recipes'],
    }),
  }),
});

// ===============================================
// Export Hooks (RTK Query auto-generated)
// ===============================================
export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useGetRecommendedRecipesQuery,
  useGetRecipesByCategoryQuery,
  useSearchByIngredientsQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipesApi;

// ===============================================
// Recipe Panel Slice - סטייט גלובלי נוסף
// (לא קשור לקריאות שרת - לכן נשאר כ-slice רגיל)
// ===============================================

interface RecipePanelState {
  selectedCategory: RecipeCategory | null;
  searchTerm: string;
  currentPage: number;
  pageSize: number;
}

const initialPanelState: RecipePanelState = {
  selectedCategory: null,
  searchTerm: '',
  currentPage: 1,
  pageSize: 12,
};

const recipePanelSlice = createSlice({
  name: 'recipePanel',
  initialState: initialPanelState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<RecipeCategory | null>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1; // איפוס עמוד בשינוי קטגוריה
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    nextPage: (state) => {
      state.currentPage += 1;
    },
    previousPage: (state) => {
      if (state.currentPage > 1) state.currentPage -= 1;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    resetFilters: (state) => {
      state.selectedCategory = null;
      state.searchTerm = '';
      state.currentPage = 1;
    },
  },
});

export const {
  setSelectedCategory,
  setSearchTerm,
  nextPage,
  previousPage,
  setPageSize,
  resetFilters,
} = recipePanelSlice.actions;

export default recipePanelSlice.reducer;