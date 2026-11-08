'use client'

import { useEffect, useRef, useState } from 'react'
import { RecipeDetail } from '@/src/components/RecipeDetail'
import type { Recipe } from '@/src/types'

const OUT_MS = 140
const IN_MS = 420

type Shown = { recipe: Recipe; index: number }
type Mode = 'idle' | 'out' | 'in'

// Shows one recipe at a time. When the chosen recipe changes, the one on screen leaves, then the new one
// arrives, both moving in the direction of the move through the list (down the list = up the screen).
// canAnimate is false while the page itself is mid-transition, in which case the swap is instant.
export function RecipePanel({ recipe, index, isMatched, showStatus, canAnimate }: {
  recipe: Recipe
  index: number
  isMatched: (ingredientName: string) => boolean
  showStatus: boolean
  canAnimate: boolean
}) {
  const [shown, setShown] = useState<Shown>({ recipe, index })
  const [mode, setMode] = useState<Mode>('idle')
  const [flip, setFlip] = useState(false)
  const [direction, setDirection] = useState<'down' | 'up'>('down')

  const rootRef = useRef<HTMLDivElement>(null)
  const latest = useRef<Shown>({ recipe, index })
  const busy = useRef(false)
  const timers = useRef<number[]>([])

  latest.current = { recipe, index }

  useEffect(() => () => timers.current.forEach(timer => window.clearTimeout(timer)), [])

  function scrollToTop() {
    rootRef.current?.closest<HTMLElement>('[data-panel-scroll]')?.scrollTo({ top: 0 })
  }

  useEffect(() => {
    if (busy.current || recipe.id === shown.recipe.id) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!canAnimate || reducedMotion) {
      setShown({ recipe, index })
      scrollToTop()
      return
    }

    busy.current = true
    setDirection(index > shown.index ? 'down' : 'up')
    setFlip(current => !current)
    setMode('out')

    timers.current.push(window.setTimeout(() => {
      setShown(latest.current)
      scrollToTop()
      setFlip(current => !current)
      setMode('in')
      timers.current.push(window.setTimeout(() => {
        busy.current = false
        setMode('idle')
      }, IN_MS))
    }, OUT_MS))
    // mode is a dependency so a recipe picked mid-transition is picked up as soon as this one finishes
  }, [recipe, index, shown, canAnimate, mode])

  return (
    <div
      ref={rootRef}
      data-switch={mode === 'idle' ? undefined : mode}
      data-switch-flip={flip ? 'b' : 'a'}
      data-switch-dir={direction}
    >
      <RecipeDetail recipe={shown.recipe} variant="panel" isMatched={isMatched} showStatus={showStatus} />
    </div>
  )
}
