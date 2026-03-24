'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

const CHIP_COLORS = [
  'bg-red-600 text-white',
  'bg-blue-700 text-white',
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
      <nav className="sticky top-0 z-50 bg-white border-b-8 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center px-6 py-4">
        <span className="font-display font-black italic tracking-tighter text-4xl text-red-600">
          PANTRIO
        </span>
      </nav>

      <main className="flex flex-col lg:flex-row min-h-[calc(100svh-73px)]">

        {/* Left: headline */}
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 pt-12 lg:pt-0 pb-4 lg:pb-0 lg:flex-1">
          <h1 className="font-display font-black uppercase tracking-tighter leading-[0.85] text-5xl sm:text-6xl lg:text-8xl">
            WHAT ARE
            <br />
            YOU
            <br />
            <span className="text-red-600 italic">COOKING</span>
            <br />
            WITH?
          </h1>
        </div>

        {/* Divider — desktop only */}
        <div className="hidden lg:block w-2 bg-black flex-shrink-0" />

        {/* Right: form */}
        <div className="flex flex-col justify-center px-6 md:px-10 lg:px-16 pb-16 pt-4 lg:pt-0 lg:w-[520px] xl:w-[600px] flex-shrink-0">

          <div className="mb-4">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder="harissa, chickpeas..."
              autoFocus
              className="w-full bg-white border-8 border-black px-5 py-4 text-2xl md:text-3xl font-display font-black uppercase placeholder:text-zinc-300 focus:outline-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          {emptyError && (
            <p className="mb-3 font-sans font-bold uppercase tracking-tight text-red-600 text-sm">
              Add something first. Even one ingredient.
            </p>
          )}

          <button
            onClick={handleFindRecipes}
            className="w-full bg-red-600 text-white border-8 border-black px-5 py-5 font-display font-black text-3xl md:text-4xl uppercase tracking-tighter shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-none mb-10"
          >
            FIND RECIPES
          </button>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-3 items-start">
              {ingredients.map((ingredient, index) => (
                <button
                  key={ingredient}
                  onClick={() => removeIngredient(ingredient)}
                  className={`
                    ${CHIP_COLORS[index % CHIP_COLORS.length]}
                    ${CHIP_ROTATIONS[index % CHIP_ROTATIONS.length]}
                    border-4 border-black px-4 py-2
                    font-sans font-black text-sm uppercase tracking-tight
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    active:translate-x-1 active:translate-y-1 active:shadow-none
                    flex items-center gap-2 transition-none
                  `}
                >
                  {ingredient}
                  <span className="opacity-60 text-xs">✕</span>
                </button>
              ))}
            </div>
          )}

        </div>
      </main>
    </>
  )
}
