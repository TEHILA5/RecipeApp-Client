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

- **Pages**: `features/*/pages/[Name]Page.tsx` + optional `[Name]Page.css`
  - Handles routing & feature-level orchestration
- **Components**: `features/*/components/[Name].tsx` (scoped styling adjacent if needed)
  - Reusable within feature or across via `src/shared/components/`
- **Shared Components**: `src/shared/components/` (FormInput, StarRating, ImageLazyLoad, UI/Layout helpers)

### Styling Strategy (Layered)

1. **CSS Variables** (`src/styles/variables.css`) — color palette, spacing defaults
2. **Material-UI Theme** (`src/styles/themes/muiTheme.ts`) — customized with pink/gold scheme
3. **Feature CSS** (`features/*/components/*.css`, `features/*/pages/*.css`) — local overrides (optional)
4. **Tailwind** (`tailwind.config.js`) — utility classes for rapid layout (light usage)

**Color Palette**:
- Primary: `#e8799a` (pink)
- Secondary: `#c4894a` (gold)
- Light backgrounds, gradients, hover effects heavily used

**⚠️ CSS Pairing**: CSS files (`.css`) are **optional**. Not all components have them. Many use MUI classes or Tailwind utilities exclusively. Choose your approach per component:
- **Prefer MUI styling** for Material-UI components (TextField, Button, Card, etc.)
- **Use Tailwind utilities** for layout & quick styling
- **Create `.css` file** only when complex styling is needed (animations, media queries, special effects)

### Authentication & Authorization

- **Token Storage**: JWT in localStorage (see [authSlice](src/features/auth/redux/authSlice.ts))
- **Auto-Injection**: Bearer token auto-added in [`baseApi.prepareHeaders()`](src/api/baseApi.ts)
- **Protected Routes**: [ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx), [AdminRoute.tsx](src/routes/AdminRoute.tsx)
- **Role Parsing**: Admin status decoded from JWT claims in `authSlice.ts`

```typescript
// Admin role extracted from JWT token payload
const isAdminFromToken = (token: string): boolean => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
  return role === 'Admin';
};
```

- **Session Restore**: `restoreAuth()` action called on app init (see [App.tsx](src/App.tsx)) to restore session from localStorage on page refresh

### Data Transformation & Validation

**Recipe Category Mapping** (Critical Pattern):
- Backend returns category as `number` (0-29)
- Frontend uses category `string` (Cakes, Cookies, etc.)
- **Conversion**: `normalizeRecipe()` (int→string), `serializeForServer()` (string→int, private function in recipeSlice)
- **Normalization**: `normalizeRecipe()` defined in [src/features/recipe/types/recipe.types.ts](src/features/recipe/types/recipe.types.ts)
- **Serialization**: `serializeForServer()` defined in [src/features/recipe/redux/recipeSlice.ts](src/features/recipe/redux/recipeSlice.ts) (private)
- **Usage**: Auto-applied in RTK Query hooks via `transformResponse`; must manually apply in non-RTK contexts
- **Constant Maps**: `RECIPE_CATEGORIES_MAP` (string→number), `INT_TO_CATEGORY` (number→string) in recipe.types.ts

**Ingredient Importance Mapping** (Similar Pattern):
- Backend returns importance as `number` (1=Essential, 2=Recommended, 3=Optional)
- Frontend uses importance `string` for display
- **Mappings**: `INT_TO_IMPORTANCE`, `IMPORTANCE_TO_INT` in ingredient types
- **Auto-converted**: In `normalizeRecipe()` for recipe ingredient lists

**Tags & JSON Parsing**:
- Backend stores tags as JSON string in recipe
- Automatically parsed by `normalizeRecipe()` into `string[]`
- When sending to server, stringify back to JSON format

**Validation**:
- Centralized rules in [src/shared/utils/validation.ts](src/shared/utils/validation.ts)
- Phone format: Israeli only (`05XXXXXXXXX`)
- Email, password, required fields defined here
- Used with React Hook Form only (inline validation rules)

### Forms & Validation

