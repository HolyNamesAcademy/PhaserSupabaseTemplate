# PhaserSupabaseTemplate

A classroom starter for building a **browser game** with Phaser and Supabase.

**Simple local setup** — install Node, copy your Supabase keys, and run the game. No Docker, no Java, and no separate backend server to manage.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Supabase Setup](#supabase-setup)
- [Environment Variables](#environment-variables)
- [Quick Start](#quick-start)
- [Development URLs](#development-urls)
- [Development Commands](#development-commands)
- [Common Workflows](#common-workflows)
- [Verify Everything Works](#verify-everything-works)
- [Project Structure](#project-structure)
- [Supabase Integration](#supabase-integration)
- [What You Will Build Next](#what-you-will-build-next)
- [Database and Migrations](#database-and-migrations)
- [Development Notes](#development-notes)
- [CI/CD Pipeline](#cicd-pipeline)
- [Deploying to GitHub Pages](#deploying-to-github-pages)
- [Troubleshooting](#troubleshooting)

## Features

- **Phaser 3 game project** — TypeScript + Vite with hot reload
- **Supabase connection demo** — a small screen that proves your project can read from the database
- **Service layer** — keep Supabase calls in `src/services/` instead of inside scenes
- **SQL migrations in git** — starter schema lives in `supabase/migrations/`
- **GitHub Pages deploy** — push to `main` and GitHub Actions publishes the game
- **CI from day one** — lint, format check, and build on every push/PR
- **Pinned Node version** — see `.nvmrc`

## Prerequisites

- **Node.js 22.20.0** (see `.nvmrc` for the exact version)
- **npm** (comes with Node)
- **Git**
- **Visual Studio Code** (recommended)
- A free **[Supabase](https://supabase.com/)** account
- A **GitHub** account

**(Windows users)** Use **Git Bash** (from [Git for Windows](https://gitforwindows.org/)) for the commands in this README.

<details>
<summary><strong>School Network Users - Important Note</strong></summary>

If you're on a school network with security restrictions, you may need to:

- Use a specific NVM mirror for Node.js installation
- Temporarily disable SSL verification for npm installs

See the [Initial Setup](#initial-setup) section for detailed instructions.

</details>

## Initial Setup

### 1. Install Required Software

**Visual Studio Code**

- Download from: https://code.visualstudio.com/download
- Install and verify it opens

**Git**

- **Windows users:** Download from https://gitforwindows.org/ (includes Git Bash)
- **Mac users:** Install Xcode Command Line Tools: `xcode-select --install`

<details>
<summary><strong>Mac Users - Xcode Command Line Tools</strong></summary>

If you don't have Git installed on Mac, run this in Terminal:

```bash
xcode-select --install
```

You may be prompted to install additional software — click Install when prompted.

</details>

### 2. Clone the Repository

1. Open your team repository on GitHub
2. Click the green **Code** button and copy the URL
3. In VS Code, choose **Clone Repository** and paste the URL
4. Open the project folder in VS Code

Or from Git Bash / Terminal:

```bash
git clone https://github.com/YOUR_ORG/YOUR_TEAM_REPO.git
cd YOUR_TEAM_REPO
```

### 3. Fix Line Endings (Windows Users Only)

<details>
<summary><strong>Windows Users - Line Endings Fix</strong></summary>

To keep files on Linux-style (LF) line endings, run this in Git Bash from the project root:

```bash
find . -type f -not -path '*/\.git/*' -exec dos2unix {} +; git checkout .
```

If `dos2unix` is missing, install it or ask your instructor.

</details>

### 4. Install Node Version Manager (NVM)

**Install NVM:**

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```

**Configure NVM:**

- **Windows (Git Bash):** `nano ~/.bash_profile`
- **Mac:** `nano ~/.zshrc`

Add this:

```bash
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm
```

Save with: `Ctrl+X`, then `Y`, then `Enter`

**Open a new terminal** (Git Bash on Windows).

### 5. Install Node.js

<details>
<summary><strong>School Network (with security restrictions)</strong></summary>

```bash
NVM_NODEJS_ORG_MIRROR=http://nodejs.org/dist nvm install
nvm use
node -v   # should show v22.20.0
```

</details>

<details>
<summary><strong>Home Network</strong></summary>

```bash
nvm install
nvm use
node -v   # should show v22.20.0
```

</details>

### 6. Install Project Dependencies

<details>
<summary><strong>School Network (with security restrictions)</strong></summary>

```bash
npm run install:school
```

Or manually:

```bash
npm config set strict-ssl false
npm install
npm config set strict-ssl true
```

</details>

<details>
<summary><strong>Home Network</strong></summary>

```bash
npm install
```

</details>

### 7. Configure Supabase

Complete [Supabase Setup](#supabase-setup) and [Environment Variables](#environment-variables) before expecting the demo to succeed.

### 8. Verify Your Setup

```bash
node -v    # Should show v22.20.0
git --version
npm -v
```

If any of these fail, go back to the relevant step above.

## Supabase Setup

Each team should create **its own** Supabase project. Do not share one project across the whole class.

1. Go to [https://supabase.com/](https://supabase.com/) and create a new project
2. Wait until the project finishes provisioning
3. Open **Project Settings → API**
4. Copy:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key  
     Never copy the **service_role** key into this app
5. Open **SQL Editor → New query**
6. Paste the full contents of `supabase/migrations/001_initial.sql`
7. Click **Run**

That creates a small `demo_messages` table and adds one hello row so you can confirm the connection.

## Environment Variables

1. Copy the example file:

```bash
cp .env.example .env
```

2. Edit `.env` and paste your values:

```bash
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_PUBLIC_KEY
```

3. Save the file and restart `npm run dev` if it was already running.

| Value | Safe in the browser? | Notes |
|------|----------------------|-------|
| `VITE_SUPABASE_URL` | Yes | Public project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Public client key |
| `service_role` key | **No** | Never commit or put in Vite / GitHub Pages |

GitHub Pages is a static site. Anything bundled into the client is public. Real security comes from Auth and Row Level Security later — not from hiding the anon key.

## Quick Start

> **First time?** Finish [Initial Setup](#initial-setup), [Supabase Setup](#supabase-setup), and [Environment Variables](#environment-variables) first.

1. Start the dev server:

```bash
npm run dev
```

2. Open the URL Vite prints (usually http://localhost:5173)

3. Confirm the demo shows **Connected — demo_messages loaded** and a hello message

## Development URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Game (local)** | http://localhost:5173 | Phaser app + connectivity demo |
| **Supabase Dashboard** | https://supabase.com/dashboard | Your project's tables, SQL, and API settings |
| **GitHub Pages** | `https://<org-or-user>.github.io/<repo-name>/` | Public deployed game (after setup) |

## Development Commands

```text
npm run dev            Start the Vite development server
npm run build          Typecheck and build for production
npm run preview        Preview the production build locally
npm run lint           Run ESLint
npm run format         Format files with Prettier
npm run format:check   Check formatting (used in CI)
npm run smoke          Quick Supabase connectivity check
npm run install:school npm install with a temporary SSL workaround
```

## Common Workflows

### Daily Development

```bash
git pull
npm install            # only if dependencies changed
npm run dev
```

### Making Changes

- Edit scenes in `src/game/scenes/`
- Put Supabase calls in `src/services/`
- Save and let Vite hot-reload the browser
- When the database schema changes, add SQL under `supabase/migrations/` and run it in your Supabase project

### Checking Quality Before You Push

```bash
npm run lint
npm run format:check
npm run build
```

### Stopping

Press `Ctrl+C` in the terminal running `npm run dev`.

## Verify Everything Works

Use this checklist after first setup:

1. `npm run dev` starts without errors
2. The Phaser canvas appears in the browser
3. The demo shows **Connected — demo_messages loaded**
4. You see a message like `#1  Hello from Supabase!`
5. Click **Refresh** and it still works

Optional command-line check:

```bash
npm run smoke
```

If those steps work, your computer, `.env`, and Supabase project are set up correctly.

## Project Structure

```text
├── .github/workflows/         # GitHub Actions (CI + Pages deploy)
│   ├── ci.yml
│   └── deploy.yml
├── public/assets/             # Images, audio, and other static files
├── src/
│   ├── game/
│   │   ├── scenes/            # BootScene, DemoScene (replace with your game)
│   │   └── config.ts          # Phaser game config
│   ├── services/              # Supabase helpers
│   │   ├── supabase.ts        # Creates the Supabase client
│   │   └── demo.ts            # Demo table helpers
│   ├── main.ts                # App entry point
│   └── style.css
├── supabase/migrations/       # SQL schema in git
│   └── 001_initial.sql
├── scripts/smoke-test.ts      # Optional connectivity check
├── .env.example               # Example environment variables
├── .nvmrc                     # Pinned Node version
├── AGENTS.md                  # Notes for AI coding tools
├── package.json
├── vite.config.ts
└── README.md
```

## Supabase Integration

### Demo table

The starter migration creates:

- `demo_messages` — a tiny public table used only to prove connectivity

### Using the service helpers

```typescript
import { getDemoMessages } from '@/services/demo';

const rows = await getDemoMessages();
```

Scenes should call helpers in `src/services/` rather than writing Supabase queries inline.

### Where new helpers go

When you add Auth, scores, saves, and so on, create new files next to `demo.ts`, for example:

- `src/services/auth.ts`
- `src/services/gameData.ts`

## What You Will Build Next

This template stops at a connection check on purpose. Your team will still need to add:

- Authentication (register / sign in / sign out)
- Profiles and ownership
- Game tables (scores, inventory, saves, …)
- Row Level Security policies for private data
- Your actual Phaser game

## Database and Migrations

Database schema should live in git — not only in the Supabase dashboard.

- Starter file: `supabase/migrations/001_initial.sql`
- Apply it by pasting into the Supabase **SQL Editor** (simplest on student Windows machines)
- Add new migration files as your schema grows
- Replace the demo table when your real game schema is ready

`demo_messages` is publicly readable so setup works before you add Auth. Private player data should use Auth and stricter RLS policies later.

## Development Notes

- **Hot reload:** Vite refreshes the browser when you save TypeScript/CSS files
- **Env vars:** Only variables starting with `VITE_` are available in the browser
- **Restart after `.env` changes:** Stop and re-run `npm run dev`
- **Service layer:** Keep Supabase access in `src/services/`
- **No Docker / Java required:** Supabase hosts the database for you

## CI/CD Pipeline

The `.github/workflows/` folder contains GitHub Actions that run on pushes and pull requests:

- **CI** — install, lint, format check, and build
- **Deploy** — build and publish to GitHub Pages from `main`

## Deploying to GitHub Pages

### One-time repository settings

1. Push this project to GitHub
2. Open repo **Settings → Pages**
3. Set Source to **GitHub Actions**
4. Open **Settings → Secrets and variables → Actions → Variables** and add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Make sure GitHub Actions is allowed to run workflows

### What happens on push to `main`

```text
push to main
  → GitHub Actions builds with VITE_BASE_PATH=/<repo-name>/
  → Uploads the dist/ folder
  → Publishes to GitHub Pages
```

Your game will be at:

```text
https://<org-or-user>.github.io/<repo-name>/
```

### Local production build check

```bash
VITE_BASE_PATH=/your-repo-name/ npm run build
npm run preview
```

## Troubleshooting

### Common Issues

<details>
<summary><strong>Supabase is not configured</strong></summary>

- Confirm `.env` exists (copied from `.env.example`)
- Confirm values are real, not still `YOUR_…` placeholders
- Restart `npm run dev` after editing `.env`
- Variable names must start with `VITE_`

</details>

<details>
<summary><strong>Request failed / table missing</strong></summary>

- Run `supabase/migrations/001_initial.sql` in the SQL Editor
- In Supabase **Table Editor**, confirm `demo_messages` exists
- Confirm the Project URL and anon key belong to the same project
- Try `npm run smoke` for a clearer error message

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
<summary><strong>Game page is blank or assets 404 on GitHub Pages</strong></summary>

- Pages source must be **GitHub Actions**
- Confirm the deploy workflow succeeded under the **Actions** tab
- Confirm Actions variables `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Open the site URL including the repo name subpath (`/your-repo-name/`)

</details>

<details>
<summary><strong>Port 5173 already in use</strong></summary>

- Stop the other Vite process, or let Vite pick another port and use the URL it prints
- Check what is using the port: `lsof -i :5173` (macOS/Linux)

</details>

<details>
<summary><strong>Windows terminal issues</strong></summary>

- Use **Git Bash**, not PowerShell, for the setup commands in this README
- In VS Code, click the arrow next to the `+` button in the terminal panel and choose **Git Bash**
- Make sure your terminal is in the project root (`ls` should show `package.json`)

</details>

### Debug Commands

```bash
node -v
npm -v
npm run smoke
npm run build
```

### Getting Help

If you're still stuck:

1. Re-check [Initial Setup](#initial-setup), [Supabase Setup](#supabase-setup), and [Environment Variables](#environment-variables)
2. Run `npm run smoke` and read the error text
3. Look at the browser console for errors
4. Ask your instructor or teammates — include what you tried and the exact error message
