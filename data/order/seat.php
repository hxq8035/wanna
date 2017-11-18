<?php
header('Content-Type: application/json;charset=UTF-8');
require_once("../init.php");
@$cid=$_REQUEST['cid'];
$sql="SELECT sid,srow,scolumn,is_sale FROM seat s,ticket t WHERE s.sid=t.seat_id AND changci_id=$cid ORDER BY sid DESC";
echo json_encode(sql_execute($sql,MYSQLI_ASSOC));

?>