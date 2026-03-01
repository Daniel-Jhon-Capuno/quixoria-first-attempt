# 🚀 Quixoria — Local Setup Guide (VS Code + XAMPP)

## What changed from the original Replit project
| Area | Before (Replit) | After (Yours) |
|---|---|---|
| Database | PostgreSQL | MySQL via XAMPP |
| Auth | Replit OIDC | Username & Password (passport-local) |
| Sessions | connect-pg-simple | express-mysql-session |
| Vite plugins | Replit-specific plugins | Standard React plugin only |
| ORM dialect | `postgresql` | `mysql` |

---

## Step 1 — Prerequisites

Make sure you have these installed:
- [Node.js 20+](https://nodejs.org/) — check with `node -v`
- [XAMPP](https://www.apachefriends.org/) — for MySQL
- [VS Code](https://code.visualstudio.com/)

---

## Step 2 — Set up the database in XAMPP

1. Open **XAMPP Control Panel** and start **Apache** and **MySQL**
2. Open your browser and go to `http://localhost/phpmyadmin`
3. Click **"New"** on the left sidebar
4. Create a database named `quixoria` (collation: `utf8mb4_unicode_ci`)
5. That's it — Drizzle will create all the tables for you

---

## Step 3 — Clone / open in VS Code

Open the project folder in VS Code, then open the integrated terminal (`Ctrl + \``).

---

## Step 4 — Replace files

Copy the converted files from this migration into your project, replacing the originals:

| File | Action |
|---|---|
| `package.json` | ✅ Replace |
| `drizzle.config.ts` | ✅ Replace |
| `vite.config.ts` | ✅ Replace |
| `shared/schema.ts` | ✅ Replace |
| `server/db.ts` | ✅ Replace (or create if missing) |
| `server/auth.ts` | ✅ Replace entirely (new local auth) |
| `.env` | ✅ Create from `.env.example` |

### Files to DELETE (no longer needed):
- `server/replit_integrations/` — entire folder
- Any file importing from `openid-client`

---

## Step 5 — Create your .env file

In the project root, create a file called `.env` (copy from `.env.example`):

```
DATABASE_URL=mysql://root:@localhost:3306/quixoria
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=quixoria
SESSION_SECRET=my-super-secret-session-key-change-me
NODE_ENV=development
PORT=5000
```

> If you set a password for MySQL root in XAMPP, fill in `DB_PASSWORD` and update `DATABASE_URL` accordingly.

---

## Step 6 — Install dependencies

```bash
npm install
```

This will install `mysql2`, `bcryptjs`, `express-mysql-session` and remove the old Postgres packages.

---

## Step 7 — Push the schema to MySQL

```bash
npm run db:push
```

This creates all the tables (`users`, `books`, `library_items`, `reviews`, `sessions`) in your `quixoria` database. You can verify in phpMyAdmin.

---

## Step 8 — Update server/index.ts

Find where Replit Auth was set up (look for `setupAuth` from `./replit_integrations/auth`) and replace it:

```ts
// OLD (delete these)
import { setupAuth } from "./replit_integrations/auth";

// NEW (add these)
import { setupAuth, registerAuthRoutes } from "./auth";

// Then in your app setup:
setupAuth(app);
registerAuthRoutes(app);
```

---

## Step 9 — Update frontend auth calls

In your React frontend, replace any Replit Auth redirects with calls to your new API:

```ts
// Login
await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password }),
  credentials: "include",
});

// Register
await fetch("/api/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username, password, email, firstName, lastName }),
  credentials: "include",
});

// Logout
await fetch("/api/auth/logout", { method: "POST", credentials: "include" });

// Get current user
await fetch("/api/auth/me", { credentials: "include" });
```

---

## Step 10 — Run the app!

```bash
npm run dev
```

Open `http://localhost:5000` in your browser. 🎉

---

## Protecting routes on the server

Use the `requireAuth` middleware from `server/auth.ts` on any route that needs a logged-in user:

```ts
import { requireAuth } from "./auth";

app.get("/api/library", requireAuth, async (req, res) => {
  const userId = (req.user as any).id;
  // ...
});
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `DATABASE_URL is required` | Make sure `.env` exists and has `DATABASE_URL` |
| `Access denied for user 'root'` | Check DB_PASSWORD in `.env` matches your XAMPP MySQL password |
| `Table 'sessions' doesn't exist` | Run `npm run db:push` — it will create it |
| Port 5000 already in use | Change `PORT=5001` in `.env` |
| Vite can't find `@replit/...` packages | Make sure you replaced `vite.config.ts` with the new version |
