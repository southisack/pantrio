import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Recipe, Difficulty } from '@/src/types'
import recipesData from '@/data/recipes.json'

const recipes = recipesData as Recipe[]

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Some effort',
  hard: 'Ambitious',
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} mins`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} hr ${m} mins` : `${h} hr`
}

export default async function RecipeDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ ingredients?: string }>
}) {
  const { id } = await params
  const { ingredients } = await searchParams

  const recipe = recipes.find(r => r.id === id)
  if (!recipe) notFound()

  const userIngredients = ingredients
    ? ingredients.split(',').map(s => s.toLowerCase().trim()).filter(Boolean)
    : []

  const resultsHref = ingredients
    ? `/?ingredients=${encodeURIComponent(ingredients)}`
    : '/'

  function isMatched(ingredientName: string): boolean {
    const name = ingredientName.toLowerCase().trim()
    return userIngredients.some(ui => name.includes(ui) || ui.includes(name))
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Full-width nav */}
      <nav className="sticky top-0 z-50 bg-zinc-50 border-b border-black flex items-center justify-center relative px-6 py-4">
        <span className="font-display font-bold text-xl text-zinc-950 tracking-tight">Pantrio</span>
        <Link
          href={resultsHref}
          className="absolute left-6 font-ui font-bold text-sm text-zinc-950 border border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none"
        >
          ← Back
        </Link>
      </nav>

      {/* Two-column body */}
      <div className="flex flex-col lg:flex-row flex-1">

      {/* Left panel — image */}
      <div className="lg:sticky lg:top-[61px] lg:h-[calc(100vh-61px)] lg:w-1/2 bg-zinc-100 border-r border-black flex flex-col">

        {/* Image placeholder */}
        <div className="flex-1 relative">
          <img
            src="/icons/alfredo-burgos-HaO8q859TQo-unsplash.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

      </div>

      {/* Right panel — content */}
      <div className="lg:w-1/2 bg-zinc-50 border-l-0">

        {/* Hero: title + meta */}
        <div className="px-14 pt-12 pb-8">
          <h1 className="font-display text-5xl lg:text-6xl leading-[0.9] text-zinc-950 tracking-tight mb-4">
            {recipe.name}
          </h1>
          <p className="font-sans text-sm leading-snug text-zinc-950 mb-6">
            {recipe.summary}
          </p>
          <div className="flex flex-wrap gap-4">
            <span className="font-sans font-black uppercase text-xs text-zinc-950 tracking-widest">{formatTime(recipe.time)}</span>
            <span className="font-sans font-black uppercase text-xs text-zinc-950 tracking-widest">{difficultyLabel[recipe.difficulty]}</span>
            <span className="font-sans font-black uppercase text-xs text-zinc-950 tracking-widest">Serves {recipe.servings}</span>
          </div>
        </div>

        {/* Kit + Steps */}
        <div className="px-14 py-4">
          <div className="hatch-shadow">
          <div className="border border-black rounded-3xl p-8 bg-white relative z-10">
          <h2 className="font-display text-2xl leading-tight text-zinc-950 tracking-tight mb-4">The Kit</h2>
          <ul className="space-y-2 mb-8">
            {recipe.ingredients.map(ingredient => {
              const matched = isMatched(ingredient.name)
              return (
                <li key={ingredient.name} className={`font-sans text-sm flex items-center gap-2 ${matched ? 'text-zinc-400 line-through' : 'text-zinc-950'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  {ingredient.quantity && ingredient.unit
                    ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                    : ingredient.quantity
                    ? `${ingredient.quantity} ${ingredient.name}`
                    : ingredient.name}
                </li>
              )
            })}
          </ul>
          <hr className="border-black mb-8" />
          <h2 className="font-display text-2xl leading-tight text-zinc-950 tracking-tight mb-4">Do This</h2>
          <div className="space-y-2">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-950 flex-shrink-0 mt-2" />
                <p className="font-sans text-sm leading-relaxed text-zinc-950">
                  {step.instruction}
                </p>
              </div>
            ))}
          </div>
          </div>
          </div>
        </div>

      </div>
      </div>
    </div>
  )
}
