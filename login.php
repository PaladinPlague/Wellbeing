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

$sql = "SELECT `user_id`, `password_hash` FROM `users` WHERE `username` = '$username'";
$result = execute_query($conn, $sql);
$row = $result->fetch_assoc();

if ($row) {
  if (password_verify($password, $row['password_hash'])) {
    echo $row['user_id'];
  } else {
    echo 0;
  }
} else {
    echo 0;
}

$conn->close();
