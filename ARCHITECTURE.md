# ARCHITECTURE.md — Pantrio

## Purpose

This file documents the architecture decisions for Pantrio v1. Every decision here is intentional and settled. Do not deviate from these choices or propose alternatives unless a blocking technical problem is encountered — in which case, flag it before changing anything.

---

## Framework — Next.js (App Router)

**Decision:** Next.js with the App Router.

**Why:** File-based routing (like Expo Router was for the original build), excellent TypeScript support, deploys to Vercel in one click. App Router gives us layout files, clean page components, and easy navigation. For a 3-screen linear app this is straightforward and familiar to anyone who knows React.

**What this means in practice:**
- Pages live in `/app/` — each folder/file is a route
- Shared layouts live in `/app/layout.tsx`
- No API routes needed — everything is client-side

---

## Styling — Tailwind CSS

**Decision:** Tailwind CSS for all styling.

**Why:** Replaces the `StyleSheet` + `tokens.ts` approach from the React Native build. Tailwind's utility classes are fast to write, and custom design tokens (colors, fonts, spacing) are defined once in `tailwind.config.ts` and used everywhere. No inline styles. No one-off class names.

**What this means in practice:**
- Design tokens live in `tailwind.config.ts` under `theme.extend`
- All components use Tailwind utility classes
- No inline `style={}` props — ever
- Global styles (font imports, base resets) live in `/app/globals.css`

---

## Recipe Data — Static JSON

**Decision:** All recipe data lives in a single static JSON file at `/data/recipes.json`.

**Why:** No backend needed. No database. No API calls. The recipe directory is curated and hand-authored — it doesn't change at runtime. A static JSON file is the simplest possible data layer that works correctly.

**What this means in practice:**
- `/data/recipes.json` is the single source of truth for all recipe content
- Recipes are loaded at build time or imported directly — no fetch calls
- Adding a recipe = editing the JSON file
- The JSON shape must match the `Recipe` type in `/src/types/index.ts` exactly

---

## Matching Logic — Client-Side Utility Function

**Decision:** Ingredient matching is a pure utility function, not a hook or API call.

**Why:** Matching is synchronous and deterministic — given a list of user ingredients and the recipe directory, it always returns the same ranked list. There's no async, no loading state, no side effects. A plain function is the right tool.

**Location:** `/src/lib/matchRecipes.ts`

**Function signature:**
```typescript
export function matchRecipes(
  userIngredients: string[],
  recipes: Recipe[]
): MatchedRecipe[]
```

**Returns:**
```typescript
interface MatchedRecipe {
  recipe: Recipe
  matchedIngredients: string[]   // ingredients the user has
  missingIngredients: string[]   // ingredients the user is missing
  matchScore: number             // 0–1, matched ÷ total
}
```

**Matching rules:**
- Normalize everything to lowercase and trim whitespace before comparing
- Filter out results below 0.3 (30%) match score
- Sort by match score descending

---

## State — React useState + URL Params

**Decision:** No global state library. Ingredient list lives in component state on the input screen, selected recipe is passed via URL param.

**Why:** The data flow is simple enough not to need Zustand or Context. The input screen owns the ingredient list. When the user navigates to results, the ingredients are passed as a URL query param (serialized as a comma-separated string). When the user taps a recipe, the recipe ID is passed as a URL param to the detail page. Each page reads what it needs from the URL.

**What this means in practice:**
- Ingredient list: `useState<string[]>` on the input page
- Results page reads ingredients from `searchParams`
- Detail page reads recipe ID from `params`, looks up the recipe from the JSON
- No store. No context provider. No Zustand.

**URL structure:**
```
/                          ← Ingredient input
/results?ingredients=garlic,chicken,lemon   ← Recipe results
/recipe/[id]               ← Recipe detail
```

---

## Project Structure

```
/app
  layout.tsx               ← Root layout (fonts, global styles)
  page.tsx                 ← Ingredient Input screen
  /results
    page.tsx               ← Recipe Results screen
  /recipe
    /[id]
      page.tsx             ← Recipe Detail screen
  globals.css              ← Base styles, font imports

/data
  recipes.json             ← The recipe directory (source of truth)

/src
  /components              ← Shared UI components
  /lib
    matchRecipes.ts        ← Matching algorithm
  /types
    index.ts               ← Shared TypeScript types

tailwind.config.ts         ← Design tokens and Tailwind config
```

---

## TypeScript Types

All shared types live in `/src/types/index.ts`:

```typescript
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface RecipeIngredient {
  name: string
  quantity: string
  unit: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  time: string
  difficulty: Difficulty
  servings: number
  tags: string[]
  ingredients: RecipeIngredient[]
  steps: string[]
}

export interface MatchedRecipe {
  recipe: Recipe
  matchedIngredients: string[]
  missingIngredients: string[]
  matchScore: number
}
```

---

## Key Rules

- **No inline styles** — Tailwind classes only
- **No API calls** — all data is local
- **No global state library** — component state + URL params only
- **Design tokens in `tailwind.config.ts`** — never hardcode color or spacing values
- **All copy follows TASTE.md** — no placeholder strings, no generic UI text
- **Matching logic stays in `/src/lib/matchRecipes.ts`** — not inline in components
