<?php
header("Content-Type:application/json;charset=UTF-8");
@$uname=$_REQUEST["uname"] or die('{"code":400,"msg":"uname required"}');
@$upwd=$_REQUEST["upwd"] or die('{"code":401,"msg":"upwd required"}');
@$phone=$_REQUEST["phone"] or die('{"code":402,"msg":"phone required"}');

require_once("../init.php");
$sql="INSERT INTO fuser(uname,upwd,phone) VALUES('$uname','$upwd','$phone')";

$result=sql_execute($sql,MYSQLI_ASSOC);
if($result>0){
    echo ('{"code":200,"msg":"register succ"}');
}else{
    echo ('{"code":403,"msg":"register err"}');
}

?>