<?php
function safePOST($conn, $name){
  if (isset($_POST[$name])) {
    return $conn->real_escape_string(strip_tags($_POST[$name]));
  } else {
    return "";
  }
}

function validateImage($formSubmissionName) {
  $fileSize = $_FILES[$formSubmissionName]["size"];
  $fileType = $_FILES[$formSubmissionName]["type"];

  $acceptedFileFormat = ($fileType == "image/jpeg" || $fileType == "image/png" || $fileType == "image/heif");

  return (($fileSize < 100 * 1024 * 1024) && $acceptedFileFormat);
}

require_once "database_query.php";
$conn = createDBConnection();

$userId = safePOST($conn, "user_id");
$title = safePOST($conn, "title");
$body = safePOST($conn, "body");
$img = isset($_FILES["img"]) ? $conn->real_escape_string(file_get_contents($_FILES["img"]["tmp_name"])) : "";
$anonymous = safePOST($conn, "anon");

$allValid = (strlen($title) < 255 && strlen($body) < 4000 && ($img === "" || validateImage("img")));

if($allValid) {
  $sql = "INSERT INTO posts(user_id, title, body, img, anonymous, timestamp) VALUES('$userId', '$title', '$body', '$img', '$anonymous',CURRENT_TIMESTAMP);";

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
