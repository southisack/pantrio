import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Recipe, Difficulty } from '@/src/types'
import recipesData from '@/data/recipes.json'

function Stars({ score }: { score: number }) {
  return (
    <span className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <span
          key={i}
          className={`text-lg leading-none ${i <= score ? 'text-zinc-950' : 'text-zinc-950 opacity-15'}`}
        >
          ★
        </span>
      ))}
    </span>
  )
}

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
    <>
      <nav className="sticky top-0 z-50 bg-zinc-50 border-b-2 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 py-3">
        <span className="font-display font-bold text-2xl text-zinc-950 tracking-tight">
          Pantrio
        </span>
        <Link
          href={resultsHref}
          className="font-ui font-bold text-sm text-zinc-950 border-2 border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-none"
        >
          ← Back
        </Link>
      </nav>

      <main className="px-6 md:px-10 lg:px-16 py-10">

        {/* Title + summary */}
        <div className="mb-8 max-w-3xl">
          <h1 className="font-display leading-[0.9] text-4xl sm:text-5xl lg:text-6xl mb-4 text-zinc-950 tracking-tight">
            {recipe.name}
          </h1>
          <p className="font-sans text-sm leading-snug border-l-4 border-black pl-4 text-zinc-950 opacity-70">
            {recipe.summary}
          </p>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 mb-10">
          <div className="border-2 border-black rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-sans font-black uppercase text-xs text-zinc-950 opacity-50 mr-1.5">Time</span>
            <span className="font-sans font-bold text-sm text-zinc-950">{formatTime(recipe.time)}</span>
          </div>
          <div className="border-2 border-black rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-sans font-black uppercase text-xs text-zinc-950 opacity-50 mr-1.5">Serves</span>
            <span className="font-sans font-bold text-sm text-zinc-950">{recipe.servings}</span>
          </div>
          <div className="border-2 border-black rounded-full px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <span className="font-sans font-black uppercase text-xs text-zinc-950 opacity-50 mr-1.5">Effort</span>
            <span className="font-sans font-bold text-sm text-zinc-950">{difficultyLabel[recipe.difficulty]}</span>
          </div>
        </div>

        {/* Family ratings */}
        <div className="flex flex-wrap gap-6 mb-10">
          {([
            { key: 'johnny',   label: 'Johnny' },
            { key: 'marieEve', label: 'Marie-Eve' },
            { key: 'mia',      label: 'Mia' },
          ] as const).map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="font-sans font-bold text-xs text-zinc-950 uppercase tracking-wide opacity-50 w-20">{label}</span>
              {recipe.ratings[key] === 0
                ? <span className="font-sans text-xs text-zinc-950 opacity-30 italic">Not yet rated</span>
                : <Stars score={recipe.ratings[key]} />}
            </div>
          ))}
        </div>

        {/* Two column: ingredients + steps */}
        <div className="flex flex-col lg:flex-row gap-12">

          {/* THE KIT */}
          <section className="lg:w-1/3">
            <div className="inline-block bg-zinc-950 text-white font-sans font-black uppercase tracking-widest text-xs px-4 py-2 mb-6 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              The Kit
            </div>

            <div className="space-y-2">
              {recipe.ingredients.map(ingredient => {
                const matched = isMatched(ingredient.name)
                return (
                  <div
                    key={ingredient.name}
                    className={
                      matched
                        ? 'border-2 border-black rounded-2xl p-3 bg-zinc-100 flex items-center justify-between'
                        : 'border-2 border-black rounded-2xl p-3 bg-white flex items-center justify-between shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'
                    }
                  >
                    <div>
                      <span
                        className={
                          matched
                            ? 'font-sans text-zinc-400 line-through text-sm'
                            : 'font-sans font-bold text-zinc-950 text-sm'
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
                          : 'font-sans font-black uppercase text-xs bg-zinc-950 text-white px-2 py-0.5 rounded-full flex-shrink-0 ml-3'
                      }
                    >
                      {matched ? 'Got it' : 'Need it'}
                    </span>
                  </div>
                )
              })}
            </div>
          </section>

          {/* DO THIS */}
          <section className="lg:w-2/3">
            <div className="inline-block bg-zinc-950 text-white font-sans font-black uppercase tracking-widest text-xs px-4 py-2 mb-6 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              Do This
            </div>

            <div className="space-y-6">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-5">
                  <div className="flex-none w-10 h-10 rounded-full border-2 border-black bg-zinc-950 text-white flex items-center justify-center font-sans font-black text-xs shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="flex-grow pt-2.5">
                    <p className="font-sans text-sm leading-relaxed text-zinc-950">
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
