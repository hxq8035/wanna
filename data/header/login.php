<?php
header('Content-Type: application/json;charset=UTF-8');
require_once('../init.php');
@$uname = $_REQUEST['uname'] or die('{"code":401,"msg":"uname required"}');
@$upwd = $_REQUEST['upwd'] or die('{"code":402,"msg":"upwd required"}');

$sql="SELECT uid,avatar FROM fuser WHERE uname='$uname' AND upwd='$upwd'";
$result=sql_execute($sql,MYSQLI_ASSOC);

if(count($result)==0){
    echo('{"code":201, "msg":"uname or upwd err"}');
}else if(count($result)==1){
    //session_start();
    // $_SESSION['loginUname'] = $uname;
    // $_SESSION['loginUid'] = $result[0]['uid'];
    $avatar=$result[0]['avatar'];
    $uid=$result[0]['uid'];
     echo '{"code":200, "msg":"login succ","avatar":"'.$avatar.'","uid":"'.$uid.'","uname":"'.$uname.'"}';
}



?>