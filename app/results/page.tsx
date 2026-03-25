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
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-black shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] flex items-center justify-between px-6 py-3">
        <span className="font-display italic tracking-tighter text-2xl text-red-600">
          PANTRIO
        </span>
        <Link
          href="/"
          className="font-sans font-black uppercase text-xs tracking-tight border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-none"
        >
          ← BACK
        </Link>
      </nav>

      <main className="px-6 md:px-10 lg:px-16 py-8">

        <div className="mb-8">
          <h1 className="font-display uppercase tracking-tighter leading-[0.85] text-3xl sm:text-4xl lg:text-5xl mb-4">
            HERE'S WHAT
            <br />
            YOU CAN
            <br />
            <span className="text-red-600 italic">ACTUALLY</span>
            <br />
            COOK.
          </h1>

          {results.length > 0 && (
            <p className="font-sans font-bold uppercase text-sm tracking-tight border-t-2 border-black pt-3">
              {resultsHeadline(results.length)}
            </p>
          )}
        </div>

        {results.length === 0 ? (
          <div className="border-2 border-black border-dashed p-8 text-center max-w-lg">
            <p className="font-display uppercase tracking-tighter text-2xl mb-2">
              NOTHING MATCHED.
            </p>
            <p className="font-sans font-bold text-sm max-w-sm mx-auto">
              Either your fridge is very sparse or very unusual. Try adding a few more ingredients.
            </p>
            <Link
              href="/"
              className="inline-block mt-6 bg-red-600 text-white font-sans font-black uppercase tracking-tight text-sm border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none transition-none"
            >
              TRY AGAIN
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {results.map(({ recipe, matchScore, matchedIngredients }) => {
              const matchedCount = matchedIngredients.length
              const totalCount = recipe.ingredients.length
              const pct = Math.round(matchScore * 100)
              const detailHref = `/recipe/${recipe.id}?ingredients=${encodeURIComponent(ingredientList.join(','))}`

              return (
                <Link
                  key={recipe.id}
                  href={detailHref}
                  className="group block bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(28,20,16,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] transition-none"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="font-display uppercase tracking-tighter leading-none text-xl sm:text-2xl flex-1">
                        {recipe.name}
                      </h2>
                      <div className="flex-shrink-0 bg-red-600 text-white font-display text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(28,20,16,1)] px-2 py-1 leading-none">
                        {pct}%
                      </div>
                    </div>

                    <p className="font-sans text-sm leading-snug mb-4 text-zinc-950">
                      {recipe.summary}
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="border-2 border-black p-2">
                        <span className="block font-sans font-black uppercase text-xs text-zinc-950 mb-0.5">
                          INGREDIENTS
                        </span>
                        <span className="font-display text-sm text-red-600 uppercase leading-tight">
                          {matchedCount} OF {totalCount}
                        </span>
                      </div>
                      <div className="border-2 border-black p-2">
                        <span className="block font-sans font-black uppercase text-xs text-zinc-950 mb-0.5">
                          TIME
                        </span>
                        <span className="font-display text-sm uppercase leading-tight">
                          {formatTime(recipe.time)}
                        </span>
                      </div>
                      <div className="border-2 border-black p-2">
                        <span className="block font-sans font-black uppercase text-xs text-zinc-950 mb-0.5">
                          EFFORT
                        </span>
                        <span className="font-display text-sm uppercase leading-tight">
                          {difficultyLabel[recipe.difficulty]}
                        </span>
                      </div>
                    </div>

                    <div className="w-full bg-zinc-950 text-white font-sans font-black text-sm uppercase tracking-tight text-center py-2.5 border-2 border-black group-hover:bg-red-600 transition-none">
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
