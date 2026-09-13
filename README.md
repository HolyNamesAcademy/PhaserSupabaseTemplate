# Projects II Game Template

A classroom starter for building a **browser game** with **user accounts** and **persistent data**.

Stack: **Phaser 3** · **TypeScript** · **Vite** · **Supabase** · **GitHub Pages**

After setup, daily development is:

```bash
npm install
npm run dev
```

No Docker. No Java. No local database server. No separate backend process.

## Table of Contents

- [What This Repository Is](#what-this-repository-is)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Supabase Setup](#supabase-setup)
- [Environment Variables](#environment-variables)
- [Run the Game Locally](#run-the-game-locally)
- [Verify Everything Works](#verify-everything-works)
- [Daily Development Workflow](#daily-development-workflow)
- [Project Structure](#project-structure)
- [Database and Migrations](#database-and-migrations)
- [Authentication](#authentication)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Client Trust and Edge Functions](#client-trust-and-edge-functions)
- [Common Problems / Troubleshooting](#common-problems--troubleshooting)
- [Useful Commands](#useful-commands)

## What This Repository Is

This template combines ideas from earlier Projects II approaches:

- Phaser + GitHub Pages (simple public game hosting)
- Classroom scaffolding from `SpringReactTemplate` (docs, CI, centralized API layer, AI guidance)

…without the operational weight of Spring Boot, Docker, or a separately hosted API.

Each **team** should use:

- One GitHub repository
- One Supabase project
- One GitHub Pages deployment

Do **not** share a single Supabase project across the whole class.

The included **Coin Catcher** demo is intentionally tiny. Its job is to prove the architecture (register → play → save → reload → leaderboard). Replace the demo scenes with your real game.

## Prerequisites

- **Node.js 22.20.0** (see `.nvmrc`)
- **npm** (comes with Node)
- **Git**
- A free **[Supabase](https://supabase.com/)** account
- A **GitHub** account (for hosting and deployment)

**Windows users:** use **Git Bash** (from [Git for Windows](https://gitforwindows.org/)) for the commands in this README.

<details>
<summary><strong>School network users</strong></summary>

If npm or nvm fails on the school network:

```bash
# Optional: alternate Node download mirror while installing with nvm
NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist nvm install

# Optional: temporary SSL workaround for npm install
npm run install:school
```

Ask your instructor if you are unsure whether you need these steps.

</details>

## Initial Setup

### 1. Install Node (with nvm recommended)

**macOS / Linux / Git Bash:**

```bash
# If you use nvm:
nvm install
nvm use
node -v   # should match .nvmrc (v22.20.0)
```

### 2. Clone your team repository

```bash
git clone https://github.com/YOUR_ORG/YOUR_TEAM_REPO.git
cd YOUR_TEAM_REPO
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure Supabase and `.env`

Follow [Supabase Setup](#supabase-setup) and [Environment Variables](#environment-variables) below before expecting login/save to work.

## Supabase Setup

1. Go to [https://supabase.com/](https://supabase.com/) and create a **new project** for your team only.
2. Wait until the project finishes provisioning.
3. In the Supabase dashboard, open **Project Settings → API**.
4. Copy:
   - **Project URL**
   - **anon public** key  
     (Never copy the **service_role** key into this app.)
5. Open **SQL Editor → New query**.
6. Paste the full contents of `supabase/migrations/001_initial.sql` and run it.
7. Recommended for classroom development: **Authentication → Providers → Email**  
   Turn **off** “Confirm email” so students can register and play immediately without inbox setup.  
   (You can turn confirmation on later if you want.)

You should now have tables `profiles`, `scores`, and `save_games` with Row Level Security enabled.

## Environment Variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Edit `.env` and paste your Supabase **URL** and **anon** key:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

3. Restart `npm run dev` after changing `.env`.

### What is safe to expose?

| Value | Safe in browser? | Notes |
|------|------------------|-------|
| `VITE_SUPABASE_URL` | Yes | Public project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public client key; protected by RLS |
| `service_role` key | **No** | Bypasses RLS — never commit or put in Vite |

GitHub Pages is a **static** site. Anything bundled into the client is public. Real security comes from **Auth + Row Level Security**, not from hiding the anon key.

## Run the Game Locally

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Verify Everything Works

Use this checklist after first setup:

1. `npm run dev` starts without errors.
2. The Phaser game canvas appears in the browser.
3. Register a test account (email + password + username).
4. You land on the main menu and see your username / scores area.
5. Click **Play**, collect coins for a few seconds, wait for the round to end.
6. Confirm the game says it **saved** your score.
7. Reload the browser page.
8. Sign in again if needed.
9. Confirm your **best score** / lifetime coins still appear on the menu.
10. Open **Leaderboard** and confirm your score is listed.

If all of those work, auth, Postgres, RLS reads/writes, and the Phaser ↔ service layer path are working.

## Daily Development Workflow

1. `git pull`
2. `npm install` (if dependencies changed)
3. `npm run dev`
4. Build your game in `src/game/scenes/`
5. Add persistence helpers in `src/services/gameData.ts` (do not scatter Supabase calls in scenes)
6. If the database schema changes, add SQL under `supabase/migrations/` and run it in your Supabase project
7. Commit and push — CI builds on every push; Pages deploys from `main`

## Project Structure

```text
project/
├── .github/workflows/     # CI + GitHub Pages deploy
├── public/assets/         # Images, audio, etc.
├── src/
│   ├── game/
│   │   ├── scenes/        # Boot, Auth, Menu, Game, Leaderboard
│   │   └── config.ts
│   ├── services/          # Supabase client, auth, game data
│   └── main.ts
├── supabase/migrations/   # SQL schema + RLS (source of truth)
├── .env.example
├── AGENTS.md              # Guidance for AI coding tools
├── package.json
├── vite.config.ts
└── README.md
```

## Database and Migrations

Schema must live in git — not only in the Supabase dashboard.

- Starter migration: `supabase/migrations/001_initial.sql`
- Apply on a new project by pasting into the Supabase SQL Editor (simplest on student Windows machines)
- Optional later: install the [Supabase CLI](https://supabase.com/docs/guides/cli) if your team prefers CLI workflows

### Starter tables

- **`profiles`** — one row per user (`id` → `auth.users`, plus `username`)
- **`scores`** — score rows owned by a user (leaderboard reads these)
- **`save_games`** — optional `jsonb` blob for flexible save state

### Row Level Security (authorization)

- Authentication asks: “Who are you?”
- Authorization asks: “What are you allowed to do?”

In this starter:

- You can **insert/update/delete** only **your own** scores and save games
- The **leaderboard** can be **read** by everyone (shared data)
- Hiding a button in Phaser is **not** security — RLS is

## Authentication

Uses Supabase Auth with a simple email + password flow (register / sign in / sign out).

Advanced flows (OAuth, password reset, required email confirmation) are intentionally **not** required for the starter.

Service helpers live in `src/services/auth.ts`. Scenes should call those helpers.

## Deploying to GitHub Pages

### One-time repository settings

1. Push this project to GitHub.
2. Repo **Settings → Pages**:
   - Source: **GitHub Actions**
3. Repo **Settings → Secrets and variables → Actions → Variables**:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon public key  
     (Variables are fine here — these are public client values.)
4. Ensure GitHub Actions is allowed to run workflows.

### What happens on push to `main`

```text
push to main
  → GitHub Actions builds with VITE_BASE_PATH=/<repo-name>/
  → Uploads dist/
  → Deploys to GitHub Pages
```

Your game will be available at:

```text
https://<org-or-user>.github.io/<repo-name>/
```

Example: `https://holynamesacademy.github.io/team-project-name/`

The deploy workflow sets `VITE_BASE_PATH` automatically from the repository name so assets work on that subpath.

### Local production build check

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
npm run preview
```

## Client Trust and Edge Functions

Direct Supabase access with RLS is appropriate for normal persistence in this class.

But remember: **the browser is not trusted**. A player could invent a score. For many student games that is acceptable. If you later need unforgeable logic (for example “claim quest reward after server validation”), add a **Supabase Edge Function** — do not add that complexity until you need it.

## Common Problems / Troubleshooting

<details>
<summary><strong>Game says Supabase is not configured</strong></summary>

- Confirm `.env` exists (copied from `.env.example`)
- Confirm values are real, not the `YOUR_…` placeholders
- Restart `npm run dev` after editing `.env`
- Variable names must start with `VITE_`

</details>

<details>
<summary><strong>Register / login fails</strong></summary>

- Confirm you ran `001_initial.sql` in the SQL Editor
- Confirm Email auth is enabled in Supabase
- If confirmation emails are required, either confirm the email or disable confirmations for development
- Check the browser console and the exact error on the login form

</details>

<details>
<summary><strong>Scores do not save or leaderboard is empty</strong></summary>

- Confirm you are signed in
- Confirm the migration created RLS policies
- In Supabase **Table Editor**, check whether rows appear in `scores`
- Confirm your code calls `src/services/gameData.ts` helpers

</details>

<details>
<summary><strong>GitHub Pages is blank or assets 404</strong></summary>

- Confirm Pages source is **GitHub Actions**
- Confirm the deploy workflow succeeded
- Confirm Actions variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Open the site URL including the repo name subpath (`/your-repo-name/`)

</details>

<details>
<summary><strong>npm install fails on school network</strong></summary>

```bash
npm run install:school
```

</details>

<details>
<summary><strong>Wrong Node version</strong></summary>

```bash
nvm install
nvm use
node -v
```

</details>

If you are still stuck, contact your instructor with: what you tried, the exact error text, and a screenshot if relevant.

## Useful Commands

| Command | Purpose |
|--------|---------|
| `npm install` | Install dependencies |
| `npm run install:school` | Install with temporary SSL workaround |
| `npm run dev` | Local development server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting (CI) |
| `npm run smoke` | End-to-end auth + save check (needs `.env` + live Supabase) |

## Features

- Phaser 3 game with TypeScript and Vite hot reload
- Supabase Auth (register / sign in / sign out)
- PostgreSQL persistence with migrations in git
- Row Level Security examples (private writes, public leaderboard reads)
- Centralized service layer (`src/services/`)
- GitHub Actions CI (lint, format check, build)
- Automatic GitHub Pages deployment from `main`
- Classroom-oriented README + `AGENTS.md` for AI tools
