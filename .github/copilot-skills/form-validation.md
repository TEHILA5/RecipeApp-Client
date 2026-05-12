# Form Validation & React Hook Form

**Skill**: Implement form validation using React Hook Form with custom validation rules.

## Overview

This project uses **React Hook Form** (NOT yup or Zod). Validation rules are centralized in [src/shared/utils/validation.ts](../../src/shared/utils/validation.ts).

## Available Validators

### Standard Validators

From [src/shared/utils/validation.ts](../../src/shared/utils/validation.ts):

```typescript
export const validation = {
  // Required field
  required: {
    value: true,
    message: 'This field is required',
  },

  // Email
  email: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Invalid email format',
  },

  // Password (complex)
  password: {
    validate: (value: string) => {
      if (value.length < 6) return 'Password must be at least 6 characters';
      if (!/[A-Z]/.test(value)) return 'Password must contain uppercase letter';
      if (!/[0-9]/.test(value)) return 'Password must contain number';
      return true;
    },
  },

  // Phone (Israeli only: 05XXXXXXXXX)
  phone: {
    validate: (value: string) => {
      const isValid = /^05\d{8}$/.test(value);
      return isValid ? true : 'Invalid Israeli phone number (05XXXXXXXXX)';
    },
  },
};
```

## Basic Form Example

```typescript
import { useForm } from 'react-hook-form';
import { validation } from '@/shared/utils/validation';
import FormInput from '@/shared/components/FormInput';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form data:', data);
    // Send to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Using shared FormInput component */}
      <FormInput
        label="Email"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: validation.email.value,
            message: validation.email.message,
          },
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <FormInput
        label="Password"
        type="password"
        {...register('password', {
          validate: validation.password.validate,
        })}
        error={!!errors.password}
        helperText={errors.password?.message}
      />

      <button type="submit">Login</button>
    </form>
  );
}
```

## Using FormInput Component

The [FormInput.tsx](../../src/shared/components/FormInput.tsx) component wraps Material-UI TextField and handles validation display:

```typescript
import FormInput from '@/shared/components/FormInput';
import { validation } from '@/shared/utils/validation';

// In your form
<FormInput
  label="Phone"
  placeholder="05xxxxxxxxx"
  {...register('phone', {
    validate: validation.phone.validate,
  })}
  error={!!errors.phone}
  helperText={errors.phone?.message}
/>
```

## Complex Form Example

```typescript
import { useForm, Controller } from 'react-hook-form';
import { TextField, Select, MenuItem, Button } from '@mui/material';
import { validation } from '@/shared/utils/validation';

interface RecipeFormData {
  name: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
}

export default function RecipeForm() {
  const { 
    register, 
    control,
    handleSubmit, 
    formState: { errors, isSubmitting },
    watch,
  } = useForm<RecipeFormData>({
    defaultValues: {
      name: '',
      category: 'Cakes',
      difficulty: 'easy',
      servings: 4,
    },
  });

  const watchName = watch('name');

  const onSubmit = async (data: RecipeFormData) => {
    // Transform if needed (e.g., category string → number)
    const payload = {
      ...data,
      category: RECIPE_CATEGORIES_MAP[data.category],
    };
    // Send to API
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <TextField
        label="Recipe Name"
        {...register('name', {
          required: 'Name is required',
          minLength: { value: 3, message: 'Name must be at least 3 characters' },
        })}
        error={!!errors.name}
        helperText={errors.name?.message}
        fullWidth
        margin="normal"
      />

      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <Select
            {...field}
            label="Category"
            fullWidth
            margin="dense"
          >
            {Object.keys(RECIPE_CATEGORIES_MAP).map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        )}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
        fullWidth
      >
        {isSubmitting ? 'Saving...' : 'Save Recipe'}
      </Button>
    </form>
  );
}
```

## Custom Validation Rules

Add to [src/shared/utils/validation.ts](../../src/shared/utils/validation.ts):

```typescript
// New custom validator
url: {
  validate: (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return 'Invalid URL format';
    }
  },
},

// Use in form
{...register('imageUrl', { validate: validation.url.validate })}
```

## Advanced: Async Validation

```typescript
{...register('email', {
  required: 'Email is required',
  validate: async (value) => {
    const exists = await checkEmailExists(value);
    return exists ? 'Email already taken' : true;
  },
})}
```

## Conditional Validation

Using `watch()` to validate based on other fields:

```typescript
const { watch, register, formState: { errors } } = useForm<RecipeFormData>();

const recipeName = watch('name');

<TextField
  label="Description (required for complex recipes)"
  {...register('description', {
    validate: (value) => {
      if (recipeName?.includes('soufflé') && !value) {
        return 'Description required for soufflés';
      }
      return true;
    },
  })}
  error={!!errors.description}
  helperText={errors.description?.message}
/>
```

## Reusable Form Hook Pattern

Extract form logic into a custom hook:

```typescript
// features/recipe/hooks/useRecipeForm.ts
import { useForm } from 'react-hook-form';
import { validation } from '@/shared/utils/validation';

export function useRecipeForm(initialData?: Recipe) {
  return useForm<RecipeFormData>({
    defaultValues: initialData || { name: '', category: 'Cakes' },
  });
}

// In your form component
export default function RecipeForm() {
  const { register, handleSubmit, formState: { errors } } = useRecipeForm();
  // Use as normal
}
```

## Tips & Tricks

### Avoid .value Pattern
Instead of pattern validators, use `validate()` for better error messages:

```typescript
// ❌ Avoid
pattern: { value: /regex/, message: 'Error' }

// ✅ Prefer
validate: (value) => {
  if (!/regex/.test(value)) return 'Error';
  return true;
}
```

### Clean Error Display
Use `Controller` for custom components that don't work with native `register()`:

```typescript
import { Controller } from 'react-hook-form';

<Controller
  name="category"
  control={control}
  rules={{ required: 'Category required' }}
  render={({ field, fieldState: { error } }) => (
    <CustomSelect {...field} error={!!error} helperText={error?.message} />
  )}
/>
```

### Disable Submit While Submitting

```typescript
const { formState: { isSubmitting } } = useForm();

<Button type="submit" disabled={isSubmitting}>
  {isSubmitting ? 'Saving...' : 'Save'}
</Button>
```

---

**Reference**: [React Hook Form Docs](https://react-hook-form.com/)
