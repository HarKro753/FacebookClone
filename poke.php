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

$other_id = (int)($_POST['user_id'] ?? 0);

if (!$other_id || $other_id == $me['id']) {
    redirect('home.php');
}

$other = db_fetch_one("SELECT id, first_name FROM users WHERE id = ?", 'i', [$other_id]);
if (!$other) {
    set_flash('error', 'User not found.');
    redirect('home.php');
}

// Check poke permission
if (!can_view($other_id, $me['id'], 'pokes')) {
    set_flash('error', 'You cannot poke this person.');
    redirect('profile.php?id=' . $other_id);
}

// Mark any existing poke from them as seen
db_execute(
    "UPDATE pokes SET seen = 1 WHERE poker_id = ? AND poked_id = ?",
    'ii',
    [$other_id, $me['id']]
);

// Upsert poke (INSERT or UPDATE to reset seen/timestamp)
$existing = db_fetch_one(
    "SELECT id FROM pokes WHERE poker_id = ? AND poked_id = ?",
    'ii',
    [$me['id'], $other_id]
);

if ($existing) {
    db_execute(
        "UPDATE pokes SET seen = 0, created_at = CURRENT_TIMESTAMP WHERE poker_id = ? AND poked_id = ?",
        'ii',
        [$me['id'], $other_id]
    );
} else {
    db_insert(
        "INSERT INTO pokes (poker_id, poked_id) VALUES (?, ?)",
        'ii',
        [$me['id'], $other_id]
    );
}

set_flash('success', 'You poked ' . $other['first_name'] . '!');
redirect('profile.php?id=' . $other_id);
