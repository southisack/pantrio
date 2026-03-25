# PROGRESS.md — Pantrio

## How to Use This File

Update this file at the end of every coding session. Read this at the start of each session to know where things stand. Be specific — "started" is not useful, "built but not wired to store" is.

---

## Current Status

**Phase:** Design refinement — brand pivot complete, all three screens updated
**Last updated:** 2026-03-25
**Last session summary:** Major design session. Scaled down all component sizes (borders, text, spacing) to standard web proportions. Switched display font from Epilogue → Titan One → EB Garamond (final). Pivoted color palette to "Warm Editorial" (Option A): deep crimson #A51C30, warm cream #F7F3EC background, herb olive #5C6B3A, golden mustard #D4A843, warm near-black #1C1410. Reworked input screen layout to two-column (text + form left, image placeholder right) inspired by Graza olive oil brand. Added design system page at /design-system. Fixed font synthesis bug (removed font-black from display elements). Added hover states to buttons from neobrutalism.dev. Renamed blue-700 → olive-700 as a clean custom token.

---

## Build Checklist

### Foundation
- [x] Next.js project initialized (with TypeScript, Tailwind, App Router)
- [x] Folder structure created (`/app`, `/data`, `/src/components`, `/src/lib`, `/src/types`)
- [x] `tailwind.config.ts` updated with design tokens (colors, fonts, spacing)
- [x] `globals.css` set up with font imports and base resets
- [x] TypeScript strict mode configured
- [x] `/src/types/index.ts` created with `Recipe`, `RecipeIngredient`, `MatchedRecipe`, `Difficulty` types
- [x] `/data/recipes.json` created with at least 5 sample recipes for dev/testing
- [x] Design system page at `/app/design-system` — all components documented

### Matching Logic (`/src/lib`)
- [x] `matchRecipes.ts` — pure function, takes user ingredients + recipe array, returns ranked `MatchedRecipe[]`
- [x] Normalization (lowercase, trim) applied to both user input and recipe ingredients
- [x] Recipes below 30% match filtered out
- [x] Sorted by match score descending
- [x] Tested manually with a few ingredient combinations

### Screen: Ingredient Input (`/app/page.tsx`)
- [x] Input field renders, focused on load
- [x] Typing and pressing Enter adds an ingredient chip
- [x] Pasting comma-separated list splits and adds all at once
- [x] Each chip has a remove button
- [x] "Find Recipes" button navigates to `/results?ingredients=...`
- [x] Empty submit state has branded copy (not a generic validation error)
- [x] Two-column layout — text/form left, image placeholder right
- [x] Eyebrow label above headline

### Screen: Recipe Results (`/app/results/page.tsx`)
- [x] Reads `ingredients` from URL search params
- [x] Runs `matchRecipes()` against `/data/recipes.json`
- [x] Recipe cards render with: name, match score, time, difficulty
- [x] Cards sorted by match score
- [x] Tapping a card navigates to `/recipe/[id]`
- [x] Empty state (no recipes above 30%) has branded copy
- [x] Back navigation to input works

### Screen: Recipe Detail (`/app/recipe/[id]/page.tsx`)
- [x] Reads recipe ID from URL params
- [x] Looks up recipe from `/data/recipes.json`
- [x] Reads user's ingredients from URL to distinguish matched vs. missing
- [x] Full ingredient list renders — matched (GOT IT) vs missing (NEED IT)
- [x] Step-by-step instructions render
- [x] Time, difficulty, servings shown
- [x] Back navigation to results works

### Recipe Directory (`/data/recipes.json`)
- [x] 8 sample recipes added
- [x] Schema matches `Recipe` type exactly
- [ ] Final curated set of recipes authored and added (target: 20–30)

---

## Design Tokens (current)

| Token | Value | Usage |
|---|---|---|
| `red-600` | `#A51C30` | Primary CTA, logo, NEED IT badge |
| `red-700` | `#7D1524` | Hover state |
| `olive-700` | `#5C6B3A` | Section badges (DO THIS) |
| `amber-400` | `#D4A843` | Ingredient chips |
| `zinc-50` | `#F7F3EC` | Warm cream background |
| `zinc-950` / `black` | `#1C1410` | Borders, body text, shadows |
| Font display | EB Garamond | Headlines, badges, logo |
| Font sans | Space Grotesk | Body, UI labels, buttons |

---

## Known Issues

- Ingredient display on detail screen runs quantity and unit together without a space (e.g. "1TSP CUMIN") — minor formatting fix needed (actually partially fixed this session — unit spacing added with a space in the template literal)
- Image placeholder on input screen right column — needs a real photo

---

## Decisions Made This Session

- EB Garamond chosen as display font — editorial food brand aesthetic, true italic support, pairs well with warm palette
- `font-black` (weight 900) removed from all `font-display` elements — EB Garamond's 800 weight handles visual weight naturally without browser synthesis artifacts
- `blue-700` renamed to `olive-700` as a custom Tailwind token — avoids cache conflicts with Tailwind's built-in blue scale
- Warm near-black `#1C1410` overrides Tailwind's `black` directly — all `border-black`, `bg-black`, shadow rgba values use warm tone
- Input screen pivoted to Graza-style two-column layout (text left, image right)

---

## Next Session — Start Here

1. **Get a hero image** for the input screen right column — food photography or illustration
2. **Mobile layout pass** — screens work but haven't been reviewed at phone width
3. **Author more recipes** — currently 8, aim for 20–30
4. **Deploy to Vercel**
5. Consider whether `uppercase` on headlines should stay or move to mixed case (EB Garamond reads beautifully either way)
