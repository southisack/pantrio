'use client'

import { useEffect, useRef } from 'react'
import { difficultyLabel, formatTime } from '@/src/lib/ingredients'
import type { Recipe } from '@/src/types'

const NORMAL_RATE = 1
const HOVER_RATE = 1 / 6

export function RecipeCarousel({ recipes, onOpen }: {
  recipes: Recipe[]
  onOpen: (recipeId: string) => void
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const targetRate = useRef(NORMAL_RATE)
  const currentRate = useRef(NORMAL_RATE)
  const frameId = useRef<number | null>(null)

  useEffect(() => () => {
    if (frameId.current !== null) cancelAnimationFrame(frameId.current)
  }, [])

  // The scroll itself is a CSS animation. Hovering only eases its playback rate.
  function easeTo(rate: number) {
    targetRate.current = rate
    if (frameId.current !== null) return

    let lastTime = performance.now()
    function tick(now: number) {
      const elapsedSeconds = Math.min(0.05, (now - lastTime) / 1000)
      lastTime = now
      currentRate.current += (targetRate.current - currentRate.current) * Math.min(1, elapsedSeconds * 6)

      const isSettled = Math.abs(targetRate.current - currentRate.current) < 0.005
      if (isSettled) currentRate.current = targetRate.current

      const animation = trackRef.current?.getAnimations()[0]
      if (animation) animation.playbackRate = currentRate.current

      frameId.current = isSettled ? null : requestAnimationFrame(tick)
    }
    frameId.current = requestAnimationFrame(tick)
  }

  function renderCards(isDuplicate: boolean) {
    return (
      <div
        aria-hidden={isDuplicate}
        className={`flex flex-none gap-4 pr-4 ${isDuplicate ? 'motion-reduce:hidden' : ''}`}
      >
        {recipes.map(recipe => (
          <button
            key={recipe.id}
            onClick={() => onOpen(recipe.id)}
            tabIndex={isDuplicate ? -1 : undefined}
            className="flex-none w-card h-card-tall flex flex-col items-start gap-2.5 px-4 py-3.5 bg-white text-black text-left border-2 border-black rounded-card"
          >
            <span className="font-mono font-bold text-card-label uppercase">
              Recipe · {formatTime(recipe.time)}
            </span>
            <span className="font-display text-card-title">{recipe.name}</span>
            <span className="mt-auto font-semibold text-sm uppercase">
              {difficultyLabel[recipe.difficulty]}
            </span>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="mt-12 -mx-4 lg:mt-auto lg:-ml-14 lg:-mr-12">
      <h2 className="pb-2 pl-4 font-mono font-bold text-label uppercase lg:pl-14">
        Fresh from the cookbook
      </h2>
      <div
        onMouseEnter={() => easeTo(HOVER_RATE)}
        onMouseLeave={() => easeTo(NORMAL_RATE)}
        onFocus={() => easeTo(HOVER_RATE)}
        onBlur={() => easeTo(NORMAL_RATE)}
        className="overflow-hidden pt-1 pb-1.5 motion-reduce:overflow-x-auto"
      >
        <div ref={trackRef} className="flex w-max motion-safe:animate-marquee">
          {renderCards(false)}
          {renderCards(true)}
        </div>
      </div>
    </div>
  )
}
