<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");
@$mid=$_REQUEST["mid"];
if(!$mid) $mid=1;

$sql="SELECT cid,comment_time,score,praise,content,uname,avatar,user_level FROM comment c,fuser u WHERE c.user_id=u.uid AND film_id=$mid ORDER BY comment_time DESC";
$output=sql_execute($sql,MYSQLI_ASSOC);
echo json_encode($output);

?>