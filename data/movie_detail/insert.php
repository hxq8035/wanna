<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");
@$fid=$_REQUEST["fid"] or die('{"code":401,"msg":"fid request"}');
@$uid=$_REQUEST["uid"] or die('{"code":402,"msg":"uid request"}');
@$time=$_REQUEST["time"] or die('{"code":403,"msg":"time request"}');
@$score=$_REQUEST["score"] or die('{"code":404,"msg":"score request"}');
@$content=$_REQUEST["content"] or die('{"code":405,"msg":"content request"}');
$sql="INSERT INTO comment(film_id,user_id,comment_time,score,content) VALUES($fid,$uid,'$time',$score,'$content') ";
$result=sql_execute($sql,MYSQLI_ASSOC);

if($result>0){
    echo '{"code":200,"msg":"succ"}';
}else{
    echo '{"code":400,"msg":"err"}';
}

?>