'use client'

import { useState } from 'react'
import { INGREDIENT_PHOTOS } from '@/src/lib/ingredients'

export function IngredientCard({ ingredient, isSelected, onToggle }: {
  ingredient: string
  isSelected: boolean
  onToggle: () => void
}) {
  const [bursting, setBursting] = useState(false)
  const [hovered, setHovered] = useState(false)
  const photo = INGREDIENT_PHOTOS[ingredient]

  function handleClick() {
    if (!isSelected) setBursting(true)
    onToggle()
  }

  return (
    <div
      className={`relative transition-transform duration-200 ease-out ${isSelected ? 'scale-95' : hovered ? 'scale-110' : 'scale-100'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`relative ${!isSelected && hovered ? 'animate-levitate' : ''}`}>
        {bursting && (
          <span
            className="impact-burst"
            onAnimationEnd={() => setBursting(false)}
          />
        )}
        <button
          onClick={handleClick}
          className="relative flex flex-col items-center justify-center gap-2 aspect-[2/3] w-full rounded-3xl border border-black font-ui font-bold text-xl capitalize tracking-tight overflow-hidden"
          style={!photo ? { backgroundColor: isSelected ? '#f4f4f5' : '#ffffff' } : undefined}
        >
          {photo ? (
            <>
              <div
                className="absolute inset-0"
                style={{ backgroundImage: `url(${photo})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
              />
              {isSelected && <div className="absolute inset-0 bg-yellow/70" />}
              <span className="absolute bottom-3 left-3 right-3 bg-yellow border border-black rounded-2xl py-2 text-black text-center z-10">{ingredient}</span>
            </>
          ) : (
            <span className="text-black">{ingredient}</span>
          )}
        </button>
      </div>
    </div>
  )
}