- **Framework**: React Hook Form with inline validation rules (no external validator library)
- **Example**: [LoginForm.tsx](src/features/auth/components/LoginForm.tsx)
- **Shared Input**: [FormInput.tsx](src/shared/components/FormInput.tsx) — wraps MUI TextField with validation
- **Validation Rules**: All custom rules centralized in [src/shared/utils/validation.ts](src/shared/utils/validation.ts); imported and used directly in form register calls

## Custom Hooks (Shared Utilities)

### Shared Hooks (`src/shared/hooks/`)

| Hook | Purpose | Example |
|------|---------|----------|
| `useDebounce(value, ms)` | Debounce input changes | Search, filter inputs |
| `useClickOutside(ref, callback)` | Detect clicks outside element | Close modals, dropdowns |
| `useInfiniteScroll(callback, options)` | Lazy-load on scroll | Recipe listing, pagination |
| `useLocalStorage(key, initialValue)` | Persist state to localStorage | Theme preference, filters |
| `useMediaQuery(query)` | Detect responsive breakpoints | Mobile/desktop layouts |
| `useScrollToTop()` | Scroll page to top on navigation | After page change |

**Usage**: Import from `src/shared/hooks/` and use in any component. These prevent code duplication.

### Redux Hooks (`src/redux/hooks.ts`)

- **`useAppDispatch()`**: Typed Redux dispatch hook (dispatch actions with type safety)
- **`useAppSelector(selector)`**: Typed Redux selector hook (access Redux state with type safety)

**Usage**: Use these instead of `useDispatch()` and `useSelector()` from Redux for full TypeScript support:
```typescript
const dispatch = useAppDispatch();
const { user, isAuthenticated } = useAppSelector(state => state.auth);
```

### Feature-Specific Hooks
Each feature may expose custom hooks for managing feature state and API interactions:

| Hook | Location | Purpose |
|------|----------|---------|  
| `useRecipes()` | `features/recipe/hooks/` | Search, filter, sort recipes with debouncing |
| `useRecipeSearch()` | `features/recipe/hooks/` | Multi-mode search (name/category/ingredients) |
| `useRecipeDetail()` | `features/recipe/hooks/` | Single recipe operations & mutations |
| `useAuth()` | `features/auth/hooks/` | Auth state, login/logout, token refresh |
| `useUserProfile()` | `features/user/hooks/` | Profile save/delete with optimistic updates |
| `useChat()` | `features/chat/hooks/` | SignalR connection lifecycle & messaging |

**Usage**: Import from `features/[name]/hooks/` and use to encapsulate feature logic.

### Utility Functions (`src/shared/utils/`)

**formatting.ts**:
- `calcAverageRating(ratings: number[])` — Calculate average of rating array
- `sortBy(array, key)` — Generic array sorting by property
- `unique(array, key?)` — Deduplicate array
- `sleep(ms)` — Promise-based sleep utility
- `truncate(str, length)` — Truncate string to length
- `formatDate(str)` — Format date in US locale (en-US)
- `formatShortDate(date)` — Format date in Hebrew locale (he-IL)
- `formatTime(minutes)` — Format duration as "1h 30m" or "45m"
- `formatRating(rating)` — Format rating for display

**helpers.ts**:
- Various app-specific helpers (check file for current utilities)

**validation.ts**:
- Phone, email, password, required field validators
- Constants: `PHONE_REGEX`, `EMAIL_REGEX`, etc.

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
2. Create page: `features/[name]/pages/[Name]Page.tsx` + optional `[Name]Page.css`
3. If needed, create RTK Query API: `src/api/[name]Api.ts`
4. Add to store: import slice in [src/app/store.ts](src/app/store.ts)
5. Add route: [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx)

### Styling a Component

**Choose based on complexity:**

1. **Simple components** → Use MUI `sx` prop or Tailwind classes directly
   ```typescript
   <Button sx={{ color: 'var(--primary-pink)', padding: '8px' }} />
   ```

2. **Medium complexity** → Create component `.css` file
   ```typescript
   // MyComponent.tsx
   import './MyComponent.css';
   export default function MyComponent() {
     return <div className="my-component">...</div>;
   }
   ```

3. **Complex styling** → Create `.css` file with media queries, animations
   ```css
   /* MyComponent.css */
   .my-component { /* ... */ }
   @media (max-width: 768px) { /* ... */ }
   @keyframes slideIn { /* ... */ }
   ```

