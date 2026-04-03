<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$me = current_user();
$profile_id = isset($_GET['id']) ? (int)$_GET['id'] : $me['id'];

// Get profile user
$profile = db_fetch_one(
    "SELECT u.*, h.name AS house_name FROM users u LEFT JOIN houses h ON u.house_id = h.id WHERE u.id = ?",
    'i',
    [$profile_id]
);

if (!$profile) {
    set_flash('error', 'User not found.');
    redirect('home.php');
}

$is_own = ($me['id'] == $profile_id);
$is_friend = is_friend($me['id'], $profile_id);
$f_status = friendship_status($me['id'], $profile_id);

$page_title = $profile['first_name'] . ' ' . $profile['last_name'];

// Get courses
$courses = [];
if ($is_own || can_view($profile_id, $me['id'], 'courses')) {
    $courses = db_fetch_all(
        "SELECT c.* FROM courses c JOIN user_courses uc ON c.id = uc.course_id WHERE uc.user_id = ? ORDER BY c.code",
        'i',
        [$profile_id]
    );
}

// Get wall posts
$wall_posts = [];
if ($is_own || can_view($profile_id, $me['id'], 'wall')) {
    $wall_posts = db_fetch_all(
        "SELECT w.*, u.first_name, u.last_name FROM wall_posts w
         JOIN users u ON w.author_id = u.id
         WHERE w.profile_id = ?
         ORDER BY w.created_at DESC LIMIT 20",
        'i',
        [$profile_id]
    );
}

// Can post on wall?
$can_post = $is_own || can_view($profile_id, $me['id'], 'wall_posts');

// Get friend count
$num_friends = friend_count($profile_id);

// Get some friends
$profile_friends = db_fetch_all(
    "SELECT u.id, u.first_name, u.last_name, u.photo FROM users u
     JOIN friends f ON ((f.requester_id = u.id AND f.requested_id = ?) OR (f.requested_id = u.id AND f.requester_id = ?))
     WHERE f.status = 'accepted'
     ORDER BY RAND() LIMIT 6",
    'ii',
    [$profile_id, $profile_id]
);

require_once __DIR__ . '/includes/header.php';
?>

