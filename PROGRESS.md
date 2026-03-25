# PROGRESS.md — Pantrio

## How to Use This File

Update this file at the end of every coding session. Read this at the start of each session to know where things stand. Be specific — "started" is not useful, "built but not wired to store" is.

---

## Current Status

**Phase:** Core loop complete — all three screens built and wired together
**Last updated:** 2026-03-24
**Last session summary:** Pulled this morning's commits from the other computer (Next.js scaffold, Tailwind tokens, IngredientInput component). Then built the remaining pieces: 8 curated recipes in data/recipes.json, matchRecipes() function, results screen, and recipe detail screen. Full input → results → detail flow is working end to end. Pushed to master.

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
- [x] "Find Recipes" button is disabled with zero ingredients
- [x] "Find Recipes" button navigates to `/results?ingredients=...`
- [x] Empty submit state has branded copy (not a generic validation error)
- [x] Copy and layout match TASTE.md direction

### Screen: Recipe Results (`/app/results/page.tsx`)
- [x] Reads `ingredients` from URL search params
- [x] Runs `matchRecipes()` against `/data/recipes.json`
- [x] Recipe cards render with: name, match score, time, difficulty
- [x] Cards sorted by match score
- [x] Tapping a card navigates to `/recipe/[id]`
- [x] Empty state (no recipes above 30%) has branded copy
- [x] Back navigation to input works
- [x] Copy and layout match TASTE.md direction

### Screen: Recipe Detail (`/app/recipe/[id]/page.tsx`)
- [x] Reads recipe ID from URL params
- [x] Looks up recipe from `/data/recipes.json`
- [x] Reads user's ingredients from URL (passed through or back-referenced) to distinguish matched vs. missing
- [x] Full ingredient list renders — matched ingredients visually distinct from missing ones
- [x] Step-by-step instructions render
- [x] Time, difficulty, servings shown
- [x] Back navigation to results works
- [x] Copy and layout match TASTE.md direction

### Recipe Directory (`/data/recipes.json`)
- [x] At least 5 sample recipes added for development (8 added)
- [x] Schema matches `Recipe` type exactly
- [ ] Final curated set of recipes authored and added

---

## Known Issues

- Ingredient display on detail screen runs quantity and unit together without a space (e.g. "1TSP CUMIN" instead of "1 TSP CUMIN") — minor formatting fix needed

---

## Decisions Made This Session

- `steps` stored as `RecipeStep[]` with `{ instruction: string }` shape (not flat `string[]` as SPEC suggested) — types file was already written this way, kept it consistent
- Ingredient matching uses substring in both directions (`name.includes(ui) || ui.includes(name)`) — handles "garlic" matching "garlic cloves" etc.
- `ingredients` query param is passed through from results → detail URL so the detail screen can distinguish matched vs. missing without re-running matching

---

## Next Session — Start Here

The core loop is complete. Good next steps:
1. Fix the ingredient quantity/unit spacing bug on the detail screen ("1TSP" → "1 TSP")
2. Author more recipes to round out the directory (currently 8 — aim for 20–30)
3. Consider a mobile layout pass — screens work but haven't been carefully reviewed at phone width
4. Deploy to Vercel
