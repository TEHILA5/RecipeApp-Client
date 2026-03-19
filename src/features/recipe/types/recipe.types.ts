/* eslint-disable @typescript-eslint/no-explicit-any */

export type RecipeCategory =
  | 'Sweats' | 'Cakes' | 'Cupcakes' | 'Cheesecakes' | 'BundtCakes'
  | 'Brownies' | 'Cookies' | 'Bars' | 'IceCream' | 'Mousse'
  | 'Puddings' | 'Panna' | 'Tiramisu' | 'FrozenDesserts' | 'Pies'
  | 'Tarts' | 'Crumbles' | 'FruitSalads' | 'Pastries' | 'Donuts'
  | 'Churros' | 'Crepes' | 'Waffles' | 'NoBakeCakes' | 'Truffles'
  | 'EnergyBalls' | 'SoufleeAndCustard' | 'MilkDesserts'
  | 'JellyAndGelatin' | 'TraditionalDesserts';

export type DifficultyLevel = 1 | 2 | 3;

export const INT_TO_CATEGORY: Record<number, RecipeCategory> = {
  0: 'Sweats', 1: 'Cakes', 2: 'Cupcakes', 3: 'Cheesecakes', 4: 'BundtCakes',
  5: 'Brownies', 6: 'Cookies', 7: 'Bars', 8: 'IceCream', 9: 'Mousse',
  10: 'Puddings', 11: 'Panna', 12: 'Tiramisu', 13: 'FrozenDesserts', 14: 'Pies',
  15: 'Tarts', 16: 'Crumbles', 17: 'FruitSalads', 18: 'Pastries', 19: 'Donuts',
  20: 'Churros', 21: 'Crepes', 22: 'Waffles', 23: 'NoBakeCakes', 24: 'Truffles',
  25: 'EnergyBalls', 26: 'SoufleeAndCustard', 27: 'MilkDesserts',
  28: 'JellyAndGelatin', 29: 'TraditionalDesserts',
};

export const CATEGORY_TO_INT: Record<RecipeCategory, number> = {
  Sweats: 0, Cakes: 1, Cupcakes: 2, Cheesecakes: 3, BundtCakes: 4,
  Brownies: 5, Cookies: 6, Bars: 7, IceCream: 8, Mousse: 9,
  Puddings: 10, Panna: 11, Tiramisu: 12, FrozenDesserts: 13, Pies: 14,
  Tarts: 15, Crumbles: 16, FruitSalads: 17, Pastries: 18, Donuts: 19,
  Churros: 20, Crepes: 21, Waffles: 22, NoBakeCakes: 23, Truffles: 24,
  EnergyBalls: 25, SoufleeAndCustard: 26, MilkDesserts: 27,
  JellyAndGelatin: 28, TraditionalDesserts: 29,
};

export const INT_TO_IMPORTANCE: Record<number, 'Essential' | 'Recommended' | 'Optional'> = {
  1: 'Essential', 2: 'Recommended', 3: 'Optional',
};

export const IMPORTANCE_TO_INT: Record<string, number> = {
  Essential: 1, Recommended: 2, Optional: 3,
};

export const LEVEL_LABELS: Record<DifficultyLevel, string> = {
  1: 'Easy', 2: 'Medium', 3: 'Hard',
};

export const CATEGORY_EMOJIS: Partial<Record<RecipeCategory, string>> = {
  Cakes: '🎂', Cupcakes: '🧁', Cheesecakes: '🍰', Cookies: '🍪',
  Brownies: '🟫', IceCream: '🍦', Mousse: '🍮', Tiramisu: '☕',
  Pies: '🥧', Tarts: '🥧', Pastries: '🥐', Donuts: '🍩',
  Crepes: '🥞', Waffles: '🧇', Truffles: '🍫', NoBakeCakes: '🍰',
  Sweats: '🍬', BundtCakes: '🎂', Bars: '🍫', Puddings: '🍮',
  Panna: '🍶', FrozenDesserts: '🧊', Crumbles: '🫐', FruitSalads: '🍓',
  Churros: '🌀', EnergyBalls: '⚡', SoufleeAndCustard: '🥚',
  MilkDesserts: '🥛', JellyAndGelatin: '🟣', TraditionalDesserts: '🏺',
};

export function normalizeRecipe(raw: any): Recipe {
  return {
    ...raw,
    category: typeof raw.category === 'number'
      ? (INT_TO_CATEGORY[raw.category] ?? 'Sweats')
      : raw.category,
    tags: raw.tags
      ? (typeof raw.tags === 'string' ? JSON.parse(raw.tags) : raw.tags)
      : [],
    ingredients: raw.ingredients?.map((ing: any) => ({
      ...ing,
      importance: typeof ing.importance === 'number'
        ? (INT_TO_IMPORTANCE[ing.importance] ?? 'Essential')
        : ing.importance,
    })) ?? [],
  };
}

export interface RecipeIngredient {
  ingredientId: number;
  ingredientName?: string;
  quantity: number;
  unit: string;
  importance?: string;
}

export interface Recipe {
  id: number;
  name: string;
  description: string;
  category: RecipeCategory;
  instructions: string;
  arrImage: string;
  servings: number;
  level: DifficultyLevel;
  prepTime: number;
  totalTime: number;
  ingredients: RecipeIngredient[];
  averageRating?: number;
  commentCount?: number;
  tags?: string[];
}

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
  tags?: string[];
}

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
  tags?: string[];
}

export interface RecipeFilters {
  category?: RecipeCategory;
  level?: DifficultyLevel;
  maxPrepTime?: number;
  searchTerm?: string;
}