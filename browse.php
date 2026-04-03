<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$me = current_user();
$page_title = 'Browse';

$houses = db_fetch_all("SELECT id, name FROM houses ORDER BY name");
$courses = db_fetch_all("SELECT id, code, title FROM courses ORDER BY code");
$years = [2004, 2005, 2006, 2007];

$filter_house = isset($_GET['house_id']) ? (int)$_GET['house_id'] : 0;
$filter_year = isset($_GET['year']) ? (int)$_GET['year'] : 0;
$filter_course = isset($_GET['course_id']) ? (int)$_GET['course_id'] : 0;

$results = [];
$filter_label = '';

if ($filter_house) {
    $house = db_fetch_one("SELECT name FROM houses WHERE id = ?", 'i', [$filter_house]);
    $filter_label = $house ? $house['name'] : 'Unknown House';
    $results = db_fetch_all(
        "SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
         FROM users u LEFT JOIN houses h ON u.house_id = h.id
         WHERE u.house_id = ?
         ORDER BY u.last_name, u.first_name LIMIT 100",
        'i',
        [$filter_house]
    );
} elseif ($filter_year) {
    $filter_label = "Class of $filter_year";
    $results = db_fetch_all(
        "SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
         FROM users u LEFT JOIN houses h ON u.house_id = h.id
         WHERE u.class_year = ?
         ORDER BY u.last_name, u.first_name LIMIT 100",
        'i',
        [$filter_year]
    );
} elseif ($filter_course) {
    $course = db_fetch_one("SELECT code, title FROM courses WHERE id = ?", 'i', [$filter_course]);
    $filter_label = $course ? $course['code'] . ' — ' . $course['title'] : 'Unknown Course';
    $results = db_fetch_all(
        "SELECT u.id, u.first_name, u.last_name, u.photo, u.class_year, u.concentration, h.name AS house_name
         FROM users u
         LEFT JOIN houses h ON u.house_id = h.id
         JOIN user_courses uc ON uc.user_id = u.id
         WHERE uc.course_id = ?
         ORDER BY u.last_name, u.first_name LIMIT 100",
        'i',
        [$filter_course]
    );
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-box">
    <h2>Browse</h2>

    <div class="browse-filters">
        <form method="get" action="browse.php" style="display: inline;">
            <label>House:</label>
            <select name="house_id" onchange="this.form.submit()">
                <option value="">-- All Houses --</option>
                <?php foreach ($houses as $house): ?>
                    <option value="<?php echo $house['id']; ?>" <?php echo $filter_house == $house['id'] ? 'selected' : ''; ?>><?php echo h($house['name']); ?></option>
                <?php endforeach; ?>
            </select>
        </form>

        <form method="get" action="browse.php" style="display: inline;">
            <label>Year:</label>
            <select name="year" onchange="this.form.submit()">
                <option value="">-- All Years --</option>
                <?php foreach ($years as $y): ?>
                    <option value="<?php echo $y; ?>" <?php echo $filter_year == $y ? 'selected' : ''; ?>><?php echo $y; ?></option>
                <?php endforeach; ?>
            </select>
        </form>

        <form method="get" action="browse.php" style="display: inline;">
            <label>Course:</label>
            <select name="course_id" onchange="this.form.submit()">
                <option value="">-- All Courses --</option>
                <?php foreach ($courses as $c): ?>
                    <option value="<?php echo $c['id']; ?>" <?php echo $filter_course == $c['id'] ? 'selected' : ''; ?>><?php echo h($c['code'] . ' — ' . $c['title']); ?></option>
                <?php endforeach; ?>
            </select>
        </form>
    </div>
</div>

<?php if ($filter_label): ?>
<div class="form-box">
    <h2><?php echo h($filter_label); ?> (<?php echo count($results); ?> people)</h2>

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
        <p>No people found with this filter.</p>
    <?php endif; ?>
</div>
<?php elseif (!$filter_house && !$filter_year && !$filter_course): ?>
<div class="form-box">
    <p>Select a house, year, or course above to browse people.</p>
</div>
<?php endif; ?>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
