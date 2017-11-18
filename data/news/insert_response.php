<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");

@$content=$_REQUEST["content"] or die('{"code":402,"msg":"content request"}');
@$resId=$_REQUEST['resId'] or die ('{"code":403,"msg":"responseId request"}');
@$uname=$_REQUEST['uname'] or die ('{"code":404,"msg":"uname request"}');

$sql="INSERT INTO response(comment_id,user_name,content) VALUES($resId,'$uname','$content')";
$result=sql_execute($sql,MYSQLI_ASSOC);

if($result>0){
    echo '{"code":200,"msg":"succ"}';
}else{
    echo '{"code":400,"msg":"err"}';
}

?>