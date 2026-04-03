<?php
// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'facebook_clone');

// Site configuration
define('SITE_NAME', '[ thefacebook ]');
define('SITE_URL', 'http://localhost:8080');
define('UPLOAD_DIR', __DIR__ . '/../images/uploads/');
define('MAX_PHOTO_SIZE', 2 * 1024 * 1024); // 2MB

// Session configuration
define('SESSION_LIFETIME', 86400); // 24 hours

// Email validation pattern (harvard.edu and gmail.com)
define('ALLOWED_EMAIL_PATTERN', '/^[a-zA-Z0-9._%+-]+@(([a-zA-Z0-9.-]+\.)?harvard\.edu|gmail\.com)$/i');
