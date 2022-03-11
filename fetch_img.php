<?php
require_once "database_query.php";
$conn = createDBConnection();

$id = $_GET["id"];

$sql = "SELECT img FROM posts WHERE post_id=$id";

$result = execute_query($conn, $sql);
$conn->close();

echo $result->fetch_assoc()["img"];


