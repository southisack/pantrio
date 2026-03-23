# PROGRESS.md — Pantrio

## How to Use This File

Update this file at the end of every coding session. Claude Code reads this at the start of each session to know where things stand. Be specific — "started" is not useful, "built but not wired to store" is.

---

## Current Status

**Phase:** Capture screen built, remaining screens are skeletons
**Last updated:** 2026-03-22
**Last session summary:** Initialized Expo project with Router, installed expo-camera and zustand. Created full folder structure, design tokens, TypeScript types, Zustand session store, and API layer (detectIngredients + generateRecipes). All four screens exist as navigation-ready skeletons. App should boot and navigate.

---

## Build Checklist

### Foundation
- [x] Expo project initialized
- [x] Folder structure created (`/app`, `/src/api`, `/src/hooks`, `/src/types`, `/src/constants`)
- [x] TypeScript strict mode configured
- [x] `tokens.ts` created with design tokens
- [x] `types/index.ts` created with `Ingredient`, `RecipeSuggestion`, `RecipeIngredient`, `CapturedPhoto` types
- [x] Zustand installed and `sessionStore.ts` created (`/src/hooks/sessionStore.ts`)
- [x] Environment variable set up (`EXPO_PUBLIC_ANTHROPIC_API_KEY` in `.env`)
- [x] Expo Router configured, basic navigation working (all 4 screens wired)

### API Layer (`/src/api`)
- [x] `detectIngredients.ts` — sends photos to Claude vision, returns `Ingredient[]`
- [x] `generateRecipes.ts` — sends ingredients to Claude, returns `RecipeSuggestion[]`
- [x] Both functions handle network errors and API errors separately
- [x] Both functions validate and parse JSON responses

### Hooks (`/src/hooks`)
- [ ] `useIngredientDetection.ts` — wraps `detectIngredients`, manages loading/error state, writes to store
- [ ] `useRecipeGeneration.ts` — wraps `generateRecipes`, manages loading/error state, writes to store

### Screen: Capture (`/app/index.tsx`)
- [x] Camera viewfinder renders
- [x] Camera permission request handled
- [x] Photo capture works, stores base64 in session store
- [x] Thumbnail strip shows captured photos
- [x] Remove individual photo works
- [x] 3-photo limit enforced
- [x] Analyze button triggers detectIngredients directly (no separate hook — kept simple)
- [x] Loading state designed and implemented ("Squinting at your fridge…")
- [x] Error state designed and implemented ("Something went sideways. Worth a retry.")
- [x] Navigates to Ingredient Review on success

### Screen: Ingredient Review (`/app/ingredient-review.tsx`)
- [ ] Reads ingredients from session store
- [ ] Loading state (skeleton) designed and implemented
- [ ] Success state — ingredient list renders
- [ ] Each ingredient shows name and confidence level
- [ ] Low-confidence ingredients visually flagged
- [ ] Remove ingredient works
- [ ] Add ingredient (text input) works
- [ ] Empty detection state designed and implemented
- [ ] Error state designed and implemented
- [ ] Find Recipes button triggers `useRecipeGeneration`
- [ ] Navigates to Recipe Suggestions on success

### Screen: Recipe Suggestions (`/app/recipe-suggestions.tsx`)
- [ ] Reads recipes from session store
- [ ] Loading state designed and implemented
- [ ] Success state — recipe cards render
- [ ] Each card shows name, time, difficulty, key ingredients
- [ ] Tapping a card navigates to Recipe Detail
- [ ] Empty state designed and implemented
- [ ] Error state designed and implemented
- [ ] Back navigation to Ingredient Review works

### Screen: Recipe Detail (`/app/recipe-detail.tsx`)
- [ ] Reads single recipe from session store by id
- [ ] Full ingredient list with quantities renders
- [ ] Step-by-step instructions render
- [ ] Back navigation to Recipe Suggestions works

---

## Known Issues

_None yet — add issues here as they come up with a short description and which file/screen is affected._

---

## Decisions Made This Session

_Use this section to log any new decisions made during a coding session. Move them to DECISIONS.md at the end of the session._

---

## Next Session — Start Here

_At the end of each session, write 1–3 sentences describing exactly where to pick up. Be specific about what file was last touched and what state it's in._

Example: "Capture screen camera viewfinder is working. Photo capture stores base64 correctly. Thumbnail strip is not yet built — start there in `/app/index.tsx`."
