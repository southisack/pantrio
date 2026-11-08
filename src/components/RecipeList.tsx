'use client'

import { useEffect, useRef } from 'react'
import { cascadeStep } from '@/src/lib/cascade'
import { PROTEINS, SIDES, STARCHES, difficultyLabel, formatTime } from '@/src/lib/ingredients'
import type { Recipe } from '@/src/types'

export function RecipeList({ recipes, selected, onToggle, activeId, onSelect, onBack }: {
  recipes: Recipe[]
  selected: Set<string>
  onToggle: (ingredient: string) => void
  activeId: string | null
  onSelect: (recipeId: string) => void
  onBack: () => void
}) {
  // Keep the active row visible when it changes (e.g. stepping with the arrow keys).
  const activeRowRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    activeRowRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  }, [activeId])

  return (
    <div className="cascade-bg-to-white min-w-0 bg-yellow text-black px-4 pb-24 lg:order-1 lg:flex-none lg:w-panel lg:min-w-panel lg:h-screen lg:overflow-y-auto lg:bg-white lg:px-14 lg:pt-11 lg:pb-16 lg:border-r-2 lg:border-black">
      <button
        onClick={onBack}
        className="cascade-item cascade-d0 hidden lg:block mb-8 font-mono font-bold text-label uppercase text-left hover:opacity-70 transition-opacity"
      >
        ← Pantrio
      </button>

      <div className="bg-white border-2 border-black rounded-card px-5 pt-5 pb-2 lg:p-0 lg:bg-transparent lg:border-0 lg:rounded-none">

        <section aria-label="Filter by ingredient">
          <div className="cascade-item cascade-d1 flex flex-wrap gap-1.5 pb-5">
            {[...PROTEINS, ...STARCHES, SIDES].map(ingredient => {
              const isSelected = selected.has(ingredient)
              return (
                <button
                  key={ingredient}
                  onClick={() => onToggle(ingredient)}
                  aria-pressed={isSelected}
                  className={`min-h-9 px-3 font-ui font-semibold text-sm capitalize border-2 border-black rounded-full transition-colors duration-150 ${
                    isSelected ? 'bg-black text-yellow' : 'bg-transparent text-black hover:bg-yellow'
                  }`}
                >
                  {ingredient}
                </button>
              )
            })}
          </div>
        </section>

        <section aria-label="Recipes">
          {recipes.length === 0 ? (
            <div className="py-2">
              <p className="mb-3 font-display text-4xl leading-none tracking-tight">Nothing matched.</p>
              <p className="font-ui text-lg leading-snug">Either your fridge is very sparse or very unusual.</p>
            </div>
          ) : (
            <div className="pb-4">
              {recipes.map((recipe, index) => {
                const isActive = recipe.id === activeId
                return (
                  <button
                    key={recipe.id}
                    ref={isActive ? activeRowRef : undefined}
                    onClick={() => onSelect(recipe.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className={`cascade-item ${cascadeStep(index + 2)} w-full scroll-my-6 min-h-16 flex items-center gap-4 px-row py-2.5 my-0.5 rounded-lg text-left transition-colors duration-200 ease-out ${
                      isActive ? 'bg-black text-yellow' : 'bg-transparent text-black hover:bg-yellow'
                    }`}
                  >
                    <span className="flex-none w-index font-mono font-bold text-index">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 min-w-0 flex flex-col gap-1.5">
                      <span className="font-display text-card-title">{recipe.name}</span>
                      <span className="font-mono font-bold text-card-label uppercase">
                        {formatTime(recipe.time)} · {difficultyLabel[recipe.difficulty]}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex-none w-9 h-9 flex items-center justify-center pb-0.5 border-2 border-current rounded-full font-semibold text-2xl leading-none"
                    >
                      {isActive ? '→' : '+'}
                    </span>
                  </button>
                )
              })}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}
