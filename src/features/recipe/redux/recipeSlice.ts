import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { baseApi } from '../../../api/baseApi';
import type { Recipe, RecipeCreateDto, RecipeUpdateDto, RecipeCategory } from '../types/recipe.types';
import { normalizeRecipe, CATEGORY_TO_INT, IMPORTANCE_TO_INT } from '../types/recipe.types';

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
 
export interface RankedRecipe {
  recipe: Recipe;
  matchScore: number;
  matchLabel: string;
  matchedCriteria: string[];
  missedCriteria: string[];
}

export interface AdvancedSearchResult {
  intent: {
    category: string | null;
    tags: string[];
    difficultyLevel: number | null;
    maxPrepTime: number | null;
    keywords: string[];
    originalText: string;
  };
  results: RankedRecipe[]; 
} 

export const recipesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<Recipe[], void>({
      query: () => '/recipe',
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
      providesTags: ['Recipes'],
    }),

    getRecipeById: builder.query<Recipe, number>({
      query: (id) => `/recipe/${id}`,
      transformResponse: (raw: unknown) => normalizeRecipe(raw),
      providesTags: (_result, _error, id) => [{ type: 'Recipe', id }],
    }),

    getRecommendedRecipes: builder.query<Recipe[], void>({
      query: () => '/recipe/recommended',
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
    }),

    getRecipesByCategory: builder.query<Recipe[], string>({
      query: (category) => `/recipe/category/${category}`,
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
    }),

    searchByIngredients: builder.query<Recipe[], string[]>({
      query: (ingredients) => ({ url: '/recipe/search-by-ingredients', method: 'POST', body: ingredients }),
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
    }),

    searchByTags: builder.query<Recipe[], string[]>({
      query: (tags) => ({ url: '/recipe/search-by-tags', method: 'POST', body: tags }),
      transformResponse: (raw: unknown[]) => raw.map(normalizeRecipe),
    }),
    
    analyzeAndSearch: builder.query<AdvancedSearchResult, string>({
      query: (text) => ({ url: '/search/advanced', method: 'POST', body: JSON.stringify(text) }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformResponse: (raw: any) => ({
      intent: raw.intent,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: raw.results.map((r: any) => ({
        ...r,
        recipe: normalizeRecipe(r.recipe),  
          })),
        }),
      }),

    createRecipe: builder.mutation<Recipe, RecipeCreateDto>({
      query: (newRecipe) => ({ url: '/recipe', method: 'POST', body: serializeForServer(newRecipe) }),
      transformResponse: (raw: unknown) => normalizeRecipe(raw),
      async onQueryStarted(newRecipe, { dispatch, queryFulfilled }) {
        const tempId = Date.now();
        const patch = dispatch(
          recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
            draft.unshift({ ...newRecipe, id: tempId, averageRating: 0, commentCount: 0 } as Recipe);
          })
        );
        try {
          const { data: created } = await queryFulfilled;
          dispatch(
            recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
              const idx = draft.findIndex((r) => r.id === tempId);
              if (idx !== -1) draft[idx] = created;
            })
          );
        } catch { patch.undo(); }
      },
      invalidatesTags: ['Recipes'],
    }),

    updateRecipe: builder.mutation<Recipe, { id: number; data: RecipeUpdateDto }>({
      query: ({ id, data }) => ({
        url: `/recipe/${id}`,
        method: 'PATCH',
        body: serializeForServer(data),
      }),
      transformResponse: (raw: unknown) => normalizeRecipe(raw),
      async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
            const idx = draft.findIndex((r) => r.id === id);
            if (idx !== -1) draft[idx] = { ...draft[idx], ...data } as Recipe;
          })
        );
        try { await queryFulfilled; } catch { patch.undo(); }
      },
      invalidatesTags: (_result, _error, { id }) => ['Recipes', { type: 'Recipe', id }],
    }),

    deleteRecipe: builder.mutation<void, number>({
      query: (id) => ({ url: `/recipe/${id}`, method: 'DELETE' }),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          recipesApi.util.updateQueryData('getRecipes', undefined, (draft) => {
            const idx = draft.findIndex((r) => r.id === id);
            if (idx !== -1) draft.splice(idx, 1);
          })
        );
        try { await queryFulfilled; } catch { patch.undo(); }
      },
      invalidatesTags: ['Recipes'],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useGetRecommendedRecipesQuery,
  useGetRecipesByCategoryQuery,
  useSearchByIngredientsQuery,
  useSearchByTagsQuery,
  useAnalyzeAndSearchQuery,
  useCreateRecipeMutation,
  useUpdateRecipeMutation,
  useDeleteRecipeMutation,
} = recipesApi;

// ── Recipe Panel UI Slice ──────────────────────────────────────────────────

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
      state.currentPage = 1;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.currentPage = 1;
    },
    nextPage: (state) => { state.currentPage += 1; },
    previousPage: (state) => { if (state.currentPage > 1) state.currentPage -= 1; },
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