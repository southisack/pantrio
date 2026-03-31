# PROGRESS.md — Pantrio

## How to Use This File

Update this file at the end of every coding session. Read this at the start of each session to know where things stand. Be specific — "started" is not useful, "built but not wired to store" is.

---

## Current Status

**Phase:** Core UI complete — ingredient picker, recipe grid, recipe detail all built and polished
**Last updated:** 2026-03-30
**Last session summary:** Major redesign of ingredient picker — replaced text input + chip system with a 2×4 grid of big square cards (proteins row + starches row). Added press animation (scale-down + starburst impact lines on select), hover yellow fill, and smooth transitions. Switched display font to Orelega One, added Outfit as UI font for buttons/links/inputs. Added family star ratings (Johnny, Marie-Eve, Mia) to recipe detail pages. Loaded all 51 family cookbook recipes into data/recipes.json. Fixed all olive/green color tokens to pure black. Added hatch shadow and fade-up animation utilities. Removed unused results page and IngredientInput component — filtering now happens inline on the home page.

---

## Build Checklist

### Foundation
- [x] Next.js project initialized (with TypeScript, Tailwind, App Router)
- [x] Folder structure created (`/app`, `/data`, `/src/components`, `/src/lib`, `/src/types`)
- [x] `tailwind.config.ts` updated with design tokens (colors, fonts, spacing)
- [x] `globals.css` set up with font imports, hatch shadow, fade-up and impact burst animations
- [x] TypeScript strict mode configured
- [x] `/src/types/index.ts` — `Recipe`, `RecipeIngredient`, `RecipeRatings`, `Difficulty` types

### Matching Logic
- [x] Ingredient filtering — inline on home page via `useMemo`, toggleable by ingredient category
- [x] Normalization (lowercase) applied to both selected ingredients and recipe data
- [x] Filtered results update instantly on toggle — no navigation required
- [x] URL sync — selected ingredients persisted to `?ingredients=` query param

### Screen: Ingredient Input + Recipe Grid (`/app/page.tsx`)
- [x] 2×4 grid of ingredient cards — Row 1: proteins (chicken, beef, pork, fish), Row 2: starches (pasta, rice, potato, noodles)
- [x] Cards: white bg → yellow hover, yellow fill + scale-down when selected
- [x] Starburst impact animation on card select (radiating lines from center)
- [x] Recipe count label with brand copy ("All 51. Take your pick." / "X recipes. Start somewhere.")
- [x] Recipe grid — 4-column on xl, 3-col lg, 2-col sm, 1-col mobile
- [x] Cards with hatch shadow, hover translate to cover shadow
- [x] Fade-up animation on grid when filter changes
- [x] Empty state — "Nothing matched." / "Either your fridge is very sparse or very unusual."
- [x] Clicking a card navigates to `/recipe/[id]` (with ingredients in URL if filtered)

### Screen: Recipe Detail (`/app/recipe/[id]/page.tsx`)
- [x] Reads recipe ID from URL params
- [x] Full ingredient list — matched (GOT IT) vs missing (NEED IT)
- [x] Step-by-step instructions
- [x] Time, difficulty, servings shown
- [x] Family star ratings — Johnny, Marie-Eve, Mia (0 = "Not yet rated")
- [x] Back navigation to home

### Recipe Directory (`/data/recipes.json`)
- [x] 51 family cookbook recipes — full schema with ingredients, steps, ratings
- [x] Schema: id, name, summary, time, servings, difficulty, ingredients, steps, ratings

---

## Design Tokens (current)

| Token | Value | Usage |
|---|---|---|
| `zinc-50` | `#FFEA59` | Yellow — page background, selected card fill, hover fill |
| `zinc-100` | `#FFF9B0` | Lighter yellow |
| `zinc-950` / `black` | `#000000` | Borders, body text, shadows |
| Font display | Orelega One | Headlines |
| Font sans | Space Grotesk | Body, data labels |
| Font ui | Outfit | Buttons, links, inputs |

---

## Known Issues

- Star ratings for all 51 recipes are set to 0 (not yet rated) — needs the family to actually rate them
- No image support — recipe cards and detail pages are text-only

---

## Next Session — Start Here

1. **Rate the recipes** — fill in Johnny, Marie-Eve, Mia scores in `data/recipes.json`
2. **Mobile layout pass** — screens work but haven't been reviewed at phone width
3. **Deploy to Vercel**
4. Consider adding more ingredient categories beyond proteins and starches
