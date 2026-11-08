'use client'

// Lives inside the menu column and sticks to the bottom of its scroll area, so it always lines up with the rows.
export function OrderCard({ chosen, onSubmit }: {
  chosen: string[]
  onSubmit: () => void
}) {
  const hasOrder = chosen.length > 0

  return (
    <>
      <div
        aria-hidden={!hasOrder}
        className={`cascade-item cascade-down cascade-d1 sticky bottom-6 z-40 mt-8 mb-6 flex flex-col gap-4 py-row pl-7 pr-5 bg-black text-yellow border-2 border-yellow rounded-order ring-4 ring-black transition-[transform,opacity,visibility] duration-300 ease-pop xl:flex-row xl:items-center xl:gap-6 ${
          hasOrder ? 'translate-y-0 opacity-100 visible' : 'translate-y-40 opacity-0 invisible'
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-mono font-bold text-label uppercase">
            Working with
          </p>
          <div className="flex flex-wrap gap-1.5">
            {chosen.map(ingredient => (
              <span key={ingredient} className="px-3.5 py-1 bg-yellow text-black rounded-full font-display text-lg capitalize">
                {ingredient}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={onSubmit}
          className="flex-none px-7 py-row bg-yellow text-black rounded-row font-semibold text-lg uppercase lg:text-cta xl:w-64"
        >
          Show recipes
        </button>
      </div>
    </>
  )
}
