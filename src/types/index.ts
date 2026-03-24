export type Difficulty = 'easy' | 'medium' | 'hard'

export interface RecipeIngredient {
  name: string
  quantity: string
  unit: string
}

export interface RecipeStep {
  instruction: string
}

export interface Recipe {
  id: string
  name: string
  summary: string
  time: number        // minutes
  servings: number
  difficulty: Difficulty
  ingredients: RecipeIngredient[]
  steps: RecipeStep[]
}

export interface MatchedRecipe {
  recipe: Recipe
  matchScore: number        // 0–1
  matchedIngredients: string[]
  missingIngredients: string[]
}
