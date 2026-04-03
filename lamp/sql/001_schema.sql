-- thefacebook.com Clone - Database Schema
-- 9 tables total

CREATE DATABASE IF NOT EXISTS facebook_clone CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE facebook_clone;

-- Harvard houses/dorms
CREATE TABLE houses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Course catalog
CREATE TABLE courses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL,
    title VARCHAR(255) NOT NULL,
    professor VARCHAR(255) DEFAULT NULL,
    semester VARCHAR(20) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Core user data
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    sex ENUM('Male','Female') DEFAULT NULL,
    birthday DATE DEFAULT NULL,
    phone VARCHAR(30) DEFAULT NULL,
    photo VARCHAR(255) DEFAULT 'default_photo.jpg',
    relationship_status VARCHAR(50) DEFAULT NULL,
    interested_in VARCHAR(50) DEFAULT NULL,
    interests TEXT DEFAULT NULL,
    favorite_music TEXT DEFAULT NULL,
    favorite_movies TEXT DEFAULT NULL,
    favorite_books TEXT DEFAULT NULL,
    favorite_quotes TEXT DEFAULT NULL,
    about_me TEXT DEFAULT NULL,
    house_id INT UNSIGNED DEFAULT NULL,
    class_year SMALLINT UNSIGNED DEFAULT NULL,
    concentration VARCHAR(255) DEFAULT NULL,
    political_views VARCHAR(100) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (house_id) REFERENCES houses(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Many-to-many: users <-> courses
CREATE TABLE user_courses (
    user_id INT UNSIGNED NOT NULL,
    course_id INT UNSIGNED NOT NULL,
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Friend requests/relationships
CREATE TABLE friends (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    requester_id INT UNSIGNED NOT NULL,
    requested_id INT UNSIGNED NOT NULL,
    status ENUM('pending','accepted','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_friendship (requester_id, requested_id),
    FOREIGN KEY (requester_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (requested_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Wall posts
CREATE TABLE wall_posts (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    profile_id INT UNSIGNED NOT NULL,
    author_id INT UNSIGNED NOT NULL,
    body TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (profile_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Poke tracking
CREATE TABLE pokes (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    poker_id INT UNSIGNED NOT NULL,
    poked_id INT UNSIGNED NOT NULL,
    seen TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_poke (poker_id, poked_id),
    FOREIGN KEY (poker_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (poked_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Per-user privacy controls
CREATE TABLE privacy_settings (
    user_id INT UNSIGNED NOT NULL PRIMARY KEY,
    show_email ENUM('everyone','friends','nobody') DEFAULT 'friends',
    show_phone ENUM('everyone','friends','nobody') DEFAULT 'friends',
    show_birthday ENUM('everyone','friends','nobody') DEFAULT 'friends',
    show_courses ENUM('everyone','friends','nobody') DEFAULT 'everyone',
    show_interests ENUM('everyone','friends','nobody') DEFAULT 'everyone',
    show_wall ENUM('everyone','friends','nobody') DEFAULT 'friends',
    allow_wall_posts ENUM('everyone','friends','nobody') DEFAULT 'friends',
    allow_pokes ENUM('everyone','friends','nobody') DEFAULT 'everyone',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Optional DB-backed sessions
CREATE TABLE sessions (
    id VARCHAR(128) NOT NULL PRIMARY KEY,
    user_id INT UNSIGNED DEFAULT NULL,
    data TEXT,
    last_activity INT UNSIGNED NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;
