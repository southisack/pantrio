export type Difficulty = 'easy' | 'medium' | 'hard'

export interface RecipeIngredient {
  name: string
  quantity: string
  unit: string
}

export interface RecipeStep {
  instruction: string
}

export interface RecipeRatings {
  johnny: number    // 0 = not yet rated, 1–5 stars
  marieEve: number
  mia: number
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
  ratings: RecipeRatings
  mainIngredient?: string   // one of PROTEINS / STARCHES in src/lib/ingredients.ts
  image?: string            // path under /public, e.g. /icons/lemon-chicken.jpg
  tags?: string[]           // lowercase, e.g. ["weeknight", "bbq"]
  cuisine?: string
  source?: string           // who it came from, e.g. "Mom" or a URL
}

export interface MatchedRecipe {
  recipe: Recipe
  matchScore: number        // 0–1
  matchedIngredients: string[]
  missingIngredients: string[]
}
