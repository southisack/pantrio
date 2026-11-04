'use client'

import { PROTEINS, STARCHES } from '@/src/lib/ingredients'

const GROUPS = [
  { title: 'Proteins', ingredients: PROTEINS, firstNumber: 1 },
  { title: 'Starches', ingredients: STARCHES, firstNumber: PROTEINS.length + 1 },
]

export function IngredientMenu({ selected, onToggle }: {
  selected: Set<string>
  onToggle: (ingredient: string) => void
}) {
  return (
    <div className="flex-1 min-w-0 flex flex-col gap-10 bg-white text-black px-4 pt-hero-gap pb-64 border-t-2 border-black lg:px-14 lg:pb-panel-bottom lg:border-t-0 lg:border-l-2">
      {GROUPS.map(group => (
        <section key={group.title} className="flex-1 flex flex-col min-h-0">
          <h2 className="pt-2.5 pb-1.5 border-t-2 border-black font-mono font-bold text-label uppercase">
            <span className="block pb-1.5 border-b-2 border-black">{group.title}</span>
          </h2>
          {group.ingredients.map((ingredient, index) => {
            const isSelected = selected.has(ingredient)
            return (
              <button
                key={ingredient}
                onClick={() => onToggle(ingredient)}
                aria-pressed={isSelected}
                className={`flex-1 min-h-16 lg:min-h-12 flex items-center gap-4 px-row my-0.5 rounded-row text-left transition-colors duration-150 ${
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
        </section>
      ))}
    </div>
  )
}
