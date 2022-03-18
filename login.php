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

$sql = "SELECT `user_id` FROM `users` WHERE `username` = '$username'";
$result = execute_query($conn, $sql);
$userID = mysqli_fetch_assoc($result)['user_id'];

if ($result->num_rows > 0) {
  $hash = "SELECT `password_hash` FROM `users` WHERE `username` = '$username'";
  $result2 = execute_query($conn, $hash);
  $array = mysqli_fetch_assoc($result2);
  $resultString = $array['password_hash'];
  if (password_verify($password, $resultString)) {
    //MOVE THIS SCRIPT TO CLIENT SIDE
    ?>
    <script>
    local = window.localStorage;
    id = <?php echo $userID; ?>;
    local.setItem("ID", id);
    </script>
    <?php
    header('location: get_post.php');
    echo 1;
  } else {
    $passwordError = "Incorrect Password";
    echo "<script type='text/javascript'>alert('$passwordError');</script>";

  }
} else {
    echo 0;
}

$conn->close();
