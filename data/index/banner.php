<?php
header("Content-Type:application/json;charset=UTF-8");

require_once("../init.php");
$sql="SELECT img,href FROM index_carousel ORDER BY cid DESC";
echo json_encode(sql_execute($sql,MYSQLI_ASSOC));

?>