'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { IngredientCard } from '@/src/components/IngredientCard'
import { PROTEINS, STARCHES, difficultyLabel, formatTime } from '@/src/lib/ingredients'
import type { Recipe } from '@/src/types'
import recipesData from '@/data/recipes.json'

const recipes = recipesData as Recipe[]

type View = 'picker' | 'results'

function RecipeCard({ recipe, isExpanded, onToggle, isMatched }: {
  recipe: Recipe
  isExpanded: boolean
  onToggle: () => void
  isMatched: (name: string) => boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`transition-transform duration-200 ease-out ${isExpanded ? 'sm:col-span-2 scale-100' : hovered ? 'scale-105' : 'scale-100'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`hatch-shadow ${!isExpanded && hovered ? 'animate-levitate' : ''}`}>
        <div className="bg-white border border-black rounded-3xl overflow-hidden relative z-10">

          {/* Card header */}
          <button
            onClick={onToggle}
            className="w-full text-left p-5 transition-colors duration-150"
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
              <span className={`font-ui text-lg text-black flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-45' : ''}`}>+</span>
            </div>
          </button>

          {/* Expandable content */}
          <div className={`recipe-expand ${isExpanded ? 'open' : ''}`}>
            <div>
              <div className="w-full h-56 relative border-t border-black">
                <img
                  src="/icons/alfredo-burgos-HaO8q859TQo-unsplash.jpg"
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="p-8 border-t border-black">
                <h3 className="font-display text-xl leading-tight text-black tracking-tight mb-4">What you need</h3>
                <ul className="space-y-2 mb-8">
                  {recipe.ingredients.map(ingredient => {
                    const matched = isMatched(ingredient.name)
                    return (
                      <li key={ingredient.name} className={`font-ui text-sm flex items-center gap-2 ${matched ? 'text-gray line-through' : 'text-black'}`}>
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
                      <p className="font-ui text-sm leading-relaxed text-black">{step.instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
const VIEW_ORDER: View[] = ['picker', 'results']

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
    const selectedList = [...selected].map(s => s.toLowerCase())
    return selectedList.some(ui => name.includes(ui) || ui.includes(name))
  }

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

  const recipesSectionRef = useRef<HTMLDivElement>(null)
  const [recipesInView, setRecipesInView] = useState(false)
  useEffect(() => {
    const el = recipesSectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setRecipesInView(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [view])

  const viewIndex = VIEW_ORDER.indexOf(view)

  function panelClasses(panelView: View) {
    const i = VIEW_ORDER.indexOf(panelView)
    if (i === viewIndex) return 'opacity-100 translate-y-0 pointer-events-auto'
    if (i < viewIndex) return 'opacity-0 translate-y-8 pointer-events-none'
    return 'opacity-0 -translate-y-8 pointer-events-none'
  }

  return (
    <>
      <main className="lg:flex lg:flex-row lg:items-start">

        {/* ── LEFT PANEL (desktop only) ── */}
        <div className="left-panel hidden lg:flex lg:sticky lg:top-0 lg:h-screen lg:w-1/2 bg-cream border-r border-black flex-col p-12">
          <span className="font-display font-bold text-xl text-black tracking-tight">Pantrio</span>

          <div className="flex-1 relative overflow-hidden">

            {/* Picker */}
            <div className={`absolute inset-0 flex flex-col justify-center gap-10 transition-all duration-500 ease-in-out ${panelClasses('picker')}`}>
              <h1 className="font-display hero-heading text-8xl 2xl:text-9xl text-black tracking-tight">
                What are you{' '}
                <span className="relative inline-block">
                  <span className="text-hatch-shadow absolute top-[5px] left-[5px] pointer-events-none select-none" aria-hidden="true">working</span>
                  <span className="text-outlined relative">working</span>
                </span>
                {' '}with?
              </h1>
              <p className="font-ui text-2xl leading-snug text-black">
                Pick your main ingredient. We'll surface recipes that actually make sense with what you've got.
              </p>
              <span className="animate-arrow-nudge inline-block text-7xl text-black leading-none self-start">→</span>
            </div>

            {/* Results */}
            <div className={`absolute inset-0 flex flex-col justify-center gap-10 transition-all duration-500 ease-in-out ${panelClasses('results')}`}>
              <h1 className="font-display hero-heading text-8xl 2xl:text-9xl text-black tracking-tight">
                Not bad,{' '}actually.
              </h1>
              <p className="font-ui text-2xl leading-snug text-black">
                Toggle ingredients to narrow things down. Or just cook everything.
              </p>
              <span className="animate-arrow-nudge inline-block text-7xl text-black leading-none self-start">→</span>
            </div>

          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="right-panel lg:w-1/2 lg:relative lg:h-screen lg:overflow-hidden">

          {/* ── PICKER VIEW ── */}
          <div className={`${view === 'picker' ? 'block' : 'hidden lg:block'} lg:absolute lg:inset-0 lg:transition-all lg:duration-500 lg:ease-in-out ${panelClasses('picker')}`}>

            {/* Mobile hero */}
            <div className="lg:hidden bg-teal py-16 border-b border-black">
              <div className="w-full max-w-3xl mx-auto px-4 flex flex-col items-center text-center">
                <h1 className="font-display hero-heading text-7xl sm:text-8xl mb-12 text-black tracking-tight">
                  What are you{' '}
                  <span className="relative inline-block">
                    <span className="text-hatch-shadow absolute top-[5px] left-[5px] pointer-events-none select-none" aria-hidden="true">working</span>
                    <span className="text-outlined relative">working</span>
                  </span>
                  {' '}with?
                </h1>
                <div className="w-full flex flex-col gap-4">
                  <div className="grid grid-cols-3 gap-3">
                    {PROTEINS.map(ingredient => (
                      <IngredientCard key={ingredient} ingredient={ingredient} isSelected={selected.has(ingredient)} onToggle={() => toggle(ingredient)} />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {STARCHES.map(ingredient => (
                      <IngredientCard key={ingredient} ingredient={ingredient} isSelected={selected.has(ingredient)} onToggle={() => toggle(ingredient)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop ingredient picker */}
            <div className="hidden lg:flex flex-col h-screen bg-teal">
              <div className="ingredient-scroll flex-1 overflow-y-auto p-8 pb-4">
                <h2 className="font-display text-xl text-black tracking-tight mb-6 text-center">Ingredients</h2>
                <div className="grid grid-cols-3 gap-3">
                  {[...PROTEINS, ...STARCHES].map(ingredient => (
                    <IngredientCard key={ingredient} ingredient={ingredient} isSelected={selected.has(ingredient)} onToggle={() => toggle(ingredient)} />
                  ))}
                </div>
              </div>
              <button
                onClick={() => selected.size > 0 && navigateTo('results')}
                className={`w-full font-ui font-bold text-xl border-t border-black px-8 py-6 text-center transition-colors ${
                  selected.size > 0
                    ? 'bg-black text-yellow cursor-pointer hover:bg-yellow hover:text-black'
                    : 'bg-teal/60 text-black cursor-default'
                }`}
              >
                {selected.size === 0 ? 'Staring into the fridge...' : `I've done worse with less — show me →`}
              </button>
            </div>

            {/* Mobile CTA */}
            <div className="lg:hidden bg-yellow border-t border-black px-4 py-4">
              <button
                onClick={() => selected.size > 0 && navigateTo('results')}
                className={`w-full font-ui font-bold text-lg border border-black rounded-2xl px-6 py-4 transition-all duration-200 ${
                  selected.size > 0 ? 'bg-black text-yellow cursor-pointer' : 'bg-yellow/60 text-black cursor-default'
                }`}
              >
                {selected.size === 0 ? 'Staring into the fridge...' : `I've done worse with less — show me →`}
              </button>
            </div>

          </div>

          {/* ── RESULTS VIEW ── */}
          <div className={`${view === 'results' ? 'block' : 'hidden lg:block'} lg:absolute lg:inset-0 lg:transition-all lg:duration-500 lg:ease-in-out ${panelClasses('results')}`}>
            <div className="lg:h-screen lg:flex lg:flex-col">

              {/* Ingredient bar */}
              <div className="bg-yellow border-b border-black flex items-center flex-wrap sticky top-0 z-40">
                <div className="px-4 py-3 flex items-center gap-2 flex-wrap">
                  {[...PROTEINS, ...STARCHES].map(ing => (
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

              {/* Recipe list */}
              <div ref={recipesSectionRef} className="lg:flex-1 lg:overflow-y-auto py-8 px-6">
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
                          isExpanded={expandedRecipeId === recipe.id}
                          onToggle={() => toggleRecipe(recipe.id)}
                          isMatched={isMatched}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>

      {/* Sticky recipe count bar */}
      <div className={`fixed bottom-0 left-0 right-0 flex justify-center pb-6 pointer-events-none transition-all duration-300 ease-out ${view === 'results' && selected.size > 0 && !recipesInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="border border-black rounded-2xl px-6 py-3 font-ui font-bold text-lg pointer-events-auto bg-black text-yellow whitespace-nowrap">
          {displayedRecipes.length} recipe{displayedRecipes.length === 1 ? '' : 's'} found.
        </div>
      </div>
    </>
  )
}
