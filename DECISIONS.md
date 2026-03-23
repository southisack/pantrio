# DECISIONS.md — Pantrio

## Purpose

This file logs every decision that has been made and settled for Pantrio v1. Claude Code must not reopen these questions, propose alternatives, or deviate from these choices without a explicit conversation with the developer first.

If you encounter a situation not covered here, flag it — don't decide unilaterally.

---

## Product Decisions

### P1 — No user accounts in v1
**Decision:** No authentication, no user accounts, no saved data.
**Why:** The core value of Pantrio is zero-friction. Adding auth adds a signup screen, a login screen, session management, and a backend. None of that is the product. Ship the core loop first.
**Implication:** All session data is ephemeral. When the app closes, everything clears.

### P2 — Camera only, no photo library picker
**Decision:** Users can only take new photos. No importing from gallery.
**Why:** The experience is designed around "point at your fridge right now." Gallery imports introduce stale photos, screenshots, and edge cases that complicate ingredient detection without adding meaningful value for v1.
**Implication:** `expo-camera` is used directly. No `expo-image-picker`.

### P3 — Max 3 photos per session
**Decision:** Users can capture up to 3 photos before analyzing.
**Why:** Covers the realistic use case (fridge, pantry, countertop) without overloading the API with too many images or making the UI complex.
**Implication:** The capture screen must enforce this limit and communicate it clearly.

### P4 — Recipe detail data is bundled in the suggestion response
**Decision:** One API call returns both the suggestion list AND full recipe detail for each suggestion. No second API call on recipe tap.
**Why:** Eliminates a loading state on the Recipe Detail screen, making navigation feel instant. The payload is larger but acceptable.
**Implication:** The recipe generation prompt must return the full data shape including `ingredients[]` and `steps[]` for every recipe.

### P5 — 3–5 recipe suggestions per session
**Decision:** Claude returns between 3 and 5 recipes per analysis.
**Why:** Enough choice to feel useful, not so many that it's overwhelming. Matches what a person could realistically cook that day.

### P6 — Confidence levels shown on detected ingredients
**Decision:** Each ingredient shows a confidence level: high, medium, or low. Low confidence items are visually flagged.
**Why:** Ingredient detection is imperfect. Surfacing uncertainty lets the user make informed edits rather than trusting a wrong ingredient into a bad recipe.
**Implication:** The ingredient detection prompt must return confidence values. The Ingredient Review UI must visually distinguish low-confidence items.

---

## Error Handling Decisions

### E1 — API failure keeps session data, surfaces retry
**Decision:** When a Claude API call fails, the app shows a branded error message with a single retry action. All previously captured data (photos, ingredients) is preserved.
**Why:** Photos are the hardest thing to recreate — the user had to position the shot, get lighting right, potentially take multiple. Discarding that work because of a network hiccup punishes the user for something outside their control. Keep the data, let them retry in one tap.
**Implication:** Error states must never call `resetSession()`. Hooks surface `error` and `reset()` — reset only clears the error flag, not the store data.

### E2 — Network errors and API errors are treated differently in messaging
**Decision:** The copy for a network failure ("Looks like you're offline") differs from an API error ("Something went sideways on our end"). Both offer retry.
**Why:** Matches TASTE.md voice and gives the user actionable information.
**Implication:** API hooks must distinguish between network failures and non-200 API responses and pass that context to the error state.

### E3 — Empty detection is its own state, not an error
**Decision:** If Claude returns zero ingredients from the photos, this is an "empty" state — not an error. The user is prompted to retake with better lighting or a closer shot.
**Why:** Zero results is a valid outcome of a successful API call. Treating it as an error is misleading. It needs its own copy and its own CTA.
**Implication:** The Ingredient Review screen has four states: loading, success, empty, error. All four must be designed.

---

## Architecture Decisions

### A1 — Expo Router for navigation
**Decision:** File-based routing via Expo Router.
**Why:** Less boilerplate than React Navigation, idiomatic for current Expo projects, appropriate for a linear 4-screen flow. See ARCHITECTURE.md for full rationale.

### A2 — Zustand for session state
**Decision:** One Zustand store (`sessionStore`) holds all cross-screen session data.
**Why:** Avoids prop-drilling through navigation params, especially for large base64 photo data. Simple API, minimal boilerplate. See ARCHITECTURE.md for store shape.

### A3 — Custom hooks own all API logic
**Decision:** `useIngredientDetection` and `useRecipeGeneration` are the only entry points to Claude API calls.
**Why:** Screens stay clean. Loading/error/success logic is co-located with the API call, not scattered across components.

### A4 — Going back to Capture preserves detected ingredients
**Decision:** If the user navigates back from Ingredient Review to Capture and takes new photos, the old ingredient list is kept until a new detection call succeeds and replaces it.
**Why:** Don't destroy work the user has already done. If the new detection succeeds, `setIngredients()` overwrites the old list naturally.
**Implication:** Navigating back must not call `resetSession()`. Only a successful new detection call updates `ingredients`.

### A5 — API responses are always JSON
**Decision:** Both Claude API prompts (detection and recipe generation) are instructed to return JSON only with no preamble.
**Why:** Simplifies parsing. No need to extract JSON from prose. Consistent, predictable output.
**Implication:** Prompts must explicitly instruct the model to return JSON only. Responses must be validated before use. Malformed JSON is treated as an API error (see E1).

---

## Design Decisions

### D1 — English only for v1
**Decision:** The app ships in English only.
**Why:** Scope control. Bilingual support (French/English) adds complexity to copy, layout, and Claude prompts. Not in v1 scope.
**Implication:** No i18n library needed. All copy is hardcoded in English following the voice in TASTE.md.

### D2 — No inline styles
**Decision:** All styles use `StyleSheet` or design tokens from `/src/constants/tokens.ts`.
**Why:** Consistency, performance, and maintainability. Inline styles bypass the token system and make the UI harder to keep coherent.
**Implication:** `tokens.ts` must be populated before building any screen. Claude Code must never write `style={{ color: '#fff' }}` — always `style={styles.someRule}` or `style={{ color: tokens.colorSomething }}`.

### D3 — No placeholder copy
**Decision:** Every string in the UI — including loading states, empty states, and errors — must follow the voice in TASTE.md. Generic strings like "Loading..." or "An error occurred" are not acceptable.
**Why:** The copy is half the personality of Pantrio. Generic copy makes it feel like any other app.
**Implication:** Before writing any UI string, read TASTE.md. When in doubt, write something that sounds like a person, not a product.
