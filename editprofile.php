<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$user = current_user();
$page_title = 'Edit Profile';

$houses = db_fetch_all("SELECT id, name FROM houses ORDER BY name");
$all_courses = db_fetch_all("SELECT id, code, title FROM courses ORDER BY code");
$user_course_ids = array_column(
    db_fetch_all("SELECT course_id FROM user_courses WHERE user_id = ?", 'i', [$user['id']]),
    'course_id'
);

$errors = [];
$success = false;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission.';
    } else {
        $first_name = trim($_POST['first_name'] ?? '');
        $last_name = trim($_POST['last_name'] ?? '');
        $sex = $_POST['sex'] ?? null;
        $birthday = $_POST['birthday'] ?? null;
        $phone = trim($_POST['phone'] ?? '');
        $relationship_status = $_POST['relationship_status'] ?? null;
        $interested_in = $_POST['interested_in'] ?? null;
        $political_views = trim($_POST['political_views'] ?? '');
        $house_id = $_POST['house_id'] ? (int)$_POST['house_id'] : null;
        $class_year = $_POST['class_year'] ? (int)$_POST['class_year'] : null;
        $concentration = trim($_POST['concentration'] ?? '');
        $interests = trim($_POST['interests'] ?? '');
        $favorite_music = trim($_POST['favorite_music'] ?? '');
        $favorite_movies = trim($_POST['favorite_movies'] ?? '');
        $favorite_books = trim($_POST['favorite_books'] ?? '');
        $favorite_quotes = trim($_POST['favorite_quotes'] ?? '');
        $about_me = trim($_POST['about_me'] ?? '');

        if (!$first_name) $errors[] = 'First name is required.';
        if (!$last_name) $errors[] = 'Last name is required.';

        // Validate birthday format
        if ($birthday && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $birthday)) {
            $birthday = null;
        }

        if (empty($errors)) {
            db_execute(
                "UPDATE users SET first_name=?, last_name=?, sex=?, birthday=?, phone=?,
                 relationship_status=?, interested_in=?, political_views=?,
                 house_id=?, class_year=?, concentration=?,
                 interests=?, favorite_music=?, favorite_movies=?,
                 favorite_books=?, favorite_quotes=?, about_me=?
                 WHERE id=?",
                'sssssssssissssssi',
                [$first_name, $last_name, $sex ?: null, $birthday ?: null, $phone ?: null,
                 $relationship_status ?: null, $interested_in ?: null, $political_views ?: null,
                 $house_id, $class_year, $concentration ?: null,
                 $interests ?: null, $favorite_music ?: null, $favorite_movies ?: null,
                 $favorite_books ?: null, $favorite_quotes ?: null, $about_me ?: null,
                 $user['id']]
            );

            // Update courses
            db_execute("DELETE FROM user_courses WHERE user_id = ?", 'i', [$user['id']]);
            $selected_courses = $_POST['courses'] ?? [];
            foreach ($selected_courses as $cid) {
                $cid = (int)$cid;
                if ($cid > 0) {
                    db_execute("INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)", 'ii', [$user['id'], $cid]);
                }
            }

            set_flash('success', 'Profile updated successfully.');
            redirect('profile.php?id=' . $user['id']);
        }
    }
}

// Reload user data for form
$user = db_fetch_one(
    "SELECT u.*, h.name AS house_name FROM users u LEFT JOIN houses h ON u.house_id = h.id WHERE u.id = ?",
    'i',
    [$user['id']]
);

require_once __DIR__ . '/includes/header.php';
?>

