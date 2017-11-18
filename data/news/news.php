<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");

@$nid=$_REQUEST['nid'];
if(!$nid) $nid=1;
$sql="SELECT title,timer,view_num,content FROM news WHERE nid=$nid";
$output=sql_execute($sql,MYSQLI_ASSOC);

echo json_encode($output);

?>