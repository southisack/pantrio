# ARCHITECTURE.md — Pantrio

## Purpose

This file documents the architecture decisions for Pantrio v1. Every decision here is intentional and settled. Claude Code should not deviate from these choices or propose alternatives unless a blocking technical problem is encountered — in which case, flag it before changing anything.

---

## Navigation — Expo Router

**Decision:** Use Expo Router (file-based routing, built into Expo).

**Why:** Expo Router is the current standard for Expo projects. It uses a file-based system (like Next.js) where each file in `/app` becomes a screen automatically. For a solo beginner-friendly setup, this means less manual wiring — you create the file, the route exists. React Navigation is more flexible but requires more boilerplate configuration that adds complexity without benefit at Pantrio's scale.

**What this means in practice:**
- Screens live in `/app/` not `/src/screens/`
- Navigation between screens uses `router.push('/ingredient-review')` not a navigator config
- The back button behavior is handled automatically

---

## State Management — Zustand

**Decision:** Use Zustand for shared session state.

**Why:** Pantrio's core flow passes data across multiple screens — photos captured on screen 1 need to reach screen 2, detected ingredients from screen 2 need to reach screen 3. Without a state solution, this requires prop-drilling through navigation params, which gets messy fast.

Zustand is the right fit here because:
- It's minimal (no boilerplate, no providers)
- Simple to learn as a beginner — it's just a store with getters and setters
- Appropriate for the scale of this app (one session's worth of data, not a complex app-wide state tree)

React Context was considered but Zustand is cleaner for cross-screen data that isn't purely UI state.

**Store structure:**
```typescript
// /src/store/sessionStore.ts
interface SessionStore {
  // Step 1: Captured photos
  photos: string[]                    // base64 encoded images
  addPhoto: (photo: string) => void
  removePhoto: (index: number) => void
  clearPhotos: () => void

  // Step 2: Detected ingredients
  ingredients: Ingredient[]
  setIngredients: (ingredients: Ingredient[]) => void
  addIngredient: (ingredient: Ingredient) => void
  removeIngredient: (id: string) => void

  // Step 3: Recipe suggestions
  recipes: Recipe[]
  setRecipes: (recipes: Recipe[]) => void

  // Reset entire session
  resetSession: () => void
}
```

**Rule:** This store holds one session at a time. When the user starts over (goes back to capture), call `resetSession()` to clear everything.

---

## API Calls — Custom Hooks Per Feature

**Decision:** Each AI feature gets its own custom hook. Loading, success, and error states live in those hooks — not scattered across screen components.

**Why:** Screens should be responsible for UI, not API logic. Mixing fetch logic and render logic in the same component makes both harder to read and harder to debug. Custom hooks let each screen stay clean.

**The two hooks:**

```
/src/hooks/useIngredientDetection.ts   ← handles photo → ingredients API call
/src/hooks/useRecipeGeneration.ts      ← handles ingredients → recipes API call
```

**Each hook returns:**
```typescript
{
  execute: () => Promise<void>   // trigger the API call
  isLoading: boolean
  error: string | null
  reset: () => void              // clear error state
}
```

**Results are written directly to the Zustand store** — hooks don't return data, they populate the store. Screens read from the store.

---

## Camera — expo-camera

**Decision:** Use `expo-camera` directly.

**Why:** `expo-camera` gives a live camera viewfinder that renders inside the app UI, which matches the design intent in SPEC.md (camera-first, capture button prominent). `expo-image-picker` opens the native camera app and returns when done — it takes the user out of Pantrio's UI, which breaks the experience. The extra control `expo-camera` requires is worth it for the UX.

**Constraint:** Camera permission must be requested before the viewfinder renders. Handle this at the Capture screen level with a clear permission-request state.

---

## Project Structure

Given the Expo Router decision, the structure from CLAUDE.md is updated:

```
/app
  index.tsx                  ← Capture screen (entry point)
  ingredient-review.tsx      ← Ingredient Review screen
  recipe-suggestions.tsx     ← Recipe Suggestions screen
  recipe-detail.tsx          ← Recipe Detail screen

/src
  /api                       ← Raw Claude API calls (detection, recipes)
  /hooks                     ← useIngredientDetection, useRecipeGeneration
  /store                     ← sessionStore.ts (Zustand)
  /components                ← Shared UI components
  /types                     ← Shared TypeScript types (Ingredient, Recipe, etc.)
  /constants                 ← tokens.ts, config

SPEC.md
TASTE.md
CLAUDE.md
ARCHITECTURE.md
DECISIONS.md
PROGRESS.md
```

---

## Data Flow (End to End)

```
Capture Screen
  → User takes photo(s)
  → Photos stored in sessionStore.photos (base64)
  → User taps "Analyze"
  → useIngredientDetection.execute() called
      → reads sessionStore.photos
      → calls /src/api/detectIngredients.ts
      → on success: writes to sessionStore.ingredients
  → Navigate to Ingredient Review

Ingredient Review Screen
  → Reads sessionStore.ingredients
  → User edits list (add/remove)
  → Mutations go directly to sessionStore
  → User taps "Find Recipes"
  → useRecipeGeneration.execute() called
      → reads sessionStore.ingredients
      → calls /src/api/generateRecipes.ts
      → on success: writes to sessionStore.recipes
  → Navigate to Recipe Suggestions

Recipe Suggestions Screen
  → Reads sessionStore.recipes
  → User taps a recipe card
  → Recipe id passed via navigation param
  → Navigate to Recipe Detail

Recipe Detail Screen
  → Reads recipe by id from sessionStore.recipes
  → No async calls — data already in store
```

---

## TypeScript Types

All shared types live in `/src/types/index.ts`. These match the data shapes in SPEC.md exactly:

```typescript
export type Confidence = 'high' | 'medium' | 'low'
export type Difficulty = 'easy' | 'medium' | 'hard'

export interface Ingredient {
  id: string
  name: string
  confidence: Confidence
  confirmed: boolean
}

export interface RecipeSuggestion {
  id: string
  name: string
  estimatedTime: string
  difficulty: Difficulty
  keyIngredients: string[]
  summary: string
  servings: number
  ingredients: RecipeIngredient[]
  steps: string[]
}

export interface RecipeIngredient {
  name: string
  quantity: string
  unit: string
}
```

---

## Key Rules

- **Never call the Claude API directly from a screen component** — always go through `/src/api` via a hook
- **Never store API keys in code** — use `ANTHROPIC_API_KEY` environment variable only
- **Never pass large data objects through navigation params** — use the store
- **Never skip loading, error, and empty states** — every async operation needs all three
- **Reset the session store** when the user starts a new capture flow
