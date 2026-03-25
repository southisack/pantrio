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
      <nav className="sticky top-0 z-50 bg-white border-b-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 py-4">
        <span className="font-display font-black italic tracking-tighter text-4xl text-red-600">
          PANTRIO
        </span>
        <Link
          href={resultsHref}
          className="font-sans font-black uppercase text-sm tracking-tight border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none"
        >
          ← RESULTS
        </Link>
      </nav>

      <main className="px-6 md:px-10 lg:px-16 py-12">

        {/* Title + summary */}
        <div className="mb-10 max-w-4xl">
          <h1 className="font-display font-black uppercase tracking-tighter leading-[0.85] text-5xl sm:text-6xl lg:text-8xl mb-6">
            {recipe.name}
          </h1>
          <p className="font-sans text-xl leading-snug border-l-8 border-black pl-6">
            {recipe.summary}
          </p>
        </div>

        {/* Meta row */}
        <div className="grid grid-cols-3 gap-4 mb-12 max-w-lg">
          <div className="border-8 border-black p-4 text-center">
            <span className="block font-sans font-black uppercase text-xs mb-1">TIME</span>
            <span className="font-display font-black text-xl uppercase leading-tight">
              {formatTime(recipe.time)}
            </span>
          </div>
          <div className="border-8 border-black p-4 text-center">
            <span className="block font-sans font-black uppercase text-xs mb-1">SERVES</span>
            <span className="font-display font-black text-xl uppercase leading-tight">
              {recipe.servings}
            </span>
          </div>
          <div className="border-8 border-black p-4 text-center">
            <span className="block font-sans font-black uppercase text-xs mb-1">EFFORT</span>
            <span className="font-display font-black text-xl uppercase leading-tight">
              {difficultyLabel[recipe.difficulty]}
            </span>
          </div>
        </div>

        {/* Two column: ingredients + steps */}
        <div className="flex flex-col lg:flex-row gap-12">

          {/* THE KIT */}
          <section className="lg:w-1/3">
            <div className="inline-block bg-zinc-950 text-white font-display font-black uppercase tracking-tighter text-3xl px-4 py-2 mb-8 rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              THE KIT
            </div>

            <div className="space-y-3">
              {recipe.ingredients.map(ingredient => {
                const matched = isMatched(ingredient.name)
                return (
                  <div
                    key={ingredient.name}
                    className={
                      matched
                        ? 'border-4 border-black p-4 bg-zinc-100 flex items-center justify-between'
                        : 'border-4 border-black p-4 bg-white flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] translate-x-1'
                    }
                  >
                    <div>
                      <span
                        className={
                          matched
                            ? 'font-sans font-bold uppercase text-zinc-400 line-through'
                            : 'font-sans font-black uppercase text-red-600 text-lg'
                        }
                      >
                        {ingredient.quantity && ingredient.unit
                          ? `${ingredient.quantity}${ingredient.unit} ${ingredient.name}`
                          : ingredient.quantity
                          ? `${ingredient.quantity} ${ingredient.name}`
                          : ingredient.name}
                      </span>
                    </div>
                    <span
                      className={
                        matched
                          ? 'font-sans font-black uppercase text-xs text-zinc-400 flex-shrink-0 ml-4'
                          : 'font-sans font-black uppercase text-xs bg-red-600 text-white px-2 py-1 flex-shrink-0 ml-4'
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
            <div className="inline-block bg-blue-700 text-white font-display font-black uppercase tracking-tighter text-3xl px-4 py-2 mb-8 -rotate-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              DO THIS
            </div>

            <div className="space-y-10">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex-none w-20 h-20 border-8 border-black bg-zinc-950 text-white flex items-center justify-center font-display font-black text-4xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-grow pt-2">
                    <p className="font-sans text-lg leading-relaxed">
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
