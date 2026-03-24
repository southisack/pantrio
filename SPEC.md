# SPEC.md — Pantrio v1

## What Is Pantrio

Pantrio is a web app that turns the ingredients you have into recipes you can actually make tonight. You tell it what's in your fridge, it finds the best matches from a curated recipe directory, and you cook.

No accounts. No AI-generated content. No friction. Just tell it what you have, get real recipes back.

---

## Core Loop

```
Input → Match → Browse → Cook
```

1. User opens app → lands on ingredient input screen
2. User types in what they have (add one at a time or paste a comma-separated list)
3. App scores every recipe in the directory against the ingredient list
4. Results screen shows recipes ranked by match percentage
5. User taps a recipe → sees full recipe detail
6. User cooks. Done.

---

## Platform

- **Target:** Web (desktop + mobile browser)
- **Framework:** Next.js (App Router)
- **Deployment:** Vercel

---

## Recipe Directory

- Curated JSON file — not AI-generated
- Target size: fewer than 100 recipes to start
- Lives at `/data/recipes.json`
- Every recipe is hand-authored and intentional — quality over quantity

---

## Matching Algorithm

- Normalize all ingredient names to lowercase before comparison
- For each recipe, calculate: **matched ingredients ÷ total recipe ingredients = match score**
- Sort results by match score descending
- Show match score on each recipe card (e.g. "You have 5 of 7 ingredients")
- Hide recipes where match score is below 30% — not useful to show

---

## Screens

### 1. Ingredient Input Screen
The entry point. Ingredient-first design.

**States:**
- Default: input field active, empty ingredient list
- Ingredients added: list of chips/tags showing what's been entered, clear CTA to find recipes
- Empty submit: user tries to find recipes with no ingredients entered

**Behaviors:**
- User types an ingredient and hits Enter or comma to add it
- User can also paste a comma-separated list (e.g. "garlic, chicken, lemon") and it splits automatically
- Each ingredient appears as a removable chip/tag
- User can remove any ingredient with a single tap/click
- "Find Recipes" button is only active when at least one ingredient is entered
- No limit on number of ingredients

**Explicitly out of scope:**
- Autocomplete / ingredient suggestions (v1)
- Saved ingredient lists (v1)

---

### 2. Recipe Results Screen
Shows matched recipes ranked by how many ingredients the user has.

**States:**
- Results: list of recipe cards sorted by match score
- Empty: no recipes matched above the 30% threshold
- (No loading state — matching is instant, client-side)

**Behaviors:**
- Each recipe card shows: name, match score ("5 of 7 ingredients"), estimated time, difficulty
- Cards sorted by match score — highest first
- Tapping a card navigates to Recipe Detail
- User can go back and adjust ingredients
- "Missing" ingredients are not shown on the card (shown in detail view)

---

### 3. Recipe Detail Screen
Full recipe for the selected result.

**States:**
- Content loaded (no async — data comes from the JSON directory)

**Behaviors:**
- Shows full ingredient list with quantities — ingredients the user has are visually distinguished from ones they're missing
- Shows step-by-step instructions
- Shows estimated time, difficulty, servings
- User can go back to results

---

## Recipe Data Shape

```json
{
  "id": "string",
  "name": "string",
  "description": "string",
  "time": "string",
  "difficulty": "easy | medium | hard",
  "servings": 2,
  "tags": ["string"],
  "ingredients": [
    {
      "name": "string",
      "quantity": "string",
      "unit": "string"
    }
  ],
  "steps": ["string"]
}
```

---

## Navigation Structure

```
Ingredient Input Screen
    ↓ (find recipes)
Recipe Results Screen
    ↓ (select recipe)
Recipe Detail Screen
```

Linear flow. No tabs. No persistent nav.

---

## Explicitly Out of Scope for v1

- User accounts / authentication
- Saving or bookmarking recipes
- Pantry inventory tracking
- Dietary preferences or filters
- Shopping list generation
- Meal planning
- Social or sharing features
- Offline mode
- Push notifications
- Onboarding flow
- Ingredient autocomplete
- AI-generated recipes
- Camera / photo capture
- Recipe search by name

---

## Error Handling Principles

- No API calls means no async errors in the main flow
- The only "error" state is an empty match result — handle it as its own state with personality (see TASTE.md)
- Form validation (empty ingredient list) should feel human, not like a validation error
