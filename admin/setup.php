<?php
/**
 * Database setup script — run once to initialize the database
 */
require_once __DIR__ . '/../includes/config.php';

echo "<h2>thefacebook Database Setup</h2>";
echo "<pre>";

// Connect without selecting a database
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
$conn->set_charset('utf8mb4');

$sql_files = [
    '001_schema.sql',
    '002_seed_data.sql',
    '003_indexes.sql',
];

foreach ($sql_files as $file) {
    $path = __DIR__ . '/../sql/' . $file;
    echo "Running $file...\n";

    $sql = file_get_contents($path);
    if ($sql === false) {
        echo "ERROR: Could not read $path\n";
        continue;
    }

    // Execute multi-query
    if ($conn->multi_query($sql)) {
        do {
            if ($result = $conn->store_result()) {
                $result->free();
            }
        } while ($conn->next_result());
    }

    if ($conn->error) {
        echo "ERROR in $file: " . $conn->error . "\n";
    } else {
        echo "OK: $file executed successfully.\n";
    }
}

// Create uploads directory
$upload_dir = __DIR__ . '/../images/uploads/';
if (!is_dir($upload_dir)) {
    mkdir($upload_dir, 0755, true);
    echo "\nCreated uploads directory.\n";
}

echo "\n--- Setup complete! ---\n";
echo "You can now <a href='../index.php'>go to thefacebook</a>.\n";
echo "</pre>";

$conn->close();
