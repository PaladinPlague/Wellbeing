<head>
  <style>
    img {
      height:80vh;
      width:auto;
    }
  </style>
</head>
<body>
<?php
require_once "database_query.php";
$conn = createDBConnection();

if(isset($_GET["date"])) {
  $requestedDate = $_GET["date"];
  $dateHandler = new DateTime($requestedDate);
  $dateFrom = $dateHandler->format("Y-m-d");
  $dateTo = $dateHandler->modify('+1 day')->format("Y-m-d");


  $sql = "SELECT posts.post_id, posts.title, users.username FROM posts, users WHERE posts.user_id = users.user_id AND timestamp >= '$dateFrom' AND timestamp < '$dateTo' ORDER BY timestamp DESC;";

  $result = execute_query($conn, $sql);

  $resultArray = [];

  while ($row = $result->fetch_array()) {
    $resultArray[$row["post_id"]] = ["title"=>$row["title"], "username"=>$row["username"]];
  }


  echo $resultArray ? json_encode($resultArray) : "";

} else if(isset($_GET["id"])) {
  $requestedId = $_GET["id"];

  $sql = "SELECT posts.post_id, posts.title, posts.body, users.username FROM posts, users WHERE posts.user_id = users.user_id AND post_id='$requestedId';";

  $result = execute_query($conn, $sql);

  $row = $result->fetch_assoc();

  echo $row ? json_encode($row) : "";

?>


<br>
<button onclick="document.getElementById('test').style.display = 'block';">Show image</button>
<img id="test" src='#' style="display:none">

</body>
<script>
  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200){
      let img = document.getElementById("test");
      img.src = URL.createObjectURL(this.response);
    }
  }
  xhr.open('GET', 'fetch_img.php?id="<?php echo $row["post_id"] ?>"');
  xhr.responseType = 'blob';
  xhr.send();


</script>
<?php
}
?>








