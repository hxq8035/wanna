<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");

@$cid=$_REQUEST['cid'] or die ('{"code":400,"msg":"cid request"}');
$sql="SELECT comment_id,user_name,content FROM response WHERE comment_id=$cid";
$output=sql_execute($sql,MYSQLI_ASSOC);

echo json_encode($output);


?>