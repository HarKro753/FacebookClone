<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

if (current_user()) {
    redirect('home.php');
}

$page_title = 'Register';
$errors = [];
$fields = [
    'first_name' => '',
    'last_name' => '',
    'email' => '',
    'password' => '',
    'password_confirm' => '',
    'sex' => '',
    'class_year' => '',
    'house_id' => '',
];

// Get houses for dropdown
$houses = db_fetch_all("SELECT id, name FROM houses ORDER BY name");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission.';
    } else {
        foreach ($fields as $key => $val) {
            $fields[$key] = trim($_POST[$key] ?? '');
        }

        // Validate
        if (!$fields['first_name']) $errors[] = 'First name is required.';
        if (!$fields['last_name']) $errors[] = 'Last name is required.';

        if (!$fields['email']) {
            $errors[] = 'Email is required.';
        } elseif (!preg_match(HARVARD_EMAIL_PATTERN, $fields['email'])) {
            $errors[] = 'You must use a valid harvard.edu email address.';
        } else {
            $existing = db_fetch_one("SELECT id FROM users WHERE email = ?", 's', [$fields['email']]);
            if ($existing) $errors[] = 'An account with this email already exists.';
        }

        if (!$fields['password']) {
            $errors[] = 'Password is required.';
        } elseif (strlen($fields['password']) < 6) {
            $errors[] = 'Password must be at least 6 characters.';
        }

        if ($fields['password'] !== $fields['password_confirm']) {
            $errors[] = 'Passwords do not match.';
        }

        if (empty($errors)) {
            $hash = password_hash($fields['password'], PASSWORD_DEFAULT);
            $house_id = $fields['house_id'] ? (int)$fields['house_id'] : null;
            $class_year = $fields['class_year'] ? (int)$fields['class_year'] : null;
            $sex = $fields['sex'] ?: null;

            $user_id = db_insert(
                "INSERT INTO users (email, password_hash, first_name, last_name, sex, house_id, class_year) VALUES (?, ?, ?, ?, ?, ?, ?)",
                'sssssii',
                [$fields['email'], $hash, $fields['first_name'], $fields['last_name'], $sex, $house_id, $class_year]
            );

            // Create default privacy settings
            db_execute("INSERT INTO privacy_settings (user_id) VALUES (?)", 'i', [$user_id]);

            login_user($user_id);
            set_flash('success', 'Welcome to Thefacebook! Start by editing your profile.');
            redirect('editprofile.php');
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="form-box" style="width: 500px; margin: 0 auto;">
    <h2>Create Your Account</h2>
    <p style="margin-bottom: 10px;">You must have a valid <b>harvard.edu</b> email address to register.</p>

    <?php if ($errors): ?>
        <div class="flash flash-error">
            <?php foreach ($errors as $err): ?>
                <p><?php echo h($err); ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <form method="post" action="register.php">
        <?php echo csrf_field(); ?>
        <table class="form-table">
            <tr>
                <td class="label">First Name:</td>
                <td><input type="text" name="first_name" value="<?php echo h($fields['first_name']); ?>"></td>
            </tr>
            <tr>
                <td class="label">Last Name:</td>
                <td><input type="text" name="last_name" value="<?php echo h($fields['last_name']); ?>"></td>
            </tr>
            <tr>
                <td class="label">Email:</td>
                <td><input type="text" name="email" value="<?php echo h($fields['email']); ?>"></td>
            </tr>
            <tr>
                <td class="label">Password:</td>
                <td><input type="password" name="password"></td>
            </tr>
            <tr>
                <td class="label">Confirm Password:</td>
                <td><input type="password" name="password_confirm"></td>
            </tr>
            <tr>
                <td class="label">Sex:</td>
                <td>
                    <select name="sex">
                        <option value="">-- Select --</option>
                        <option value="Male" <?php echo $fields['sex'] === 'Male' ? 'selected' : ''; ?>>Male</option>
                        <option value="Female" <?php echo $fields['sex'] === 'Female' ? 'selected' : ''; ?>>Female</option>
                    </select>
                </td>
            </tr>
            <tr>
                <td class="label">Class Year:</td>
                <td>
                    <select name="class_year">
                        <option value="">-- Select --</option>
                        <?php for ($y = 2007; $y >= 2004; $y--): ?>
                            <option value="<?php echo $y; ?>" <?php echo $fields['class_year'] == $y ? 'selected' : ''; ?>><?php echo $y; ?></option>
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
                            <option value="<?php echo $house['id']; ?>" <?php echo $fields['house_id'] == $house['id'] ? 'selected' : ''; ?>><?php echo h($house['name']); ?></option>
                        <?php endforeach; ?>
                    </select>
                </td>
            </tr>
            <tr>
                <td>&nbsp;</td>
                <td><input type="submit" value="Register" class="btn-primary"></td>
            </tr>
        </table>
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
