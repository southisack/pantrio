# DECISIONS.md — Pantrio

## Purpose

This file logs every decision that has been made and settled for Pantrio v1. Do not reopen these questions, propose alternatives, or deviate from these choices without an explicit conversation with the developer first.

If you encounter a situation not covered here, flag it — don't decide unilaterally.

---

## Product Decisions

### P1 — No user accounts in v1
**Decision:** No authentication, no user accounts, no saved data.
**Why:** The core value of Pantrio is zero-friction. Adding auth adds a signup screen, a login screen, session management, and a backend. None of that is the product. Ship the core loop first.
**Implication:** All session data is ephemeral. When the user closes the tab, everything clears.

### P2 — Curated recipe directory, not AI-generated recipes
**Decision:** Recipes come from a hand-authored JSON file. No AI recipe generation.
**Why:** Curated recipes mean consistent quality, predictable output, and zero per-query API costs. The app is faster, cheaper to run, and the recipes are actually good because they were chosen intentionally.
**Implication:** Someone has to write and maintain the recipes. That's the product. `/data/recipes.json` is the source of truth.

### P3 — Smart matching, not keyword search
**Decision:** Results are ranked by how many of the user's ingredients match each recipe, not by text search.
**Why:** Text search would require the user to know what they want to make. The whole point of Pantrio is surfacing recipes they didn't know they could make. Ingredient-based matching is the product differentiator.
**Implication:** Match score (matched ÷ total ingredients) drives sort order. Recipes below 30% match are hidden.

### P4 — Web app, not native app
**Decision:** Pantrio v1 is a web app built with Next.js, deployed to Vercel.
**Why:** Removes the friction of app store distribution, Android Studio setup, and device-specific development. A web app can be shared as a URL, works on any device, and ships faster.
**Implication:** React Native and Expo are gone. Next.js App Router is the framework.

### P5 — No AI / Claude API in v1
**Decision:** No Anthropic API calls in v1.
**Why:** The pivot to a curated recipe directory eliminates the need for AI-generated content. The matching algorithm is deterministic and runs client-side. Zero running costs, zero API key management, zero rate limiting.
**Implication:** No `/src/api` folder. No API keys. No environment variables needed for v1.

### P6 — Fewer than 100 recipes to start
**Decision:** Launch with a curated set of fewer than 100 recipes.
**Why:** Quality over quantity. 50 excellent recipes are more valuable than 500 mediocre ones. The directory can grow over time — starting small means every recipe gets proper attention.
**Implication:** The matching algorithm must work well with a small corpus. Results should feel good even when the directory is lean.

---

## Architecture Decisions

### A1 — Next.js App Router for navigation
**Decision:** File-based routing via Next.js App Router.
**Why:** Clean, idiomatic, minimal configuration. Three screens = three route files. URL-based navigation means the back button works for free and recipe results are shareable/bookmarkable.

### A2 — No global state library
**Decision:** Component state (`useState`) + URL search params only.
**Why:** The data flow is simple. Ingredients live on the input page, get passed to results via URL, recipe ID gets passed to detail via URL. Nothing needs to be shared globally. Zustand would be overengineering.

### A3 — Matching logic is a pure utility function
**Decision:** `/src/lib/matchRecipes.ts` owns all matching logic. It's a plain function, not a hook.
**Why:** Matching is synchronous, side-effect-free, and deterministic. A pure function is simpler, easier to test, and easier to reason about than a hook.

### A4 — Recipe detail shows matched vs. missing ingredients
**Decision:** On the Recipe Detail screen, ingredients the user has are visually distinguished from ingredients they're missing.
**Why:** The user already told us what they have. Using that information on the detail screen makes the app feel smart and saves them from cross-referencing mentally. "You have this, you're missing that" is useful in context.

### A5 — Ingredients passed via URL query param
**Decision:** When navigating to the results screen, the ingredient list is serialized as a comma-separated URL query param (`?ingredients=garlic,chicken,lemon`).
**Why:** Keeps state in the URL, which means the back button works correctly, results are bookmarkable, and there's no need for a state store. URL is the right place for navigation state.

---

## Design Decisions

### D1 — English only for v1
**Decision:** The app ships in English only.
**Why:** Scope control. Not in v1.
**Implication:** All copy is hardcoded in English following the voice in TASTE.md.

### D2 — No inline styles
**Decision:** All styles use Tailwind utility classes. Design tokens live in `tailwind.config.ts`.
**Why:** Consistency and maintainability. Inline styles bypass the token system.
**Implication:** Never write `style={{ color: '#fff' }}`. Use Tailwind classes or token-based values.

### D3 — No placeholder copy
**Decision:** Every string in the UI — including empty states and validation messages — must follow the voice in TASTE.md.
**Why:** The copy is half the personality of Pantrio. Generic copy makes it feel like any other app.
**Implication:** Before writing any UI string, read TASTE.md. No "Loading...", no "No results found.", no "Please enter at least one ingredient."
