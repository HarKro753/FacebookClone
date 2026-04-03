<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$me = current_user();
$page_title = 'My Friends';

$friends = db_fetch_all(
    "SELECT u.id, u.first_name, u.last_name, u.photo, u.concentration, u.class_year, h.name AS house_name
     FROM users u
     LEFT JOIN houses h ON u.house_id = h.id
     JOIN friends f ON ((f.requester_id = u.id AND f.requested_id = ?) OR (f.requested_id = u.id AND f.requester_id = ?))
     WHERE f.status = 'accepted'
     ORDER BY u.last_name, u.first_name",
    'ii',
    [$me['id'], $me['id']]
);

$pending_count = pending_request_count($me['id']);

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-box">
    <h2>My Friends (<?php echo count($friends); ?>)</h2>

    <?php if ($pending_count > 0): ?>
        <p style="margin-bottom: 10px;"><a href="friendrequests.php"><b><?php echo $pending_count; ?> pending friend request<?php echo $pending_count > 1 ? 's' : ''; ?></b></a></p>
    <?php endif; ?>

    <?php if ($friends): ?>
        <div class="friend-grid">
            <?php foreach ($friends as $friend): ?>
                <div class="friend-card">
                    <a href="profile.php?id=<?php echo $friend['id']; ?>">
                        <img src="<?php echo photo_url($friend['photo']); ?>" alt="">
                    </a>
                    <div class="friend-name">
                        <a href="profile.php?id=<?php echo $friend['id']; ?>"><?php echo h($friend['first_name'] . ' ' . $friend['last_name']); ?></a>
                    </div>
                    <?php if ($friend['house_name']): ?>
                        <div style="font-size: 10px; color: #666;"><?php echo h($friend['house_name']); ?></div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php else: ?>
        <p>You don't have any friends yet. <a href="search.php">Find people</a> to connect with.</p>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
