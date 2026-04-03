<?php
require_once __DIR__ . '/db.php';

/**
 * Sanitize output for HTML
 */
function h($string) {
    return htmlspecialchars($string ?? '', ENT_QUOTES, 'UTF-8');
}

/**
 * Redirect to a URL
 */
function redirect($url) {
    header('Location: ' . $url);
    exit;
}

/**
 * Format a timestamp as relative time
 */
function time_ago($datetime) {
    $time = strtotime($datetime);
    $diff = time() - $time;

    if ($diff < 60) return 'just now';
    if ($diff < 3600) return floor($diff / 60) . ' minute' . (floor($diff / 60) > 1 ? 's' : '') . ' ago';
    if ($diff < 86400) return floor($diff / 3600) . ' hour' . (floor($diff / 3600) > 1 ? 's' : '') . ' ago';
    if ($diff < 604800) return floor($diff / 86400) . ' day' . (floor($diff / 86400) > 1 ? 's' : '') . ' ago';

    return date('F j, Y', $time);
}

/**
 * Check if two users are friends
 */
function is_friend($user_id_1, $user_id_2) {
    if ($user_id_1 == $user_id_2) return true;
    $row = db_fetch_one(
        "SELECT id FROM friends WHERE status = 'accepted' AND
         ((requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?))",
        'iiii',
        [$user_id_1, $user_id_2, $user_id_2, $user_id_1]
    );
    return $row !== null;
}

/**
 * Get friendship status between two users
 * Returns: null, 'pending_sent', 'pending_received', 'accepted', 'rejected'
 */
function friendship_status($user_id, $other_id) {
    if ($user_id == $other_id) return 'self';

    $row = db_fetch_one(
        "SELECT requester_id, status FROM friends WHERE
         (requester_id = ? AND requested_id = ?) OR (requester_id = ? AND requested_id = ?)",
        'iiii',
        [$user_id, $other_id, $other_id, $user_id]
    );

    if (!$row) return null;
    if ($row['status'] === 'accepted') return 'accepted';
    if ($row['status'] === 'rejected') return 'rejected';
    if ($row['status'] === 'pending') {
        return ($row['requester_id'] == $user_id) ? 'pending_sent' : 'pending_received';
    }
    return null;
}

/**
 * Check if a viewer can see a specific field of a profile
 */
function can_view($profile_user_id, $viewer_id, $field) {
    if ($profile_user_id == $viewer_id) return true;

    $settings = db_fetch_one(
        "SELECT * FROM privacy_settings WHERE user_id = ?",
        'i',
        [$profile_user_id]
    );

    // Default: friends only if no settings exist
    if (!$settings) {
        return is_friend($profile_user_id, $viewer_id);
    }

    $column = 'show_' . $field;
    if ($field === 'wall_posts' || $field === 'pokes') {
        $column = 'allow_' . $field;
    }

    if (!isset($settings[$column])) {
        return is_friend($profile_user_id, $viewer_id);
    }

    $visibility = $settings[$column];

    if ($visibility === 'everyone') return true;
    if ($visibility === 'nobody') return false;
    if ($visibility === 'friends') return is_friend($profile_user_id, $viewer_id);

    return false;
}

/**
 * Get friend count for a user
 */
function friend_count($user_id) {
    $row = db_fetch_one(
        "SELECT COUNT(*) AS cnt FROM friends WHERE status = 'accepted' AND (requester_id = ? OR requested_id = ?)",
        'ii',
        [$user_id, $user_id]
    );
    return $row ? (int)$row['cnt'] : 0;
}

/**
 * Get pending friend request count for a user
 */
function pending_request_count($user_id) {
    $row = db_fetch_one(
        "SELECT COUNT(*) AS cnt FROM friends WHERE status = 'pending' AND requested_id = ?",
        'i',
        [$user_id]
    );
    return $row ? (int)$row['cnt'] : 0;
}

/**
 * Get unseen poke count
 */
function unseen_poke_count($user_id) {
    $row = db_fetch_one(
        "SELECT COUNT(*) AS cnt FROM pokes WHERE poked_id = ? AND seen = 0",
        'i',
        [$user_id]
    );
    return $row ? (int)$row['cnt'] : 0;
}

/**
 * Get photo URL for a user
 */
function photo_url($photo) {
    if (!$photo || $photo === 'default_photo.jpg') {
        return 'images/default_photo.svg';
    }
    return 'images/uploads/' . $photo;
}

/**
 * Set a flash message
 */
function set_flash($type, $message) {
    init_session();
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

/**
 * Get and clear flash message
 */
function get_flash() {
    init_session();
    if (isset($_SESSION['flash'])) {
        $flash = $_SESSION['flash'];
        unset($_SESSION['flash']);
        return $flash;
    }
    return null;
}
