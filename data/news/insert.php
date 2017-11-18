<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");
@$nid=$_REQUEST["nid"] or die('{"code":401,"msg":"nid request"}');
@$uid=$_REQUEST["uid"] or die('{"code":402,"msg":"uid request"}');
@$time=$_REQUEST["time"] or die('{"code":403,"msg":"time request"}');
@$content=$_REQUEST["content"] or die('{"code":405,"msg":"content request"}');
$sql="INSERT INTO comment(news_id,user_id,comment_time,content) VALUES($nid,$uid,'$time','$content') ";
$result=sql_execute($sql,MYSQLI_ASSOC);

if($result>0){
    echo '{"code":200,"msg":"succ"}';
}else{
    echo '{"code":400,"msg":"err"}';
}

?>