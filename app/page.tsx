'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { IngredientMenu } from '@/src/components/IngredientMenu'
import { OrderCard } from '@/src/components/OrderCard'
import { RecipeCarousel } from '@/src/components/RecipeCarousel'
import { FEATURED_RECIPE_IDS, PROTEINS, SIDES, SIDE_TAG, STARCHES, difficultyLabel, formatTime } from '@/src/lib/ingredients'
import type { Recipe } from '@/src/types'
import recipesData from '@/data/recipes.json'

const recipes = recipesData as Recipe[]
const featuredRecipes = FEATURED_RECIPE_IDS.flatMap(id => recipes.filter(recipe => recipe.id === id))

type View = 'picker' | 'results'

function RecipeCard({ recipe, onOpen }: {
  recipe: Recipe
  onOpen: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`transition-transform duration-200 ease-out ${hovered ? 'scale-105' : 'scale-100'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`hatch-shadow ${hovered ? 'animate-levitate' : ''}`}>
        <button
          onClick={onOpen}
          className="w-full text-left bg-white border border-black rounded-3xl overflow-hidden relative z-10 p-5 transition-colors duration-150"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="font-display text-2xl leading-tight text-black tracking-tight mb-2">
                {recipe.name}
              </h2>
              <p className="font-ui text-xs leading-snug text-black mb-4 line-clamp-2">
                {recipe.summary}
              </p>
              <div className="flex items-center gap-3 font-ui text-xs text-black font-bold uppercase tracking-wide">
                <span>{formatTime(recipe.time)}</span>
                <span>·</span>
                <span>{difficultyLabel[recipe.difficulty]}</span>
              </div>
            </div>
            <span className="font-ui text-lg text-black flex-shrink-0">+</span>
          </div>
        </button>
      </div>
    </div>
  )
}

function RecipeModal({ recipe, onClose, isMatched }: {
  recipe: Recipe
  onClose: () => void
  isMatched: (name: string) => boolean
}) {
  const [closing, setClosing] = useState(false)

  function handleClose() {
    setClosing(true)
    setTimeout(onClose, 175)
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') handleClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" onClick={handleClose}>
      <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm ${closing ? 'animate-fade-out' : 'animate-fade-in'}`} />
      <div
        className={`relative bg-white border border-black rounded-t-3xl sm:rounded-3xl overflow-hidden w-full sm:max-w-lg max-h-[92vh] overflow-y-auto ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-black sticky top-0 bg-white z-10">
          <div>
            <h2 className="font-display text-2xl leading-tight text-black tracking-tight mb-1">
              {recipe.name}
            </h2>
            <div className="flex items-center gap-3 font-ui text-xs text-black font-bold uppercase tracking-wide">
              <span>{formatTime(recipe.time)}</span>
              <span>·</span>
              <span>{difficultyLabel[recipe.difficulty]}</span>
            </div>
          </div>
          <button onClick={handleClose} className="font-ui text-xl text-black flex-shrink-0 rotate-45 leading-none mt-1">+</button>
        </div>

        {/* Image */}
        <div className="w-full h-56 relative">
          <img
            src={`/icons/${recipe.id}.jpg`}
            onError={(e) => { (e.target as HTMLImageElement).src = '/icons/alfredo-burgos-HaO8q859TQo-unsplash.jpg' }}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="p-8">
          <h3 className="font-display text-xl leading-tight text-black tracking-tight mb-4">What you need</h3>
          <ul className="space-y-2 mb-8">
            {recipe.ingredients.map(ingredient => {
              const matched = isMatched(ingredient.name)
              return (
                <li key={ingredient.name} className={`font-ui text-base flex items-center gap-2 ${matched ? 'text-zinc-400 line-through' : 'text-black'}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                  {ingredient.quantity && ingredient.unit
                    ? `${ingredient.quantity} ${ingredient.unit} ${ingredient.name}`
                    : ingredient.quantity
                    ? `${ingredient.quantity} ${ingredient.name}`
                    : ingredient.name}
                </li>
              )
            })}
          </ul>
          <hr className="border-black mb-8" />
          <h3 className="font-display text-xl leading-tight text-black tracking-tight mb-4">How to cook it</h3>
          <div className="space-y-2">
            {recipe.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0 mt-2" />
                <p className="font-ui text-base leading-relaxed text-black">{step.instruction}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HomePageInner />
    </Suspense>
  )
}

