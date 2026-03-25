'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const CHIP_COLORS = [
  'bg-red-600 text-white',
  'bg-olive-700 text-white',
  'bg-amber-400 text-zinc-950',
  'bg-zinc-950 text-white',
]

const CHIP_ROTATIONS = [
  '-rotate-2',
  'rotate-3',
  '-rotate-1',
  'rotate-2',
  '-rotate-3',
  'rotate-1',
]

export function IngredientInput() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [emptyError, setEmptyError] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  function addIngredients(raw: string) {
    const incoming = raw
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 0)

    setIngredients(prev => {
      const next = [...prev]
      for (const item of incoming) {
        if (!next.includes(item)) next.push(item)
      }
      return next
    })

    setEmptyError(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addIngredients(inputValue)
        setInputValue('')
      }
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text')
    const combined = inputValue ? `${inputValue},${pasted}` : pasted
    addIngredients(combined)
    setInputValue('')
  }

  function removeIngredient(ingredient: string) {
    setIngredients(prev => prev.filter(i => i !== ingredient))
  }

  function handleFindRecipes() {
    if (ingredients.length === 0) {
      setEmptyError(true)
      inputRef.current?.focus()
      return
    }
    router.push(`/results?ingredients=${encodeURIComponent(ingredients.join(','))}`)
  }

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white border-b-2 border-black shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] flex items-center px-6 py-3">
        <span className="font-display tracking-tighter text-2xl text-red-600">
          PANTRIO
        </span>
      </nav>

      <main className="flex flex-col lg:flex-row min-h-[calc(100svh-49px)]">

        {/* Left: content */}
        <div className="flex flex-col justify-center px-8 md:px-12 lg:px-16 py-12 lg:py-0 lg:flex-1 lg:max-w-[55%]">

          {/* Eyebrow */}
          <p className="font-sans font-black uppercase text-xs tracking-widest text-zinc-950 opacity-50 mb-6">
            OPEN YOUR FRIDGE. START TYPING.
          </p>

          {/* Headline */}
          <h1 className="font-display uppercase tracking-tighter leading-[0.9] text-5xl sm:text-6xl lg:text-7xl mb-8">
            WHAT ARE YOU
            <br />
            <span className="text-red-600">COOKING</span>
            <br />
            WITH?
          </h1>

          {/* Input */}
          <div className="mb-3">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="garlic, olive oil, chickpeas..."
              autoFocus
              className="w-full bg-white border-2 border-black px-4 py-2.5 text-sm font-sans font-bold uppercase placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]"
            />
          </div>

          {emptyError && (
            <p className="mb-2 font-sans font-bold uppercase tracking-tight text-red-600 text-xs">
              Add something first. Even one ingredient.
            </p>
          )}

          <button
            onClick={handleFindRecipes}
            className="w-full bg-red-600 text-white border-2 border-black px-4 py-2.5 font-sans font-black text-sm uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none transition-none mb-8"
          >
            FIND RECIPES
          </button>

          {/* Chips */}
          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 items-start">
              {ingredients.map((ingredient, index) => (
                <button
                  key={ingredient}
                  onClick={() => removeIngredient(ingredient)}
                  className={`
                    ${CHIP_COLORS[index % CHIP_COLORS.length]}
                    ${CHIP_ROTATIONS[index % CHIP_ROTATIONS.length]}
                    border-2 border-black px-3 py-1.5
                    font-sans font-black text-xs uppercase tracking-tight
                    shadow-[3px_3px_0px_0px_rgba(28,20,16,1)]
                    active:translate-x-[3px] active:translate-y-[3px] active:shadow-none
                    flex items-center gap-1.5 transition-none
                  `}
                >
                  {ingredient}
                  <span className="opacity-60 text-xs">✕</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: image placeholder */}
        <div className="hidden lg:flex flex-1 border-l-2 border-black items-center justify-center bg-zinc-50 relative overflow-hidden">
          <div className="border-2 border-black border-dashed m-10 flex-1 h-[70%] flex flex-col items-center justify-center gap-4 shadow-[6px_6px_0px_0px_rgba(28,20,16,1)]">
            <span className="font-display uppercase tracking-tighter text-3xl text-zinc-300">
              IMAGE
            </span>
            <span className="font-sans font-black uppercase text-xs tracking-widest text-zinc-300">
              COMING SOON
            </span>
          </div>
        </div>

      </main>
    </>
  )
}
