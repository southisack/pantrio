import { SIDES, SIDE_TAG } from '@/src/lib/ingredients'
import type { Recipe, MatchedRecipe } from '@/src/types'

const MIN_MATCH_SCORE = 0.3

// Whether a recipe belongs to one pick on the home menu. "Sides" is a category, not an ingredient:
// it matches every recipe tagged as a side.
export function recipeMatchesPick(recipe: Recipe, pick: string): boolean {
  if (pick === SIDES) return recipe.tags?.includes(SIDE_TAG) ?? false
  const term = pick.toLowerCase()
  return recipe.ingredients.some(ingredient => {
    const name = ingredient.name.toLowerCase()
    return name.includes(term) || term.includes(name)
  })
}

export function matchRecipes(
  userIngredients: string[],
  recipes: Recipe[],
  minScore: number = MIN_MATCH_SCORE
): MatchedRecipe[] {
  const normalized = userIngredients.map(i => i.toLowerCase().trim())

  return recipes
    .map(recipe => {
      const matched: string[] = []
      const missing: string[] = []

      for (const ingredient of recipe.ingredients) {
        const name = ingredient.name.toLowerCase().trim()
        const isMatched = normalized.some(
          ui => name.includes(ui) || ui.includes(name)
        )
        if (isMatched) {
          matched.push(ingredient.name)
        } else {
          missing.push(ingredient.name)
        }
      }

      const matchScore = matched.length / recipe.ingredients.length

      return {
        recipe,
        matchScore,
        matchedIngredients: matched,
        missingIngredients: missing,
      }
    })
    .filter(m => m.matchedIngredients.length > 0 && m.matchScore >= minScore)
    .sort((a, b) => b.matchScore - a.matchScore)
}
