'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import type { Recipe } from '@/src/types'
import recipesData from '@/data/recipes.json'

const recipes = recipesData as Recipe[]

const PROTEINS = ['chicken', 'beef', 'pork', 'fish']
const STARCHES = ['pasta', 'rice', 'potato', 'noodles']

const difficultyLabel: Record<string, string> = {
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

export default function HomePage() {
  return (
    <Suspense>
      <HomePageInner />
    </Suspense>
  )
}

function IngredientCard({ ingredient, isSelected, onToggle }: {
  ingredient: string
  isSelected: boolean
  onToggle: () => void
}) {
  const [bursting, setBursting] = useState(false)

  function handleClick() {
    if (!isSelected) setBursting(true)
    onToggle()
  }

  return (
    <div className="relative">
      {bursting && (
        <span
          className="impact-burst"
          onAnimationEnd={() => setBursting(false)}
        />
      )}
      <button
        onClick={handleClick}
        className={`flex flex-col items-center justify-center aspect-square w-full rounded-3xl border border-black font-ui font-bold text-base sm:text-lg capitalize tracking-tight transition duration-150 ease-out ${isSelected ? 'scale-95 bg-zinc-50 text-zinc-950' : 'bg-white hover:bg-zinc-50 text-zinc-950'}`}
      >
        {ingredient}
      </button>
    </div>
  )
}

function HomePageInner() {
  const searchParams = useSearchParams()

  const [selected, setSelected] = useState<Set<string>>(() => {
    const param = searchParams.get('ingredients')
    return param ? new Set(param.split(',').filter(Boolean)) : new Set()
  })

  function toggle(ingredient: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(ingredient)) {
        next.delete(ingredient)
      } else {
        next.add(ingredient)
      }
      return next
    })
  }

  useEffect(() => {
    const url = selected.size > 0
      ? `/?ingredients=${encodeURIComponent([...selected].join(','))}`
      : '/'
    window.history.replaceState(null, '', url)
  }, [selected])

  const displayedRecipes = useMemo(() => {
    if (selected.size === 0) return recipes
    const selectedList = [...selected].map(s => s.toLowerCase())
    return recipes.filter(recipe =>
      recipe.ingredients.some(ingredient =>
        selectedList.some(sel =>
          ingredient.name.toLowerCase().includes(sel) || sel.includes(ingredient.name.toLowerCase())
        )
      )
    )
  }, [selected])

  const filterKey = [...selected].sort().join(',')

  return (
    <>
      <main>
        {/* Hero filter section */}
        <div className="bg-white px-8 md:px-12 lg:px-20 py-16 border-b-2 border-black flex flex-col items-center text-center">
          <h1 className="font-display leading-[0.92] text-6xl sm:text-7xl lg:text-8xl mb-12 text-zinc-950 tracking-tight">
            What are you<br />
            working with?
          </h1>

          <div className="w-full max-w-2xl flex flex-col gap-4">
            <div className="grid grid-cols-4 gap-3">
              {PROTEINS.map(ingredient => <IngredientCard key={ingredient} ingredient={ingredient} isSelected={selected.has(ingredient)} onToggle={() => toggle(ingredient)} />)}
            </div>
            <div className="grid grid-cols-4 gap-3">
              {STARCHES.map(ingredient => <IngredientCard key={ingredient} ingredient={ingredient} isSelected={selected.has(ingredient)} onToggle={() => toggle(ingredient)} />)}
            </div>
          </div>
        </div>

        {/* Recipe grid */}
        <div className="px-8 md:px-12 lg:px-20 py-12">
          <p className="font-display text-zinc-950 tracking-tight mb-6 text-center">
            {selected.size === 0
              ? `All ${recipes.length}. Take your pick.`
              : displayedRecipes.length === 0
              ? null
              : `${displayedRecipes.length} recipe${displayedRecipes.length === 1 ? '' : 's'}. Start somewhere.`}
          </p>

          <div key={filterKey} className="animate-fade-up">
            {displayedRecipes.length === 0 ? (
              <div className="text-center py-20">
                <p className="font-display text-3xl text-zinc-950 tracking-tight mb-3">
                  Nothing matched.
                </p>
                <p className="font-sans text-sm text-zinc-950 opacity-60">
                  Either your fridge is very sparse or very unusual.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {displayedRecipes.map(recipe => {
                  const href = selected.size > 0
                    ? `/recipe/${recipe.id}?ingredients=${encodeURIComponent([...selected].join(','))}`
                    : `/recipe/${recipe.id}`

                  return (
                    <div key={recipe.id} className="hatch-shadow">
                      <Link
                        href={href}
                        className="group block bg-white border border-black rounded-3xl hover:translate-x-[4px] hover:translate-y-[4px] transition-transform duration-150 ease-out overflow-hidden"
                      >
                        <div className="p-5">
                          <h2 className="font-display text-lg leading-tight text-zinc-950 tracking-tight mb-2 group-hover:opacity-70 transition-none">
                            {recipe.name}
                          </h2>
                          <p className="font-sans text-xs leading-snug text-zinc-950 opacity-60 mb-4 line-clamp-2">
                            {recipe.summary}
                          </p>
                          <div className="flex items-center gap-3 font-sans text-xs text-zinc-950 opacity-50 font-bold uppercase tracking-wide">
                            <span>{formatTime(recipe.time)}</span>
                            <span>·</span>
                            <span>{difficultyLabel[recipe.difficulty]}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}
