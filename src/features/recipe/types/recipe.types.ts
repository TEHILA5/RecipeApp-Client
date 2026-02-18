// ===============================================
// Recipe Types - מותאם לשרת (.NET)
// ===============================================

// ✅ מותאם ל-enum של השרת RecipeCategory
export type RecipeCategory =
  | 'Sweats' | 'Cakes' | 'Cupcakes' | 'Cheesecakes' | 'BundtCakes'
  | 'Brownies' | 'Cookies' | 'Bars' | 'IceCream' | 'Mousse'
  | 'Puddings' | 'Panna' | 'Tiramisu' | 'FrozenDesserts' | 'Pies'
  | 'Tarts' | 'Crumbles' | 'FruitSalads' | 'Pastries' | 'Donuts'
  | 'Churros' | 'Crepes' | 'Waffles' | 'NoBakeCakes' | 'Truffles'
  | 'EnergyBalls' | 'SoufleeAndCustard' | 'MilkDesserts'
  | 'JellyAndGelatin' | 'TraditionalDesserts';

// ✅ Level מספרי כמו בשרת (1=קל, 2=בינוני, 3=קשה)
export type DifficultyLevel = 1 | 2 | 3;

export const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  1: 'Easy',
  2: 'Medium',
  3: 'Hard',
};

export const CATEGORY_EMOJIS: Partial<Record<RecipeCategory, string>> = {
  Cakes: '🎂', Cupcakes: '🧁', Cheesecakes: '🍰', Cookies: '🍪',
  Brownies: '🟫', IceCream: '🍦', Mousse: '🍮', Tiramisu: '☕',
  Pies: '🥧', Tarts: '🥧', Pastries: '🥐', Donuts: '🍩',
  Crepes: '🥞', Waffles: '🧇', Truffles: '🍫', NoBakeCakes: '🍰',
};

// ✅ מותאם ל-RecipeIngredientDto בשרת
export interface RecipeIngredient {
  ingredientId: number;
  ingredientName?: string;
  quantity: number;
  unit: string;
  importance?: string;
}

// ✅ מותאם ל-RecipeDto בשרת
export interface Recipe {
  id: number;
  name: string;
  description: string;
  category: RecipeCategory;
  instructions: string;
  arrImage: string;        // שדה התמונה - string של URL
  servings: number;
  level: DifficultyLevel;  // 1/2/3
  prepTime: number;        // דקות
  totalTime: number;       // דקות (לא cookTime!)
  ingredients: RecipeIngredient[];
  averageRating?: number;
  commentCount?: number;
}

// ✅ מותאם ל-RecipeCreateDto בשרת
export interface RecipeCreateDto {
  name: string;
  description: string;
  category: RecipeCategory;
  instructions: string;
  arrImage: string;
  servings: number;
  level: DifficultyLevel;
  prepTime: number;
  totalTime: number;
  ingredients: Array<{
    ingredientId: number;
    quantity: number;
    unit: string;
    importance?: string;
  }>;
}

// ✅ מותאם ל-RecipeUpdateDto בשרת
export interface RecipeUpdateDto {
  name?: string;
  description?: string;
  category?: RecipeCategory;
  instructions?: string;
  arrImage?: string;
  servings?: number;
  level?: DifficultyLevel;
  prepTime?: number;
  totalTime?: number;
  ingredients?: Array<{
    ingredientId: number;
    quantity: number;
    unit: string;
    importance?: string;
  }>;
}

export interface RecipeFilters {
  category?: RecipeCategory;
  level?: DifficultyLevel;
  maxPrepTime?: number;
  searchTerm?: string;
}