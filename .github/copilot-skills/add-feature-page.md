# Add a New Feature Page

**Skill**: Scaffold a new feature module with pages, components, state, and routing.

## When to Use

When adding a new major feature (e.g., new admin panel, new search mode, new user section).

## Step-by-Step

### Step 1: Create Feature Directory Structure

```
features/[featureName]/
├── pages/
│   ├── [FeatureName]Page.tsx
│   └── [FeatureName]Page.css (optional)
├── components/
│   ├── MyComponent.tsx
│   └── MyComponent.css (optional)
├── hooks/
│   └── useMyHook.ts
├── redux/
│   └── [featureName]Slice.ts
└── types/
    └── [featureName].types.ts
```

### Step 2: Create the Page Component

**Example: New `RecipeReviewPage`**

```typescript
// features/recipe/pages/RecipeReviewPage.tsx
import './RecipeReviewPage.css';

interface RecipeReviewPageProps {}

export default function RecipeReviewPage({}: RecipeReviewPageProps) {
  return (
    <div className="recipe-review-page">
      <h1>Recipe Reviews</h1>
      {/* Page content */}
    </div>
  );
}
```

### Step 3: Create Redux Slice (if needed)

```typescript
// features/recipe/redux/recipeReviewSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RecipeReviewState {
  filters: {
    rating: number | null;
    sortBy: 'recent' | 'popular';
  };
  selectedRecipeId: number | null;
}

const initialState: RecipeReviewState = {
  filters: { rating: null, sortBy: 'recent' },
  selectedRecipeId: null,
};

const recipeReviewSlice = createSlice({
  name: 'recipeReview',
  initialState,
  reducers: {
    setRatingFilter: (state, action: PayloadAction<number | null>) => {
      state.filters.rating = action.payload;
    },
    setSortBy: (state, action: PayloadAction<'recent' | 'popular'>) => {
      state.filters.sortBy = action.payload;
    },
    setSelectedRecipe: (state, action: PayloadAction<number | null>) => {
      state.selectedRecipeId = action.payload;
    },
  },
});

export const { setRatingFilter, setSortBy, setSelectedRecipe } = recipeReviewSlice.actions;
export default recipeReviewSlice.reducer;
```

### Step 4: Register Slice in Store

Add to [src/app/store.ts](../../src/app/store.ts):

```typescript
import recipeReviewReducer from '@/features/recipe/redux/recipeReviewSlice';

export const store = configureStore({
  reducer: {
    // ... existing slices
    recipeReview: recipeReviewReducer,
  },
});
```

### Step 5: Add Route

Add to [src/routes/AppRoutes.tsx](../../src/routes/AppRoutes.tsx):

```typescript
import RecipeReviewPage from '@/features/recipe/pages/RecipeReviewPage';

// Inside the Routes component
<Route path="/recipes/reviews" element={<RecipeReviewPage />} />
```

### Step 6: Add to Navigation (if needed)

Update navigation links in your layout or header to include the new route.

## Optional: Create API Endpoints

If the page needs API calls, create [src/api/[domain]Api.ts](../../src/api) or update existing:

```typescript
// src/api/recipeApi.ts
export const recipeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getRecipeReviews: builder.query<ReviewDto[], { recipeId: number }>({
      query: ({ recipeId }) => `/recipes/${recipeId}/reviews`,
      providesTags: ['Review'],
    }),
  }),
});

export const { useGetRecipeReviewsQuery } = recipeApi;
```

## Optional: Create Feature Hooks

For complex state logic, create [features/[name]/hooks/](../../src/features/recipe/hooks/):

```typescript
// features/recipe/hooks/useRecipeReviews.ts
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { useGetRecipeReviewsQuery } from '@/api/recipeApi';
import { setRatingFilter } from '../redux/recipeReviewSlice';

export function useRecipeReviews(recipeId: number) {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.recipeReview.filters);
  const { data: reviews, isLoading } = useGetRecipeReviewsQuery({ recipeId });

  const updateRatingFilter = (rating: number | null) => {
    dispatch(setRatingFilter(rating));
  };

  return { reviews, isLoading, filters, updateRatingFilter };
}
```

Then use in your page:

```typescript
export default function RecipeReviewPage() {
  const { reviews, filters, updateRatingFilter } = useRecipeReviews(123);
  
  return (
    // JSX using reviews and handlers
  );
}
```

## Styling

Choose based on complexity:

1. **Simple**: Use MUI `sx` prop or Tailwind classes
2. **Medium**: Create `[FeatureName]Page.css` with BEM-style classes
3. **Complex**: Use CSS with media queries, animations

Always import CSS at the top: `import './RecipeReviewPage.css';`

## Checklist

- [ ] Created feature directory structure
- [ ] Created page component (`[Name]Page.tsx`)
- [ ] Created Redux slice (if stateful)
- [ ] Registered slice in `src/app/store.ts`
- [ ] Created API endpoints (if needed)
- [ ] Added route in `src/routes/AppRoutes.tsx`
- [ ] Added navigation link (if needed)
- [ ] Created component-scoped CSS (if complex styling needed)

---

See [AGENTS.md — Adding a New Feature Page](../../AGENTS.md#adding-a-new-feature-page) for more details.
