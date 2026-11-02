import { readFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { PROTEINS, STARCHES } from '../src/lib/ingredients.ts'
import { validateRecipes } from '../src/lib/validateRecipes.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const recipes = JSON.parse(readFileSync(process.argv[2] ?? `${root}data/recipes.json`, 'utf8'))

const { errors, warnings } = validateRecipes(recipes, {
  mainIngredients: [...PROTEINS, ...STARCHES],
  imageExists: publicPath => existsSync(`${root}public${publicPath}`),
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
