<p align="center">
  <img src="https://img.shields.io/badge/PHP-8.x-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/MySQL-9.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Year-2004-3b5998?style=for-the-badge" alt="2004">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
</p>

<h1 align="center">[ thefacebook ]</h1>

<p align="center">
  <b>A pixel-perfect recreation of the original thefacebook.com (February 2004)</b><br>
  The Harvard-only social network that started it all — rebuilt with the LAMP stack.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/No_Frameworks-Pure_PHP-blue?style=flat-square" alt="No Frameworks">
  <img src="https://img.shields.io/badge/No_JavaScript-Full_Page_Reloads-blue?style=flat-square" alt="No JS">
  <img src="https://img.shields.io/badge/760px_Fixed_Width-1024x768_Era-blue?style=flat-square" alt="760px">
  <img src="https://img.shields.io/badge/CSS-No_Border_Radius-blue?style=flat-square" alt="No CSS3">
</p>

---

## About

This is a faithful clone of Mark Zuckerberg's original **thefacebook.com** MVP — the Harvard-only social network launched on February 4, 2004. Built entirely with raw PHP and MySQL (no frameworks, no JavaScript), it captures the look, feel, and functionality of early-2000s web development.

### Features

- **Profiles** — Photo, bio, interests, favorite music/movies/books, political views, relationship status
- **The Wall** — Post messages on your friends' profiles
- **Friend Requests** — Send, accept, reject, and remove friends
- **Pokes** — The iconic poke feature with seen/unseen tracking
- **Search** — Find people by name (FULLTEXT search)
- **Browse** — Filter users by Harvard house, class year, or course
- **Privacy Settings** — Per-field visibility controls (everyone / friends only / no one)
- **Course Directory** — 20 real Spring 2004 Harvard courses with professors
- **Harvard Houses** — All 26 houses and freshman dorms

### Design Authenticity

Every design choice mirrors the 2004 original:

| Element           | Implementation                                                      |
| ----------------- | ------------------------------------------------------------------- |
| **Color Palette** | `#3b5998` blue header, `#d8dfea` accents, `#eef0f5` page background |
| **Typography**    | `Lucida Grande, Tahoma, Verdana, Arial` at 11px                     |
| **Layout**        | 760px fixed-width, float-based, table forms                         |
| **CSS**           | No `border-radius`, no CSS3 — period-authentic                      |
| **Interactions**  | Full-page POST/redirect — zero JavaScript                           |

---

## Quick Start

### Prerequisites

- **PHP 8.x** with `mysqli` and `gd` extensions
- **MySQL 5.7+** or **9.x**

#### Install on macOS (Homebrew)

```bash
brew install php mysql
brew services start mysql
```

### Setup

**1. Clone the repository**

```bash
git clone https://github.com/YOUR_USERNAME/FacebookClone.git
cd FacebookClone
```

**2. Initialize the database**

This creates the `facebook_clone` database, all 9 tables, Harvard houses, and sample courses:

```bash
php admin/setup.php
```

**3. Start the server**

```bash
php -S localhost:8080
```

**4. Open in your browser**

```
http://localhost:8080
```

> Register with any `@harvard.edu` email address (e.g., `mark@harvard.edu`).

---

## Project Structure

```
FacebookClone/
├── index.php                  # Landing page + login
├── register.php               # Registration (harvard.edu only)
├── login.php                  # Login handler
├── logout.php                 # Session destroy
├── home.php                   # Dashboard (pokes, wall, friends)
├── profile.php                # User profile view
├── editprofile.php            # Edit profile fields + courses
├── editphoto.php              # Upload profile photo
├── wall.php                   # Wall post handler
├── search.php                 # Search users by name
├── friends.php                # Friends list
├── friendrequests.php         # Pending friend requests
├── friendaction.php           # Add/accept/reject/remove
├── poke.php                   # Poke handler
├── browse.php                 # Browse by house/course/year
├── privacy.php                # Privacy settings
├── about.php                  # About page
│
├── includes/
│   ├── config.php             # DB credentials + constants
│   ├── db.php                 # mysqli connection + query helpers
│   ├── auth.php               # Sessions, CSRF, login/logout
│   ├── functions.php          # Utilities (sanitize, time_ago, etc.)
│   ├── header.php             # Blue nav bar + search
│   └── footer.php             # Footer
│
├── sql/
│   ├── 001_schema.sql         # 9 CREATE TABLE statements
│   ├── 002_seed_data.sql      # Harvard houses + courses
│   └── 003_indexes.sql        # FULLTEXT + performance indexes
│
├── css/
│   └── style.css              # Complete 2004-era stylesheet
│
├── images/
│   ├── default_photo.jpg      # Default profile silhouette
│   └── uploads/               # User-uploaded photos
│
├── admin/
│   └── setup.php              # One-click DB initialization
│
└── .htaccess                  # Security: blocks includes/ and sql/
```

