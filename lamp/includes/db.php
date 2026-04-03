<?php
require_once __DIR__ . '/config.php';

/**
 * Get mysqli database connection (singleton)
 */
function db_connect() {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            die('Database connection failed: ' . $conn->connect_error);
        }
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}

/**
 * Execute a prepared statement and return the result
 * @param string $sql SQL query with ? placeholders
 * @param string $types Type string for bind_param (e.g., 'si' for string, int)
 * @param array $params Parameters to bind
 * @return mysqli_stmt
 */
function db_query($sql, $types = '', $params = []) {
    $conn = db_connect();
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        die('Query prepare failed: ' . $conn->error . ' SQL: ' . $sql);
    }
    if ($types && $params) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    return $stmt;
}

/**
 * Fetch all rows from a prepared statement
 */
function db_fetch_all($sql, $types = '', $params = []) {
    $stmt = db_query($sql, $types, $params);
    $result = $stmt->get_result();
    $rows = $result->fetch_all(MYSQLI_ASSOC);
    $stmt->close();
    return $rows;
}

/**
 * Fetch a single row
 */
function db_fetch_one($sql, $types = '', $params = []) {
    $stmt = db_query($sql, $types, $params);
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();
    return $row;
}

/**
 * Execute an insert/update/delete and return affected rows
 */
function db_execute($sql, $types = '', $params = []) {
    $stmt = db_query($sql, $types, $params);
    $affected = $stmt->affected_rows;
    $stmt->close();
    return $affected;
}

/**
 * Execute an insert and return the insert ID
 */
function db_insert($sql, $types = '', $params = []) {
    $stmt = db_query($sql, $types, $params);
    $id = $stmt->insert_id;
    $stmt->close();
    return $id;
}
