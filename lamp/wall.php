<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$me = current_user();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    redirect('home.php');
}

if (!verify_csrf()) {
    set_flash('error', 'Invalid form submission.');
    redirect('home.php');
}

$profile_id = (int)($_POST['profile_id'] ?? 0);
$body = trim($_POST['body'] ?? '');

if (!$profile_id || !$body) {
    set_flash('error', 'Please write something.');
    redirect('profile.php?id=' . $profile_id);
}

// Check profile exists
$profile = db_fetch_one("SELECT id FROM users WHERE id = ?", 'i', [$profile_id]);
if (!$profile) {
    set_flash('error', 'User not found.');
    redirect('home.php');
}

// Check permission
$is_own = ($me['id'] == $profile_id);
if (!$is_own && !can_view($profile_id, $me['id'], 'wall_posts')) {
    set_flash('error', 'You cannot post on this wall.');
    redirect('profile.php?id=' . $profile_id);
}

db_insert(
    "INSERT INTO wall_posts (profile_id, author_id, body) VALUES (?, ?, ?)",
    'iis',
    [$profile_id, $me['id'], $body]
);

set_flash('success', 'Wall post added.');
redirect('profile.php?id=' . $profile_id);