<div id="profile">
    <div id="profile-left">
        <div id="profile-photo">
            <img src="<?php echo photo_url($profile['photo']); ?>" alt="<?php echo h($profile['first_name']); ?>">
        </div>

        <?php if ($is_own): ?>
            <div class="profile-actions">
                <a href="editprofile.php">Edit My Profile</a><br>
                <a href="editphoto.php">Change Photo</a>
            </div>
        <?php else: ?>
            <div class="profile-actions">
                <?php if ($f_status === null || $f_status === 'rejected'): ?>
                    <form method="post" action="friendaction.php">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="user_id" value="<?php echo $profile_id; ?>">
                        <input type="hidden" name="action" value="add">
                        <input type="submit" value="Add as Friend">
                    </form>
                <?php elseif ($f_status === 'pending_sent'): ?>
                    <p>Friend request sent.</p>
                <?php elseif ($f_status === 'pending_received'): ?>
                    <form method="post" action="friendaction.php" style="display:inline;">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="user_id" value="<?php echo $profile_id; ?>">
                        <input type="hidden" name="action" value="accept">
                        <input type="submit" value="Confirm Friend">
                    </form>
                <?php elseif ($f_status === 'accepted'): ?>
                    <form method="post" action="friendaction.php">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="user_id" value="<?php echo $profile_id; ?>">
                        <input type="hidden" name="action" value="remove">
                        <input type="submit" value="Remove Friend">
                    </form>
                <?php endif; ?>

                <?php if (can_view($profile_id, $me['id'], 'pokes')): ?>
                <form method="post" action="poke.php" style="margin-top: 5px;">
                    <?php echo csrf_field(); ?>
                    <input type="hidden" name="user_id" value="<?php echo $profile_id; ?>">
                    <input type="submit" value="Poke!">
                </form>
                <?php endif; ?>
            </div>
        <?php endif; ?>

        <?php if ($profile_friends): ?>
        <div class="profile-section" style="margin-top: 10px;">
            <h3><?php echo h($profile['first_name']); ?>'s Friends (<?php echo $num_friends; ?>)</h3>
            <div class="profile-section-content">
                <div class="friend-grid">
                    <?php foreach ($profile_friends as $friend): ?>
                        <div class="friend-card" style="width: 75px; margin: 3px;">
                            <a href="profile.php?id=<?php echo $friend['id']; ?>">
                                <img src="<?php echo photo_url($friend['photo']); ?>" alt="" style="width: 55px; height: 55px;">
                            </a>
                            <div class="friend-name" style="font-size: 10px;">
                                <a href="profile.php?id=<?php echo $friend['id']; ?>"><?php echo h($friend['first_name']); ?></a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php endif; ?>
    </div>

    <div id="profile-right">
        <div id="profile-info">
            <h1><?php echo h($profile['first_name'] . ' ' . $profile['last_name']); ?></h1>
            <?php if ($profile['house_name']): ?>
                <p><?php echo h($profile['house_name']); ?></p>
            <?php endif; ?>
            <?php if ($profile['class_year']): ?>
                <p>Class of <?php echo h($profile['class_year']); ?></p>
            <?php endif; ?>
            <?php if ($profile['concentration']): ?>
                <p><?php echo h($profile['concentration']); ?></p>
            <?php endif; ?>
            <p>Member since <?php echo date('F j, Y', strtotime($profile['created_at'])); ?></p>
        </div>

        <!-- Contact Info -->
        <div class="profile-section">
            <h3>Contact Information</h3>
            <div class="profile-section-content">
                <table class="info-table">
                    <?php if (($is_own || can_view($profile_id, $me['id'], 'email')) && $profile['email']): ?>
                    <tr>
                        <td class="info-label">Email:</td>
                        <td><?php echo h($profile['email']); ?></td>
                    </tr>
                    <?php endif; ?>
                    <?php if (($is_own || can_view($profile_id, $me['id'], 'phone')) && $profile['phone']): ?>
                    <tr>
                        <td class="info-label">Phone:</td>
                        <td><?php echo h($profile['phone']); ?></td>
                    </tr>
                    <?php endif; ?>
                </table>
            </div>
        </div>

        <!-- Personal Info -->
        <?php if ($is_own || can_view($profile_id, $me['id'], 'interests')): ?>
        <div class="profile-section">
            <h3>Personal Information</h3>
            <div class="profile-section-content">
                <table class="info-table">
                    <?php if ($profile['sex']): ?>
                    <tr><td class="info-label">Sex:</td><td><?php echo h($profile['sex']); ?></td></tr>
                    <?php endif; ?>
                    <?php if (($is_own || can_view($profile_id, $me['id'], 'birthday')) && $profile['birthday']): ?>
                    <tr><td class="info-label">Birthday:</td><td><?php echo date('F j, Y', strtotime($profile['birthday'])); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['relationship_status']): ?>
                    <tr><td class="info-label">Relationship Status:</td><td><?php echo h($profile['relationship_status']); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['interested_in']): ?>
                    <tr><td class="info-label">Interested In:</td><td><?php echo h($profile['interested_in']); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['political_views']): ?>
                    <tr><td class="info-label">Political Views:</td><td><?php echo h($profile['political_views']); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['interests']): ?>
                    <tr><td class="info-label">Interests:</td><td><?php echo nl2br(h($profile['interests'])); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['favorite_music']): ?>
                    <tr><td class="info-label">Favorite Music:</td><td><?php echo nl2br(h($profile['favorite_music'])); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['favorite_movies']): ?>
                    <tr><td class="info-label">Favorite Movies:</td><td><?php echo nl2br(h($profile['favorite_movies'])); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['favorite_books']): ?>
                    <tr><td class="info-label">Favorite Books:</td><td><?php echo nl2br(h($profile['favorite_books'])); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['favorite_quotes']): ?>
                    <tr><td class="info-label">Favorite Quotes:</td><td><?php echo nl2br(h($profile['favorite_quotes'])); ?></td></tr>
                    <?php endif; ?>
                    <?php if ($profile['about_me']): ?>
                    <tr><td class="info-label">About Me:</td><td><?php echo nl2br(h($profile['about_me'])); ?></td></tr>
                    <?php endif; ?>
                </table>
            </div>
        </div>
        <?php endif; ?>

        <!-- Courses -->
        <?php if ($courses): ?>
        <div class="profile-section">
            <h3>Courses</h3>
            <div class="profile-section-content">
                <?php foreach ($courses as $course): ?>
                    <div class="course-item">
                        <a href="browse.php?course_id=<?php echo $course['id']; ?>"><?php echo h($course['code']); ?></a>
                        — <?php echo h($course['title']); ?>
                        <?php if ($course['professor']): ?>
                            (<?php echo h($course['professor']); ?>)
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <?php endif; ?>

        <!-- The Wall -->
        <div class="profile-section">
            <h3>The Wall</h3>
            <div class="profile-section-content">
                <?php if ($can_post): ?>
                <div class="wall-form">
                    <form method="post" action="wall.php">
                        <?php echo csrf_field(); ?>
                        <input type="hidden" name="profile_id" value="<?php echo $profile_id; ?>">
                        <textarea name="body" placeholder="Write on <?php echo $is_own ? 'your' : h($profile['first_name']) . "'s"; ?> wall..."></textarea><br>
                        <input type="submit" value="Post">
                    </form>
                </div>
                <?php endif; ?>

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
</div>

<div style="clear: both;"></div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
