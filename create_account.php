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

$passwordHash = password_hash($password, PASSWORD_DEFAULT);

$sql = "INSERT INTO users(username, password_hash) VALUES('$username', '$passwordHash')";


$user_check_query = "SELECT * FROM users WHERE username='$username'";
$result = execute_query($conn, $user_check_query);
$row = $result->fetch_assoc();

if ($row && $row['username'] === $username) { // if user exists
  echo 0;
} else {
  if(strlen($username) <=255 && strlen($password) <= 255) {
    $result = execute_query($conn, $sql);

    if($result) {
      echo 1;
    } else {
      echo 0;
    }
  } else {
    echo 0;
  }
}



$conn->close();
