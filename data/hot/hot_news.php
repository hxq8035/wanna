<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");
$sql="SELECT * FROM news ORDER BY nid DESC";
$output=sql_execute($sql,MYSQLI_ASSOC);
echo json_encode($output);

?>