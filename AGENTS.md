# PhaserSupabaseTemplate

Notes for AI coding tools (and humans) working in this repo.

## What this repo is

Reusable **classroom template**. Each year it is copied into a new class repository; that class repo gets the production Supabase keys and is what students clone. Do not assume students push directly to the upstream template.

## Stack

- Phaser 3 + TypeScript + Vite for the game
- Supabase for backend data
- GitHub Pages for hosting

## Supabase environments

- **Local / development:** each student has their own Supabase project; keys go in local `.env`
- **Production:** one shared class Supabase project on the *class* GitHub repo; keys go in that repo’s GitHub Actions variables
- Apply the same SQL migrations to both kinds of projects
- Do not commit production keys into `.env`

## Layout

- Scenes: `src/game/scenes/`
- Game config: `src/game/config.ts`
- Assets: `public/assets/`
- Supabase client: `src/services/supabase.ts`
- Database helpers: `src/services/` (start with `demo.ts`)
- SQL: `supabase/migrations/`

Put Supabase calls in `src/services/`, not in Phaser scenes.

## Commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run format
npm run smoke
```

Node version is in `.nvmrc`.

## Important

- Only use the public publishable key in the browser / `VITE_*` variables
- Never add the secret key to client code
- The included demo only checks that Supabase is connected — leave auth and game data for the class to build
- Do not add React, Spring Boot, or Docker unless asked
