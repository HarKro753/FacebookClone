<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$me = current_user();
$page_title = 'Privacy Settings';

// Get current settings
$settings = db_fetch_one("SELECT * FROM privacy_settings WHERE user_id = ?", 'i', [$me['id']]);
if (!$settings) {
    db_execute("INSERT INTO privacy_settings (user_id) VALUES (?)", 'i', [$me['id']]);
    $settings = db_fetch_one("SELECT * FROM privacy_settings WHERE user_id = ?", 'i', [$me['id']]);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        set_flash('error', 'Invalid form submission.');
        redirect('privacy.php');
    }

    $fields = ['show_email', 'show_phone', 'show_birthday', 'show_courses', 'show_interests', 'show_wall', 'allow_wall_posts', 'allow_pokes'];
    $allowed = ['everyone', 'friends', 'nobody'];

    $updates = [];
    $types = '';
    $params = [];

    foreach ($fields as $field) {
        $val = $_POST[$field] ?? 'friends';
        if (!in_array($val, $allowed)) $val = 'friends';
        $updates[] = "$field = ?";
        $types .= 's';
        $params[] = $val;
    }

    $types .= 'i';
    $params[] = $me['id'];

    db_execute(
        "UPDATE privacy_settings SET " . implode(', ', $updates) . " WHERE user_id = ?",
        $types,
        $params
    );

    set_flash('success', 'Privacy settings updated.');
    redirect('privacy.php');
}

$fields_config = [
    'show_email' => 'Email Address',
    'show_phone' => 'Phone Number',
    'show_birthday' => 'Birthday',
    'show_courses' => 'Courses',
    'show_interests' => 'Personal Info & Interests',
    'show_wall' => 'Wall (viewing)',
    'allow_wall_posts' => 'Wall Posts (who can post)',
    'allow_pokes' => 'Pokes (who can poke)',
];

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-box" style="width: 550px; margin: 0 auto;">
    <h2>Privacy Settings</h2>
    <p style="margin-bottom: 10px;">Control who can see your information.</p>

    <form method="post" action="privacy.php">
        <?php echo csrf_field(); ?>

        <table class="privacy-table">
            <tr>
                <th>Field</th>
                <th>Who Can See</th>
            </tr>
            <?php foreach ($fields_config as $field => $label): ?>
            <tr>
                <td><?php echo h($label); ?></td>
                <td>
                    <select name="<?php echo $field; ?>">
                        <option value="everyone" <?php echo ($settings[$field] ?? '') === 'everyone' ? 'selected' : ''; ?>>Everyone</option>
                        <option value="friends" <?php echo ($settings[$field] ?? '') === 'friends' ? 'selected' : ''; ?>>Friends Only</option>
                        <option value="nobody" <?php echo ($settings[$field] ?? '') === 'nobody' ? 'selected' : ''; ?>>No One</option>
                    </select>
                </td>
            </tr>
            <?php endforeach; ?>
        </table>

        <br>
        <input type="submit" value="Save Settings" class="btn-primary">
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
