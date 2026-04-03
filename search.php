<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$me = current_user();
$page_title = 'Search';
$query = trim($_GET['q'] ?? '');
$results = [];

if ($query && strlen($query) >= 2) {
    // Try FULLTEXT search first, fall back to LIKE
    $results = db_fetch_all(
        "SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
         FROM users u
         LEFT JOIN houses h ON u.house_id = h.id
         WHERE MATCH(u.first_name, u.last_name) AGAINST(? IN BOOLEAN MODE)
         ORDER BY u.last_name, u.first_name
         LIMIT 50",
        's',
        [$query . '*']
    );

    // Fall back to LIKE if FULLTEXT returns nothing
    if (empty($results)) {
        $like = '%' . $query . '%';
        $results = db_fetch_all(
            "SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
             FROM users u
             LEFT JOIN houses h ON u.house_id = h.id
             WHERE u.first_name LIKE ? OR u.last_name LIKE ? OR CONCAT(u.first_name, ' ', u.last_name) LIKE ?
             ORDER BY u.last_name, u.first_name
             LIMIT 50",
            'sss',
            [$like, $like, $like]
        );
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-box">
    <h2>Search for People</h2>
    <form method="get" action="search.php">
        <input type="text" name="q" value="<?php echo h($query); ?>" size="40" placeholder="Enter a name...">
        <input type="submit" value="Search">
    </form>
</div>

<?php if ($query): ?>
<div class="form-box">
    <h2>Results for "<?php echo h($query); ?>" (<?php echo count($results); ?>)</h2>

    <?php if ($results): ?>
        <?php foreach ($results as $user): ?>
            <div class="user-row">
                <img src="<?php echo photo_url($user['photo']); ?>" alt="">
                <div class="user-info">
                    <div class="user-name">
                        <a href="profile.php?id=<?php echo $user['id']; ?>"><?php echo h($user['first_name'] . ' ' . $user['last_name']); ?></a>
                    </div>
                    <div class="user-details">
                        <?php
                        $details = [];
                        if ($user['class_year']) $details[] = "Class of " . $user['class_year'];
                        if ($user['house_name']) $details[] = $user['house_name'];
                        if ($user['concentration']) $details[] = $user['concentration'];
                        echo h(implode(' &middot; ', $details));
                        ?>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    <?php else: ?>
        <p>No results found. Try a different search.</p>
    <?php endif; ?>
</div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
