# lamp/

LAMP-stack implementation of thefacebook.com (2004). Raw PHP 8, MySQL, zero frameworks, zero JavaScript.

## Prerequisites

- **PHP 8.x** with `mysqli` and `fileinfo` extensions
- **MySQL 5.7+** or **9.x**

```bash
# macOS
brew install php mysql
brew services start mysql
```

## Setup

```bash
# 1. Initialize database (creates facebook_clone DB, all tables, 20 mock users)
php admin/setup.php

# 2. Start dev server
php -S localhost:8080

# 3. Open http://localhost:8080
```

## Demo Accounts

Password for all: **`harvard2004`**

| Email | Name | House | Year |
|---|---|---|---|
| `mark.e@harvard.edu` | Mark Ellison | Kirkland | '06 |
| `priya.s@harvard.edu` | Priya Shankar | Eliot | '05 |
| `tyler.w@harvard.edu` | Tyler Whitfield | Adams | '04 |
| `jessica.m@harvard.edu` | Jessica Morrison | Lowell | '06 |
| `david.k@harvard.edu` | David Kim | Dunster | '05 |

...and 15 more with profiles, friendships, wall posts, and pokes pre-loaded.

## Database

MySQL with 9 tables. Credentials in `includes/config.php`:

```php
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'facebook_clone');
```

### Schema

| Table | Purpose |
|---|---|
| `users` | Profiles (20+ fields: name, email, bio, interests, house, class year, etc.) |
| `houses` | 26 Harvard houses and freshman dorms |
| `courses` | 20 real Spring 2004 courses with professors |
| `user_courses` | Many-to-many enrollment |
| `friends` | Friend requests/relationships (pending/accepted/rejected) |
| `wall_posts` | Messages on profile walls |
| `pokes` | Poke tracking with seen/unseen |
| `privacy_settings` | Per-field visibility (everyone/friends/nobody) |
| `sessions` | Optional DB-backed sessions |

SQL files are in `sql/` and run in order by `admin/setup.php`:

```
sql/001_schema.sql       # CREATE TABLE statements
sql/002_seed_data.sql    # Houses + courses
sql/003_indexes.sql      # FULLTEXT + performance indexes
sql/004_mock_users.sql   # 20 fictional Harvard students
sql/005_mock_social.sql  # Friendships, wall posts, pokes, enrollments, privacy
```

## Project Structure

```
lamp/
├── index.php            # Landing page + login form
├── register.php         # Registration (harvard.edu / gmail.com only)
├── login.php            # Redirect to index
├── logout.php           # Session destroy + redirect
├── home.php             # Dashboard: pokes, friend requests, wall, friends sidebar
├── profile.php          # Full profile view (most complex page)
├── editprofile.php      # Edit all profile fields + course enrollment
├── editphoto.php        # Photo upload (JPEG/PNG/GIF, 2MB max, MIME validated)
├── wall.php             # POST handler: write on a wall
├── poke.php             # POST handler: poke/poke back
├── friendaction.php     # POST handler: add/accept/reject/remove friend
├── friends.php          # Friends list grid
├── friendrequests.php   # Pending incoming requests
├── search.php           # Name search (FULLTEXT + LIKE fallback)
├── browse.php           # Filter by house, class year, or course
├── privacy.php          # Per-field privacy settings
├── about.php            # Static about page
│
├── includes/
│   ├── config.php       # DB credentials, site name, upload path, email regex
│   ├── db.php           # mysqli singleton + db_query/db_fetch_all/db_fetch_one/db_execute/db_insert
│   ├── auth.php         # init_session, current_user, require_login, login_user, logout_user, csrf_token/field/verify
│   ├── functions.php    # h() (htmlspecialchars), redirect(), time_ago(), is_friend(), friendship_status(),
│   │                    #   can_view(), friend_count(), pending_request_count(), unseen_poke_count(),
│   │                    #   photo_url(), set_flash(), get_flash()
│   ├── header.php       # HTML head + blue nav bar + search form + flash message
│   └── footer.php       # Footer + closing tags
│
├── css/style.css        # Complete 2004-era stylesheet (583 lines, no CSS3)
├── images/
│   ├── default_photo.jpg
│   ├── default_photo.svg
│   └── uploads/         # User-uploaded photos (+ 20 mock user photos)
│
├── sql/                 # Schema, seeds, indexes (see above)
├── admin/setup.php      # One-click DB initialization
└── .htaccess            # Blocks direct access to includes/ and sql/
```

## Security

This is a 2004 recreation, but it uses modern security where it matters:

- **`password_hash()` / `password_verify()`** — bcrypt passwords (the one deliberate anachronism)
- **Prepared statements** everywhere via `mysqli` — no SQL injection
- **CSRF tokens** on every POST form
- **`htmlspecialchars()`** on all output — no XSS
- **`.htaccess`** blocks `includes/` and `sql/`
- **MIME validation** on photo uploads via `finfo`
- **2MB file size limit** enforced server-side

## Commands

| Command | Description |
|---|---|
| `php admin/setup.php` | Create database, tables, indexes, seed data |
| `php -S localhost:8080` | Start development server |
| `mysql -u root facebook_clone` | Open MySQL shell |
