<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';
require_login();

$user = current_user();
$page_title = 'Change Profile Photo';
$errors = [];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $errors[] = 'Invalid form submission.';
    } elseif (!isset($_FILES['photo']) || $_FILES['photo']['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Please select a photo to upload.';
    } else {
        $file = $_FILES['photo'];
        $allowed = ['image/jpeg', 'image/png', 'image/gif'];
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        $mime = finfo_file($finfo, $file['tmp_name']);
        finfo_close($finfo);

        if (!in_array($mime, $allowed)) {
            $errors[] = 'Only JPEG, PNG, and GIF images are allowed.';
        } elseif ($file['size'] > MAX_PHOTO_SIZE) {
            $errors[] = 'Photo must be under 2MB.';
        } else {
            $ext = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/gif' => 'gif'][$mime];
            $filename = 'user_' . $user['id'] . '_' . time() . '.' . $ext;

            // Ensure upload dir exists
            if (!is_dir(UPLOAD_DIR)) {
                mkdir(UPLOAD_DIR, 0755, true);
            }

            if (move_uploaded_file($file['tmp_name'], UPLOAD_DIR . $filename)) {
                // Delete old photo if not default
                if ($user['photo'] && $user['photo'] !== 'default_photo.jpg') {
                    $old = UPLOAD_DIR . $user['photo'];
                    if (file_exists($old)) unlink($old);
                }

                db_execute("UPDATE users SET photo = ? WHERE id = ?", 'si', [$filename, $user['id']]);
                set_flash('success', 'Profile photo updated.');
                redirect('profile.php?id=' . $user['id']);
            } else {
                $errors[] = 'Failed to save photo. Please try again.';
            }
        }
    }
}

require_once __DIR__ . '/includes/header.php';
?>

<div class="edit-section" style="width: 400px; margin: 0 auto;">
    <h2>Change Profile Photo</h2>

    <?php if ($errors): ?>
        <div class="flash flash-error">
            <?php foreach ($errors as $err): ?>
                <p><?php echo h($err); ?></p>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <p>Current photo:</p>
    <p><img src="<?php echo photo_url($user['photo']); ?>" alt="" style="width: 150px; border: 1px solid #999;"></p>

    <form method="post" action="editphoto.php" enctype="multipart/form-data">
        <?php echo csrf_field(); ?>
        <p>
            <input type="file" name="photo" accept="image/jpeg,image/png,image/gif">
        </p>
        <p style="color: #666;">Maximum file size: 2MB. JPEG, PNG, or GIF.</p>
        <p><input type="submit" value="Upload Photo" class="btn-primary"></p>
    </form>
</div>

<?php require_once __DIR__ . '/includes/footer.php'; ?>
