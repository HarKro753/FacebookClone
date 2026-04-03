<?php
require_once __DIR__ . '/db.php';

/**
 * Start session if not started
 */
function init_session() {
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

/**
 * Get current logged-in user data, or null
 */
function current_user() {
    init_session();
    if (!isset($_SESSION['user_id'])) {
        return null;
    }
    static $user = null;
    if ($user === null) {
        $user = db_fetch_one(
            "SELECT u.*, h.name AS house_name FROM users u LEFT JOIN houses h ON u.house_id = h.id WHERE u.id = ?",
            'i',
            [$_SESSION['user_id']]
        );
        if (!$user) {
            // User no longer exists
            session_destroy();
            return null;
        }
    }
    return $user;
}

/**
 * Require login — redirect to index if not logged in
 */
function require_login() {
    init_session();
    if (!isset($_SESSION['user_id'])) {
        header('Location: index.php');
        exit;
    }
}

/**
 * Log in a user by setting session
 */
function login_user($user_id) {
    init_session();
    session_regenerate_id(true);
    $_SESSION['user_id'] = $user_id;
}

/**
 * Log out current user
 */
function logout_user() {
    init_session();
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    session_destroy();
}

/**
 * Generate CSRF token
 */
function csrf_token() {
    init_session();
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Generate hidden CSRF input field
 */
function csrf_field() {
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}

/**
 * Verify CSRF token from POST
 */
function verify_csrf() {
    init_session();
    if (!isset($_POST['csrf_token']) || !isset($_SESSION['csrf_token'])) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $_POST['csrf_token']);
}
