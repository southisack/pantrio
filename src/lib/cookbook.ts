import type { Recipe } from '@/src/types'
import recipesData from '@/data/recipes.json'
import { PROTEINS, STARCHES } from '@/src/lib/ingredients'
import { matchRecipes } from '@/src/lib/matchRecipes'
import { readRecipesFile, writeRecipesFile } from '@/src/lib/github'
import { validateRecipes } from '@/src/lib/validateRecipes'

const MAIN_INGREDIENTS = [...PROTEINS, ...STARCHES]

export interface NewRecipeInput {
  id?: string
  name: string
  summary: string
  time: number
  servings: number
  difficulty: 'easy' | 'medium' | 'hard'
  ingredients: { name: string; quantity: string; unit: string }[]
  steps: string[]
  mainIngredient?: string
  cuisine?: string
  tags?: string[]
  source?: string
}

export interface SearchFilters {
  ingredients?: string[]
  mainIngredient?: string
  maxMinutes?: number
  difficulty?: Recipe['difficulty']
  text?: string
  limit: number
}

export const MAIN_INGREDIENT_OPTIONS = MAIN_INGREDIENTS

export async function loadRecipes(): Promise<Recipe[]> {
  try {
    const { recipes } = await readRecipesFile()
    return recipes as Recipe[]
  } catch {
    return recipesData as Recipe[]
  }
}

export function slugify(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function searchRecipes(recipes: Recipe[], filters: SearchFilters) {
  const hasIngredients = filters.ingredients !== undefined && filters.ingredients.length > 0
  const scored = hasIngredients
    ? matchRecipes(filters.ingredients ?? [], recipes, 0).sort(
        (a, b) => b.matchedIngredients.length - a.matchedIngredients.length || b.matchScore - a.matchScore
      )
    : recipes.map(recipe => ({ recipe, matchScore: 1, matchedIngredients: [] as string[], missingIngredients: [] as string[] }))

  const text = filters.text?.toLowerCase().trim()
  return scored
    .filter(({ recipe }) => {
      if (filters.maxMinutes !== undefined && recipe.time > filters.maxMinutes) return false
      if (filters.difficulty !== undefined && recipe.difficulty !== filters.difficulty) return false
      if (filters.mainIngredient !== undefined) {
        const wanted = filters.mainIngredient.toLowerCase()
        const matchesField = recipe.mainIngredient === wanted
        const matchesName = recipe.ingredients.some(ingredient => ingredient.name.toLowerCase().includes(wanted))
        if (!matchesField && !matchesName) return false
      }
      if (text && !`${recipe.name} ${recipe.summary}`.toLowerCase().includes(text)) return false
      return true
    })
    .slice(0, filters.limit)
    .map(({ recipe, matchScore, matchedIngredients, missingIngredients }) => ({
      id: recipe.id,
      name: recipe.name,
      summary: recipe.summary,
      minutes: recipe.time,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      cuisine: recipe.cuisine,
      ...(hasIngredients ? { matchScore: Math.round(matchScore * 100) / 100, have: matchedIngredients, need: missingIngredients } : {}),
    }))
}

export async function addRecipe(input: NewRecipeInput): Promise<{ id: string; commitUrl: string } | { errors: string[] }> {
  const id = input.id ?? slugify(input.name)

  const recipe: Recipe = {
    id,
    name: input.name,
    summary: input.summary,
    time: input.time,
    servings: input.servings,
    difficulty: input.difficulty,
    ...(input.mainIngredient !== undefined ? { mainIngredient: input.mainIngredient } : {}),
    ...(input.cuisine !== undefined ? { cuisine: input.cuisine } : {}),
    ...(input.tags !== undefined ? { tags: input.tags } : {}),
    ...(input.source !== undefined ? { source: input.source } : {}),
    ingredients: input.ingredients,
    steps: input.steps.map(instruction => ({ instruction })),
    ratings: { johnny: 0, marieEve: 0, mia: 0 },
  }

  const { recipes, sha } = await readRecipesFile()
  const next = [...(recipes as Recipe[]), recipe]
  const { errors } = validateRecipes(next, { mainIngredients: MAIN_INGREDIENTS })
  const ownErrors = errors.filter(message => message.startsWith(`${id}:`))
  if (ownErrors.length > 0) return { errors: ownErrors }

  const commitUrl = await writeRecipesFile(next, sha, `Add recipe: ${recipe.name} (via MCP)`)
  return { id, commitUrl }
}
