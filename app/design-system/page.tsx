import Link from 'next/link'

export default function DesignSystemPage() {
  return (
    <div className="bg-yellow min-h-screen">

      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-yellow border-b border-black flex items-center justify-center relative px-6 py-4">
        <span className="font-display font-bold text-xl text-black tracking-tight">Pantrio</span>
        <Link
          href="/"
          className="absolute left-6 font-ui font-bold text-sm text-black border border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none"
        >
          ← Back
        </Link>
        <span className="absolute right-6 font-ui text-xs text-gray uppercase tracking-widest">Design System</span>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-14 space-y-16">

        {/* ─── COLOR PALETTE ─── */}
        <section>
          <SectionLabel>Color Palette</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <Swatch hex="#FFEA59" name="Yellow" token="yellow" label="Page background / overlay" dark={false} />
            <Swatch hex="#58C2B9" name="Teal" token="teal" label="Hero background" dark={false} />
            <Swatch hex="#2A7A72" name="Teal Dark" token="teal-dark" label="Depth / hover states" dark={true} />
            <Swatch hex="#E8503A" name="Coral" token="coral" label="Warm accent — badges, highlights" dark={true} />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            <Swatch hex="#FFF9EF" name="Cream" token="cream" label="Softer card backgrounds" dark={false} bordered />
            <Swatch hex="#000000" name="Black" token="black" label="Text / borders / UI" dark={true} />
            <Swatch hex="#FFFFFF" name="White" token="white" label="Card backgrounds" dark={false} bordered />
            <Swatch hex="#666666" name="Gray" token="gray" label="Strikethrough / muted text" dark={true} />
          </div>
        </section>

        {/* ─── TYPOGRAPHY ─── */}
        <section>
          <SectionLabel>Typography</SectionLabel>
          <div className="mt-6 space-y-8">

            <Row label="font-display — Hero Headline (text-6xl, tracking-tight)">
              <h1 className="font-display text-6xl leading-[0.9] text-black tracking-tight">
                What are you <span className="text-outlined">working</span> with?
              </h1>
            </Row>

            <Row label="font-display — Recipe Title (text-5xl, tracking-tight)">
              <h1 className="font-display text-5xl leading-[0.9] text-black tracking-tight">
                Spaghetti Aglio e Olio
              </h1>
            </Row>

            <Row label="font-display — Section Header (text-2xl, tracking-tight)">
              <h2 className="font-display text-2xl leading-tight text-black tracking-tight">The Kit</h2>
            </Row>

            <Row label="font-display — Recipe Card Title (text-2xl, tracking-tight)">
              <h3 className="font-display text-2xl leading-tight text-black tracking-tight">Shakshuka</h3>
            </Row>

            <Row label="font-display — Nav Logo (text-xl, font-bold, tracking-tight)">
              <span className="font-display font-bold text-xl text-black tracking-tight">Pantrio</span>
            </Row>

            <Row label="font-ui — Body / Summary (text-sm, leading-snug)">
              <p className="font-ui text-sm leading-snug text-black max-w-md">
                A deceptively simple Italian classic that transforms pantry staples into something genuinely satisfying. The key is patience with the garlic.
              </p>
            </Row>

            <Row label="font-ui — Metadata strip (font-black, uppercase, text-xs, tracking-widest)">
              <div className="flex flex-wrap gap-4">
                <span className="font-ui font-black uppercase text-xs text-black tracking-widest">20 mins</span>
                <span className="font-ui font-black uppercase text-xs text-black tracking-widest">Easy</span>
                <span className="font-ui font-black uppercase text-xs text-black tracking-widest">Serves 4</span>
              </div>
            </Row>

            <Row label="font-ui — Button / Back link (font-bold, text-sm)">
              <span className="font-ui font-bold text-sm text-black">← Back</span>
            </Row>

            <Row label="text-outlined — Accent word treatment">
              <span className="font-display text-5xl leading-none text-outlined">working</span>
            </Row>

          </div>
        </section>

        {/* ─── SHADOWS & EFFECTS ─── */}
        <section>
          <SectionLabel>Shadows & Effects</SectionLabel>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">

            <Row label="hatch-shadow — Used on recipe cards, ingredient cards, kit sections">
              <div className="hatch-shadow">
                <div className="border border-black rounded-3xl p-6 bg-white relative z-10">
                  <p className="font-ui text-sm text-black">Bordered card with hatch shadow offset.</p>
                </div>
              </div>
            </Row>

            <Row label="hatch-shadow-sm — Smaller variant">
              <div className="hatch-shadow-sm">
                <div className="border border-black rounded-3xl p-6 bg-white relative z-10">
                  <p className="font-ui text-sm text-black">Smaller hatch shadow variant.</p>
                </div>
              </div>
            </Row>

          </div>
        </section>

        {/* ─── NAVIGATION ─── */}
        <section>
          <SectionLabel>Navigation</SectionLabel>
          <div className="mt-6 space-y-6">

            <Row label="Nav — Home (centered logo, no back button)">
              <div className="border border-black rounded-md overflow-hidden">
                <nav className="bg-yellow border-b border-black flex items-center justify-center px-6 py-4">
                  <span className="font-display font-bold text-xl text-black tracking-tight">Pantrio</span>
                </nav>
                <div className="h-8 bg-yellow" />
              </div>
            </Row>

            <Row label="Nav — With back button (absolute left)">
              <div className="border border-black rounded-md overflow-hidden">
                <nav className="bg-yellow border-b border-black flex items-center justify-center relative px-6 py-4">
                  <span className="font-display font-bold text-xl text-black tracking-tight">Pantrio</span>
                  <span className="absolute left-6 font-ui font-bold text-sm text-black border border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    ← Back
                  </span>
                </nav>
                <div className="h-8 bg-yellow" />
              </div>
            </Row>

          </div>
        </section>

        {/* ─── BUTTONS ─── */}
        <section>
          <SectionLabel>Buttons</SectionLabel>
          <div className="mt-6 space-y-6">

            <Row label="Back / nav button — pill with hatch shadow">
              <div className="flex gap-3 flex-wrap">
                <button className="font-ui font-bold text-sm text-black border border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none">
                  ← Back
                </button>
                <button className="font-ui font-bold text-sm text-black border border-black px-3 py-1.5 rounded-full shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-none">
                  ← Results
                </button>
              </div>
            </Row>

            <Row label="Sticky count bar — fixed bottom pill (black bg, yellow text)">
              <div className="flex">
                <div className="border border-black rounded-2xl px-6 py-3 font-ui font-bold text-lg bg-black text-yellow-300 whitespace-nowrap">
                  6 recipes found.
                </div>
              </div>
            </Row>

          </div>
        </section>

        {/* ─── INGREDIENT CARDS ─── */}
        <section>
          <SectionLabel>Ingredient Cards</SectionLabel>
          <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">

            {/* Default state — text only */}
            <div className="relative">
              <div className="relative transition-transform duration-200 ease-out scale-100">
                <div className="relative">
                  <button className="relative flex flex-col items-center justify-center gap-2 aspect-[2/3] w-full rounded-3xl border border-black font-ui font-bold text-xl capitalize tracking-tight overflow-hidden bg-yellow">
                    <span className="text-black">eggs</span>
                  </button>
                </div>
              </div>
              <p className="font-ui text-xs text-gray mt-2 text-center">Default</p>
            </div>

            {/* Hover state (simulated — scale-110) */}
            <div className="relative">
              <div className="relative transition-transform duration-200 ease-out scale-110 mt-2">
                <div className="relative animate-levitate">
                  <button className="relative flex flex-col items-center justify-center gap-2 aspect-[2/3] w-full rounded-3xl border border-black font-ui font-bold text-xl capitalize tracking-tight overflow-hidden bg-yellow">
                    <span className="text-black">onion</span>
                  </button>
                </div>
              </div>
              <p className="font-ui text-xs text-gray mt-4 text-center">Hover (levitate)</p>
            </div>

            {/* Selected state — text only */}
            <div className="relative">
              <div className="relative transition-transform duration-200 ease-out scale-95">
                <div className="relative">
                  <button className="relative flex flex-col items-center justify-center gap-2 aspect-[2/3] w-full rounded-3xl border border-black font-ui font-bold text-xl capitalize tracking-tight overflow-hidden bg-yellow">
                    <div className="absolute inset-0 bg-yellow/70 z-10" />
                    <span className="text-black relative z-20">lemon</span>
                  </button>
                </div>
              </div>
              <p className="font-ui text-xs text-gray mt-2 text-center">Selected</p>
            </div>

            {/* Photo card — default */}
            <div className="relative">
              <div className="relative transition-transform duration-200 ease-out scale-100">
                <div className="relative">
                  <button className="relative flex flex-col items-center justify-center gap-2 aspect-[2/3] w-full rounded-3xl border border-black font-ui font-bold text-xl capitalize tracking-tight overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundImage: 'url(/icons/chicken.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <span className="absolute bottom-3 left-3 right-3 bg-yellow border border-black rounded-2xl py-2 text-black text-center z-10 text-sm">chicken</span>
                  </button>
                </div>
              </div>
              <p className="font-ui text-xs text-gray mt-2 text-center">Photo default</p>
            </div>

            {/* Photo card — selected */}
            <div className="relative">
              <div className="relative transition-transform duration-200 ease-out scale-95">
                <div className="relative">
                  <button className="relative flex flex-col items-center justify-center gap-2 aspect-[2/3] w-full rounded-3xl border border-black font-ui font-bold text-xl capitalize tracking-tight overflow-hidden">
                    <div className="absolute inset-0" style={{ backgroundImage: 'url(/icons/pasta.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
                    <div className="absolute inset-0 bg-yellow/70 z-10" />
                    <span className="absolute bottom-3 left-3 right-3 bg-yellow border border-black rounded-2xl py-2 text-black text-center z-20 text-sm">pasta</span>
                  </button>
                </div>
              </div>
              <p className="font-ui text-xs text-gray mt-2 text-center">Photo selected</p>
            </div>

          </div>
        </section>

        {/* ─── RECIPE CARDS ─── */}
        <section>
          <SectionLabel>Recipe Cards</SectionLabel>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">

            {[
              {
                name: 'Spaghetti Aglio e Olio',
                summary: 'A deceptively simple Italian classic that transforms pantry staples into something genuinely satisfying.',
                time: '20 mins',
                difficulty: 'Easy',
                servings: 4,
                matched: 6,
                total: 7,
              },
              {
                name: 'Shakshuka',
                summary: 'Eggs poached in a spiced tomato sauce. Works for breakfast, lunch, or dinner — no one will judge you.',
                time: '35 mins',
                difficulty: 'Easy',
                servings: 4,
                matched: 3,
                total: 8,
              },
            ].map((recipe) => (
              <div key={recipe.name} className="hatch-shadow">
                <div className="border border-black rounded-3xl p-6 bg-white relative z-10 flex flex-col gap-3">
                  <div>
                    <h3 className="font-display text-2xl leading-tight text-black tracking-tight mb-1">{recipe.name}</h3>
                    <p className="font-ui text-sm leading-snug text-black">{recipe.summary}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <span className="font-ui font-black uppercase text-xs text-black tracking-widest">{recipe.time}</span>
                    <span className="font-ui font-black uppercase text-xs text-black tracking-widest">{recipe.difficulty}</span>
                    <span className="font-ui font-black uppercase text-xs text-black tracking-widest">Serves {recipe.servings}</span>
                  </div>
                  <div className="pt-1">
                    <span className="font-ui text-xs text-gray">{recipe.matched} of {recipe.total} ingredients matched</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </section>

        {/* ─── RECIPE DETAIL COMPONENTS ─── */}
        <section>
          <SectionLabel>Recipe Detail — Sections</SectionLabel>
          <div className="mt-6 space-y-6">

            <Row label="The Kit + Do This — white bordered card on yellow background">
              <div className="bg-yellow rounded-2xl p-6 border border-black">
                <div className="hatch-shadow">
                  <div className="border border-black rounded-3xl p-8 bg-white relative z-10">

                    <h2 className="font-display text-2xl leading-tight text-black tracking-tight mb-4">The Kit</h2>

                    <ul className="space-y-2 mb-8">
                      {[
                        { qty: '200g', unit: '', name: 'spaghetti', matched: false },
                        { qty: '4', unit: 'cloves', name: 'garlic', matched: true },
                        { qty: '60ml', unit: '', name: 'olive oil', matched: true },
                        { qty: '1', unit: 'bunch', name: 'flat-leaf parsley', matched: false },
                        { qty: '', unit: '', name: 'salt', matched: false },
                      ].map((ing) => (
                        <li key={ing.name} className={`font-ui text-sm flex items-center gap-2 ${ing.matched ? 'text-gray line-through' : 'text-black'}`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                          {ing.qty && ing.unit ? `${ing.qty} ${ing.unit} ${ing.name}` : ing.qty ? `${ing.qty} ${ing.name}` : ing.name}
                        </li>
                      ))}
                    </ul>

                    <hr className="border-black mb-8" />

                    <h2 className="font-display text-2xl leading-tight text-black tracking-tight mb-4">Do This</h2>

                    <div className="space-y-2">
                      {[
                        'Bring a large pot of heavily salted water to a boil. Cook spaghetti until al dente.',
                        'Warm olive oil over medium-low heat. Add sliced garlic and cook until golden — not brown.',
                        'Reserve 1 cup pasta water before draining. Toss pasta with garlic oil, adding water as needed to emulsify.',
                      ].map((step, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-black flex-shrink-0 mt-2" />
                          <p className="font-ui text-sm leading-relaxed text-black">{step}</p>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              </div>
            </Row>

          </div>
        </section>

        {/* ─── INGREDIENT LIST STATES ─── */}
        <section>
          <SectionLabel>Ingredient List — States</SectionLabel>
          <div className="mt-6 flex gap-8 flex-wrap">
            <div>
              <p className="font-ui font-black uppercase text-xs text-black tracking-widest mb-3">Unmatched</p>
              <ul className="space-y-2">
                {['200g spaghetti', '1 bunch flat-leaf parsley', 'salt'].map(i => (
                  <li key={i} className="font-ui text-sm flex items-center gap-2 text-black">
                    <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-ui font-black uppercase text-xs text-black tracking-widest mb-3">Matched (strikethrough)</p>
              <ul className="space-y-2">
                {['4 cloves garlic', '60ml olive oil'].map(i => (
                  <li key={i} className="font-ui text-sm flex items-center gap-2 text-gray line-through">
                    <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── METADATA STRIP ─── */}
        <section>
          <SectionLabel>Metadata Strip</SectionLabel>
          <div className="mt-6 space-y-4">
            <Row label="Recipe detail metadata (font-ui, font-black, uppercase, text-xs, tracking-widest)">
              <div className="flex flex-wrap gap-4">
                <span className="font-ui font-black uppercase text-xs text-black tracking-widest">20 mins</span>
                <span className="font-ui font-black uppercase text-xs text-black tracking-widest">Some effort</span>
                <span className="font-ui font-black uppercase text-xs text-black tracking-widest">Serves 2</span>
              </div>
            </Row>
          </div>
        </section>

        {/* ─── HERO SECTION ─── */}
        <section>
          <SectionLabel>Hero Section</SectionLabel>
          <div className="mt-6 bg-teal rounded-2xl p-8 border border-black">
            <p className="font-ui font-black uppercase text-xs text-black tracking-widest mb-4">Teal hero background (teal = #58C2B9)</p>
            <h1 className="font-display font-bold text-5xl lg:text-6xl leading-[0.85] hero-heading text-black tracking-tight">
              What are you <span className="text-outlined">working</span> with?
            </h1>
          </div>
        </section>

        {/* ─── ANIMATIONS ─── */}
        <section>
          <SectionLabel>Animations</SectionLabel>
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-8">

            <div className="flex flex-col items-center gap-3">
              <div className="animate-levitate">
                <button className="flex flex-col items-center justify-center gap-2 aspect-[2/3] w-24 rounded-3xl border border-black font-ui font-bold text-sm capitalize tracking-tight bg-yellow text-black">
                  garlic
                </button>
              </div>
              <p className="font-ui text-xs text-gray text-center">animate-levitate<br />1.8s ease-in-out infinite</p>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="animate-fade-up">
                <div className="hatch-shadow-sm">
                  <div className="border border-black rounded-3xl px-5 py-3 bg-white relative z-10">
                    <p className="font-ui text-sm text-black">Recipe card</p>
                  </div>
                </div>
              </div>
              <p className="font-ui text-xs text-gray text-center">animate-fade-up<br />200ms ease-out</p>
            </div>

          </div>
        </section>

        {/* ─── SPACING / BORDER RADIUS ─── */}
        <section>
          <SectionLabel>Border Radius Tokens</SectionLabel>
          <div className="mt-6 flex flex-wrap gap-4 items-end">
            {[
              { label: 'rounded-sm', cls: 'rounded-sm', size: '4px' },
              { label: 'rounded-md', cls: 'rounded-md', size: '8px' },
              { label: 'rounded-lg', cls: 'rounded-lg', size: '12px' },
              { label: 'rounded-xl', cls: 'rounded-xl', size: '16px' },
              { label: 'rounded-2xl', cls: 'rounded-2xl', size: '20px' },
              { label: 'rounded-3xl', cls: 'rounded-3xl', size: '24px' },
              { label: 'rounded-full', cls: 'rounded-full', size: '9999px' },
            ].map(({ label, cls, size }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className={`w-14 h-14 bg-black ${cls}`} />
                <span className="font-ui text-xs text-black">{label}</span>
                <span className="font-ui text-xs text-gray">{size}</span>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  )
}

/* ─── Helpers ─── */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-2">
      <h2 className="font-display text-2xl leading-tight text-black tracking-tight whitespace-nowrap">{children}</h2>
      <div className="flex-1 h-px bg-black" />
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-ui font-black uppercase text-xs text-black tracking-widest mb-3">{label}</p>
      {children}
    </div>
  )
}

function Swatch({
  hex,
  name,
  token,
  label,
  dark,
  bordered,
}: {
  hex: string
  name: string
  token: string
  label: string
  dark: boolean
  bordered?: boolean
}) {
  return (
    <div className={`border border-black rounded-xl overflow-hidden ${bordered ? 'border' : ''}`}>
      <div
        className="h-16 flex items-end p-2"
        style={{ backgroundColor: hex }}
      >
        <span className={`font-ui font-black text-xs ${dark ? 'text-white' : 'text-black'}`}>{hex}</span>
      </div>
      <div className="p-3 bg-white">
        <p className="font-ui font-black text-xs text-black">{name}</p>
        <p className="font-ui text-xs text-gray mt-0.5">{token}</p>
        <p className="font-ui text-xs text-gray mt-0.5">{label}</p>
      </div>
    </div>
  )
}
