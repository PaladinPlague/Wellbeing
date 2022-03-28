<?php
require_once "database_query.php";
$conn = createDBConnection();

$requestedId = $_GET["id"];
$latestTimestamp = $_GET["latest"];

$sql = "SELECT comments.text, users.username, comments.timestamp, comments.anonymous FROM comments, users WHERE comments.commenter_id = users.user_id AND comments.post_id ='$requestedId' AND timestamp > '$latestTimestamp' ORDER BY timestamp ASC";


$result = execute_query($conn, $sql);

$commentsArray = [];

while($row = $result->fetch_assoc()) {
  $anonymous = $row["anonymous"];
  unset($row["anonymous"]);

  if($anonymous) {
    $row["username"] = "Anonymous";
  }

  $commentsArray[] = $row;
}

echo $commentsArray ? json_encode($commentsArray) : "";