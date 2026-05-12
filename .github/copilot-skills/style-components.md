# Style Components Effectively

**Skill**: Choose the right styling approach for different component complexity levels.

## Decision Tree

```
Does your component need:
├─ Simple color/padding changes? → Use MUI sx prop
├─ Layout (flex, grid, spacing)? → Use Tailwind utilities
├─ Animations/media queries? → Create .css file
└─ Complex custom styling? → Create .css file
```

## Approach 1: MUI `sx` Prop (Simple)

For Material-UI components with simple style changes:

```typescript
import { Button, Card, TextField } from '@mui/material';

export default function MyComponent() {
  return (
    <Card sx={{ padding: '16px', backgroundColor: 'var(--bg-light)' }}>
      <TextField
        label="Name"
        sx={{ marginBottom: '8px' }}
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: 'var(--primary-pink)',
          '&:hover': { backgroundColor: '#d6678a' },
        }}
      >
        Submit
      </Button>
    </Card>
  );
}
```

### CSS Variables Available

From [src/styles/variables.css](../../src/styles/variables.css):

- **Colors**: `--primary-pink`, `--secondary-gold`, `--bg-light`, `--text-dark`, etc.
- **Spacing**: Use standard px values (8px, 16px, 24px, etc.)
- **Fonts**: `--font-main`, `--font-heading`, etc.

## Approach 2: Tailwind Classes (Layout)

For layout, spacing, and quick styling:

```typescript
export default function MyComponent() {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold text-pink-500">Title</h1>
      <p className="text-gray-600">Description</p>
      <div className="flex justify-between items-center">
        <span>Label</span>
        <button className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600">
          Action
        </button>
      </div>
    </div>
  );
}
```

**Common Tailwind classes**:
- `flex`, `grid` — layout
- `gap-2`, `p-4`, `mx-2` — spacing
- `bg-white`, `text-gray-600` — colors
- `rounded`, `shadow` — decoration
- `hover:`, `focus:` — states

## Approach 3: CSS File (Complex)

For animations, media queries, or complex styling:

### Structure: BEM (Block-Element-Modifier)

```css
/* MyComponent.css */

.my-component {
  display: flex;
  flex-direction: column;
  padding: 16px;
  background: linear-gradient(135deg, var(--primary-pink), var(--secondary-gold));
  border-radius: 8px;
}

.my-component__title {
  font-size: 20px;
  font-weight: bold;
  color: white;
  margin-bottom: 12px;
}

.my-component__button {
  padding: 8px 16px;
  background-color: var(--primary-pink);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.my-component__button:hover {
  background-color: #d6678a;
}

.my-component__button--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Media query for mobile */
@media (max-width: 768px) {
  .my-component {
    padding: 12px;
  }

  .my-component__title {
    font-size: 18px;
  }
}

/* Animation */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.my-component__content {
  animation: slideIn 0.3s ease-in-out;
}
```

### Import and Use

```typescript
import './MyComponent.css';

interface MyComponentProps {
  title: string;
  disabled?: boolean;
  onSubmit: () => void;
}

export default function MyComponent({ title, disabled, onSubmit }: MyComponentProps) {
  return (
    <div className="my-component">
      <h1 className="my-component__title">{title}</h1>
      <div className="my-component__content">
        {/* Content */}
      </div>
      <button
        className={`my-component__button ${disabled ? 'my-component__button--disabled' : ''}`}
        onClick={onSubmit}
        disabled={disabled}
      >
        Submit
      </button>
    </div>
  );
}
```

## Approach 4: Theme Customization (Global)

For global MUI component styling, edit [src/styles/themes/muiTheme.ts](../../src/styles/themes/muiTheme.ts):

```typescript
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    primary: { main: '#e8799a' },
    secondary: { main: '#c4894a' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
  },
});
```

## Guidelines

### ✅ DO

- Use CSS variables for colors: `color: var(--primary-pink);`
- Use Tailwind for responsive layouts: `hidden md:block`
- Keep component styles close to component files
- Use BEM naming for `.css` classes: `.component__element--modifier`
- Import `.css` at the **top** of the component file

### ❌ DON'T

- Hardcode hex colors — use CSS variables
- Create global CSS files for component styles
- Mix multiple styling approaches in one component (pick one)
- Forget to import `.css` files
- Over-engineer simple styling with CSS files when Tailwind works

## Example: Multi-Level Styling

Complex component combining approaches:

```typescript
import './RecipeCard.css';
import { Card, Typography, Rating } from '@mui/material';

interface RecipeCardProps {
  recipe: Recipe;
  featured?: boolean;
}

export default function RecipeCard({ recipe, featured }: RecipeCardProps) {
  return (
    <Card
      sx={{
        padding: '16px',
        backgroundColor: featured ? 'var(--highlight)' : 'white',
      }}
      className={`recipe-card ${featured ? 'recipe-card--featured' : ''}`}
    >
      <Typography variant="h6" className="recipe-card__title">
        {recipe.name}
      </Typography>
      
      <div className="recipe-card__metadata">
        <span className="text-sm text-gray-600">{recipe.category}</span>
        <Rating value={recipe.rating} readOnly size="small" />
      </div>

      <p className="recipe-card__description">{recipe.description}</p>
    </Card>
  );
}
```

```css
/* RecipeCard.css */
.recipe-card {
  transition: transform 0.2s, box-shadow 0.2s;
}

.recipe-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.recipe-card--featured {
  border: 2px solid var(--primary-pink);
}

.recipe-card__title {
  color: var(--primary-pink);
  margin-bottom: 8px;
}

.recipe-card__metadata {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.recipe-card__description {
  color: var(--text-dark);
  line-height: 1.5;
  margin: 0;
}
```

---

See [AGENTS.md — Styling Strategy](../../AGENTS.md#styling-strategy-layered) for more details.
