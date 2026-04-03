<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/functions.php';
$current_user = current_user();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title><?php echo isset($page_title) ? h($page_title) . ' | ' . SITE_NAME : SITE_NAME; ?></title>
    <link rel="stylesheet" type="text/css" href="css/style.css">
</head>
<body>
<div id="header">
    <div id="header-inner">
        <div id="header-left">
            <a href="home.php" id="logo">[ thefacebook ]</a>
        </div>
        <?php if ($current_user): ?>
        <div id="header-nav">
            <a href="home.php">home</a> |
            <a href="profile.php?id=<?php echo $current_user['id']; ?>">my profile</a> |
            <a href="friends.php">my friends</a> |
            <a href="editprofile.php">edit</a> |
            <a href="privacy.php">privacy</a> |
            <a href="browse.php">browse</a> |
            <a href="about.php">about</a> |
            <a href="logout.php">logout</a>
        </div>
        <div id="header-search">
            <form action="search.php" method="get">
                <input type="text" name="q" placeholder="Search for people" size="18">
                <input type="submit" value="Search">
            </form>
        </div>
        <?php endif; ?>
    </div>
</div>
<div id="content">
<?php
$flash = get_flash();
if ($flash):
?>
<div class="flash flash-<?php echo h($flash['type']); ?>"><?php echo h($flash['message']); ?></div>
<?php endif; ?>
