# CLAUDE.md — Pantrio

## What Is This Project

Pantrio is a web app that takes the ingredients you have and finds the best matching recipes from a curated directory. Built by a solo designer-developer using Claude Code as the primary coding tool.

Read SPEC.md for full product definition and screen specs.
Read TASTE.md for brand direction and aesthetic constraints before touching any UI.

---

## Stack

- **Framework:** Next.js (App Router)
- **Platform:** Web (desktop + mobile browser)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Data:** Static JSON recipe directory (`/data/recipes.json`)
- **AI:** None in v1

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
  globals.css

/data
  recipes.json             ← Curated recipe directory (source of truth)

/src
  /components              ← Shared UI components
  /lib
    matchRecipes.ts        ← Ingredient matching algorithm
  /types
    index.ts               ← Shared TypeScript types

tailwind.config.ts         ← Design tokens
SPEC.md                    ← Master product spec
TASTE.md                   ← Brand and aesthetic north star
ARCHITECTURE.md            ← Architecture decisions
DECISIONS.md               ← Key decisions log
PROGRESS.md                ← Current build status
```

---

## Before Writing Any Code

1. Read SPEC.md — understand what exists and why
2. Read TASTE.md — understand the aesthetic constraints
3. Read ARCHITECTURE.md — understand the structure and rules

---

## Coding Conventions

- TypeScript strict mode — no `any`
- Functional components only — no class components
- One component per file
- Named exports only — no default exports except pages
- Descriptive variable names — no abbreviations except standard ones (e.g. `id`, `url`)
- Matching logic lives in `/src/lib/matchRecipes.ts` — never inline in components

---

## Styling Conventions

- Tailwind utility classes only — no inline `style={}` props
- Design tokens (colors, fonts, spacing) defined in `tailwind.config.ts`
- Never hardcode color or spacing values — always use token-based classes
- Global styles and font imports live in `/app/globals.css`

---

## Design Constraints

- Reference TASTE.md before generating any UI, copy, or component
- Every screen must have its states designed intentionally (results, empty, etc.)
- Copy must match the voice defined in TASTE.md — no generic placeholder text
- Do not generate UI that looks like a health app, SaaS dashboard, or recipe blog

---

## What NOT To Do

- Do not install new dependencies without flagging it first
- Do not add features outside v1 scope defined in SPEC.md
- Do not use inline styles — Tailwind only
- Do not write placeholder copy like "Loading..." or "No results found" — check TASTE.md for voice
- Do not skip empty states — every screen that can have zero results needs one
- Do not call any external APIs — all data is local
- Do not generate UI that looks like a health app, SaaS dashboard, or recipe blog

---

## Environment Variables

None required for v1.

---

## How to Run

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

---

## Current Status

See PROGRESS.md for where the build is at.
