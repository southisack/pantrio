export default function DesignSystemPage() {
  return (
    <div className="bg-white min-h-screen">

      {/* Page Header */}
      <div className="border-b-4 border-black px-6 py-3 flex items-center justify-between sticky top-0 bg-white z-50">
        <div className="flex items-center gap-3">
          <span className="font-display italic tracking-tighter text-2xl text-red-600">PANTRIO</span>
          <span className="font-sans font-black uppercase text-xs tracking-tight text-zinc-950 opacity-40">/ Design System</span>
        </div>
        <a
          href="/"
          className="font-sans font-black uppercase text-xs tracking-tight border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none"
        >
          ← HOME
        </a>
      </div>

      <div className="px-6 py-10 max-w-5xl mx-auto space-y-14">

        {/* ─── COLOR PALETTE ─── */}
        <section>
          <SectionLabel>Color Palette</SectionLabel>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mt-5">
            <Swatch hex="#EB0000" name="Red 600" label="Primary / Logo / CTA" textClass="text-white" />
            <Swatch hex="#BC0100" name="Red 700" label="Red Hover" textClass="text-white" />
            <Swatch hex="#FFC130" name="Amber 400" label="Chip Accent" textClass="text-zinc-950" />
            <Swatch hex="#004BE4" name="Blue 700" label="Section Accent" textClass="text-white" />
            <Swatch hex="#1B1B1B" name="Zinc 950" label="Border / Body" textClass="text-white" />
            <Swatch hex="#F9F9F9" name="Zinc 50" label="Background" textClass="text-zinc-950" bordered />
          </div>
        </section>

        {/* ─── TYPOGRAPHY ─── */}
        <section>
          <SectionLabel>Typography</SectionLabel>
          <div className="mt-5 space-y-6 border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]">

            <Row label="Display / Epilogue 900 — Headline XL">
              <p className="font-display uppercase tracking-tighter leading-[0.85] text-4xl">
                WHAT ARE YOU <span className="text-red-600 italic">COOKING</span> WITH?
              </p>
            </Row>

            <Row label="Display / Epilogue 900 — Headline LG">
              <p className="font-display uppercase tracking-tighter leading-[0.85] text-2xl">
                HERE'S WHAT YOU CAN <span className="text-red-600 italic">ACTUALLY</span> COOK.
              </p>
            </Row>

            <Row label="Display / Epilogue 900 — Component">
              <p className="font-display uppercase tracking-tighter text-xl">
                SPAGHETTI AGLIO E OLIO
              </p>
            </Row>

            <Row label="Display / Epilogue 900 — Logo">
              <p className="font-display italic tracking-tighter text-2xl text-red-600">
                PANTRIO
              </p>
            </Row>

            <Row label="Sans / Space Grotesk 700 — Body Bold">
              <p className="font-sans font-bold text-base leading-snug">
                Found 4 recipes. Not bad at all.
              </p>
            </Row>

            <Row label="Sans / Space Grotesk 400 — Body Regular">
              <p className="font-sans text-sm leading-relaxed max-w-md">
                A deceptively simple Italian classic that transforms pantry staples into something genuinely satisfying. The key is patience with the garlic.
              </p>
            </Row>

            <Row label="Sans / Space Grotesk 900 — Label / Tag">
              <p className="font-sans font-black uppercase text-xs tracking-tight">
                INGREDIENTS · TIME · EFFORT
              </p>
            </Row>

          </div>
        </section>

        {/* ─── SHADOWS & BORDERS ─── */}
        <section>
          <SectionLabel>Shadows & Borders</SectionLabel>
          <div className="mt-5 grid grid-cols-4 gap-6">
            {[
              { size: 'XS — 4px', cls: 'shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]', border: 'border-4' },
              { size: 'SM — 6px', cls: 'shadow-[6px_6px_0px_0px_rgba(28,20,16,1)]', border: 'border-4' },
              { size: 'MD — 8px', cls: 'shadow-[8px_8px_0px_0px_rgba(28,20,16,1)]', border: 'border-8' },
              { size: 'LG — 12px', cls: 'shadow-[12px_12px_0px_0px_rgba(28,20,16,1)]', border: 'border-8' },
            ].map(({ size, cls, border }) => (
              <div key={size} className={`${border} border-black ${cls} bg-white p-4 flex items-end h-20`}>
                <span className="font-sans font-black uppercase text-xs">{size}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BUTTONS ─── */}
        <section>
          <SectionLabel>Buttons</SectionLabel>
          <div className="mt-5 space-y-5">

            <Row label="Primary — Full Width">
              <button className="w-full max-w-xs bg-red-600 text-white border-4 border-black px-5 py-3 font-display text-xl uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">
                FIND RECIPES
              </button>
            </Row>

            <Row label="Primary — Inline (Empty State CTA)">
              <a href="#" className="inline-block bg-red-600 text-white font-display uppercase tracking-tighter text-lg border-4 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none active:translate-x-1 active:translate-y-1 active:shadow-none transition-none">
                TRY AGAIN
              </a>
            </Row>

            <Row label="Secondary — Nav / Back">
              <div className="flex gap-3">
                <a href="#" className="inline-block font-sans font-black uppercase text-xs tracking-tight border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none">
                  ← BACK
                </a>
                <a href="#" className="inline-block font-sans font-black uppercase text-xs tracking-tight border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none">
                  ← RESULTS
                </a>
              </div>
            </Row>

            <Row label="CTA Strip — Recipe Card">
              <div className="w-48 bg-zinc-950 text-white font-display text-base uppercase tracking-tighter text-center py-2 border-2 border-black">
                COOK IT →
              </div>
            </Row>

          </div>
        </section>

        {/* ─── INPUTS ─── */}
        <section>
          <SectionLabel>Inputs</SectionLabel>
          <div className="mt-5 space-y-5">

            <Row label="Text Input — Default">
              <input
                type="text"
                placeholder="harissa, chickpeas..."
                readOnly
                className="w-full max-w-sm bg-white border-4 border-black px-4 py-2.5 text-base font-display uppercase placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]"
              />
            </Row>

            <Row label="Text Input — With Value">
              <input
                type="text"
                defaultValue="GARLIC, OLIVE OIL"
                readOnly
                className="w-full max-w-sm bg-white border-4 border-black px-4 py-2.5 text-base font-display uppercase placeholder:text-zinc-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]"
              />
            </Row>

            <Row label="Error State">
              <p className="font-sans font-bold uppercase tracking-tight text-red-600 text-sm">
                Add something first. Even one ingredient.
              </p>
            </Row>

          </div>
        </section>

        {/* ─── INGREDIENT CHIPS ─── */}
        <section>
          <SectionLabel>Ingredient Chips</SectionLabel>
          <div className="mt-5 flex flex-wrap gap-3 items-start">
            {[
              { label: 'GARLIC', color: 'bg-red-600 text-white', rotate: '-rotate-2' },
              { label: 'OLIVE OIL', color: 'bg-olive-700 text-white', rotate: 'rotate-3' },
              { label: 'CHICKPEAS', color: 'bg-amber-400 text-zinc-950', rotate: '-rotate-1' },
              { label: 'HARISSA', color: 'bg-zinc-950 text-white', rotate: 'rotate-2' },
              { label: 'PASTA', color: 'bg-red-600 text-white', rotate: '-rotate-3' },
              { label: 'LEMON', color: 'bg-olive-700 text-white', rotate: 'rotate-1' },
            ].map(({ label, color, rotate }) => (
              <button
                key={label}
                className={`${color} ${rotate} border-4 border-black px-4 py-2 font-sans font-black text-sm uppercase tracking-tight shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] active:translate-x-1 active:translate-y-1 active:shadow-none flex items-center gap-2 transition-none`}
              >
                {label}
                <span className="opacity-60 text-xs">✕</span>
              </button>
            ))}
          </div>
        </section>

        {/* ─── NAVIGATION ─── */}
        <section>
          <SectionLabel>Navigation</SectionLabel>
          <div className="mt-5 space-y-4">

            <Row label="Nav — Home (Logo only)">
              <div className="border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] flex items-center px-4 py-3 bg-white max-w-lg">
                <span className="font-display italic tracking-tighter text-2xl text-red-600">PANTRIO</span>
              </div>
            </Row>

            <Row label="Nav — With Back Button">
              <div className="border-b-4 border-black shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] flex items-center justify-between px-4 py-3 bg-white max-w-lg">
                <span className="font-display italic tracking-tighter text-2xl text-red-600">PANTRIO</span>
                <a href="#" className="font-sans font-black uppercase text-xs tracking-tight border-2 border-black px-3 py-1.5 shadow-[3px_3px_0px_0px_rgba(28,20,16,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none">
                  ← BACK
                </a>
              </div>
            </Row>

          </div>
        </section>

        {/* ─── RECIPE CARD ─── */}
        <section>
          <SectionLabel>Recipe Card</SectionLabel>
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">

            <div className="group block bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(28,20,16,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] transition-none cursor-pointer">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="font-display uppercase tracking-tighter leading-none text-2xl flex-1">
                    SPAGHETTI AGLIO E OLIO
                  </h2>
                  <div className="flex-shrink-0 bg-red-600 text-white font-display text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(28,20,16,1)] px-2 py-1 leading-none">
                    87%
                  </div>
                </div>
                <p className="font-sans text-sm leading-snug mb-4 text-zinc-950">
                  A deceptively simple Italian classic that transforms pantry staples into something genuinely satisfying.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <MiniStatBox label="INGREDIENTS" value="6 OF 7" valueClass="text-red-600" />
                  <MiniStatBox label="TIME" value="20 MINS" />
                  <MiniStatBox label="EFFORT" value="EASY" />
                </div>
                <div className="w-full bg-zinc-950 text-white font-display text-base uppercase tracking-tighter text-center py-2.5 border-2 border-black group-hover:bg-red-600 transition-none">
                  COOK IT →
                </div>
              </div>
            </div>

            <div className="group block bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(28,20,16,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] transition-none cursor-pointer">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <h2 className="font-display uppercase tracking-tighter leading-none text-2xl flex-1">
                    SHAKSHUKA
                  </h2>
                  <div className="flex-shrink-0 bg-red-600 text-white font-display text-sm border-2 border-black shadow-[2px_2px_0px_0px_rgba(28,20,16,1)] px-2 py-1 leading-none">
                    54%
                  </div>
                </div>
                <p className="font-sans text-sm leading-snug mb-4 text-zinc-950">
                  Eggs poached in a spiced tomato sauce. Works for breakfast, lunch, or dinner — no one will judge you.
                </p>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <MiniStatBox label="INGREDIENTS" value="4 OF 8" valueClass="text-red-600" />
                  <MiniStatBox label="TIME" value="35 MINS" />
                  <MiniStatBox label="EFFORT" value="EASY" />
                </div>
                <div className="w-full bg-zinc-950 text-white font-display text-base uppercase tracking-tighter text-center py-2.5 border-2 border-black group-hover:bg-red-600 transition-none">
                  COOK IT →
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ─── STAT BOXES ─── */}
        <section>
          <SectionLabel>Stat Boxes</SectionLabel>
          <div className="mt-5 flex flex-wrap gap-8">

            <div>
              <Label>Card Stat (border-4)</Label>
              <div className="flex gap-3">
                <MiniStatBox label="INGREDIENTS" value="6 OF 7" valueClass="text-red-600" />
                <MiniStatBox label="TIME" value="20 MINS" />
                <MiniStatBox label="EFFORT" value="EASY" />
              </div>
            </div>

            <div>
              <Label>Detail Meta (border-8)</Label>
              <div className="flex gap-3">
                {['TIME / 20 MINS', 'SERVES / 4', 'EFFORT / EASY'].map((item) => {
                  const [lbl, val] = item.split(' / ')
                  return (
                    <div key={lbl} className="border-4 border-black p-3 text-center w-24">
                      <span className="block font-sans font-black uppercase text-xs mb-1">{lbl}</span>
                      <span className="font-display text-base uppercase leading-tight">{val}</span>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ─── SECTION HEADERS ─── */}
        <section>
          <SectionLabel>Section Headers</SectionLabel>
          <div className="mt-5 flex gap-6 flex-wrap items-start">
            <div className="inline-block bg-zinc-950 text-white font-display uppercase tracking-tighter text-xl px-3 py-1.5 rotate-1 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]">
              THE KIT
            </div>
            <div className="inline-block bg-olive-700 text-white font-display uppercase tracking-tighter text-xl px-3 py-1.5 -rotate-1 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]">
              DO THIS
            </div>
          </div>
        </section>

        {/* ─── INGREDIENT ROWS ─── */}
        <section>
          <SectionLabel>Ingredient Rows</SectionLabel>
          <div className="mt-5 max-w-sm space-y-2">
            <div className="border-4 border-black p-3 bg-white flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] translate-x-1">
              <span className="font-sans font-black uppercase text-red-600 text-sm">3 CLOVES GARLIC</span>
              <span className="font-sans font-black uppercase text-xs bg-red-600 text-white px-2 py-0.5 flex-shrink-0 ml-3">NEED IT</span>
            </div>
            <div className="border-4 border-black p-3 bg-white flex items-center justify-between shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] translate-x-1">
              <span className="font-sans font-black uppercase text-red-600 text-sm">200G SPAGHETTI</span>
              <span className="font-sans font-black uppercase text-xs bg-red-600 text-white px-2 py-0.5 flex-shrink-0 ml-3">NEED IT</span>
            </div>
            <div className="border-4 border-black p-3 bg-zinc-100 flex items-center justify-between">
              <span className="font-sans font-bold uppercase text-zinc-400 line-through text-sm">OLIVE OIL</span>
              <span className="font-sans font-black uppercase text-xs text-zinc-400 flex-shrink-0 ml-3">GOT IT</span>
            </div>
            <div className="border-4 border-black p-3 bg-zinc-100 flex items-center justify-between">
              <span className="font-sans font-bold uppercase text-zinc-400 line-through text-sm">PARMESAN</span>
              <span className="font-sans font-black uppercase text-xs text-zinc-400 flex-shrink-0 ml-3">GOT IT</span>
            </div>
          </div>
        </section>

        {/* ─── STEP BLOCK ─── */}
        <section>
          <SectionLabel>Step Block</SectionLabel>
          <div className="mt-5 space-y-5 max-w-xl">
            {[
              { n: '01', text: 'Bring a large pot of heavily salted water to a boil. Cook spaghetti until al dente.' },
              { n: '02', text: 'Warm olive oil over medium-low heat. Add sliced garlic and cook until golden — not brown.' },
              { n: '03', text: 'Reserve 1 cup pasta water before draining. Toss pasta with garlic oil to emulsify.' },
            ].map(({ n, text }) => (
              <div key={n} className="flex gap-4">
                <div className="flex-none w-12 h-12 border-4 border-black bg-zinc-950 text-white flex items-center justify-center font-display text-xl shadow-[4px_4px_0px_0px_rgba(28,20,16,1)]">
                  {n}
                </div>
                <div className="flex-grow pt-1">
                  <p className="font-sans text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── SUMMARY BLOCK ─── */}
        <section>
          <SectionLabel>Summary / Quote Block</SectionLabel>
          <div className="mt-5 max-w-lg">
            <p className="font-sans text-base leading-snug border-l-4 border-black pl-4">
              A deceptively simple Italian classic that transforms pantry staples into something genuinely satisfying. The key is patience with the garlic.
            </p>
          </div>
        </section>

        {/* ─── EMPTY STATE ─── */}
        <section>
          <SectionLabel>Empty State</SectionLabel>
          <div className="mt-5 max-w-lg">
            <div className="border-4 border-black border-dashed p-8 text-center">
              <p className="font-display uppercase tracking-tighter text-2xl mb-2">
                NOTHING MATCHED.
              </p>
              <p className="font-sans font-bold text-sm max-w-xs mx-auto">
                Either your fridge is very sparse or very unusual. Try adding a few more ingredients.
              </p>
              <a
                href="#"
                className="inline-block mt-5 bg-red-600 text-white font-display uppercase tracking-tighter text-base border-4 border-black px-6 py-2.5 shadow-[4px_4px_0px_0px_rgba(28,20,16,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-none"
              >
                TRY AGAIN
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}

/* ─── Helpers ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-display uppercase tracking-tighter text-xl whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-1 bg-zinc-950" />
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans font-black uppercase text-xs tracking-tight text-zinc-950 opacity-40 mb-2">{children}</p>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function Swatch({
  hex,
  name,
  label,
  textClass,
  bordered,
}: {
  hex: string
  name: string
  label: string
  textClass: string
  bordered?: boolean
}) {
  return (
    <div className="border-2 border-black">
      <div
        className={`h-14 flex items-end p-2 border-b-2 border-black`}
        style={{ backgroundColor: hex }}
      >
        <span className={`font-sans font-black text-xs ${textClass}`}>{hex}</span>
      </div>
      <div className="p-2 bg-white">
        <p className="font-sans font-black uppercase text-xs">{name}</p>
        <p className="font-sans text-xs text-zinc-950 opacity-50">{label}</p>
      </div>
    </div>
  )
}

function MiniStatBox({
  label,
  value,
  valueClass = '',
}: {
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="border-2 border-black p-2 min-w-[72px]">
      <span className="block font-sans font-black uppercase text-xs text-zinc-950 mb-0.5">{label}</span>
      <span className={`font-display text-sm uppercase leading-tight ${valueClass}`}>{value}</span>
    </div>
  )
}
