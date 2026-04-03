-- thefacebook.com Clone - SQLite Schema
-- Translated from MySQL for Next.js version

-- Harvard houses/dorms
CREATE TABLE IF NOT EXISTS houses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Course catalog
CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL,
    title TEXT NOT NULL,
    professor TEXT DEFAULT NULL,
    semester TEXT DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now'))
);

-- Core user data
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    sex TEXT CHECK(sex IN ('Male','Female')) DEFAULT NULL,
    birthday TEXT DEFAULT NULL,
    phone TEXT DEFAULT NULL,
    photo TEXT DEFAULT 'default_photo.jpg',
    relationship_status TEXT DEFAULT NULL,
    interested_in TEXT DEFAULT NULL,
    interests TEXT DEFAULT NULL,
    favorite_music TEXT DEFAULT NULL,
    favorite_movies TEXT DEFAULT NULL,
    favorite_books TEXT DEFAULT NULL,
    favorite_quotes TEXT DEFAULT NULL,
    about_me TEXT DEFAULT NULL,
    house_id INTEGER DEFAULT NULL,
    class_year INTEGER DEFAULT NULL,
    concentration TEXT DEFAULT NULL,
    political_views TEXT DEFAULT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE SET NULL
);

-- Many-to-many: users <-> courses
CREATE TABLE IF NOT EXISTS user_courses (
    user_id INTEGER NOT NULL,
    course_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Friend requests/relationships
CREATE TABLE IF NOT EXISTS friends (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    requester_id INTEGER NOT NULL,
    requested_id INTEGER NOT NULL,
    status TEXT CHECK(status IN ('pending','accepted','rejected')) DEFAULT 'pending',
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE (requester_id, requested_id),
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wall posts
CREATE TABLE IF NOT EXISTS wall_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    profile_id INTEGER NOT NULL,
    author_id INTEGER NOT NULL,
    body TEXT NOT NULL,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (profile_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Poke tracking
CREATE TABLE IF NOT EXISTS pokes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poker_id INTEGER NOT NULL,
    poked_id INTEGER NOT NULL,
    seen INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    UNIQUE (poker_id, poked_id),
    FOREIGN KEY (poker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poked_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Per-user privacy controls
CREATE TABLE IF NOT EXISTS privacy_settings (
    user_id INTEGER NOT NULL PRIMARY KEY,
    show_email TEXT CHECK(show_email IN ('everyone','friends','nobody')) DEFAULT 'friends',
    show_phone TEXT CHECK(show_phone IN ('everyone','friends','nobody')) DEFAULT 'friends',
    show_birthday TEXT CHECK(show_birthday IN ('everyone','friends','nobody')) DEFAULT 'friends',
    show_courses TEXT CHECK(show_courses IN ('everyone','friends','nobody')) DEFAULT 'everyone',
    show_interests TEXT CHECK(show_interests IN ('everyone','friends','nobody')) DEFAULT 'everyone',
    show_wall TEXT CHECK(show_wall IN ('everyone','friends','nobody')) DEFAULT 'friends',
    allow_wall_posts TEXT CHECK(allow_wall_posts IN ('everyone','friends','nobody')) DEFAULT 'friends',
    allow_pokes TEXT CHECK(allow_pokes IN ('everyone','friends','nobody')) DEFAULT 'everyone',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_friends_requested ON friends (requested_id, status);
CREATE INDEX IF NOT EXISTS idx_friends_requester ON friends (requester_id, status);
CREATE INDEX IF NOT EXISTS idx_wall_profile ON wall_posts (profile_id, created_at);
CREATE INDEX IF NOT EXISTS idx_pokes_poked ON pokes (poked_id, seen);
CREATE INDEX IF NOT EXISTS idx_courses_code ON courses (code);
CREATE INDEX IF NOT EXISTS idx_users_house ON users (house_id);
CREATE INDEX IF NOT EXISTS idx_users_year ON users (class_year);
