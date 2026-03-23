# SPEC.md — Pantrio v1

## What Is Pantrio

Pantrio is an Android app that turns a photo of your fridge or pantry into recipe suggestions. You shoot what you have, the app detects the ingredients, you confirm or tweak the list, and you get recipes you can actually make right now.

No pantry tracking. No accounts. No friction. Just point, shoot, cook.

---

## Core Loop

```
Capture → Detect → Review → Suggest → Cook
```

1. User opens app → lands on capture screen
2. User takes one or more photos (fridge, pantry, countertop)
3. App sends photos to Claude API (vision) → returns detected ingredients
4. User reviews ingredient list → can add or remove items
5. App sends confirmed ingredients to Claude API → returns recipe suggestions
6. User picks a recipe → sees full recipe detail
7. User cooks. Done.

---

## Platform

- **Target:** Android only
- **Framework:** React Native (Expo)
- **Min Android version:** Android 10 (API 29)

---

## AI Stack

- **Provider:** Anthropic Claude API
- **Ingredient detection:** Claude vision model — receives image(s), returns structured ingredient list
- **Recipe generation:** Claude text — receives confirmed ingredient list, returns structured recipe suggestions
- **Response format:** JSON for both detection and recipe output (structured prompting)

---

## Screens

### 1. Home / Capture Screen
The entry point. Camera-first design.

**States:**
- Default: camera viewfinder active, capture button prominent
- Photo taken: thumbnail preview appears, option to add another photo or proceed
- Multiple photos: thumbnail strip showing all captured photos, clear CTA to analyze

**Behaviors:**
- User can take up to 3 photos per session
- User can retake or remove individual photos before proceeding
- Tapping "Analyze" sends all photos to Claude vision API

**Explicitly out of scope:**
- Gallery / photo library picker (v1 is camera only)
- Flash controls

---

### 2. Ingredient Review Screen
Shows what Claude detected. User confirms before recipes are generated.

**States:**
- Loading: analyzing photos (skeleton or branded loading state)
- Success: list of detected ingredients, each editable
- Empty detection: no ingredients found, prompt to retake
- Error: API failure, prompt to retry

**Behaviors:**
- Each ingredient shown as a chip or list item
- Each ingredient shows a confidence level (high / medium / low) from Claude's detection
- Low confidence ingredients are visually flagged — user should confirm or remove them
- User can remove any ingredient with a single tap
- User can add a missing ingredient via a text input
- Tapping "Find Recipes" sends confirmed list to Claude

**Data shape — ingredient:**
```json
{
  "id": "string",
  "name": "string",
  "confidence": "high | medium | low",
  "confirmed": true
}
```

---

### 3. Recipe Suggestions Screen
Shows 3–5 recipe suggestions based on confirmed ingredients.

**States:**
- Loading: generating recipes (branded loading state)
- Success: list of recipe cards
- Empty: no recipes found with current ingredients, suggestion to add more
- Error: API failure, prompt to retry

**Behaviors:**
- Each recipe card shows: name, estimated time, difficulty, key ingredients used
- Tapping a card navigates to Recipe Detail
- User can go back and adjust ingredients

**Data shape — recipe suggestion:**
```json
{
  "id": "string",
  "name": "string",
  "estimatedTime": "string",
  "difficulty": "easy | medium | hard",
  "keyIngredients": ["string"],
  "summary": "string"
}
```

---

### 4. Recipe Detail Screen
Full recipe for the selected suggestion.

**States:**
- Content loaded (no async — data comes from suggestion response)

**Behaviors:**
- Shows full ingredient list with quantities
- Shows step-by-step instructions
- User can go back to suggestions

**Data shape — recipe detail:**
```json
{
  "id": "string",
  "name": "string",
  "estimatedTime": "string",
  "difficulty": "easy | medium | hard",
  "servings": "number",
  "ingredients": [
    { "name": "string", "quantity": "string", "unit": "string" }
  ],
  "steps": ["string"]
}
```

---

## Claude API Prompts (Contracts)

### Ingredient Detection Prompt
```
You are analyzing a photo of a fridge or pantry.
Return a JSON array of detected ingredients.
Be specific but not overly granular (e.g. "chicken breast" not just "meat").
Only include items that are clearly visible and identifiable.
For each ingredient, include a confidence level: "high" if clearly identifiable, "medium" if likely but not certain, "low" if you're guessing.
Format: { "ingredients": [{ "id": "uid", "name": "string", "confidence": "high | medium | low" }] }
Return JSON only. No preamble.
```

### Recipe Generation Prompt
```
You are a recipe generator.
Given the following confirmed ingredients, suggest 3 to 5 recipes the user can realistically make.
Prioritize recipes that use most of the provided ingredients.
Format each recipe as:
{
  "id": "uid",
  "name": "string",
  "estimatedTime": "string",
  "difficulty": "easy | medium | hard",
  "keyIngredients": ["string"],
  "summary": "string",
  "servings": number,
  "ingredients": [{ "name": "string", "quantity": "string", "unit": "string" }],
  "steps": ["string"]
}
Return a JSON array. No preamble.
```

---

## Navigation Structure

```
Capture Screen
    ↓ (analyze)
Ingredient Review Screen
    ↓ (find recipes)
Recipe Suggestions Screen
    ↓ (select recipe)
Recipe Detail Screen
```

Linear flow. No tabs. No bottom nav in v1.

---

## Explicitly Out of Scope for v1

- User accounts / authentication
- Saving or bookmarking recipes
- Pantry inventory tracking
- Dietary preferences or filters
- Shopping list
- Gallery / photo library import
- Meal planning
- Social or sharing features
- Offline mode
- Push notifications
- Onboarding flow

---

## Error Handling Principles

- Every API call has a loading state, a success state, and an error state
- Errors surface a human message + retry action (never a raw error code)
- Network failures and API failures are handled separately
- Empty states are designed intentionally — not afterthoughts

---

## Open Questions (to resolve before building affected screens)

- [x] Should recipe detail data be included in the suggestion response (one API call) or fetched separately on tap? → **One API call, detail bundled in suggestion response**
- [x] What is the maximum number of photos per session? → **3 photos max**
- [x] Do we show a confidence level on detected ingredients? → **Yes — high / medium / low, low confidence flagged visually**
