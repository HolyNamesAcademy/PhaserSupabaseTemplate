# PhaserSupabaseTemplate

A classroom **template** for a browser game built with Phaser and Supabase.

Install Node, add your Supabase keys, and run the game. No Docker, no Java, and no separate backend server.

This GitHub repo is the reusable template. Each year the instructor copies it into a **class repository**. Students clone that class repo — not this template — and use it for the year.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Supabase: Local Dev vs Production](#supabase-local-dev-vs-production)
- [Supabase Setup (Local Dev)](#supabase-setup-local-dev)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [Verify Everything Works](#verify-everything-works)
- [Development URLs](#development-urls)
- [Useful Commands](#useful-commands)
- [Daily Workflow](#daily-workflow)
- [Project Structure](#project-structure)
- [Talking to Supabase from Code](#talking-to-supabase-from-code)
- [What Comes Next](#what-comes-next)
- [Database and Migrations](#database-and-migrations)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [For Instructors](#for-instructors)
- [Troubleshooting](#troubleshooting)

## Features

- Phaser 3 + TypeScript + Vite (hot reload)
- Small demo that checks your Supabase connection
- Personal local-dev Supabase project per student; one shared production project for the class site
- Supabase helpers live in `src/services/` (not inside Phaser scenes)
- SQL migrations stored in git under `supabase/migrations/`
- GitHub Actions CI and GitHub Pages deploy

## Prerequisites

- Node.js **22.20.0** (see `.nvmrc`)
- npm (comes with Node)
- Git
- Visual Studio Code (recommended)
- A free [Supabase](https://supabase.com/) account
- A GitHub account

**Windows:** use [Git Bash](https://gitforwindows.org/) for the commands in this README.

<details>
<summary><strong>School network</strong></summary>

On a restricted school network you may need:

- An alternate NVM download mirror
- A temporary SSL workaround for `npm install`

Details are in [Initial Setup](#initial-setup).

</details>

## Initial Setup

### 1. Install required software

**Visual Studio Code**

- Download: https://code.visualstudio.com/download

**Git**

- **Windows:** https://gitforwindows.org/ (includes Git Bash)
- **Mac:** `xcode-select --install`

<details>
<summary><strong>Mac — Xcode Command Line Tools</strong></summary>

```bash
xcode-select --install
```

Click Install if prompted.

</details>

### 2. Clone the class repository

Use the **class repository** your instructor shared (a yearly copy of this template).

1. Open the class repo on GitHub
2. Click **Code** and copy the URL
3. In VS Code: **Clone Repository**, paste the URL, open the folder

Or in Git Bash / Terminal (replace with your class repo):

```bash
git clone https://github.com/HolyNamesAcademy/YOUR-CLASS-REPO.git
cd YOUR-CLASS-REPO
```

### 3. Install NVM

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

Add this to your shell config:

- **Windows (Git Bash):** `nano ~/.bash_profile`
- **Mac:** `nano ~/.zshrc`

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Save (`Ctrl+X`, then `Y`, then `Enter`), then open a **new** terminal.

### 4. Install Node.js

<details>
<summary><strong>School network</strong></summary>

```bash
NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist nvm install
nvm use
node -v   # should show v22.20.0
```

</details>

<details>
<summary><strong>Home network</strong></summary>

```bash
nvm install
nvm use
node -v   # should show v22.20.0
```

</details>

### 5. Install dependencies

<details>
<summary><strong>School network</strong></summary>

```bash
npm run install:school
```

</details>

<details>
<summary><strong>Home network</strong></summary>

```bash
npm install
```

</details>

### 6. Set up Supabase and `.env`

Follow [Supabase: Local Dev vs Production](#supabase-local-dev-vs-production), then [Supabase Setup (Local Dev)](#supabase-setup-local-dev) and [Environment Variables](#environment-variables).

### 7. Check tools

```bash
node -v    # v22.20.0
git --version
npm -v
```

## Supabase: Local Dev vs Production

| Project | Who creates it | Used by | Where the keys go |
|---------|----------------|---------|-------------------|
| **Local / development** | Each student (own project) | `npm run dev` | Local `.env` (not committed) |
| **Production** | The class (one shared project) | GitHub Pages | GitHub Actions variables on the class repo |

```text
Your laptop                         Class GitHub Pages site
───────────                         ──────────────────────
.env → your Supabase project        Actions vars → class production project
npm run dev                         push to main → deployed site
```

Why two projects?

- You can reset or break your own database without affecting the public site
- Daily work does not all hit one shared database
- The live site stays on a stable production project

When the schema changes, run the same SQL from `supabase/migrations/` on **both** your local-dev project and the class production project.

Do not put your personal local-dev keys in GitHub Actions. Do not commit production keys into the repo.

## Supabase Setup (Local Dev)

Every student creates their own Supabase project for local development.

### Create the project

1. Go to [https://supabase.com/](https://supabase.com/) and sign in
2. Open (or create) your organization, then click **New project**
3. Fill in the form:

| Field | What to choose |
|------|----------------|
| **Organization** | Your personal org, unless your instructor says otherwise |
| **GitHub (optional)** | Leave unset — migrations live in this game repo |
| **Project name** | e.g. `alex-projects2-dev` (your name + `dev`) |
| **Database password** | Click **Generate a password** and save it somewhere safe. You rarely need it here, but you cannot view it again later. |
| **Region** | Closest to you (**Americas** is fine for most US West classrooms) |

4. Under **Security**, use:

| Setting | Choose | Why |
|--------|--------|-----|
| **Enable Data API** | **On** | Needed for `supabase-js` |
| **Automatically expose new tables** | **Off** | Access stays intentional; our SQL includes the required `GRANT`s |
| **Enable automatic RLS** | **On** | Good default for this course |

5. Click **Create new project** and wait until it finishes (often 1–2 minutes)

### Get your API keys

1. Open **Project Settings → API**
2. Copy:
   - **Project URL** (`https://xxxxx.supabase.co`)
   - **Publishable** key (`sb_publishable_…`)

Never put the **secret** key (`sb_secret_…`) in this app or in `.env`.

### Apply the starter migration

1. Open **SQL Editor → New query**
2. Paste all of `supabase/migrations/001_initial.sql`
3. Click **Run**

That creates `demo_messages` and one hello row.

Continue with [Environment Variables](#environment-variables).

Production setup (one class project for GitHub Pages) is covered under [Deploying to GitHub Pages](#deploying-to-github-pages).

## Environment Variables

`.env` is for **your** local-dev Supabase project only.

```bash
cp .env.example .env
```

Edit `.env`:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=YOUR_SUPABASE_PUBLISHABLE_KEY
```

Restart `npm run dev` after changing `.env`.

| Value | Safe in the browser? | Notes |
|------|----------------------|-------|
| `VITE_SUPABASE_URL` | Yes | Project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Publishable key (`sb_publishable_…`) |
| Secret key (`sb_secret_…`) | **No** | Never commit or add to Vite / Pages |

`.env` is gitignored. Production keys go in GitHub Actions variables on the class repo.

Anything shipped to GitHub Pages is public. Security comes from Auth and Row Level Security later — not from hiding the publishable key.

## Quick Start

Finish setup above first, then:

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173). You should see **Connected — demo_messages loaded** and a hello message.

## Verify Everything Works

1. `npm run dev` starts without errors
2. The Phaser canvas appears
3. Status shows **Connected — demo_messages loaded**
4. You see something like `#1  Hello from Supabase!`
5. **Refresh** still works

Optional:

```bash
npm run smoke
```

If that passes, your computer, `.env`, and local-dev Supabase project are set up correctly.

## Development URLs

| Service | URL | Description |
|---------|-----|-------------|
| Game (local) | http://localhost:5173 | Phaser app + connection demo |
| Your local Supabase | https://supabase.com/dashboard | Project from your `.env` |
| Class production Supabase | https://supabase.com/dashboard | Shared project for GitHub Pages |
| GitHub Pages | `https://<org>.github.io/<repo-name>/` | Public site (after deploy is set up) |

## Useful Commands

```text
npm run dev            Start the local game server
npm run build          Typecheck and build for production
npm run preview        Preview the production build locally
npm run lint           Run ESLint
npm run format         Format with Prettier
npm run format:check   Check formatting (CI)
npm run smoke          Check Supabase connectivity from the terminal
npm run install:school npm install with a temporary SSL workaround
```

## Daily Workflow

```bash
git pull
npm install            # only if dependencies changed
npm run dev
```

- Edit scenes in `src/game/scenes/`
- Put Supabase calls in `src/services/`
- Vite reloads the browser when you save
- If you change the database schema, add SQL under `supabase/migrations/`, run it on your local-dev project, and make sure the class production project gets the same SQL before or when you deploy

Before you push:

```bash
npm run lint
npm run format:check
npm run build
```

Stop the dev server with `Ctrl+C`.

## Project Structure

```text
├── .github/workflows/         # CI + Pages deploy
│   ├── ci.yml
│   └── deploy.yml
├── public/assets/             # Images, audio, etc.
├── src/
│   ├── game/
│   │   ├── scenes/            # BootScene, DemoScene (replace with your game)
│   │   └── config.ts
│   ├── services/
│   │   ├── supabase.ts        # Supabase client
│   │   └── demo.ts            # Demo helpers
│   ├── main.ts
│   └── style.css
├── supabase/migrations/
│   └── 001_initial.sql
├── scripts/smoke-test.ts
├── .env.example
├── .nvmrc
├── AGENTS.md                  # Notes for AI coding tools
├── package.json
├── vite.config.ts
└── README.md
```

## Talking to Supabase from Code

The starter migration creates `demo_messages` — only to prove connectivity.

```typescript
import { getDemoMessages } from '@/services/demo';

const rows = await getDemoMessages();
```

Call helpers from `src/services/` instead of writing Supabase queries inside scenes.

When you add Auth, scores, or saves, add new files next to `demo.ts` (for example `auth.ts`, `gameData.ts`).

## What Comes Next

This template only checks the connection. The class still needs to build:

- Authentication (register / sign in / sign out)
- Profiles and ownership
- Game tables (scores, inventory, saves, …)
- Row Level Security for private data
- The actual Phaser game

## Database and Migrations

Keep schema in git, not only in the Supabase dashboard.

- Starter file: `supabase/migrations/001_initial.sql`
- Apply by pasting into the Supabase **SQL Editor**
- Run new migrations on each student’s local-dev project **and** on the class production project
- Replace the demo table when your real schema is ready

`demo_messages` is publicly readable so setup works before Auth. Private player data should use Auth and stricter RLS later.

## Deploying to GitHub Pages

The public site must use the **class production** Supabase project, not a student’s local-dev project.

### Create the production Supabase project

(Instructor / class once)

1. Create one shared project (same form as [Create the project](#create-the-project))
2. Name it something like `projects2-production`
3. Same security settings: Data API **on**, automatically expose new tables **off**, automatic RLS **on**
4. Run every file in `supabase/migrations/` in that project’s SQL Editor
5. Copy the **Project URL** and **publishable** key

### Configure the class GitHub repo

1. Open the class repo **Settings → Pages**
2. Set Source to **GitHub Actions**
3. Open **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_SUPABASE_URL` — production Project URL
   - `VITE_SUPABASE_PUBLISHABLE_KEY` — production publishable key
4. Allow GitHub Actions to run

### What happens on push to `main`

```text
push to main
  → Actions builds with VITE_BASE_PATH=/<repo-name>/
  → Build embeds production Supabase URL + publishable key
  → Publishes to GitHub Pages
```

Site URL:

```text
https://<org>.github.io/<repo-name>/
```

The deploy workflow sets `VITE_BASE_PATH` from the repository name, so you usually do not edit it by hand.

### Optional local checks

```bash
VITE_BASE_PATH=/your-class-repo-name/ npm run build
npm run preview
```

To temporarily run against production data (do not commit these):

```bash
VITE_SUPABASE_URL=... VITE_SUPABASE_PUBLISHABLE_KEY=... npm run dev
```

## For Instructors

Each year (or section):

1. Create a new class GitHub repo from this template (or copy its contents)
2. Create the class production Supabase project and apply `supabase/migrations/`
3. Set Actions variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` on the **class** repo
4. Enable Pages → GitHub Actions

Students then clone the class repo, each create a personal local-dev Supabase project + `.env`, and push to the class repo. Pages uses the class production project.

Start the next year with a fresh class repo (and usually a fresh production Supabase project) copied from this template again.

## Troubleshooting

<details>
<summary><strong>Local works but GitHub Pages shows wrong or empty data</strong></summary>

- Local `.env` is your **dev** project; Pages uses **production** from Actions variables
- Confirm production has the same migrations
- Confirm Actions variables are the class production keys, not a student’s local-dev keys

</details>

<details>
<summary><strong>Supabase is not configured</strong></summary>

- Confirm `.env` exists (from `.env.example`)
- Confirm values are not still `YOUR_…` placeholders
- Restart `npm run dev` after editing `.env`
- Names must start with `VITE_`

</details>

<details>
<summary><strong>Permission denied for table</strong></summary>

Common when **Automatically expose new tables** is off and grants were not applied.

```sql
grant usage on schema public to anon, authenticated;
grant select on table public.demo_messages to anon, authenticated;
```

Or re-run the full `supabase/migrations/001_initial.sql`.

Also confirm:

- `.env` uses `VITE_SUPABASE_PUBLISHABLE_KEY`
- you restarted `npm run dev` after editing `.env`
- URL and publishable key are from the same project

</details>

<details>
<summary><strong>Table missing / request failed</strong></summary>

- Run `supabase/migrations/001_initial.sql` in the SQL Editor
- Confirm `demo_messages` exists in **Table Editor**
- Confirm URL and publishable key match that project
- Try `npm run smoke`

</details>

<details>
<summary><strong>Wrong Node version</strong></summary>

```bash
nvm install
nvm use
node -v   # should match .nvmrc (v22.20.0)
```

</details>

<details>
<summary><strong>npm install fails on school network</strong></summary>

```bash
npm run install:school
```

</details>

<details>
<summary><strong>Blank page or missing assets on GitHub Pages</strong></summary>

- Pages source is **GitHub Actions**
- Deploy workflow succeeded under **Actions**
- Actions variables are set
- Open the URL including the repo subpath (`/your-repo-name/`)

</details>

<details>
<summary><strong>Port 5173 already in use</strong></summary>

Stop the other process, or use the alternate URL Vite prints.

</details>

<details>
<summary><strong>Windows terminal issues</strong></summary>

- Use **Git Bash**, not PowerShell
- In VS Code, use the terminal dropdown next to `+` and choose **Git Bash**
- Confirm you are in the project root (`ls` shows `package.json`)

</details>

### Getting help

1. Re-check setup, local Supabase, and `.env`
2. Run `npm run smoke` and read the error
3. Check the browser console
4. Ask your instructor or a classmate — include what you tried and the exact error text
