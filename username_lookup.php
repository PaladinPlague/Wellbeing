<?php
function safeGET($conn, $name){
  if (isset($_GET[$name])) {
    return $conn->real_escape_string(strip_tags($_GET[$name]));
  } else {
    return "";
  }
}

require_once "database_query.php";
$conn = createDBConnection();


$username = safeGET($conn, "username");


$sql = "SELECT `username` FROM `users` WHERE `username` = '$username'";
$result = execute_query($conn, $sql);

sleep(3);

if ($result->num_rows == 0) {
  echo $username;
}

$conn->close();
