# Recipe Client AI Skills — Index

**Quick reference to specialized skills for common development tasks.**

This directory contains focused guides that complement the main [AGENTS.md](../../AGENTS.md) with step-by-step instructions for specific patterns and workflows.

## Available Skills

### Core Development

| Skill | When to Use | Key Topics |
|-------|------------|-----------|
| **[Add API Endpoint](./add-api-endpoint.md)** | Adding RTK Query endpoints for backend communication | Injected endpoints, DTOs, cache invalidation, data transformation |
| **[Add Feature Page](./add-feature-page.md)** | Creating a new feature module with pages, routes, and state | Directory structure, Redux slices, routing, hooks pattern |
| **[Style Components](./style-components.md)** | Choosing styling approach (MUI, Tailwind, CSS) | Decision tree, BEM naming, CSS variables, responsive design |
| **[Form Validation](./form-validation.md)** | Implementing forms with React Hook Form | Validation rules, FormInput component, custom validators |

### Data Handling

| Skill | When to Use | Key Topics |
|-------|------------|-----------|
| **[Recipe Data Transformation](./recipe-data-transformation.md)** | Converting recipe backend/frontend data formats | Category normalization, importance mapping, JSON parsing |

---

## Quick Decision Guides

### "I need to fetch data from the API"

→ See **[Add API Endpoint](./add-api-endpoint.md)**

```typescript
// Quick pattern
const ingredientApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllIngredients: builder.query<IngredientDto[], void>({
      query: () => '/ingredients',
      providesTags: ['Ingredient'],
    }),
  }),
});
```

### "Recipe data looks wrong in the UI"

→ See **[Recipe Data Transformation](./recipe-data-transformation.md)**

```typescript
// Quick fix: Apply normalization
import { normalizeRecipe } from '@/features/recipe/types/recipe.types';
const normalized = normalizeRecipe(recipeFromServer);
```

### "I'm building a new page/feature"

→ See **[Add Feature Page](./add-feature-page.md)**

Steps:
1. Create directory: `features/[name]/pages/`, `components/`, `redux/`
2. Create page component
3. Register Redux slice in `src/app/store.ts`
4. Add route in `src/routes/AppRoutes.tsx`

### "How do I style this component?"

→ See **[Style Components](./style-components.md)**

Decision:
- Simple colors? → Use MUI `sx` prop
- Layout/spacing? → Use Tailwind
- Animations/media queries? → Create `.css` file

### "I need to validate a form"

→ See **[Form Validation](./form-validation.md)**

```typescript
import { useForm } from 'react-hook-form';
import { validation } from '@/shared/utils/validation';

const { register, formState: { errors } } = useForm();
// Use validation.phone, validation.email, validation.password, etc.
```

---

## Integration with AGENTS.md

These skills provide **step-by-step procedures** for patterns that are summarized in [AGENTS.md](../../AGENTS.md):

| AGENTS.md Section | Related Skills |
|-------------------|----------------|
| Common Patterns | All skills |
| Adding a New API Endpoint | [Add API Endpoint](./add-api-endpoint.md) |
| Adding a New Feature Page | [Add Feature Page](./add-feature-page.md) |
| Styling a Component | [Style Components](./style-components.md) |
| Forms & Validation | [Form Validation](./form-validation.md) |
| Data Transformation & Validation | [Recipe Data Transformation](./recipe-data-transformation.md) |

---

## How to Use These Skills

### In Conversations with Copilot

When working on a task, reference the skill:

> "I'm adding a new API endpoint. Follow the pattern in **Add API Endpoint skill**."

or

> "Help me style this component. Use the guidance in **Style Components skill**."

### Structure of Each Skill

Every skill contains:
1. **When to use** — Problem it solves
2. **Quick pattern** — Copy-paste starter code
3. **Step-by-step guide** — Detailed walkthrough
4. **Examples** — Real-world code snippets
5. **Tips** — Common gotchas and best practices
6. **Reference links** — Links to related files and AGENTS.md sections

---

## Contributing to Skills

When adding new skills:

1. **Name clearly** → Verb + noun (e.g., "add-feature-page", "configure-auth")
2. **Keep focused** → One skill = one task
3. **Provide examples** → Real code, not pseudocode
4. **Link liberally** → Reference AGENTS.md and other skills
5. **Include checklist** → Verification steps at the end

---

## FAQ

**Q: What's the difference between AGENTS.md and skills?**

A: **AGENTS.md** is comprehensive reference documentation (like an encyclopedia). **Skills** are focused how-to guides with step-by-step procedures (like recipes).

**Q: Which file should I read first?**

A: Start with [.github/copilot-instructions.md](../) for quick tips, then refer to **skills** for detailed procedures, then check [AGENTS.md](../../AGENTS.md) for deep context.

**Q: Can I use these skills in my own projects?**

A: Yes! The patterns are project-specific, but the structure and approach transfer well to other React + RTK Query + Redux projects.

---

**Last Updated**: May 2026  
**Stack**: React 19 + TypeScript 5.9 + Vite 7 + Redux Toolkit 2.11 + MUI 7 + Tailwind 3
