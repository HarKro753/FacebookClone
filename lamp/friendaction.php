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
$action = $_POST['action'] ?? '';

if (!$other_id || $other_id == $me['id']) {
    redirect('home.php');
}

// Check user exists
$other = db_fetch_one("SELECT id, first_name, last_name FROM users WHERE id = ?", 'i', [$other_id]);
if (!$other) {
    set_flash('error', 'User not found.');
    redirect('home.php');
}

$redirect = $_POST['redirect'] ?? ('profile.php?id=' . $other_id);

switch ($action) {
    case 'add':
        // Check no existing request
        $existing = db_fetch_one(
            "SELECT id FROM friends WHERE (requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?)",
            'iiii',
            [$me['id'], $other_id, $other_id, $me['id']]
        );
        if (!$existing) {
            db_insert(
                "INSERT INTO friends (requester_id, requested_id, status) VALUES (?, ?, 'pending')",
                'ii',
                [$me['id'], $other_id]
            );
            set_flash('success', 'Friend request sent to ' . $other['first_name'] . '.');
        }
        break;

    case 'accept':
        db_execute(
            "UPDATE friends SET status = 'accepted' WHERE requester_id = ? AND requested_id = ? AND status = 'pending'",
            'ii',
            [$other_id, $me['id']]
        );
        set_flash('success', 'You are now friends with ' . $other['first_name'] . '.');
        break;

    case 'reject':
        db_execute(
            "UPDATE friends SET status = 'rejected' WHERE requester_id = ? AND requested_id = ? AND status = 'pending'",
            'ii',
            [$other_id, $me['id']]
        );
        set_flash('info', 'Friend request rejected.');
        break;

    case 'remove':
        db_execute(
            "DELETE FROM friends WHERE (requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?)",
            'iiii',
            [$me['id'], $other_id, $other_id, $me['id']]
        );
        set_flash('info', 'Removed from friends.');
        break;
}

redirect($redirect);
