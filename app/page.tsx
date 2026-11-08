'use client'

import { useState, useMemo, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { IngredientMenu } from '@/src/components/IngredientMenu'
import { OrderCard } from '@/src/components/OrderCard'
import { RecipeCarousel } from '@/src/components/RecipeCarousel'
import { RecipeDetail } from '@/src/components/RecipeDetail'
import { RecipePanel } from '@/src/components/RecipePanel'
import { RecipeList } from '@/src/components/RecipeList'
import { FEATURED_RECIPE_IDS, SIDES, SIDE_TAG } from '@/src/lib/ingredients'
import { useIsDesktop } from '@/src/lib/useIsDesktop'
import type { Recipe } from '@/src/types'
import recipesData from '@/data/recipes.json'

const recipes = recipesData as Recipe[]
const featuredRecipes = FEATURED_RECIPE_IDS.flatMap(id => recipes.filter(recipe => recipe.id === id))

type View = 'picker' | 'results'
type Phase = 'idle' | 'intro' | 'leaving' | 'entering'

const LEAVE_MS = 520
const ENTER_MS = 1300
const INTRO_MS = 1300

function RecipeModal({ recipe, onClose, isMatched, showStatus }: {
  recipe: Recipe
  onClose: () => void
  isMatched: (name: string) => boolean
  showStatus: boolean
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
        className={`relative bg-white text-black border-2 border-black rounded-t-card sm:rounded-card overflow-hidden w-full sm:max-w-xl max-h-[92vh] overflow-y-auto ${closing ? 'animate-modal-out' : 'animate-modal-in'}`}
        onClick={e => e.stopPropagation()}
      >
        <RecipeDetail
          recipe={recipe}
          variant="modal"
          isMatched={isMatched}
          showStatus={showStatus}
          onClose={handleClose}
        />
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
  const isDesktop = useIsDesktop()

  const [view, setView] = useState<View>(() => {
    if (searchParams.get('ingredients')) return 'results'
    return 'picker'
  })

  const [selected, setSelected] = useState<Set<string>>(() => {
    const param = searchParams.get('ingredients')
    return param ? new Set(param.split(',').filter(Boolean)) : new Set()
  })

  const [expandedRecipeId, setExpandedRecipeId] = useState<string | null>(null)

  // 'leaving': the current view's rows slip out. 'entering': the next view mounts and its rows rise in.
  // 'intro': first load, rows rise in without the panel color fade.
  const [phase, setPhase] = useState<Phase>('intro')
  const transitionId = useRef(0)

  useEffect(() => {
    const timer = window.setTimeout(() => setPhase(current => (current === 'intro' ? 'idle' : current)), INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [])

  function runTransition(applyChange: () => void) {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      applyChange()
      return
    }
    const id = ++transitionId.current
    setPhase('leaving')
    window.setTimeout(() => {
      if (id !== transitionId.current) return
      applyChange()
      setPhase('entering')
      window.setTimeout(() => {
        if (id === transitionId.current) setPhase('idle')
      }, ENTER_MS)
    }, LEAVE_MS)
  }

  function navigateTo(newView: View) {
    let url = '/'
    if (newView === 'results') {
      url = selected.size > 0 ? `/?ingredients=${encodeURIComponent([...selected].join(','))}` : '/?view=results'
    }
    window.history.pushState({ view: newView, selected: [...selected] }, '', url)
    runTransition(() => {
      setView(newView)
      setExpandedRecipeId(null)
    })
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

  function resetToStart() {
    runTransition(() => {
      setSelected(new Set())
      setView('picker')
      setExpandedRecipeId(null)
      window.history.replaceState({ view: 'picker', selected: [] }, '', '/')
    })
  }

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  const expandedRecipe = recipes.find(recipe => recipe.id === expandedRecipeId) ?? null
  const showsPanel = view === 'results' && isDesktop
  // On desktop the right panel always shows a recipe: the picked one if it is still in the list, else the first.
  const panelRecipe = showsPanel
    ? displayedRecipes.find(recipe => recipe.id === expandedRecipeId) ?? displayedRecipes[0] ?? null
    : null
  const showsModal = expandedRecipe !== null && !showsPanel

  // Up/down arrows step through the recipe list while the side panel is showing.
  const panelRecipeId = panelRecipe?.id ?? null
  useEffect(() => {
    if (!showsPanel) return
    function onKey(event: KeyboardEvent) {
      if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return
      const currentIndex = displayedRecipes.findIndex(recipe => recipe.id === panelRecipeId)
      const nextRecipe = displayedRecipes[currentIndex + (event.key === 'ArrowDown' ? 1 : -1)]
      event.preventDefault()
      if (nextRecipe) setExpandedRecipeId(nextRecipe.id)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [showsPanel, displayedRecipes, panelRecipeId])

  return (
    <>
      <main data-phase={phase}>
        {view === 'picker' ? (
          <div className="min-h-screen flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden [html:has(&)]:bg-white">

            <div className="cascade-bg-to-yellow min-w-0 flex flex-col px-4 pt-11 pb-8 bg-yellow text-black lg:flex-none lg:w-panel lg:min-w-panel lg:h-screen lg:overflow-y-auto lg:pl-14 lg:pr-11 lg:pb-panel-bottom lg:border-r-2 lg:border-black">
              <h1 className="cascade-item cascade-up cascade-d0 mb-hero-gap max-w-lede font-ui font-semibold text-6xl leading-none tracking-tight lg:text-hero">
                What are you working with?
              </h1>
              <p className="cascade-item cascade-up cascade-d1 max-w-lede font-ui text-2xl leading-tight">
                Pick your main ingredient. We'll surface recipes that actually make sense with what you've got.
              </p>
              <RecipeCarousel recipes={featuredRecipes} onOpen={setExpandedRecipeId} />
            </div>

            <IngredientMenu
              selected={selected}
              onToggle={toggle}
              footer={<OrderCard chosen={[...selected]} onSubmit={() => navigateTo('results')} />}
            />

          </div>
        ) : (
          <div className="min-h-screen flex flex-col lg:flex-row lg:h-screen lg:overflow-hidden bg-yellow text-black">

            <div data-panel-scroll className="cascade-bg-to-yellow min-w-0 px-4 pt-11 pb-8 bg-yellow lg:order-2 lg:flex-1 lg:h-screen lg:overflow-y-auto lg:px-14 lg:pb-16">
              <div className="lg:hidden">
                <button
                  onClick={resetToStart}
                  className="cascade-item cascade-d0 mb-10 font-mono font-bold text-label uppercase text-left hover:opacity-70 transition-opacity"
                >
                  ← Pantrio
                </button>
                <h1 className="cascade-item cascade-d1 mb-hero-gap max-w-lede font-ui font-semibold text-6xl leading-none tracking-tight">
                  Not bad, actually.
                </h1>
                <p className="cascade-item cascade-d2 max-w-lede font-ui text-2xl leading-tight">
                  Toggle ingredients to narrow things down. Or just cook everything.
                </p>
              </div>

              {panelRecipe && (
                <RecipePanel
                  recipe={panelRecipe}
                  index={displayedRecipes.findIndex(recipe => recipe.id === panelRecipe.id)}
                  isMatched={isMatched}
                  showStatus={selected.size > 0}
                  canAnimate={phase === 'idle'}
                />
              )}
            </div>

            <RecipeList
              recipes={displayedRecipes}
              selected={selected}
              onToggle={toggle}
              activeId={panelRecipe?.id ?? null}
              onSelect={setExpandedRecipeId}
              onBack={resetToStart}
            />

          </div>
        )}
      </main>

      {showsModal && expandedRecipe && (
        <RecipeModal
          recipe={expandedRecipe}
          onClose={() => setExpandedRecipeId(null)}
          isMatched={isMatched}
          showStatus={selected.size > 0}
        />
      )}
    </>
  )
}
