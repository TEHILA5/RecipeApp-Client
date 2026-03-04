// ===============================================
// UserAction Types - מותאם ל-C# DTOs
// ===============================================
import type { RecipeCategory } from './recipe.types';

export type UserActionType = 'Comment' | 'History' | 'Book';

export interface UserActionDto {
  id: number;
  actionType: UserActionType;
  recipeId?: number;
  recipeName?: string;
  recipeImageUrl?: string;
  category?: RecipeCategory;
  // Comment fields
  userName?: string;
  content?: string;
  rating?: number;
  createdAt: string;
}

export interface BookCreateDto {
  recipeId: number;
}

export interface CommentCreateDto {
  recipeId: number;
  content: string;
  rating: number;
}

export interface HistoryCreateDto {
  category: RecipeCategory;
}

export interface UserPreferencesDto {
  favoriteCategory: RecipeCategory;
  categoryStats: CategoryStatsDto[];
}

export interface CategoryStatsDto {
  category: RecipeCategory;
  searchCount: number;
}
