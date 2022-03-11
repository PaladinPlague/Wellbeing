<?php
function createDBConnection() {
    //set up database connection
    require_once "/home/nxb19193/DEVWEB/2021/password2.php";

    $hostname = "devweb2021.cis.strath.ac.uk";
    $username = "cs317madgroup17";
    $password = get_password();
    $database = $username;

    $conn = new mysqli($hostname, $username, $password, $database);

    if($conn->connect_error) {
        die("Connection failed");
        //die("Connection failed: ". $conn->connect_error); //FIXME error message
    }

    return $conn;
}


function execute_query($conn, $sql) {
    //execute the given query
    $result = $conn->query($sql);

  if (!$result){
    //die("Query failed");
    die("Query failed ".$conn->error); //FIXME error message
  }

    return $result;
}

