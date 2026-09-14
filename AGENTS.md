# AGENTS.md — Projects II Game Template

Guidance for AI coding assistants working in this repository.

## What this project is

Classroom **starter** for Holy Names Academy Projects II: Phaser 3 + TypeScript + Vite + Supabase, deployed to GitHub Pages.

The included demo is intentionally **thin**. It only proves:

```text
Phaser → src/services → Supabase → Postgres → back to Phaser
```

It does **not** implement authentication, user accounts, owned data, scores, or a real game. Students build those.

## Architecture

- Phaser owns the game / UI
- Supabase access belongs in `src/services/`
- Schema lives in `supabase/migrations/`
- No React, Spring Boot, Docker, or separate application server

## Where things live

| Concern | Location |
|--------|----------|
| Scenes | `src/game/scenes/` |
| Game config | `src/game/config.ts` |
| Assets | `public/assets/` |
| Supabase client | `src/services/supabase.ts` |
| Demo connectivity helpers | `src/services/demo.ts` |
| SQL migrations | `supabase/migrations/` |

When students add Auth or game persistence, create new service files (for example `auth.ts`, `gameData.ts`) rather than scattering Supabase calls through scenes.

## Development commands

```bash
npm install
npm run dev
npm run build
npm run lint
npm run format
npm run smoke   # needs .env + migration applied
```

Node version is pinned in `.nvmrc`.

## Security rules

1. Never add the Supabase `service_role` key to client code or `VITE_*` env vars.
2. Only the anon/public key belongs in the browser.
3. Do not implement a full auth/product stack in this template — keep the starter thin.
4. Do not introduce React, Next.js, Spring Boot, or Docker unless explicitly requested.
5. Keep changes understandable for high-school students.

## Demo purpose

`DemoScene` + `demo_messages` exist only so a student can verify their computer and Supabase project are configured. Delete or replace them once the real game starts.