Use CSS variables for colors: `color: var(--primary-pink);`

For MUI-specific styling, customize in [muiTheme.ts](src/styles/themes/muiTheme.ts)

## Error Handling Patterns

The app uses **inconsistent error handling** by design (no central error boundary yet). Common patterns:

1. **Local Component State** (Pages & Forms):
   ```typescript
   const [error, setError] = useState('');
   try {
     await someAction().unwrap();
   } catch (err) {
     setError('User-friendly message');
   }
   ```

2. **Redux Slice State** (Auth, Admin):
   ```typescript
   // In slice
   extraReducers: (builder) => {
     builder.addCase(loginUser.rejected, (state, action) => {
       state.error = action.payload || 'Login failed';
     });
   }
   ```

3. **Console & No UI Feedback** (Less critical operations):
   ```typescript
   try {
     await deleteItem().unwrap();
   } catch (err) {
     console.error('Failed to delete:', err);
   }
   ```

**Future improvement**: Add error boundaries and centralized toast/snackbar notifications for critical errors.

## Important Conventions & Gotchas

| Issue | Details | Fix |
|-------|---------|-----|
| **Recipe data mismatch** | Backend sends category as `number`; frontend expects `string` | Apply `normalizeRecipe()` to all recipe queries |
| **Ingredient importance not transformed** | Importance field returns as number but needs string for display | Also handled by `normalizeRecipe()` |
| **Session lost on refresh** | Auth state not persisted | Ensure `restoreAuth()` called on app init (see [App.tsx](src/App.tsx)) |
| **Type errors in Redux** | Non-serializable function in middleware | UI slice disables serialization check for modal callbacks; acceptable here |
| **Form validation fails** | Custom rules not applied | Check [validation.ts](src/shared/utils/validation.ts) for available validators |
| **API auth fails** | Missing Bearer token | Token auto-injected in `baseApi`; verify JWT stored in auth slice |
| **CSS not applying** | CSS file not imported in component | Always import `.css` at top of component: `import './ComponentName.css';` |
| **CSS files are optional** | Not all components have `.css` pairs | Use MUI `sx` or Tailwind if `.css` not needed |
| **Admin role missing** | JWT not properly parsed | Check `isAdminFromToken()` in [authSlice.ts](src/features/auth/redux/authSlice.ts) |
| **Unused dependency** | `yup` validator in package.json but not used | App uses React Hook Form inline rules instead; safe to remove |

### Redux Slices Reference

All Redux state is centralized in [src/app/store.ts](src/app/store.ts). Key slices:

| Slice | Location | Purpose |
|-------|----------|---------|  
| `auth` | `features/auth/redux/` | User, token, isAdmin, error state |
| `ui` | `src/redux/slices/` | Modals, toasts, theme, sidebar, loading states |
| `ingredients` | `features/ingredient/redux/` | Filter & selection state for ingredients |
| `recipe` (recipePanel) | `features/recipe/redux/` | Recipe CRUD panel & form state |
| `search` | `features/search/redux/` | Search filters & results state |
| `admin` | `features/admin/redux/` | Admin conversion & user selection state |
| `user` | `features/user/redux/` | User profile state |

**Note**: Some slices store non-serializable functions (e.g., `ui.modal.onConfirm`). This is intentional—middleware has explicit ignore rules configured.

## Type System

- **DTOs** (API contracts): Defined inline in `src/api/*Api.ts`
- **Domain Models** (UI logic): In `features/*/types/*Types.ts`
- **Mappings**: Constants in type files (e.g., `RECIPE_CATEGORIES_MAP`, `INT_TO_CATEGORY`, `INT_TO_IMPORTANCE`)
- **TypeScript Config**: `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters` are **disabled** (not strict); this is intentional for flexibility

## API Endpoints Reference

### Admin API (`src/api/adminApi.ts`)

| Endpoint | Purpose |
|----------|---------|  
| `getAllConversions()` | Fetch all ingredient conversion ratios |
| `createConversion()` | Create new ingredient conversion |
| `updateConversion()` | Update existing conversion |
| `deleteConversion()` | Delete conversion |
| `getAllIngredientsAdminQuery()` | Fetch all ingredients for admin UI |
| `getWeeklyStatsQuery()` | Fetch weekly category view statistics |
| `sendAdminReplyMutation()` | Send email reply to contact form |

