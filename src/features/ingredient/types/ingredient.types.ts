// ===============================================
// Ingredient Types - Sweet&Treat
// ===============================================

export interface Ingredient {
  id: number;
  name: string;
}

export interface IngredientCreateDto {
  name: string;
}

export interface IngredientUpdateDto {
  name: string;
}