# CLAUDE.md — Pantrio

## What Is This Project

Pantrio is an Android app that detects ingredients from fridge/pantry photos and suggests recipes. Built by a solo designer-developer using Claude Code as the primary coding tool.

Read SPEC.md for full product definition and screen specs.
Read TASTE.md for brand direction and aesthetic constraints before touching any UI.

---

## Stack

- **Framework:** React Native (Expo)
- **Platform:** Android only (v1)
- **AI:** Anthropic Claude API — vision for ingredient detection, text for recipe generation
- **Component library:** Shadcn/UI (React Native compatible primitives)
- **Language:** TypeScript

---

## Project Structure

```
/src
  /screens        ← one file per screen
  /components     ← shared UI components
  /api            ← Claude API calls (detection, recipes)
  /types          ← shared TypeScript types
  /hooks          ← custom hooks
  /constants      ← tokens, config, static values
/specs            ← per-screen specs, read before building that screen
SPEC.md           ← master product spec
TASTE.md          ← brand and aesthetic north star
ARCHITECTURE.md   ← architecture decisions (written after first session)
DECISIONS.md      ← key decisions log
PROGRESS.md       ← current build status
```

---

## Before Writing Any Code

1. Read SPEC.md — understand what exists and why
2. Read TASTE.md — understand the aesthetic constraints
3. If building a specific screen, read /specs/[screen].md if it exists

---

## Coding Conventions

- TypeScript strict mode — no `any`
- Functional components only — no class components
- One component per file
- Named exports only — no default exports except screens
- Descriptive variable names — no abbreviations except standard ones (e.g. `id`, `url`)
- All Claude API calls live in `/src/api` — never inline in components

---

## Claude API Usage

- Model: `claude-sonnet-4-6` for both vision and text tasks
- All prompts are defined in `/src/api` — not hardcoded in components
- Responses are always JSON — parse and validate before use
- Every API call must handle: loading, success, error states
- Never expose the API key in client code — use environment variables

---

## Design Constraints

- Reference TASTE.md before generating any UI, copy, or component
- Design tokens live in `/src/constants/tokens.ts` — always use tokens, never hardcode values
- Every screen must have loading, success, empty, and error states designed intentionally
- Copy must match the voice defined in TASTE.md — no generic placeholder text

---

## What NOT To Do

- Do not install new dependencies without flagging it first
- Do not add features outside v1 scope defined in SPEC.md
- Do not use inline styles — use StyleSheet or token-based styles
- Do not write placeholder copy like "Loading..." or "Error occurred" — check TASTE.md for voice
- Do not skip error states — every async operation needs one
- Do not generate UI that looks like a health app, SaaS dashboard, or recipe blog

---

## Environment Variables

```
ANTHROPIC_API_KEY=           ← Claude API key from console.anthropic.com
```

---

## How to Run

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# Run on Android
npx expo start --android
```

---

## Current Status

See PROGRESS.md for where the build is at.
