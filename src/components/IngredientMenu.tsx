'use client'

import type { ReactNode } from 'react'
import { cascadeStep } from '@/src/lib/cascade'
import { PROTEINS, SIDES, STARCHES } from '@/src/lib/ingredients'

const GROUPS = [
  { title: 'Proteins', ingredients: PROTEINS, firstNumber: 1 },
  { title: 'Starches', ingredients: STARCHES, firstNumber: PROTEINS.length + 1 },
  { title: 'On the side', ingredients: [SIDES], firstNumber: PROTEINS.length + STARCHES.length + 1 },
]

export function IngredientMenu({ selected, onToggle, footer }: {
  selected: Set<string>
  onToggle: (ingredient: string) => void
  footer?: ReactNode
}) {
  return (
    <div className="cascade-bg-to-white flex-1 min-w-0 bg-yellow text-black px-4 lg:bg-white lg:px-14 lg:pt-menu-top lg:h-screen lg:overflow-y-auto">
      <div className="flex flex-col bg-white border-2 border-black rounded-card px-5 pt-5 pb-2 lg:p-0 lg:bg-transparent lg:border-0 lg:rounded-none">
        {GROUPS.map(group => (
          <section key={group.title}>
            <h2 className={`cascade-item ${cascadeStep(group.firstNumber - 1)} py-2 border-y-2 border-black font-mono font-bold text-label leading-none uppercase`}>
              {group.title}
            </h2>
            <div className="py-4">
              {group.ingredients.map((ingredient, index) => {
                const isSelected = selected.has(ingredient)
                return (
                  <button
                    key={ingredient}
                    onClick={() => onToggle(ingredient)}
                    aria-pressed={isSelected}
                    className={`cascade-item ${cascadeStep(group.firstNumber - 1 + index)} w-full h-16 flex items-center gap-4 px-row my-0.5 rounded-lg text-left transition-colors duration-150 ${
                      isSelected ? 'bg-black text-yellow' : 'bg-transparent text-black hover:bg-yellow'
                    }`}
                  >
                    <span className="flex-none w-index font-mono font-bold text-index">
                      {String(group.firstNumber + index).padStart(2, '0')}
                    </span>
                    <span className="flex-1 font-display text-4xl leading-none tracking-tight capitalize lg:text-menu">
                      {ingredient}
                    </span>
                    <span
                      aria-hidden="true"
                      className="flex-none w-9 h-9 flex items-center justify-center pb-0.5 border-2 border-current rounded-full font-semibold text-2xl leading-none"
                    >
                      {isSelected ? '×' : '+'}
                    </span>
                  </button>
                )
              })}
            </div>
          </section>
        ))}
      </div>
      {footer}
    </div>
  )
}
