# PROGRESS.md — Pantrio

## How to Use This File

Update this file at the end of every coding session. Read this at the start of each session to know where things stand. Be specific — "started" is not useful, "built but not wired to store" is.

---

## Current Status

**Phase:** Starting over — pivoting from React Native (Expo) to Next.js web app
**Last updated:** 2026-03-23
**Last session summary:** Rewrote all .md files to reflect the pivot. New direction: Next.js + Tailwind, curated recipe JSON directory, client-side smart matching. No AI/Claude API. Three screens: ingredient input, recipe results, recipe detail. Ready to scaffold the new project.

---

## Build Checklist

### Foundation
- [ ] Next.js project initialized (with TypeScript, Tailwind, App Router)
- [ ] Folder structure created (`/app`, `/data`, `/src/components`, `/src/lib`, `/src/types`)
- [ ] `tailwind.config.ts` updated with design tokens (colors, fonts, spacing)
- [ ] `globals.css` set up with font imports and base resets
- [ ] TypeScript strict mode configured
- [ ] `/src/types/index.ts` created with `Recipe`, `RecipeIngredient`, `MatchedRecipe`, `Difficulty` types
- [ ] `/data/recipes.json` created with at least 5 sample recipes for dev/testing

### Matching Logic (`/src/lib`)
- [ ] `matchRecipes.ts` — pure function, takes user ingredients + recipe array, returns ranked `MatchedRecipe[]`
- [ ] Normalization (lowercase, trim) applied to both user input and recipe ingredients
- [ ] Recipes below 30% match filtered out
- [ ] Sorted by match score descending
- [ ] Tested manually with a few ingredient combinations

### Screen: Ingredient Input (`/app/page.tsx`)
- [ ] Input field renders, focused on load
- [ ] Typing and pressing Enter adds an ingredient chip
- [ ] Pasting comma-separated list splits and adds all at once
- [ ] Each chip has a remove button
- [ ] "Find Recipes" button is disabled with zero ingredients
- [ ] "Find Recipes" button navigates to `/results?ingredients=...`
- [ ] Empty submit state has branded copy (not a generic validation error)
- [ ] Copy and layout match TASTE.md direction

### Screen: Recipe Results (`/app/results/page.tsx`)
- [ ] Reads `ingredients` from URL search params
- [ ] Runs `matchRecipes()` against `/data/recipes.json`
- [ ] Recipe cards render with: name, match score, time, difficulty
- [ ] Cards sorted by match score
- [ ] Tapping a card navigates to `/recipe/[id]`
- [ ] Empty state (no recipes above 30%) has branded copy
- [ ] Back navigation to input works
- [ ] Copy and layout match TASTE.md direction

### Screen: Recipe Detail (`/app/recipe/[id]/page.tsx`)
- [ ] Reads recipe ID from URL params
- [ ] Looks up recipe from `/data/recipes.json`
- [ ] Reads user's ingredients from URL (passed through or back-referenced) to distinguish matched vs. missing
- [ ] Full ingredient list renders — matched ingredients visually distinct from missing ones
- [ ] Step-by-step instructions render
- [ ] Time, difficulty, servings shown
- [ ] Back navigation to results works
- [ ] Copy and layout match TASTE.md direction

### Recipe Directory (`/data/recipes.json`)
- [ ] At least 5 sample recipes added for development
- [ ] Schema matches `Recipe` type exactly
- [ ] Final curated set of recipes authored and added

---

## Known Issues

_None yet — add issues here as they come up._

---

## Decisions Made This Session

_Use this section to log any new decisions made during a coding session. Move them to DECISIONS.md at the end of the session._

---

## Next Session — Start Here

Scaffold the Next.js project fresh. Run `npx create-next-app@latest pantrio` with TypeScript, Tailwind, and App Router. Then set up folder structure, types, and a few sample recipes so matching logic can be built and tested.
