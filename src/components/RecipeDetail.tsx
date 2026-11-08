'use client'

import { difficultyLabel, formatTime } from '@/src/lib/ingredients'
import type { Recipe } from '@/src/types'

const SECTION_LABEL = 'py-2 border-y-2 border-black font-mono font-bold text-label leading-none uppercase'

// "modal" sits on a white card with its own sticky header; "panel" sits straight on the page.
export function RecipeDetail({ recipe, variant, isMatched, showStatus, onClose }: {
  recipe: Recipe
  variant: 'modal' | 'panel'
  isMatched: (ingredientName: string) => boolean
  showStatus: boolean
  onClose?: () => void
}) {
  const isModal = variant === 'modal'

  return (
    <>
      <div
        className={`flex items-start justify-between gap-4 ${
          isModal ? 'py-5 pl-6 pr-5 border-b-2 border-black sticky top-0 bg-white z-10' : 'cascade-item switch-item cascade-d0'
        }`}
      >
        <div className="flex flex-col gap-2.5">
          <span className="font-mono font-bold text-card-label uppercase">
            Recipe · {formatTime(recipe.time)} · {difficultyLabel[recipe.difficulty]} · Serves {recipe.servings}
          </span>
          <h2 className={`font-display leading-none tracking-tight ${isModal ? 'text-4xl' : 'text-5xl'}`}>
            {recipe.name}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex-none w-10 h-10 flex items-center justify-center pb-0.5 border-2 border-black rounded-full bg-white font-semibold text-2xl leading-none transition-colors duration-150 hover:bg-black hover:text-yellow"
          >
            ×
          </button>
        )}
      </div>

      {!isModal && (
        <p className="cascade-item switch-item cascade-d1 mt-5 max-w-lede font-ui text-2xl leading-tight">{recipe.summary}</p>
      )}

      <div
        className={`relative w-full overflow-hidden ${
          isModal ? 'h-56 border-b-2 border-black' : 'cascade-item switch-item cascade-d2 mt-8 h-72 border-2 border-black rounded-card'
        }`}
      >
        <img
          src={`/icons/${recipe.id}.jpg`}
          onError={(e) => { (e.target as HTMLImageElement).src = '/icons/alfredo-burgos-HaO8q859TQo-unsplash.jpg' }}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className={`flex flex-col gap-6 ${isModal ? 'p-6' : 'mt-8'}`}>
        <section className={isModal ? undefined : 'cascade-item switch-item cascade-d3'}>
          <h3 className={SECTION_LABEL}>What you need</h3>
          <ul className="pt-2">
            {recipe.ingredients.map(ingredient => {
              const matched = isMatched(ingredient.name)
              return (
                <li key={ingredient.name} className="flex items-center justify-between gap-3 py-2">
                  <span className="font-ui text-base leading-snug">
                    {ingredient.quantity && ingredient.unit
                      ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                      : ingredient.quantity
                      ? `${ingredient.quantity} ${ingredient.name}`
                      : ingredient.name}
                  </span>
                  {showStatus && (
                    <span className={`flex-none px-2 py-0.5 rounded-full font-mono font-bold text-card-label uppercase ${matched ? 'bg-black text-yellow' : 'text-black'}`}>
                      {matched ? 'Have it' : 'Need it'}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        </section>

        <section className={isModal ? undefined : 'cascade-item switch-item cascade-d4'}>
          <h3 className={SECTION_LABEL}>How to cook it</h3>
          <ol className="pt-4 flex flex-col gap-3.5">
            {recipe.steps.map((step, index) => (
              <li key={index} className="flex items-start gap-3.5">
                <span className="flex-none w-index pt-0.5 font-mono font-bold text-index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-ui text-base leading-snug">{step.instruction}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </>
  )
}
