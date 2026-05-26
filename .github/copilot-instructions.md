# Copilot Instructions — Recipe Client

**Quick reference for AI agents working on this Recipe Client project.**

## Essential Commands

```bash
npm run dev      # Start Vite dev server (http://localhost:5173)
npm run build    # Type-check + bundle for production
npm run lint     # Run ESLint
npm run preview  # Preview production build locally
```

## Architecture at a Glance

- **Feature-based**: Code organized by `features/[name]` (auth, recipe, search, admin, etc.)
- **State management**: RTK Query with Fetch API (server) + Redux slices (UI)
- **Styling**: MUI + Tailwind + optional CSS files
- **Type safety**: Relaxed TypeScript (flexibility over strictness)
- **HTTP Client**: Fetch API via `fetchBaseQuery` (NOT axios)

See [AGENTS.md](../AGENTS.md) for **full architecture guide, patterns, and gotchas**.

## Critical Patterns You MUST Know

### 1. Recipe Category Transformation ⚠️
Backend sends category as **number** (0–29); frontend uses **string** (Cakes, Cookies, etc.).
- **Rule**: Always apply `normalizeRecipe()` from [src/features/recipe/types/recipe.types.ts](../src/features/recipe/types/recipe.types.ts) to recipe objects
- **Auto-applied** in RTK Query hooks (via `transformResponse`)
- **Manual apply** in forms, non-RTK contexts

```typescript
import { normalizeRecipe } from '@/features/recipe/types/recipe.types';
const normalized = normalizeRecipe(recipeFromServer);
```

### 2. Session Persistence
Auth state lost on page refresh unless `restoreAuth()` is called on app init.
- **Location**: [src/App.tsx](../src/App.tsx) — verify it calls `dispatch(restoreAuth())`
- **How it works**: JWT stored in localStorage; restored on app startup

### 3. Admin Role Detection
Admin status comes from JWT claim `http://schemas.microsoft.com/ws/2008/06/identity/claims/role`.
- **Location**: [src/features/auth/redux/authSlice.ts](../src/features/auth/redux/authSlice.ts)
- **Usage**: Redux selector `useAppSelector(state => state.auth.isAdmin)`

### 4. Form Validation
Uses React Hook Form (NOT yup).
- **Rules location**: [src/shared/utils/validation.ts](../src/shared/utils/validation.ts)
- **Phone constraint**: Israeli only (`05XXXXXXXXX`)
- **Usage**: Import rules and pass to form `register()` inline

```typescript
import { validation } from '@/shared/utils/validation';
register('phone', { validate: validation.phone.validate })
```

### 5. API Endpoints
RTK Query with injected endpoints pattern.
- **Pattern**: Each `src/api/[domain]Api.ts` file injects endpoints into `baseApi`
- **Tag-based cache invalidation** keeps data in sync
- **Auth auto-injected** via `baseApi.prepareHeaders()` (Bearer token added automatically)

```typescript
// Pattern in src/api/ingredientApi.ts
export const ingredientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIngredients: builder.query<IngredientDto[], void>({
      query: () => '/ingredients',
      providesTags: ['Ingredient'],
    }),
  }),
});
export const { useGetAllIngredientsQuery } = ingredientApi;
```

## Common Tasks

### Add a New Page
1. Create `features/[name]/pages/[Name]Page.tsx` + optional `.css`
2. Create `features/[name]/redux/[name]Slice.ts` if you need state
3. Add route in [src/routes/AppRoutes.tsx](../src/routes/AppRoutes.tsx)
4. Register slice in [src/app/store.ts](../src/app/store.ts) if needed

### Add an API Endpoint
1. Create or update `src/api/[domain]Api.ts`
2. Inject endpoint with `baseApi.injectEndpoints()`
3. Export the hook: `export const { useMyHook } = [domain]Api`
4. Import and use in component

### Style a Component
1. **Simple** (buttons, text): Use MUI `sx` prop
2. **Medium** (layout, spacing): Use Tailwind classes
3. **Complex** (animations, media queries): Create `ComponentName.css` and import at top
4. **Use CSS variables**: `color: var(--primary-pink);` from [src/styles/variables.css](../src/styles/variables.css)

### Add Validation Rule
1. Add to [src/shared/utils/validation.ts](../src/shared/utils/validation.ts)
2. Import in your form component
3. Pass to React Hook Form `register()` directly

## Common Gotchas

| Problem | Solution |
|---------|----------|
| Recipe data type mismatch (number vs string category) | Use `normalizeRecipe()` on all recipe queries; auto-applied in RTK Query but manual apply needed in Redux dispatch contexts. See [Data Transformation](../AGENTS.md#data-transformation--validation). |
| Auth lost on page refresh | Verify `restoreAuth()` is called in [App.tsx](../src/App.tsx) |
| CSS file not working | Ensure you `import './MyComponent.css'` at the top of the component |
| Form validation not triggering | Check rules exist in [validation.ts](../src/shared/utils/validation.ts) and are passed to `register()` |
| API returns 401 Unauthorized | JWT might be missing or expired; check auth slice has valid token. See [Environment Setup](../AGENTS.md#environment-setup--configuration). |
| Admin button not showing | Verify JWT is parsed correctly for admin role claim |
| Non-serializable Redux error | Intentional for modal callbacks in `uiSlice.ts`; middleware configured to ignore |
| Two recipe search hooks confusing | `useRecipes()` = client-side filtering | `useRecipeSearch()` = API search. See [Feature-Specific Hooks](../AGENTS.md#feature-specific-hooks). |
| Images broken in production | Don't hardcode `/src/assets/...` paths; use dynamic imports instead. See [Asset Handling](../AGENTS.md#styling-strategy-layered). |

## File Organization Quick Reference

```
src/
├── api/                    # RTK Query baseApi + injected endpoints
├── app/store.ts            # Redux store + all slices
├── features/
│   ├── auth/               # Auth pages, forms, redux, hooks
│   ├── recipe/             # Recipe CRUD, list, detail
│   ├── search/             # Search page & filters
│   ├── admin/              # Admin dashboard & features
│   ├── user/               # User profile
│   ├── chat/               # SignalR chat
│   └── ...
├── redux/slices/uiSlice.ts # Global UI state (modals, theme, etc.)
├── routes/                 # Route guards (ProtectedRoute, AdminRoute)
├── shared/
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom hooks (useDebounce, etc.)
│   └── utils/              # validation.ts, formatting.ts, helpers.ts
└── styles/                 # CSS variables, themes, global styles
```

## Redux Hooks

Always use typed hooks from [src/redux/hooks.ts](../src/redux/hooks.ts):

```typescript
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const dispatch = useAppDispatch();
const { user, isAuthenticated } = useAppSelector(state => state.auth);
```

## Need More Details?

→ **[AGENTS.md](../AGENTS.md)** has the comprehensive guide with full patterns, data transformations, real-time features, and API reference.

---

**Last Updated**: May 2026  
**Stack**: React 19 + TypeScript 5.9 + Vite 7 + Redux Toolkit 2.11 + MUI 7 + Tailwind 3
