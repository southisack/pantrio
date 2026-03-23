// Pantrio shared TypeScript types
// Shapes match the API contracts defined in SPEC.md

export type ConfidenceLevel = 'high' | 'medium' | 'low';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Ingredient {
  id: string;
  name: string;
  confidence: ConfidenceLevel;
  confirmed: boolean;
}

export interface RecipeIngredient {
  name: string;
  quantity: string;
  unit: string;
}

export interface RecipeSuggestion {
  id: string;
  name: string;
  estimatedTime: string;
  difficulty: DifficultyLevel;
  keyIngredients: string[];
  summary: string;
  // Detail fields bundled in the same response (one API call)
  servings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
}

// Captured photo — stored as base64 URI for Claude vision API
export interface CapturedPhoto {
  id: string;
  uri: string;       // file URI from camera
  base64: string;    // base64 encoded, sent to API
}

// API response shapes for validation
export interface DetectIngredientsResponse {
  ingredients: Omit<Ingredient, 'confirmed'>[];
}

export type GenerateRecipesResponse = RecipeSuggestion[];
