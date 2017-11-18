<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");

@$nid=$_REQUEST['nid'];
@$pno=$_REQUEST['pno'];
$pageSize=8;
if(!$pno) $pno=1;
if(!$nid) $nid=1;
$start=($pno-1)*$pageSize;
$sql="SELECT cid,comment_time,praise,content,uname,avatar,user_level FROM comment c,fuser u WHERE c.user_id=u.uid AND news_id=$nid ORDER BY comment_time DESC LIMIT $start,$pageSize";
$output["data"]=sql_execute($sql,MYSQLI_ASSOC);
$sql="SELECT COUNT(*) AS num FROM comment WHERE news_id=$nid";
$output["count"]=sql_execute($sql,MYSQLI_ASSOC)[0];
$output["recordCount"]=$pno*$pageSize;


echo json_encode($output);
?>