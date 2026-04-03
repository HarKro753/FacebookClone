<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$user = current_user();
$page_title = 'Home';

// Get unseen pokes
$pokes = db_fetch_all(
    "SELECT p.*, u.first_name, u.last_name FROM pokes p
     JOIN users u ON p.poker_id = u.id
     WHERE p.poked_id = ? AND p.seen = 0
     ORDER BY p.created_at DESC",
    'i',
    [$user['id']]
);

// Get pending friend requests
$requests = db_fetch_all(
    "SELECT f.*, u.first_name, u.last_name, u.photo FROM friends f
     JOIN users u ON f.requester_id = u.id
     WHERE f.requested_id = ? AND f.status = 'pending'
     ORDER BY f.created_at DESC LIMIT 5",
    'i',
    [$user['id']]
);

// Get recent wall posts on own profile
$wall_posts = db_fetch_all(
    "SELECT w.*, u.first_name, u.last_name FROM wall_posts w
     JOIN users u ON w.author_id = u.id
     WHERE w.profile_id = ?
     ORDER BY w.created_at DESC LIMIT 10",
    'i',
    [$user['id']]
);

// Get friend count
$num_friends = friend_count($user['id']);

// Get some friends for sidebar
$friends_list = db_fetch_all(
    "SELECT u.id, u.first_name, u.last_name, u.photo FROM users u
     JOIN friends f ON ((f.requester_id = u.id AND f.requested_id = ?) OR (f.requested_id = u.id AND f.requester_id = ?))
     WHERE f.status = 'accepted'
     ORDER BY RAND() LIMIT 9",
    'ii',
    [$user['id'], $user['id']]
);

require_once __DIR__ . '/includes/header.php';
?>

<div id="home-left">
    <?php if ($pokes): ?>
    <div class="home-section">
        <h3>Pokes</h3>
        <div class="home-section-content">
            <?php foreach ($pokes as $poke): ?>
                <div class="poke-item">
                    <a href="profile.php?id=<?php echo $poke['poker_id']; ?>"><?php echo h($poke['first_name'] . ' ' . $poke['last_name']); ?></a> poked you.
                    <form method="post" action="poke.php" style="display:inline;">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="user_id" value="<?php echo $poke['poker_id']; ?>">
                        <input type="submit" value="Poke Back">
                    </form>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
    <?php endif; ?>

    <?php if ($requests): ?>
    <div class="home-section">
        <h3>Friend Requests</h3>
        <div class="home-section-content">
            <?php foreach ($requests as $req): ?>
                <div class="request-item">
                    <img src="<?php echo photo_url($req['photo']); ?>" alt="">
                    <div class="request-info">
                        <a href="profile.php?id=<?php echo $req['requester_id']; ?>"><?php echo h($req['first_name'] . ' ' . $req['last_name']); ?></a>
                        <div class="request-actions">
                            <form method="post" action="friendaction.php" style="display:inline;">
                                <?php echo csrf_field(); ?>
                                <input type="hidden" name="user_id" value="<?php echo $req['requester_id']; ?>">
                                <input type="hidden" name="action" value="accept">
                                <input type="submit" value="Confirm">
                            </form>
                            <form method="post" action="friendaction.php" style="display:inline;">
                                <?php echo csrf_field(); ?>
                                <input type="hidden" name="user_id" value="<?php echo $req['requester_id']; ?>">
                                <input type="hidden" name="action" value="reject">
                                <input type="submit" value="Reject">
                            </form>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
            <?php if (pending_request_count($user['id']) > 5): ?>
                <p><a href="friendrequests.php">See all requests</a></p>
            <?php endif; ?>
        </div>
    </div>
    <?php endif; ?>

    <div class="home-section">
        <h3>My Wall</h3>
        <div class="home-section-content">
            <?php if ($wall_posts): ?>
                <?php foreach ($wall_posts as $post): ?>
                    <div class="wall-post">
                        <span class="wall-author"><a href="profile.php?id=<?php echo $post['author_id']; ?>"><?php echo h($post['first_name'] . ' ' . $post['last_name']); ?></a></span>
                        <span class="wall-time"><?php echo time_ago($post['created_at']); ?></span>
                        <div class="wall-body"><?php echo nl2br(h($post['body'])); ?></div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <p>No wall posts yet.</p>
            <?php endif; ?>
        </div>
    </div>
</div>

<div id="home-right">
    <div class="home-section">
        <h3>My Profile</h3>
        <div class="home-section-content" style="text-align: center;">
            <a href="profile.php?id=<?php echo $user['id']; ?>">
                <img src="<?php echo photo_url($user['photo']); ?>" alt="" style="width: 100px; border: 1px solid #999;">
            </a>
            <p style="margin-top: 5px;"><b><?php echo h($user['first_name'] . ' ' . $user['last_name']); ?></b></p>
            <p><a href="editprofile.php">Edit My Profile</a></p>
            <p><a href="editphoto.php">Change Photo</a></p>
        </div>
    </div>

    <div class="home-section">
        <h3>My Friends (<?php echo $num_friends; ?>)</h3>
        <div class="home-section-content">
            <?php if ($friends_list): ?>
                <div class="friend-grid">
                    <?php foreach ($friends_list as $friend): ?>
                        <div class="friend-card" style="width: 65px; margin: 3px;">
                            <a href="profile.php?id=<?php echo $friend['id']; ?>">
                                <img src="<?php echo photo_url($friend['photo']); ?>" alt="" style="width: 50px; height: 50px;">
                            </a>
                            <div class="friend-name" style="font-size: 10px;">
                                <a href="profile.php?id=<?php echo $friend['id']; ?>"><?php echo h($friend['first_name']); ?></a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
                <p><a href="friends.php">See All Friends</a></p>
            <?php else: ?>
                <p>You haven't added any friends yet. <a href="search.php">Find people</a>.</p>
            <?php endif; ?>
        </div>
    </div>
</div>

<div style="clear: both;"></div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