<div class="edit-section" style="width: 600px; margin: 0 auto;">
    <h2>Edit My Profile</h2>

    <?php if ($errors): ?>
        <div class="flash flash-error">
            <?php foreach ($errors as $err): ?>
                <p><?php echo h($err); ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <form method="post" action="editprofile.php">
        <?php echo csrf_field(); ?>

        <h2>Basic Information</h2>
        <table class="form-table">
            <tr>
                <td class="label">First Name:</td>
                <td><input type="text" name="first_name" value="<?php echo h($user['first_name']); ?>"></td>
            </tr>
            <tr>
                <td class="label">Last Name:</td>
                <td><input type="text" name="last_name" value="<?php echo h($user['last_name']); ?>"></td>
            </tr>
            <tr>
                <td class="label">Sex:</td>
                <td>
                    <select name="sex">
                        <option value="">-- Select --</option>
                        <option value="Male" <?php echo $user['sex'] === 'Male' ? 'selected' : ''; ?>>Male</option>
                        <option value="Female" <?php echo $user['sex'] === 'Female' ? 'selected' : ''; ?>>Female</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="label">Birthday:</td>
                <td><input type="text" name="birthday" value="<?php echo h($user['birthday'] ?? ''); ?>" placeholder="YYYY-MM-DD"></td>
            </tr>
            <tr>
                <td class="label">Phone:</td>
                <td><input type="text" name="phone" value="<?php echo h($user['phone'] ?? ''); ?>"></td>
            </tr>
            <tr>
                <td class="label">Class Year:</td>
                <td>
                    <select name="class_year">
                        <option value="">-- Select --</option>
                        <?php for ($y = 2007; $y >= 2004; $y--): ?>
                            <option value="<?php echo $y; ?>" <?php echo $user['class_year'] == $y ? 'selected' : ''; ?>><?php echo $y; ?></option>
                        <?php endfor; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="label">House/Dorm:</td>
                <td>
                    <select name="house_id">
                        <option value="">-- Select --</option>
                        <?php foreach ($houses as $house): ?>
                            <option value="<?php echo $house['id']; ?>" <?php echo $user['house_id'] == $house['id'] ? 'selected' : ''; ?>><?php echo h($house['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="label">Concentration:</td>
                <td><input type="text" name="concentration" value="<?php echo h($user['concentration'] ?? ''); ?>"></td>
            </tr>
        </table>

        <h2>Relationship</h2>
        <table class="form-table">
            <tr>
                <td class="label">Status:</td>
                <td>
                    <select name="relationship_status">
                        <option value="">-- Select --</option>
                        <?php
                        $statuses = ['Single', 'In a Relationship', 'Engaged', 'Married', "It's Complicated"];
                        foreach ($statuses as $s):
                        ?>
                            <option value="<?php echo h($s); ?>" <?php echo $user['relationship_status'] === $s ? 'selected' : ''; ?>><?php echo h($s); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="label">Interested In:</td>
                <td>
                    <select name="interested_in">
                        <option value="">-- Select --</option>
                        <option value="Men" <?php echo $user['interested_in'] === 'Men' ? 'selected' : ''; ?>>Men</option>
                        <option value="Women" <?php echo $user['interested_in'] === 'Women' ? 'selected' : ''; ?>>Women</option>
                        <option value="Both" <?php echo $user['interested_in'] === 'Both' ? 'selected' : ''; ?>>Both</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="label">Political Views:</td>
                <td><input type="text" name="political_views" value="<?php echo h($user['political_views'] ?? ''); ?>"></td>
            </tr>
        </table>

        <h2>Personal</h2>
        <table class="form-table">
            <tr><td class="label">Interests:</td><td><textarea name="interests"><?php echo h($user['interests'] ?? ''); ?></textarea></td></tr>
            <tr><td class="label">Favorite Music:</td><td><textarea name="favorite_music"><?php echo h($user['favorite_music'] ?? ''); ?></textarea></td></tr>
            <tr><td class="label">Favorite Movies:</td><td><textarea name="favorite_movies"><?php echo h($user['favorite_movies'] ?? ''); ?></textarea></td></tr>
            <tr><td class="label">Favorite Books:</td><td><textarea name="favorite_books"><?php echo h($user['favorite_books'] ?? ''); ?></textarea></td></tr>
            <tr><td class="label">Favorite Quotes:</td><td><textarea name="favorite_quotes"><?php echo h($user['favorite_quotes'] ?? ''); ?></textarea></td></tr>
            <tr><td class="label">About Me:</td><td><textarea name="about_me"><?php echo h($user['about_me'] ?? ''); ?></textarea></td></tr>
        </table>

        <h2>Courses</h2>
        <p>Hold Ctrl/Cmd to select multiple courses.</p>
        <select name="courses[]" multiple size="10" style="width: 400px;">
            <?php foreach ($all_courses as $course): ?>
                <option value="<?php echo $course['id']; ?>" <?php echo in_array($course['id'], $user_course_ids) ? 'selected' : ''; ?>>
                    <?php echo h($course['code'] . ' — ' . $course['title']); ?>
                </option>
            <?php endforeach; ?>
        </select>

        <br><br>
        <input type="submit" value="Save Changes" class="btn-primary">
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
