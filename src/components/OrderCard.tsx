'use client'

export function OrderCard({ chosen, onSubmit }: {
  chosen: string[]
  onSubmit: () => void
}) {
  const hasOrder = chosen.length > 0

  return (
    <>
      {!hasOrder && (
        <p className="fixed inset-x-4 bottom-11 z-30 text-center pointer-events-none font-mono font-bold text-label uppercase lg:inset-x-14">
          <span className="px-3.5 py-1 bg-black text-yellow rounded-full">
            Staring into the fridge... pick something.
          </span>
        </p>
      )}
      <div
        aria-hidden={!hasOrder}
        className={`fixed inset-x-4 bottom-6 z-40 flex flex-col gap-4 py-row pl-7 pr-5 bg-black text-yellow border-2 border-yellow rounded-order ring-4 ring-black transition-[transform,opacity,visibility] duration-300 ease-pop lg:inset-x-14 lg:flex-row lg:items-center lg:gap-6 ${
          hasOrder ? 'translate-y-0 opacity-100 visible' : 'translate-y-40 opacity-0 invisible'
        }`}
      >
        <div className="flex-1 min-w-0">
          <p className="mb-2 font-mono font-bold text-label uppercase">
            Your order · {chosen.length} {chosen.length === 1 ? 'item' : 'items'}
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
          className="flex-none px-7 py-row bg-yellow text-black rounded-row font-semibold text-lg uppercase lg:w-cta lg:text-cta"
        >
          I've done worse with less — show me →
        </button>
      </div>
    </>
  )
}
