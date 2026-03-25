import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Recipe, Difficulty } from '@/src/types'
import recipesData from '@/data/recipes.json'

const recipes = recipesData as Recipe[]

const difficultyLabel: Record<Difficulty, string> = {
  easy: 'EASY',
  medium: 'SOME EFFORT',
  hard: 'AMBITIOUS',
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} MINS`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} HR ${m} MINS` : `${h} HR`
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

  const resultsHref = `/results?ingredients=${encodeURIComponent(ingredients ?? '')}`

  function isMatched(ingredientName: string): boolean {
    const name = ingredientName.toLowerCase().trim()
    return userIngredients.some(ui => name.includes(ui) || ui.includes(name))
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-black shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] flex items-center justify-between px-6 py-3">
        <span className="font-display font-black italic tracking-tighter text-2xl text-red-600">
          PANTRIO
        </span>
        <Link
          href={resultsHref}
          className="font-sans font-black uppercase text-xs tracking-tight border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-none"
        >
          ← RESULTS
        </Link>
      </nav>

      <main className="px-6 md:px-10 lg:px-16 py-8">

        {/* Title + summary */}
        <div className="mb-6 max-w-3xl">
          <h1 className="font-display font-black uppercase tracking-tighter leading-[0.85] text-3xl sm:text-4xl lg:text-5xl mb-4">
            {recipe.name}
          </h1>
          <p className="font-sans text-sm leading-snug border-l-4 border-black pl-4">
            {recipe.summary}
          </p>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-3 gap-2 mb-8 max-w-xs">
          <div className="border-2 border-black p-2.5 text-center">
            <span className="block font-sans font-black uppercase text-xs mb-0.5">TIME</span>
            <span className="font-display font-black text-sm uppercase leading-tight">
              {formatTime(recipe.time)}
            </span>
          </div>
          <div className="border-2 border-black p-2.5 text-center">
            <span className="block font-sans font-black uppercase text-xs mb-0.5">SERVES</span>
            <span className="font-display font-black text-sm uppercase leading-tight">
              {recipe.servings}
            </span>
          </div>
          <div className="border-2 border-black p-2.5 text-center">
            <span className="block font-sans font-black uppercase text-xs mb-0.5">EFFORT</span>
            <span className="font-display font-black text-sm uppercase leading-tight">
              {difficultyLabel[recipe.difficulty]}
            </span>
          </div>
        </div>

        {/* Two column: ingredients + steps */}
        <div className="flex flex-col lg:flex-row gap-10">

          {/* THE KIT */}
          <section className="lg:w-1/3">
            <div className="inline-block bg-zinc-950 text-white font-display font-black uppercase tracking-tighter text-base px-3 py-1.5 mb-5 rotate-1 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]">
              THE KIT
            </div>

            <div className="space-y-2">
              {recipe.ingredients.map(ingredient => {
                const matched = isMatched(ingredient.name)
                return (
                  <div
                    key={ingredient.name}
                    className={
                      matched
                        ? 'border-2 border-black p-2.5 bg-zinc-100 flex items-center justify-between'
                        : 'border-2 border-black p-2.5 bg-white flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] translate-x-[3px]'
                    }
                  >
                    <div>
                      <span
                        className={
                          matched
                            ? 'font-sans font-bold uppercase text-zinc-400 line-through text-sm'
                            : 'font-sans font-black uppercase text-red-600 text-sm'
                        }
                      >
                        {ingredient.quantity && ingredient.unit
                          ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                          : ingredient.quantity
                          ? `${ingredient.quantity} ${ingredient.name}`
                          : ingredient.name}
                      </span>
                    </div>
                    <span
                      className={
                        matched
                          ? 'font-sans font-black uppercase text-xs text-zinc-400 flex-shrink-0 ml-3'
                          : 'font-sans font-black uppercase text-xs bg-red-600 text-white px-1.5 py-0.5 flex-shrink-0 ml-3'
                      }
                    >
                      {matched ? 'GOT IT' : 'NEED IT'}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* DO THIS */}
          <section className="lg:w-2/3">
            <div className="inline-block bg-olive-700 text-white font-display uppercase tracking-tighter text-base px-3 py-1.5 mb-5 -rotate-1 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]">
              DO THIS
            </div>

            <div className="space-y-6">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-none w-10 h-10 border-2 border-black bg-zinc-950 text-white flex items-center justify-center font-display font-black text-base shadow-[3px_3px_0px_0px_rgba(28,20,16,1)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-grow pt-1">
                    <p className="font-sans text-sm leading-relaxed">
                      {step.instruction}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </>
  )
}
