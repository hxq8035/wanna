<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");
@$cid=$_REQUEST['cid'] or die ('{"code":400,"msg":"cid request"}');
@$praise=$_REQUEST['praise'];
if($praise==null){
    die ('{"code":401,"msg":"praise request"}');
}
$sql="UPDATE comment SET praise=$praise WHERE cid=$cid";
$result=sql_execute($sql,MYSQLI_ASSOC);

if($result>0){
    echo '{"code":200,"msg":"success"}';
}else{
    echo '{"code":402,"msg":"error"}';
}

?>