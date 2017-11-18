<?php
header('Content-Type: application/json;charset=UTF-8');
require_once("../init.php");

@$sid=$_REQUEST["sid"] or die("sid request");
$sids=explode(',',$sid);
for($i=0;$i<count($sids);$i++){
    $sids[$i]="seat_id=".$sids[$i];
}
$sql="UPDATE ticket SET is_sale=1 WHERE ".join(" OR ",$sids);
$result=sql_execute($sql,MYSQLI_ASSOC);
if($result>0){
    echo '{"code":200,"msg":"success"}';
}else{
    echo '{"code":400,"msg":"error"}';
}
echo $sql;

?>