**Usage**: [AdminDashboard.tsx](src/features/admin/pages/AdminDashboard.tsx) demonstrates conversion CRUD & analytics.

### Other API Files
- `authApi.ts` → Login, register, token refresh
- `ingredientApi.ts` → Ingredient CRUD & search
- `userApi.ts` → User profile, settings
- `recipeApi.ts` → Recipe CRUD, search (integrated in recipeSlice.ts)
- `chatApi.ts` → Chat initialization, history
- `contactApi.ts` → Contact form submission
- `userActionApi.ts` → User interactions (favorites, ratings)

## Real-Time Features

### Sweetie Chat (AI Assistant)
- **Framework**: SignalR WebSocket via `@microsoft/signalr`
- **Component**: [SweetieChat.tsx](src/features/chat/SweetieChat.tsx)
- **Features**: Real-time chat, AI recipe suggestions, recipe analysis
- **Connection Management**: HubConnection lifecycle in chat hooks (auto-reconnection)
- **API**: See [src/api/chatApi.ts](src/api/chatApi.ts) for endpoints
- **State**: Chat messages managed in Redux
- **Hub URL**: Derived from `VITE_API_BASE_URL` with `/api` suffix removed

## Key Files by Use Case

| Need | File(s) |
|------|---------|
| Add a new API endpoint | [src/api/baseApi.ts](src/api/baseApi.ts), `src/api/[domain]Api.ts` |
| Add a new page | [src/routes/AppRoutes.tsx](src/routes/AppRoutes.tsx), `features/[name]/pages/` |
| Add Redux state | `features/*/redux/*Slice.ts` or `src/redux/slices/*Slice.ts` |
| Style a component | Companion `.css` file (optional) + [src/styles/themes/muiTheme.ts](src/styles/themes/muiTheme.ts) for MUI |
| Validate user input | [src/shared/utils/validation.ts](src/shared/utils/validation.ts) |
| Protect a route | [src/routes/ProtectedRoute.tsx](src/routes/ProtectedRoute.tsx), [src/routes/AdminRoute.tsx](src/routes/AdminRoute.tsx) |
| Share a component | `src/shared/components/` |
| Add global CSS variables | [src/styles/variables.css](src/styles/variables.css) |
| Use custom hooks | `src/shared/hooks/` |

## Build & Deployment

- **Type Checking**: `tsc -b` runs before Vite build
- **Output**: `dist/` folder (Vite bundles + minifies)
- **ESLint**: Run before commit (`npm run lint`)
- **No tests**: Test setup does not exist in this project (experimental)

## Component Naming & Structure

### Files & Exports
- **Default export**: All components use `export default function ComponentName() { }`
- **Page naming**: `[FeatureName]Page.tsx` (e.g., `LoginPage.tsx`, `AdminDashboard.tsx`)
- **Component naming**: `[ComponentName].tsx` (PascalCase)
- **Redux naming**: `[featureName]Slice.ts`
- **API naming**: `[domainName]Api.ts`

### Props Typing
- **Props interfaces**: Defined **inline** near the component (NOT in separate type files)
  ```typescript
  interface MyComponentProps {
    title: string;
    onClose: () => void;
  }
  
  export default function MyComponent({ title, onClose }: MyComponentProps) { }
  ```

## Known Issues & Limitations

- **No test framework**: Jest, Vitest, or testing utilities are not set up. Any test additions are experimental.
- **Error handling**: Inconsistent across features. No centralized error boundary or toast notification system yet (see error patterns above).
- **TypeScript strictness**: `noImplicitAny`, `noUnusedLocals`, `noUnusedParameters` disabled for flexibility. Not as strict as typical TS projects.
- **Unused dependency**: `yup` in package.json is not used anywhere (app uses React Hook Form inline validation instead).
- **Environment config**: `.env` file exists with `VITE_API_BASE_URL=https://localhost:7244/api` for local development.

---

**Last Updated**: May 2026  
**Stack**: React 19 + TypeScript 5.9 + Vite 7 + Redux Toolkit 2.11 + Material-UI 7 + Tailwind 3
