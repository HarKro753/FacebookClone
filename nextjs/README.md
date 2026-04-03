# nextjs/

Next.js 15 (App Router) implementation of thefacebook.com (2004). TypeScript, SQLite, Server Components, Server Actions. Visually identical to the LAMP version — same CSS, same mock data.

## Prerequisites

- **Bun** (recommended) or Node.js 18+

## Setup

```bash
bun install          # Install dependencies
bun run seed         # Create + seed SQLite database (data/facebook.db)
bun run dev          # Start dev server on http://localhost:3000
```

To reset the database, just run `bun run seed` again — it deletes and recreates from scratch.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 with App Router (Turbopack) |
| Language | TypeScript (strict) |
| Database | SQLite via `better-sqlite3` |
| Auth | HMAC-signed httpOnly cookie (no JWT, no session DB) |
| Passwords | `bcryptjs` (hash + compare) |
| Forms | React Server Actions (built-in CSRF protection) |
| CSS | Verbatim copy of `lamp/css/style.css` as `globals.css` |
| Package manager | Bun |

## Architecture

### No client JavaScript (almost)

The entire app uses React Server Components. Every page fetches data and renders on the server, mirroring PHP's model. Only two components are client-side:

- `FlashMessage` — reads + clears a flash cookie
- `BrowseSelect` — `onchange` auto-submit on browse dropdowns (matching the LAMP version's inline JS)

### Server Actions as POST handlers

Each PHP POST handler maps to a Server Action:

| PHP | Server Action | Purpose |
|---|---|---|
| `wall.php` | `actions/wall.ts` | Post on a wall |
| `poke.php` | `actions/poke.ts` | Poke / poke back |
| `friendaction.php` | `actions/friend.ts` | Add / accept / reject / remove |
| `editprofile.php` (POST) | `actions/profile.ts` | Update profile fields + courses |
| `editphoto.php` (POST) | `actions/profile.ts` | Upload photo |
| `privacy.php` (POST) | `actions/privacy.ts` | Update privacy settings |
| `index.php` (POST) | `actions/auth.ts` | Login |
| `register.php` (POST) | `actions/auth.ts` | Register |

All actions follow the same pattern: validate, mutate DB, `setFlash()`, `redirect()`.

### Auth

`lib/auth.ts` — stateless cookie-based sessions:

- **Login:** HMAC-sign `userId.timestamp` with a secret, store in `fb_session` httpOnly cookie
- **`getCurrentUser()`:** verify cookie signature, fetch user from DB
- **`requireLogin()`:** `getCurrentUser()` or redirect to `/`
- **Flash messages:** JSON in a non-httpOnly `fb_flash` cookie, read + cleared client-side

### Database

`lib/db.ts` — thin wrapper over `better-sqlite3`:

```typescript
dbAll<T>(sql, ...params): T[]     // SELECT multiple rows
dbGet<T>(sql, ...params): T?     // SELECT single row
dbRun(sql, ...params)             // INSERT/UPDATE/DELETE
```

Auto-initializes schema on first connection if tables don't exist.

The seed script (`lib/seed.ts`) runs under **Bun** and uses `bun:sqlite` (not `better-sqlite3`) since it executes outside the Next.js runtime.

### Schema translation (MySQL to SQLite)

| MySQL | SQLite |
|---|---|
| `INT UNSIGNED AUTO_INCREMENT PRIMARY KEY` | `INTEGER PRIMARY KEY AUTOINCREMENT` |
| `ENUM('a','b','c')` | `TEXT CHECK(col IN ('a','b','c'))` |
| `TINYINT(1)` | `INTEGER DEFAULT 0` |
| `TIMESTAMP DEFAULT CURRENT_TIMESTAMP` | `TEXT DEFAULT (datetime('now'))` |
| `ORDER BY RAND()` | `ORDER BY RANDOM()` |
| `FULLTEXT INDEX` + `MATCH AGAINST` | `LIKE` search only |
| `ON UPDATE CURRENT_TIMESTAMP` | Handled manually |

### Utility functions

`lib/utils.ts` — ports of `includes/functions.php`:

| Function | Purpose |
|---|---|
| `timeAgo(datetime)` | "3 hours ago", "February 5, 2004" |
| `photoUrl(photo)` | `/images/uploads/x.jpg` or `/images/default_photo.jpg` |
| `isFriend(a, b)` | Check accepted friendship |
| `friendshipStatus(a, b)` | Returns `null`, `pending_sent`, `pending_received`, `accepted`, `rejected`, `self` |
| `canView(profileId, viewerId, field)` | Privacy-aware field visibility check |
| `friendCount(userId)` | Count accepted friends |
| `pendingRequestCount(userId)` | Count incoming pending requests |
| `unseenPokeCount(userId)` | Count unseen pokes |
| `formatDate(dateStr)` | "February 5, 2004" |

## Project Structure

```
nextjs/
├── package.json
├── next.config.ts                  # serverExternalPackages: ['better-sqlite3']
├── public/
│   └── images/
│       ├── default_photo.jpg
│       ├── default_photo.svg
│       └── uploads/                # 20 mock user photos + user uploads
├── data/
│   └── facebook.db                 # SQLite database (gitignored)
└── src/
    ├── app/
    │   ├── layout.tsx              # Root layout: Header + FlashMessage + Footer
    │   ├── globals.css             # Verbatim copy of lamp/css/style.css
    │   ├── page.tsx                # / — Landing page + login form
    │   ├── register/page.tsx       # /register
    │   ├── home/page.tsx           # /home — Dashboard (pokes, requests, wall, friends)
    │   ├── profile/[id]/page.tsx   # /profile/:id — Full profile (most complex page)
    │   ├── edit-profile/page.tsx   # /edit-profile
    │   ├── edit-photo/page.tsx     # /edit-photo
    │   ├── friends/page.tsx        # /friends
    │   ├── friend-requests/page.tsx # /friend-requests
    │   ├── search/page.tsx         # /search?q=...
    │   ├── browse/page.tsx         # /browse?house_id=... | year=... | course_id=...
    │   ├── privacy/page.tsx        # /privacy
    │   ├── about/page.tsx          # /about
    │   └── api/logout/route.ts     # POST /api/logout
    ├── actions/
    │   ├── auth.ts                 # loginAction, registerAction
    │   ├── wall.ts                 # postWallAction
    │   ├── poke.ts                 # pokeAction
    │   ├── friend.ts               # friendAction (add/accept/reject/remove)
    │   ├── profile.ts              # updateProfileAction, uploadPhotoAction
    │   └── privacy.ts              # updatePrivacyAction
    ├── lib/
    │   ├── db.ts                   # better-sqlite3 singleton + helpers
    │   ├── auth.ts                 # Cookie sessions, getCurrentUser, requireLogin, flash, setFlash
    │   ├── utils.ts                # timeAgo, photoUrl, isFriend, canView, friendCount, etc.
    │   ├── schema.sql              # SQLite schema (translated from MySQL)
    │   └── seed.ts                 # Database seeder (runs with bun:sqlite)
    └── components/
        ├── Header.tsx              # Blue nav bar + search (server component)
        ├── Footer.tsx              # Footer (server component)
        ├── FlashMessage.tsx        # Flash message display (client component)
        └── BrowseSelect.tsx        # Auto-submit dropdown (client component)
```

## Route Map

| Route | Auth | PHP Equivalent |
|---|---|---|
| `/` | No | `index.php` |
| `/register` | No | `register.php` |
| `/home` | Yes | `home.php` |
| `/profile/[id]` | Yes | `profile.php?id=N` |
| `/edit-profile` | Yes | `editprofile.php` |
| `/edit-photo` | Yes | `editphoto.php` |
| `/friends` | Yes | `friends.php` |
| `/friend-requests` | Yes | `friendrequests.php` |
| `/search` | Yes | `search.php` |
| `/browse` | Yes | `browse.php` |
| `/privacy` | Yes | `privacy.php` |
| `/about` | No | `about.php` |
| `POST /api/logout` | — | `logout.php` |

## Commands

| Command | Description |
|---|---|
| `bun install` | Install dependencies |
| `bun run seed` | Create + seed SQLite database |
| `bun run dev` | Start dev server (Turbopack, http://localhost:3000) |
| `bun run build` | Production build |
| `bun run start` | Start production server |

## Config

- **Session secret:** `SESSION_SECRET` env var (defaults to a dev-only key)
- **Photo uploads:** Written to `public/images/uploads/` (works in dev, not ideal for production)
- **DB path:** `data/facebook.db` (gitignored)
- **`next.config.ts`:** `serverExternalPackages: ['better-sqlite3']` required for native module
