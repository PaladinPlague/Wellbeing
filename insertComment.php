<?php
require_once "database_query.php";
$conn = createDBConnection();

    $comment = "test";
    $commenterID = "100";

    $sql = "INSERT INTO comments(commenter_ID, text, timestamp) VALUES('$commenterID', '$comment',CURRENT_TIMESTAMP);";

    $result = execute_query($conn, $sql);

    if($result) {
        echo 1;
    } else {
        echo 0;
    }

$conn->close();