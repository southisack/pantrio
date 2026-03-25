import type { Recipe, MatchedRecipe } from '@/src/types'

const MIN_MATCH_SCORE = 0.3

export function matchRecipes(
  userIngredients: string[],
  recipes: Recipe[]
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
    .filter(m => m.matchScore >= MIN_MATCH_SCORE)
    .sort((a, b) => b.matchScore - a.matchScore)
}
