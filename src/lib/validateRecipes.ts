type Json = Record<string, unknown>

export interface ValidationOptions {
  mainIngredients: string[]
  imageExists?: (publicPath: string) => boolean
}

export interface ValidationResult {
  errors: string[]
  warnings: string[]
}

const DIFFICULTIES = ['easy', 'medium', 'hard']
const KNOWN_KEYS = [
  'id', 'name', 'summary', 'time', 'servings', 'difficulty', 'ingredients', 'steps', 'ratings',
  'mainIngredient', 'image', 'tags', 'cuisine', 'source',
]

const isRecord = (value: unknown): value is Json => typeof value === 'object' && value !== null && !Array.isArray(value)
const isText = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0
const isPositiveInt = (value: unknown): boolean => Number.isInteger(value) && (value as number) > 0

export function validateRecipes(recipes: unknown, options: ValidationOptions): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (!Array.isArray(recipes)) {
    return { errors: ['recipes must be an array'], warnings }
  }

  const seenIds = new Set<string>()

  recipes.forEach((entry: unknown, index: number) => {
    const recipe: Json = isRecord(entry) ? entry : {}
    const label = isText(recipe.id) ? recipe.id : `#${index + 1}`
    const fail = (message: string) => errors.push(`${label}: ${message}`)
    const warn = (message: string) => warnings.push(`${label}: ${message}`)

    if (!isRecord(entry)) fail('must be an object')

    if (!isText(recipe.id)) fail('id is required')
    else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(recipe.id)) fail(`id "${recipe.id}" must be lowercase kebab-case (e.g. lemon-chicken)`)
    else if (seenIds.has(recipe.id)) fail('id is a duplicate')
    if (isText(recipe.id)) seenIds.add(recipe.id)

    if (!isText(recipe.name)) fail('name is required')
    if (!isText(recipe.summary)) fail('summary is required')
    if (!isPositiveInt(recipe.time)) fail('time must be a whole number of minutes')
    if (!isPositiveInt(recipe.servings)) fail('servings must be a whole number')
    if (typeof recipe.difficulty !== 'string' || !DIFFICULTIES.includes(recipe.difficulty)) {
      fail(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`)
    }

    if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
      fail('ingredients must be a non-empty list')
    } else {
      recipe.ingredients.forEach((ingredient: unknown, i: number) => {
        const item: Json = isRecord(ingredient) ? ingredient : {}
        if (!isText(item.name)) fail(`ingredients[${i}].name is required`)
        if (typeof item.quantity !== 'string') fail(`ingredients[${i}].quantity must be a string (use "" if none)`)
        if (typeof item.unit !== 'string') fail(`ingredients[${i}].unit must be a string (use "" if none)`)
      })
    }

    if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
      fail('steps must be a non-empty list')
    } else {
      recipe.steps.forEach((step: unknown, i: number) => {
        if (!isRecord(step) || !isText(step.instruction)) fail(`steps[${i}].instruction is required`)
      })
    }

    const ratings: Json = isRecord(recipe.ratings) ? recipe.ratings : {}
    for (const person of ['johnny', 'marieEve', 'mia']) {
      const rating = ratings[person]
      if (!Number.isInteger(rating) || (rating as number) < 0 || (rating as number) > 5) {
        fail(`ratings.${person} must be a whole number from 0 to 5`)
      }
    }

    if (recipe.mainIngredient !== undefined) {
      if (typeof recipe.mainIngredient !== 'string' || !options.mainIngredients.includes(recipe.mainIngredient)) {
        fail(`mainIngredient "${String(recipe.mainIngredient)}" must be one of: ${options.mainIngredients.join(', ')}`)
      }
    }

    if (recipe.image !== undefined) {
      if (!isText(recipe.image) || !recipe.image.startsWith('/')) {
        fail('image must be a path starting with "/" (e.g. /icons/lemon-chicken.jpg)')
      } else if (options.imageExists && !options.imageExists(recipe.image)) {
        fail(`image file not found: public${recipe.image}`)
      }
    } else if (options.imageExists && isText(recipe.id) && !options.imageExists(`/icons/${recipe.id}.jpg`)) {
      warn('no photo yet (add public/icons/<id>.jpg or an "image" field)')
    }

    if (recipe.tags !== undefined) {
      if (!Array.isArray(recipe.tags) || recipe.tags.some((tag: unknown) => !isText(tag) || tag !== tag.toLowerCase())) {
        fail('tags must be a list of lowercase strings')
      }
    }
    if (recipe.cuisine !== undefined && !isText(recipe.cuisine)) fail('cuisine must be a non-empty string')
    if (recipe.source !== undefined && !isText(recipe.source)) fail('source must be a non-empty string')

    for (const key of Object.keys(recipe)) {
      if (!KNOWN_KEYS.includes(key)) warn(`unknown field "${key}" (typo?)`)
    }
  })

  return { errors, warnings }
}
