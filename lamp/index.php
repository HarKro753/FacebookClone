<?php
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

// If already logged in, go to home
if (current_user()) {
    redirect('home.php');
}

$page_title = 'Welcome to Thefacebook';
$error = '';

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!verify_csrf()) {
        $error = 'Invalid form submission. Please try again.';
    } else {
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';

        if (!$email || !$password) {
            $error = 'Please enter your email and password.';
        } else {
            $user = db_fetch_one("SELECT id, password_hash FROM users WHERE email = ?", 's', [$email]);
            if ($user && password_verify($password, $user['password_hash'])) {
                login_user($user['id']);
                redirect('home.php');
            } else {
                $error = 'Incorrect email or password.';
            }
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title><?php echo SITE_NAME; ?> - Welcome</title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<div id="header">
    <div id="header-inner">
        <div id="header-left">
            <a href="index.php" id="logo">[ thefacebook ]</a>
        </div>
    </div>
</div>
<div id="content">
    <div id="landing">
        <div id="landing-left">
            <h1>Welcome to Thefacebook</h1>
            <p>Thefacebook is an online directory that connects people through social networks at colleges.</p>
            <p>We have opened up Thefacebook for popular consumption at <b>Harvard University</b>.</p>
            <p>You can use Thefacebook to:</p>
            <ul>
                <li>Search for people at your school</li>
                <li>Find out who are in your classes</li>
                <li>Look up your friends' friends</li>
                <li>See a visualization of your social network</li>
            </ul>

            <h2>To get started, you need a <b>harvard.edu</b> or <b>gmail.com</b> email address.</h2>
            <p><a href="register.php"><b>&raquo; Register now</b></a></p>
        </div>
        <div id="landing-right">
            <div class="form-box">
                <h2>Login</h2>
                <?php if ($error): ?>
                    <p class="error"><?php echo h($error); ?></p>
                <?php endif; ?>
                <form method="post" action="index.php">
                    <?php echo csrf_field(); ?>
                    <table class="form-table">
                        <tr>
                            <td class="label">Email:</td>
                            <td><input type="text" name="email" value="<?php echo h($_POST['email'] ?? ''); ?>"></td>
                        </tr>
                        <tr>
                            <td class="label">Password:</td>
                            <td><input type="password" name="password"></td>
                        </tr>
                        <tr>
                            <td>&nbsp;</td>
                            <td><input type="submit" value="Login" class="btn-primary"></td>
                        </tr>
                    </table>
                </form>
            </div>
        </div>
    </div>
</div>
<?php require_once __DIR__ . '/includes/footer.php'; ?>
