import Link from 'next/link'
import { matchRecipes } from '@/src/lib/matchRecipes'
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

function resultsHeadline(count: number): string {
  if (count === 1) return 'Found 1 recipe. Make it count.'
  if (count <= 4) return `Found ${count} recipes. Not bad at all.`
  return `Found ${count} recipes. You're eating well tonight.`
}

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ ingredients?: string }>
}) {
  const params = await searchParams
  const ingredientList = params.ingredients
    ? params.ingredients.split(',').map(s => s.trim()).filter(Boolean)
    : []

  const results = matchRecipes(ingredientList, recipes)

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between px-6 py-4">
        <span className="font-display font-black italic tracking-tighter text-4xl text-red-600">
          PANTRIO
        </span>
        <Link
          href="/"
          className="font-sans font-black uppercase text-sm tracking-tight border-4 border-black px-4 py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-none"
        >
          ← BACK
        </Link>
      </nav>

      <main className="px-6 md:px-10 lg:px-16 py-12">

        <div className="mb-10">
          <h1 className="font-display font-black uppercase tracking-tighter leading-[0.85] text-5xl sm:text-6xl lg:text-8xl mb-6">
            HERE'S WHAT
            <br />
            YOU CAN
            <br />
            <span className="text-red-600 italic">ACTUALLY</span>
            <br />
            COOK.
          </h1>

          {results.length > 0 && (
            <p className="font-sans font-bold uppercase text-xl tracking-tight border-t-8 border-black pt-4">
              {resultsHeadline(results.length)}
            </p>
          )}
        </div>

        {results.length === 0 ? (
          <div className="border-8 border-black border-dashed p-12 md:p-16 text-center">
            <p className="font-display font-black uppercase tracking-tighter text-4xl md:text-5xl mb-4">
              NOTHING MATCHED.
            </p>
            <p className="font-sans font-bold text-xl max-w-md mx-auto">
              Either your fridge is very sparse or very unusual. Try adding a few more ingredients.
            </p>
            <Link
              href="/"
              className="inline-block mt-8 bg-red-600 text-white font-display font-black uppercase tracking-tighter text-2xl border-8 border-black px-8 py-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-none"
            >
              TRY AGAIN
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {results.map(({ recipe, matchScore, matchedIngredients }) => {
              const matchedCount = matchedIngredients.length
              const totalCount = recipe.ingredients.length
              const pct = Math.round(matchScore * 100)
              const detailHref = `/recipe/${recipe.id}?ingredients=${encodeURIComponent(ingredientList.join(','))}`

              return (
                <Link
                  key={recipe.id}
                  href={detailHref}
                  className="group block bg-white border-8 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-none"
                >
                  <div className="p-8">
                    <div className="flex items-start justify-between gap-4 mb-6">
                      <h2 className="font-display font-black uppercase tracking-tighter leading-none text-4xl sm:text-5xl flex-1">
                        {recipe.name}
                      </h2>
                      <div className="flex-shrink-0 bg-red-600 text-white font-display font-black text-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-3 py-2 leading-none">
                        {pct}%
                      </div>
                    </div>

                    <p className="font-sans text-base leading-snug mb-8 text-zinc-950">
                      {recipe.summary}
                    </p>

                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="border-4 border-black p-3">
                        <span className="block font-sans font-black uppercase text-xs text-zinc-950 mb-1">
                          INGREDIENTS
                        </span>
                        <span className="font-display font-black text-lg text-red-600 uppercase leading-tight">
                          {matchedCount} OF {totalCount}
                        </span>
                      </div>
                      <div className="border-4 border-black p-3">
                        <span className="block font-sans font-black uppercase text-xs text-zinc-950 mb-1">
                          TIME
                        </span>
                        <span className="font-display font-black text-lg uppercase leading-tight">
                          {formatTime(recipe.time)}
                        </span>
                      </div>
                      <div className="border-4 border-black p-3">
                        <span className="block font-sans font-black uppercase text-xs text-zinc-950 mb-1">
                          EFFORT
                        </span>
                        <span className="font-display font-black text-lg uppercase leading-tight">
                          {difficultyLabel[recipe.difficulty]}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-zinc-950 text-white font-display font-black text-2xl uppercase tracking-tighter text-center py-4 border-4 border-black group-hover:bg-red-600 transition-none">
                      COOK IT →
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </>
  )
}
