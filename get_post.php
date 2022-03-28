<?php
require_once "database_query.php";
$conn = createDBConnection();

if(isset($_GET["last"])) {
  $sql = "SELECT timestamp FROM posts ORDER BY timestamp ASC LIMIT 1;";
  $result = execute_query($conn, $sql);
  $row = $result->fetch_assoc();

  echo substr($row["timestamp"],0,10);

} else if(isset($_GET["newest"])) {
  $newest = $_GET["newest"];


  $sql = "SELECT posts.post_id, posts.title, posts.timestamp, posts.anonymous, posts.img, users.username FROM posts, users WHERE posts.user_id = users.user_id AND timestamp > '$newest'ORDER BY timestamp ASC;";

  $result = execute_query($conn, $sql);

  $resultArray = [];

  while ($row = $result->fetch_assoc()) {
    $anonymous = $row["anonymous"];
    unset($row["anonymous"]);


    $hasImg = $row["img"] !== "";
    unset($row["img"]);

    if($anonymous) {
      $row["username"] = "Anonymous";
    }

    $row["hasImg"] = $hasImg;

    $resultArray[] = $row;
  }

  echo $resultArray ? json_encode($resultArray) : "";
} else if(isset($_GET["date"])) {
  $requestedDate = $_GET["date"];
  $dateHandler = new DateTime($requestedDate);
  $dateFrom = $dateHandler->format("Y-m-d");
  $dateTo = $dateHandler->modify('+1 day')->format("Y-m-d");


  $sql = "SELECT posts.post_id, posts.title, posts.timestamp, posts.anonymous, posts.img, users.username FROM posts, users WHERE posts.user_id = users.user_id AND timestamp >= '$dateFrom' AND timestamp < '$dateTo' ORDER BY timestamp DESC;";

  $result = execute_query($conn, $sql);

  $resultArray = [];

  while ($row = $result->fetch_assoc()) {
    $anonymous = $row["anonymous"];
    unset($row["anonymous"]);


    $hasImg = $row["img"] !== "";
    unset($row["img"]);

    if($anonymous) {
      $row["username"] = "Anonymous";
    }

    $row["hasImg"] = $hasImg;

    $resultArray[] = $row;
  }

  echo $resultArray ? json_encode($resultArray) : "";

} else if(isset($_GET["id"])) {
  $requestedId = $_GET["id"];

  $sql = "SELECT posts.post_id, posts.title, posts.body, posts.timestamp, posts.anonymous, posts.img, users.username FROM posts, users WHERE posts.user_id = users.user_id AND post_id='$requestedId';";

  $result = execute_query($conn, $sql);

  $row = $result->fetch_assoc();


  $sql2 = "SELECT comments.post_id, comments.text, users.username, comments.timestamp, comments.anonymous FROM comments, users WHERE comments.commenter_id = users.user_id AND comments.post_id ='$requestedId' ORDER BY timestamp DESC";

  $result2 = execute_query($conn, $sql2);

  $commentsArray = [];

  while($commentRow = $result2->fetch_assoc()) {
    $commentAnonymous = $commentRow["anonymous"];
    unset($commentRow["anonymous"]);

    if($commentAnonymous) {
      $commentRow["username"] = "Anonymous";
    }

    $commentsArray[] = $commentRow;
  }

  $row["comments"] = $commentsArray;


  $anonymous = $row["anonymous"];
  unset($row["anonymous"]);

  $hasImg = $row["img"] !== "";
  unset($row["img"]);

  if($anonymous) {
    $row["username"] = "Anonymous";
  }

  $row["hasImg"] = $hasImg;

  echo $row ? json_encode($row) : "";
}

$conn->close();

