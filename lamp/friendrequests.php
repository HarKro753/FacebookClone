<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$me = current_user();
$page_title = 'Friend Requests';

$requests = db_fetch_all(
    "SELECT f.*, u.first_name, u.last_name, u.photo, u.class_year, h.name AS house_name
     FROM friends f
     JOIN users u ON f.requester_id = u.id
     LEFT JOIN houses h ON u.house_id = h.id
     WHERE f.requested_id = ? AND f.status = 'pending'
     ORDER BY f.created_at DESC",
    'i',
    [$me['id']]
);

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-box">
    <h2>Friend Requests (<?php echo count($requests); ?>)</h2>

    <?php if ($requests): ?>
        <?php foreach ($requests as $req): ?>
            <div class="request-item">
                <img src="<?php echo photo_url($req['photo']); ?>" alt="">
                <div class="request-info">
                    <div>
                        <a href="profile.php?id=<?php echo $req['requester_id']; ?>"><b><?php echo h($req['first_name'] . ' ' . $req['last_name']); ?></b></a>
                        <?php if ($req['house_name']): ?>
                            — <?php echo h($req['house_name']); ?>
                        <?php endif; ?>
                        <?php if ($req['class_year']): ?>
                            '<?php echo substr($req['class_year'], -2); ?>
                        <?php endif; ?>
                    </div>
                    <div class="request-actions">
                        <form method="post" action="friendaction.php" style="display:inline;">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="user_id" value="<?php echo $req['requester_id']; ?>">
                            <input type="hidden" name="action" value="accept">
                            <input type="hidden" name="redirect" value="friendrequests.php">
                            <input type="submit" value="Confirm">
                        </form>
                        <form method="post" action="friendaction.php" style="display:inline;">
                            <?php echo csrf_field(); ?>
                            <input type="hidden" name="user_id" value="<?php echo $req['requester_id']; ?>">
                            <input type="hidden" name="action" value="reject">
                            <input type="hidden" name="redirect" value="friendrequests.php">
                            <input type="submit" value="Reject">
                        </form>
                    </div>
                    <div style="color: #999; font-size: 10px; margin-top: 3px;">
                        Sent <?php echo time_ago($req['created_at']); ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p>No pending friend requests.</p>
    <?php endif; ?>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
