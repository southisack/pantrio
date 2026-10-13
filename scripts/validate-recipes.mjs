import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PROTEINS, STARCHES } from '../src/lib/ingredients.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const recipes = JSON.parse(readFileSync(process.argv[2] ?? `${root}data/recipes.json`, 'utf8'))

const DIFFICULTIES = ['easy', 'medium', 'hard']
const MAIN_INGREDIENTS = [...PROTEINS, ...STARCHES]
const KNOWN_KEYS = [
  'id', 'name', 'summary', 'time', 'servings', 'difficulty', 'ingredients', 'steps', 'ratings',
  'mainIngredient', 'image', 'tags', 'cuisine', 'source',
]

const errors = []
const warnings = []
const seenIds = new Set()

const isText = value => typeof value === 'string' && value.trim().length > 0
const isPositiveInt = value => Number.isInteger(value) && value > 0

if (!Array.isArray(recipes)) {
  console.error('data/recipes.json must be an array of recipes.')
  process.exit(1)
}

recipes.forEach((recipe, index) => {
  const label = isText(recipe?.id) ? recipe.id : `#${index + 1}`
  const fail = message => errors.push(`${label}: ${message}`)
  const warn = message => warnings.push(`${label}: ${message}`)

  if (!isText(recipe.id)) fail('id is required')
  else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(recipe.id)) fail(`id "${recipe.id}" must be lowercase kebab-case (e.g. lemon-chicken)`)
  else if (seenIds.has(recipe.id)) fail('id is a duplicate')
  seenIds.add(recipe.id)

  if (!isText(recipe.name)) fail('name is required')
  if (!isText(recipe.summary)) fail('summary is required')
  if (!isPositiveInt(recipe.time)) fail('time must be a whole number of minutes')
  if (!isPositiveInt(recipe.servings)) fail('servings must be a whole number')
  if (!DIFFICULTIES.includes(recipe.difficulty)) fail(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`)

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    fail('ingredients must be a non-empty list')
  } else {
    recipe.ingredients.forEach((ingredient, i) => {
      if (!isText(ingredient?.name)) fail(`ingredients[${i}].name is required`)
      if (typeof ingredient?.quantity !== 'string') fail(`ingredients[${i}].quantity must be a string (use "" if none)`)
      if (typeof ingredient?.unit !== 'string') fail(`ingredients[${i}].unit must be a string (use "" if none)`)
    })
  }

  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0) {
    fail('steps must be a non-empty list')
  } else {
    recipe.steps.forEach((step, i) => {
      if (!isText(step?.instruction)) fail(`steps[${i}].instruction is required`)
    })
  }

  for (const person of ['johnny', 'marieEve', 'mia']) {
    const rating = recipe.ratings?.[person]
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) fail(`ratings.${person} must be a whole number from 0 to 5`)
  }

  if (recipe.mainIngredient !== undefined && !MAIN_INGREDIENTS.includes(recipe.mainIngredient)) {
    fail(`mainIngredient "${recipe.mainIngredient}" must be one of: ${MAIN_INGREDIENTS.join(', ')}`)
  }
  if (recipe.image !== undefined) {
    if (!isText(recipe.image) || !recipe.image.startsWith('/')) fail('image must be a path starting with "/" (e.g. /icons/lemon-chicken.jpg)')
    else if (!existsSync(`${root}public${recipe.image}`)) fail(`image file not found: public${recipe.image}`)
  } else if (!existsSync(`${root}public/icons/${recipe.id}.jpg`)) {
    warn('no photo yet (add public/icons/<id>.jpg or an "image" field)')
  }
  if (recipe.tags !== undefined) {
    if (!Array.isArray(recipe.tags) || recipe.tags.some(tag => !isText(tag) || tag !== tag.toLowerCase())) {
      fail('tags must be a list of lowercase strings')
    }
  }
  if (recipe.cuisine !== undefined && !isText(recipe.cuisine)) fail('cuisine must be a non-empty string')
  if (recipe.source !== undefined && !isText(recipe.source)) fail('source must be a non-empty string')

  for (const key of Object.keys(recipe)) {
    if (!KNOWN_KEYS.includes(key)) warn(`unknown field "${key}" (typo?)`)
  }
})

const missingPhotos = warnings.filter(w => w.includes('no photo yet'))
const otherWarnings = warnings.filter(w => !w.includes('no photo yet'))

otherWarnings.forEach(w => console.warn(`warn  ${w}`))
if (missingPhotos.length > 0) console.warn(`warn  ${missingPhotos.length} of ${recipes.length} recipes have no photo yet`)
errors.forEach(e => console.error(`error ${e}`))

if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s) in data/recipes.json`)
  process.exit(1)
}
console.log(`\n${recipes.length} recipes OK`)
