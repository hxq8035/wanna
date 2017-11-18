<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");
@$uname=$_REQUEST["uname"];
if(!$uname){
    die('{"code":400,"msg":"uname required"}');
}

$sql="SELECT uid FROM fuser WHERE uname='$uname'";
$output=sql_execute($sql,MYSQLI_ASSOC);
if(count($output)==0){
    echo ('{"code":200,"msg":"success"}');
}else{
    echo ('{"code":400,"msg":"error"}');
}

?>