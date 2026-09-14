# Projects II Game Template

Notes for AI coding tools (and humans) working in this repo.

## Stack

- Phaser 3 + TypeScript + Vite for the game
- Supabase for backend data
- GitHub Pages for hosting

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

- Only use the public anon key in the browser / `VITE_*` variables
- Never add the service_role key to client code
- The included demo only checks that Supabase is connected — leave auth and game data for the team to build
- Do not add React, Spring Boot, or Docker unless asked
