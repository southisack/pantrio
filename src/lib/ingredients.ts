export const PROTEINS = ['chicken', 'beef', 'pork', 'fish']
export const STARCHES = ['pasta', 'rice', 'potato', 'noodles']

// Not an ingredient: picking this shows every recipe tagged "side" in data/recipes.json.
export const SIDES = 'sides'
export const SIDE_TAG = 'side'

export const FEATURED_RECIPE_IDS = [
  'chicken-shawarma',
  'pad-thai',
  'burrito-bowl',
  'mediterranean-grilled-salmon',
  'pork-souvlaki',
  'poke-bowl',
  'piri-piri-chicken',
  'miso-ginger-chicken',
  'chicken-satay',
  'al-pastor-pork',
]

export const INGREDIENT_PHOTOS: Record<string, string> = {
  chicken: '/icons/chicken.jpg',
  pork: '/icons/pork.jpg',
  beef: '/icons/beef.jpg',
  fish: '/icons/fish.jpg',
  potato: '/icons/potato.jpg',
  pasta: '/icons/pasta.jpg',
  rice: '/icons/rice.jpg',
  noodles: '/icons/noodle.jpg',
}

export const difficultyLabel: Record<string, string> = {
  easy: 'Easy',
  medium: 'Some effort',
  hard: 'Ambitious',
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} hr ${m} mins` : `${h} hr`
}
