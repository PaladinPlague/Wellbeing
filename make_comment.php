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

$postId = safePOST($conn, "post_id");
$commenterId = safePOST($conn, "commenter_id");
$text = safePOST($conn, "text");
$anonymous = safePOST($conn, "anon");

$allValid = (strlen($text) < 1000);

if($allValid) {
  $sql = "INSERT INTO comments(post_id, commenter_id, text, anonymous, timestamp) VALUES('$postId', '$commenterId', '$text', '$anonymous',CURRENT_TIMESTAMP);";

  $result = execute_query($conn, $sql);

  if($result) {
    echo 1;
  } else {
    echo 0;
  }

} else {
  echo 0;
}

$conn->close();