---

## Database Schema

9 tables powering the social network:

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│      users       │────▶│     friends       │◀────│      users       │
│                  │     │  (requester_id,   │     │                  │
│  id, email,      │     │   requested_id,   │     │                  │
│  name, photo,    │     │   status)         │     │                  │
│  house_id,       │     └──────────────────┘     └──────────────────┘
│  class_year,     │
│  concentration,  │     ┌──────────────────┐     ┌──────────────────┐
│  interests ...   │────▶│   wall_posts     │     │      pokes       │
│                  │     │  (profile_id,     │     │  (poker_id,      │
└────────┬─────────┘     │   author_id,      │     │   poked_id,      │
         │               │   body)           │     │   seen)          │
         │               └──────────────────┘     └──────────────────┘
         │
    ┌────┴────┐          ┌──────────────────┐     ┌──────────────────┐
    │         │          │  user_courses    │────▶│    courses       │
    ▼         ▼          │  (user_id,       │     │  (code, title,   │
┌────────┐ ┌─────────┐  │   course_id)     │     │   professor)     │
│ houses │ │privacy_  │  └──────────────────┘     └──────────────────┘
│        │ │settings  │
└────────┘ └──────────┘
```

---

## Configuration

Database credentials are in `includes/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'facebook_clone');
```

---

## Security

While this is a 2004-era recreation, it includes modern security practices where it matters:

- `password_hash()` / `password_verify()` for passwords (only deliberate anachronism)
- **Prepared statements** everywhere — no SQL injection
- **CSRF tokens** on every form
- **`htmlspecialchars()`** on all output — no XSS
- **`.htaccess`** blocks direct access to `includes/` and `sql/`
- **MIME validation** on photo uploads

---

## Command Reference

| Command                        | Description                       |
| ------------------------------ | --------------------------------- |
| `brew install php mysql`       | Install PHP and MySQL (macOS)     |
| `brew services start mysql`    | Start MySQL in the background     |
| `brew services stop mysql`     | Stop MySQL                        |
| `php admin/setup.php`          | Create database and seed data     |
| `php -S localhost:8080`        | **Start the development server**  |
| `mysql -u root`                | Open MySQL shell                  |
| `mysql -u root facebook_clone` | Open MySQL shell with DB selected |

---

## Testing Walkthrough

1. **Visit** `http://localhost:8080` — see the landing page
2. **Register** with a `@harvard.edu` email
3. **Edit profile** — add bio, interests, courses, house
4. **Upload a photo** via the change photo page
5. **Register a second user** in another browser/incognito
6. **Send a friend request** from one user to the other
7. **Accept the request** — they're now friends
8. **Write on each other's walls** and **poke** each other
9. **Search** for users and **browse** by house, year, or course
10. **Adjust privacy settings** — verify non-friends can't see restricted fields

---

## Tech Stack

| Layer          | Technology                       |
| -------------- | -------------------------------- |
| **Language**   | PHP 8.x (raw, no framework)      |
| **Database**   | MySQL 9.x with mysqli            |
| **Styling**    | Single CSS file, no preprocessor |
| **Server**     | PHP built-in server or Apache    |
| **JavaScript** | None. Zero. Zilch.               |

---

## Historical Context

On **February 4, 2004**, Mark Zuckerberg launched _thefacebook.com_ from his Harvard dorm room in Kirkland House. Within 24 hours, between 1,200 and 1,500 Harvard students had signed up. The site required a `harvard.edu` email to register and featured profiles, a "Wall" for messages, friend connections, and the infamous poke.

This project recreates that original MVP as closely as possible using the same technology stack (PHP + MySQL) that powered the real thing.

---

<p align="center">
  <i>a Mark Zuckerberg production</i><br>
  <sub>© 2004 thefacebook — Educational recreation, not affiliated with Meta Platforms, Inc.</sub>
</p>
