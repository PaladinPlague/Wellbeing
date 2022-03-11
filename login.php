<?php
function safePOST($conn, $name){
    if (isset($_POST[$name])) {
        return $conn->real_escape_string(strip_tags($_POST[$name]));
    } else {
        return "";
    }
}

require_once "database_query.php";
$conn = createDBConnection();


$username = safePOST($conn, "username");
$password = safePOST($conn, "password");

$passwordHash = $password ? password_hash($password, PASSWORD_DEFAULT) : "";

$sql = "SELECT EXISTS(SELECT `user_id` FROM `users` WHERE `username` = '$username')";
$result = execute_query($conn, $sql);

if ($result->num_rows > 0) {
        echo "exists!";
} else {
    die("User not in database.");
}

$conn->close();
