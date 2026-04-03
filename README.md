<p align="center">
  <img src="https://img.shields.io/badge/Year-2004-3b5998?style=for-the-badge" alt="2004">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

<h1 align="center">[ thefacebook ]</h1>

<p align="center">
  <b>A pixel-perfect recreation of the original thefacebook.com (February 2004)</b><br>
  The Harvard-only social network that started it all.
</p>

---

On February 4, 2004, Mark Zuckerberg launched thefacebook.com from his dorm room in Kirkland House. Within 24 hours, over 1,200 Harvard students had signed up. You needed a `harvard.edu` email. There was no news feed — just profiles, a wall, friend requests, and pokes. The whole thing ran on PHP and MySQL.

This project recreates that original MVP as faithfully as possible — the blue header, the 760px fixed-width layout, the `Lucida Grande` at 11px, the table-based forms, the full-page POST/redirect flows. No border-radius. No CSS3. No JavaScript (well, almost).

Then it rebuilds the exact same thing in Next.js, so you can compare how the same app looks when built with a 2004 stack versus a 2024 stack.

## The Two Versions

```
FacebookClone/
├── lamp/       ← PHP 8 + MySQL (the authentic stack)
└── nextjs/     ← Next.js 15 + SQLite (the modern stack)
```

Both versions are **visually identical** — same CSS, same HTML structure, same 20 mock Harvard students, same everything. The only difference is what's under the hood.

| | LAMP | Next.js |
|---|---|---|
| Language | Raw PHP | TypeScript |
| Database | MySQL | SQLite |
| Templates | PHP + HTML | React Server Components |
| Forms | `<form action="wall.php">` | `<form action={serverAction}>` |
| Auth | `$_SESSION` | Signed cookie |
| Routing | `profile.php?id=3` | `/profile/3` |
| JS on the page | Zero | One dropdown handler |
| Package manager | N/A | Bun |

## What's Inside

- **Profiles** with photo, bio, interests, favorite music/movies/books, political views, relationship status
- **The Wall** — write on your friends' profiles
- **Friend requests** — send, accept, reject, remove
- **Pokes** — the feature nobody understood but everyone used
- **Search** by name, **browse** by Harvard house, class year, or course
- **Privacy controls** — per-field visibility (everyone / friends only / nobody)
- **20 pre-loaded students** across all four class years, 12 houses, and 20 real Spring 2004 courses
- **AI-generated profile photos** (thispersondoesnotexist.com)

## Quick Start

### LAMP version

```bash
cd lamp
php admin/setup.php
php -S localhost:8080
```

### Next.js version

```bash
cd nextjs
bun install
bun run seed
bun run dev
```

Login to either with `mark.e@harvard.edu` / `harvard2004`.

See each version's README for full setup details.

---

<p align="center">
  <i>a Mark Zuckerberg production</i><br>
  <sub>&copy; 2004 thefacebook — Educational recreation, not affiliated with Meta Platforms, Inc.</sub>
</p>
