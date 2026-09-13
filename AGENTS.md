# AGENTS.md — Projects II Game Template

Guidance for AI coding assistants (Cursor, Copilot, etc.) working in this repository.

## What this project is

Classroom starter for Holy Names Academy **Projects II**: a year-long browser game with user accounts and persistent data.

Stack:

- Phaser 3 + TypeScript + Vite (the game / UI)
- Supabase (Auth, PostgreSQL, Row Level Security)
- GitHub Pages + GitHub Actions (public deployment)

There is **no** Spring Boot, Docker, React/Next.js, or separately hosted application server in this template.

## Architecture

```text
Phaser scenes  →  src/services/*  →  Supabase (Auth + Postgres + RLS)  →  persistent data
```

- Phaser owns menus, HUD, login flow, and gameplay.
- All Supabase access belongs in `src/services/`.
- Schema lives in `supabase/migrations/` (git is the source of truth).

## Where things live

| Concern | Location |
|--------|----------|
| Scenes | `src/game/scenes/` |
| Game config | `src/game/config.ts` |
| Entry | `src/main.ts` |
| Assets | `public/assets/` |
| Supabase client | `src/services/supabase.ts` |
| Auth helpers | `src/services/auth.ts` |
| Persistence helpers | `src/services/gameData.ts` |
| SQL migrations | `supabase/migrations/` |
| Env example | `.env.example` |

## Development commands

```bash
npm install          # or npm run install:school on restricted networks
npm run dev          # local Vite server
npm run build        # typecheck + production build
npm run lint
npm run format
```

Node version is pinned in `.nvmrc` (currently 22.20.0).

## Deployment

- Push to `main` builds with GitHub Actions and deploys to GitHub Pages.
- Vite `base` is set from `VITE_BASE_PATH` so project sites work at `/<repo-name>/`.
- Public Supabase values for production builds come from GitHub Actions **variables** (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Security rules (non-negotiable)

1. **Never** add the Supabase `service_role` key (or any privileged secret) to client code, `.env` committed to git, or Vite `VITE_*` variables.
2. Only the **anon/public** key belongs in the browser. Security comes from Auth + RLS, not from hiding browser keys.
3. Do not treat UI hiding as authorization. Enforce ownership in SQL RLS policies.
4. Client trust: the browser can lie. Scores and other client-written values are fine for this starter demo; for unforgeable game logic, use Supabase Edge Functions later — do not add them casually.

## Coding conventions

- Prefer **understandable > clever** and **simple > flexible**.
- Keep changes readable for high-school students.
- Phaser scenes should call service functions; they should not construct Supabase queries inline.
- Do **not** introduce React, Next.js, Spring Boot, Docker, or a custom backend server unless the user explicitly asks.
- Do not expand the demo game into a large framework. Teams replace the example scenes with their own game.
- When changing schema, add/update SQL under `supabase/migrations/` and keep RLS policies correct.

## Demo purpose

The included Coin Catcher flow proves the full stack (auth → play → save → reload → leaderboard). It is intentionally tiny and disposable.
