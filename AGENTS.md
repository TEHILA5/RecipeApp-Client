# Recipe Client — AI Agent Guide

A **feature-based React + TypeScript + Vite application** for recipe sharing, searching, and admin management. This guide helps AI agents understand the architecture and contribute productively.

## Quick Start

| Task | Command |
|------|---------|
| **Dev server** | `npm run dev` (Vite HMR on http://localhost:5173) |
| **Build** | `npm run build` (TypeScript check + Vite bundle) |
| **Lint** | `npm run lint` (ESLint) |
| **Preview** | `npm run preview` (production build preview) |

## Architecture Overview

### Feature-Based Organization
Code is organized by **feature modules** (not by layer). Each feature contains its own components, pages, types, and state:

```
features/
├── auth/          → Login, register, JWT token, session management
├── recipe/        → Recipe CRUD, listing, detail view
├── ingredient/    → Ingredient management & selection
├── search/        → Search recipes with filters
├── admin/         → Admin dashboard, user/recipe/ingredient moderation
├── user/          → User profile & preferences
├── chat/          → Real-time chat via SignalR
├── conversions/   → Unit conversion utilities
└── static/        → Pages like About, Contact
```

**Benefit**: Co-locate related code; easier to scale features independently.

### State Management (Hybrid)

#### **Server State: RTK Query** (API-driven)
Centralized `baseApi` with **injected endpoints** from feature-specific API files:

- **Files**: `src/api/*Api.ts` (authApi, ingredientApi, userActionApi, etc.)
- **Pattern**: Each file injects endpoints into baseApi with automatic tag-based cache invalidation
- **Example**: See [src/api/authApi.ts](src/api/authApi.ts)

```typescript
// Pattern: injected endpoints with tags
export const ingredientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIngredients: builder.query<IngredientDto[], void>({
      query: () => '/ingredients',
      providesTags: ['Ingredient'],
    }),
  }),
});
```

#### **UI State: Redux Toolkit Slices**
Global & feature-specific slices for UI (modals, toasts, theme, auth), kept separate from server data:

- **Files**: `src/redux/slices/uiSlice.ts` (global), `features/*/redux/*Slice.ts` (auth, admin, etc.)
- **Example**: See [src/features/auth/redux/authSlice.ts](src/features/auth/redux/authSlice.ts)

#### **Store Setup**
See [src/app/store.ts](src/app/store.ts) — combines all slices and RTK Query baseApi.

### Component Structure

- **Pages**: `features/*/pages/[Name]Page.tsx` + `[Name]Page.css`
  - Handles routing & feature-level orchestration
- **Components**: `features/*/components/[Name].tsx` (scoped styling adjacent)
  - Reusable within feature or across via `src/shared/components/`
- **Shared Components**: `src/shared/components/` (FormInput, StarRating, ImageLazyLoad, UI/Layout helpers)

### Styling Strategy (Layered)

1. **CSS Variables** (`src/styles/variables.css`) — color palette, spacing defaults
2. **Material-UI Theme** (`src/styles/themes/muiTheme.ts`) — customized with pink/gold scheme
3. **Feature CSS** (`features/*/components/*.css`, `features/*/pages/*.css`) — local overrides
4. **Tailwind** (`tailwind.config.js`) — utility classes for rapid layout (light usage)

**Color Palette**:
- Primary: `#e8799a` (pink)
- Secondary: `#c4894a` (gold)
- Light backgrounds, gradients, hover effects heavily used

### Authentication & Authorization

- **Token Storage**: JWT in localStorage (see [authSlice](src/features/auth/redux/authSlice.ts))
- **Auto-Injection**: Bearer token auto-added in [`baseApi.prepareHeaders()`](src/api/baseApi.ts)
- **Protected Routes**: [ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx), [AdminRoute.tsx](src/routes/AdminRoute.tsx)
- **Role Parsing**: Admin status decoded from JWT claims in `authSlice.ts`
- **Session Restore**: `restoreAuth()` called on app init to restore session from localStorage on page refresh

### Data Transformation & Validation

**Recipe Category Mapping** (Critical Pattern):
- Backend returns category as `number` (0-29)
- Frontend uses category `string` (Cakes, Cookies, etc.)
- **Conversion**: `normalizeRecipe()` (int→string), `serializeForServer()` (string→int)
- **Location**: [src/features/recipe/types/recipe.types.ts](src/features/recipe/types/recipe.types.ts)
- **Usage**: Auto-applied in RTK Query hooks; must manually apply in non-RTK contexts

**Validation**:
- Centralized rules in [src/shared/utils/validation.ts](src/shared/utils/validation.ts)
- Phone format: Israeli only (`05XXXXXXXXX`)
- Email, password, required fields defined here
- Used with React Hook Form + Yup

### Forms & Validation

- **Framework**: React Hook Form + Yup resolver
- **Example**: [LoginForm.tsx](src/features/auth/components/LoginForm.tsx)
- **Shared Input**: [FormInput.tsx](src/shared/components/FormInput.tsx) — wraps MUI TextField with validation

## Common Patterns

### Adding a New API Endpoint

1. Create/update `src/api/[domain]Api.ts`:

```typescript
export const ingredientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createIngredient: builder.mutation<IngredientDto, CreateIngredientDto>({
      query: (payload) => ({
        url: '/ingredients',
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: ['Ingredient'],
    }),
  }),
});

export const { useCreateIngredientMutation } = ingredientApi;
```

2. Import hook in component, use like `const [createIng] = useCreateIngredientMutation()`.

### Adding a New Feature Page

1. Create directory: `features/[name]/pages/`, `features/[name]/components/`, `features/[name]/redux/`
2. Create page: `features/[name]/pages/[Name]Page.tsx` + `[Name]Page.css`
3. If needed, create RTK Query API: `src/api/[name]Api.ts`
4. Add to store: import slice in [src/app/store.ts](src/app/store.ts)
5. Add route: [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx)

### Styling a Component

1. Create `ComponentName.css` adjacent to `ComponentName.tsx`
2. Use CSS variables for colors: `color: var(--primary-pink);`
3. For MUI-specific styling, customize in [muiTheme.ts](src/styles/themes/muiTheme.ts)
4. For utility classes, use Tailwind

## Important Conventions & Gotchas

| Issue | Details | Fix |
|-------|---------|-----|
| **Recipe data mismatch** | Backend sends category as `number`; frontend expects `string` | Apply `normalizeRecipe()` to all recipe queries |
| **Session lost on refresh** | Auth state not persisted | Ensure `restoreAuth()` called on app init (check [main.tsx](src/main.tsx)) |
| **Type errors in Redux** | Non-serializable function in middleware | UI slice disables serialization check for modal callbacks; acceptable here |
| **Form validation fails** | Custom rules not applied | Check [validation.ts](src/shared/utils/validation.ts) for available validators |
| **API auth fails** | Missing Bearer token | Token auto-injected in `baseApi`; verify JWT stored in auth slice |

## Type System

- **DTOs** (API contracts): Defined inline in `src/api/*Api.ts`
- **Domain Models** (UI logic): In `features/*/types/*Types.ts`
- **Mappings**: Constants in type files (e.g., `RECIPE_CATEGORIES_MAP`)
- **Avoid `any`**: Use TypeScript strict mode for safety

## Real-Time Features

- **Chat**: SignalR (`@microsoft/signalr`) connection in [SweetieChat.tsx](src/features/chat/SweetieChat.tsx)
- **Connection state**: Managed in chat hooks

## Key Files by Use Case

| Need | File(s) |
|------|---------|
| Add a new API endpoint | [src/api/baseApi.ts](src/api/baseApi.ts), `src/api/[domain]Api.ts` |
| Add a new page | [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx), `features/[name]/pages/` |
| Add Redux state | `features/*/redux/*Slice.ts` or `src/redux/slices/*Slice.ts` |
| Style a component | Companion `.css` file + [src/styles/themes/muiTheme.ts](src/styles/themes/muiTheme.ts) for MUI |
| Validate user input | [src/shared/utils/validation.ts](src/shared/utils/validation.ts) |
| Protect a route | [src/routes/ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx), [src/routes/AdminRoute.tsx](src/routes/AdminRoute.tsx) |
| Share a component | `src/shared/components/` |
| Add global CSS variables | [src/styles/variables.css](src/styles/variables.css) |

## Build & Deployment

- **Type Checking**: `tsc -b` runs before Vite build
- **Output**: `dist/` folder (Vite bundles + minifies)
- **ESLint**: Run before commit (`npm run lint`)

---

**Last Updated**: May 2026  
**Stack**: React 19 + TypeScript 5.9 + Vite 7 + Redux Toolkit 2.11 + Material-UI 7 + Tailwind 3
