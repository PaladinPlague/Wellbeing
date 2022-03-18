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
$ID = mysqli_fetch_assoc($result);
$userID = $ID['user_id'];

if ($result->num_rows > 0) {
        echo "user exists!";
        $hash = "SELECT `password_hash` FROM `users` WHERE `username` = '$username'";
    $result2 = execute_query($conn, $hash);
    $array = mysqli_fetch_assoc($result2);
    $resultString = $array['password_hash'];
    if (password_verify($password, $resultString)) {
        echo 'Password is valid!';
        //add a logout button on main page that clears local storage so until user logs out they will always be signed in.
        ?>
        <script>
              local = window.localStorage;
              id = <?php echo $userID; ?>;
              local.setItem("ID", id);
        </script>
        <?php
        header('location: get_post.php');
    } else {
        $passwordError = "Incorrect Password";
        echo "<script type='text/javascript'>alert('$passwordError');</script>";
        sleep(5);
        //ask others best way to redirect to login form with an incorrect password message
        //header('location: login.html');
        //die();
    }
} else {
    echo ("User not in database.");
    sleep(3);
    header('location: login.html');
    die();
}

$conn->close();
