# Projects II Game Template

A classroom starter for building a **browser game** with **Supabase** for backend data.

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
- [Run Locally](#run-locally)
- [Verify Everything Works](#verify-everything-works)
- [Daily Development Workflow](#daily-development-workflow)
- [Project Structure](#project-structure)
- [What You Will Build Next](#what-you-will-build-next)
- [Database and Migrations](#database-and-migrations)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Common Problems / Troubleshooting](#common-problems--troubleshooting)
- [Useful Commands](#useful-commands)

## What This Repository Is

This template gives your team:

- A Phaser + Vite + TypeScript game project
- A Supabase client wired through a small service layer
- A **tiny connectivity demo** (like the old SpringReactTemplate `/api-demo`)
- CI + GitHub Pages deployment

It does **not** ship a finished game, login system, or player accounts.

The demo only answers: “Can Phaser talk to my Supabase project?”

Once that works, you delete/replace the demo and build your game — including Auth and real tables.

Each **team** should use:

- One GitHub repository
- One Supabase project
- One GitHub Pages deployment

## Prerequisites

- **Node.js 22.20.0** (see `.nvmrc`)
- **npm** (comes with Node)
- **Git**
- A free **[Supabase](https://supabase.com/)** account
- A **GitHub** account

**Windows users:** use **Git Bash** (from [Git for Windows](https://gitforwindows.org/)).

<details>
<summary><strong>School network users</strong></summary>

```bash
# Optional: alternate Node download mirror while installing with nvm
NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist nvm install

# Optional: temporary SSL workaround for npm install
npm run install:school
```

</details>

## Initial Setup

### 1. Install Node

```bash
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

Follow the next two sections before expecting the demo to succeed.

## Supabase Setup

1. Create a **new Supabase project** for your team only.
2. Open **Project Settings → API**.
3. Copy:
   - **Project URL**
   - **anon public** key  
     (Never copy the **service_role** key into this app.)
4. Open **SQL Editor → New query**.
5. Paste the contents of `supabase/migrations/001_initial.sql` and run it.

That creates a stub `demo_messages` table and seeds one hello row.

## Environment Variables

```bash
cp .env.example .env
```

Edit `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

Restart `npm run dev` after changing `.env`.

| Value | Safe in browser? | Notes |
|------|------------------|-------|
| `VITE_SUPABASE_URL` | Yes | Public project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public client key |
| `service_role` key | **No** | Never commit or put in Vite |

## Run Locally

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Verify Everything Works

1. `npm run dev` starts without errors.
2. The Phaser canvas appears.
3. The demo shows **Connected — demo_messages loaded**.
4. You see a message like `#1  Hello from Supabase!`
5. Click **Refresh** and it still works.

Optional command-line check:

```bash
npm run smoke
```

If those work, your computer, `.env`, and Supabase project are set up correctly.

## Daily Development Workflow

1. `git pull`
2. `npm install` (if dependencies changed)
3. `npm run dev`
4. Build your game in `src/game/scenes/`
5. Add persistence helpers under `src/services/` (do not put Supabase queries in scenes)
6. Add SQL under `supabase/migrations/` when the schema changes
7. Commit and push

## Project Structure

```text
project/
├── .github/workflows/     # CI + GitHub Pages deploy
├── public/assets/         # Images, audio, etc.
├── src/
│   ├── game/
│   │   ├── scenes/        # BootScene, DemoScene (replace with your game)
│   │   └── config.ts
│   ├── services/          # supabase.ts, demo.ts (+ your future helpers)
│   └── main.ts
├── supabase/migrations/   # SQL schema (start with demo_messages)
├── .env.example
├── AGENTS.md
├── package.json
└── README.md
```

## What You Will Build Next

The template stops at connectivity on purpose. Your team still needs to design and implement things like:

- Authentication (register / sign in / sign out)
- Profiles and ownership
- Game tables (scores, inventory, saves, …)
- Row Level Security policies for private data
- Your actual Phaser game

Keep Supabase access in the service layer (`src/services/`), the same way the old SpringReactTemplate kept API calls in `src/lib/api.ts`.

## Database and Migrations

Schema must live in git — not only in the Supabase dashboard.

- Starter migration: `supabase/migrations/001_initial.sql`
- Apply on a new project by pasting into the Supabase SQL Editor
- Replace the demo table when your real schema is ready

The starter enables public **read** on `demo_messages` so setup works before Auth exists. When you store private player data, you will add Auth and stricter RLS policies.

## Deploying to GitHub Pages

### One-time repository settings

1. Push this project to GitHub.
2. Repo **Settings → Pages** → Source: **GitHub Actions**
3. Repo **Settings → Secrets and variables → Actions → Variables**:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Allow GitHub Actions workflows to run.

### On push to `main`

```text
push to main → build with VITE_BASE_PATH=/<repo-name>/ → GitHub Pages
```

Site URL:

```text
https://<org-or-user>.github.io/<repo-name>/
```

## Common Problems / Troubleshooting

<details>
<summary><strong>Demo says Supabase is not configured</strong></summary>

- Confirm `.env` exists and is not still using `YOUR_…` placeholders
- Restart `npm run dev` after editing `.env`
- Variable names must start with `VITE_`

</details>

<details>
<summary><strong>Request failed / table missing</strong></summary>

- Run `supabase/migrations/001_initial.sql` in the SQL Editor
- Confirm a `demo_messages` table appears in **Table Editor**
- Confirm the anon key and URL belong to the same project

</details>

<details>
<summary><strong>GitHub Pages is blank or assets 404</strong></summary>

- Pages source must be **GitHub Actions**
- Confirm the deploy workflow succeeded
- Confirm Actions variables are set
- Open the URL including the repo name subpath

</details>

<details>
<summary><strong>npm install fails on school network</strong></summary>

```bash
npm run install:school
```

</details>

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
| `npm run smoke` | Connectivity check (needs `.env` + migration) |