function HomePageInner() {
  const searchParams = useSearchParams()

  const [view, setView] = useState<View>(() => {
    if (searchParams.get('ingredients')) return 'results'
    return 'picker'
  })

  const [selected, setSelected] = useState<Set<string>>(() => {
    const param = searchParams.get('ingredients')
    return param ? new Set(param.split(',').filter(Boolean)) : new Set()
  })

  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null)

  function navigateTo(newView: View) {
    let url = '/'
    if (newView === 'results') {
      url = selected.size > 0 ? `/?ingredients=${encodeURIComponent([...selected].join(','))}` : '/?view=results'
    }
    window.history.pushState({ view: newView, selected: [...selected] }, '', url)
    setView(newView)
    setExpandedRecipeId(null)
  }

  useEffect(() => {
    if (view === 'picker') {
      const url = selected.size > 0 ? `/?ingredients=${encodeURIComponent([...selected].join(','))}` : '/'
      window.history.replaceState({ view, selected: [...selected] }, '', url)
    } else if (view === 'results') {
      const url = selected.size > 0 ? `/?ingredients=${encodeURIComponent([...selected].join(','))}` : '/?view=results'
      window.history.replaceState({ view, selected: [...selected] }, '', url)
    }
  }, [selected])

  useEffect(() => {
    function handlePop(e: PopStateEvent) {
      if (e.state) {
        setView(e.state.view)
        setSelected(new Set(e.state.selected))
        setExpandedRecipeId(null)
      } else {
        setView('picker')
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  function toggle(ingredient: string) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(ingredient)) next.delete(ingredient)
      else next.add(ingredient)
      return next
    })
  }

  function toggleRecipe(id: string) {
    setExpandedRecipeId(prev => prev === id ? null : id)
  }

  function isMatched(ingredientName: string): boolean {
    const name = ingredientName.toLowerCase().trim()
    const selectedList = [...selected].filter(s => s !== SIDES).map(s => s.toLowerCase())
    return selectedList.some(ui => name.includes(ui) || ui.includes(name))
  }

  // "Sides" is a category, not an ingredient: it adds every recipe tagged as a side
  // on top of whatever the ingredient picks match.
  const displayedRecipes = useMemo(() => {
    if (selected.size === 0) return recipes
    const wantsSides = selected.has(SIDES)
    const selectedList = [...selected].filter(s => s !== SIDES).map(s => s.toLowerCase())
    return recipes.filter(recipe =>
      (wantsSides && recipe.tags?.includes(SIDE_TAG)) ||
      recipe.ingredients.some(ingredient =>
        selectedList.some(sel =>
          ingredient.name.toLowerCase().includes(sel) || sel.includes(ingredient.name.toLowerCase())
        )
      )
    )
  }, [selected])

  const filterKey = [...selected].sort().join(',')

  const recipesSectionRef = useRef<HTMLDivElement>(null)
  const [recipesInView, setRecipesInView] = useState(false)
  useEffect(() => {
    const el = recipesSectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setRecipesInView(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [view])

  function resetToStart() {
    setSelected(new Set())
    setView('picker')
    setExpandedRecipeId(null)
    window.history.replaceState({ view: 'picker', selected: [] }, '', '/')
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  const logo = (
    <button
      onClick={resetToStart}
      className="font-display font-bold text-xl text-black tracking-tight text-left hover:opacity-70 transition-opacity"
    >
      Pantrio
    </button>
  )

  return (
    <>
      <main>
        {view === 'picker' ? (
          <div className="animate-fade-up min-h-screen flex flex-col lg:flex-row [html:has(&)]:bg-white">

            <div className="min-w-0 flex flex-col px-4 pt-11 pb-10 bg-yellow text-black lg:flex-none lg:w-panel lg:min-w-panel lg:pl-14 lg:pr-12 lg:pb-panel-bottom">
              <h1 className="mb-hero-gap font-ui font-semibold text-6xl leading-none tracking-tight lg:text-hero">
                What are you working with?
              </h1>
              <p className="max-w-lede font-ui text-2xl leading-tight">
                Pick your main ingredient. We'll surface recipes that actually make sense with what you've got.
              </p>
              <RecipeCarousel recipes={featuredRecipes} onOpen={setExpandedRecipeId} />
            </div>

            <IngredientMenu selected={selected} onToggle={toggle} />

            <OrderCard chosen={[...selected]} onSubmit={() => navigateTo('results')} />

          </div>
        ) : (
          <div className="animate-fade-up min-h-screen bg-yellow">

            <div className="w-full max-w-3xl mx-auto px-4 pt-8 sm:pt-12 pb-8">
              <div className="mb-10 sm:mb-14">{logo}</div>
              <h1 className="font-display hero-heading text-7xl sm:text-8xl mb-6 text-black tracking-tight">
                Not bad,{' '}actually.
              </h1>
              <p className="font-ui text-lg sm:text-xl leading-snug text-black max-w-xl">
                Toggle ingredients to narrow things down. Or just cook everything.
              </p>
            </div>

            <div className="bg-yellow border-y border-black sticky top-0 z-40">
              <div className="w-full max-w-3xl mx-auto px-4 py-3 flex items-center gap-2 flex-wrap">
                {[...PROTEINS, ...STARCHES, SIDES].map(ing => (
                  <button
                    key={ing}
                    onClick={() => toggle(ing)}
                    className={`font-ui text-xs capitalize border border-black rounded-full px-3 py-1 transition-colors ${
                      selected.has(ing) ? 'bg-black text-white' : 'bg-white text-black'
                    }`}
                  >
                    {ing}
                  </button>
                ))}
              </div>
            </div>

            <div ref={recipesSectionRef} className="w-full max-w-3xl mx-auto px-4 py-8">
              <p className="font-display text-black tracking-tight mb-6">
                {displayedRecipes.length > 0 && `${displayedRecipes.length} recipe${displayedRecipes.length === 1 ? '' : 's'}. Start somewhere.`}
              </p>

              <div key={filterKey} className="animate-fade-up">
                {displayedRecipes.length === 0 ? (
                  <div className="text-center py-20">
                    <p className="font-display text-3xl text-black tracking-tight mb-3">Nothing matched.</p>
                    <p className="font-ui text-sm text-black">Either your fridge is very sparse or very unusual.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {displayedRecipes.map(recipe => (
                      <RecipeCard
                        key={recipe.id}
                        recipe={recipe}
                        onOpen={() => setExpandedRecipeId(recipe.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* Recipe modal */}
      {expandedRecipeId && (() => {
        const recipe = recipes.find(r => r.id === expandedRecipeId)
        return recipe ? <RecipeModal recipe={recipe} onClose={() => setExpandedRecipeId(null)} isMatched={isMatched} /> : null
      })()}

      {/* Sticky recipe count bar */}
      <div className={`fixed bottom-0 left-0 right-0 flex justify-center pb-6 pointer-events-none transition-all duration-300 ease-out ${view === 'results' && selected.size > 0 && !recipesInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="border border-black rounded-2xl px-6 py-3 font-ui font-bold text-lg pointer-events-auto bg-black text-yellow whitespace-nowrap">
          {displayedRecipes.length} recipe{displayedRecipes.length === 1 ? '' : 's'} found.
        </div>
      </div>
    </>
  )
}
