<?php
header('Content-Type: application/json;charset=UTF-8');
require_once("init.php");

$kw=$_REQUEST["kw"];
@$pno=$_REQUEST['pno'];
if(!$pno){
  $pno = 1;
}else {
  $pno = intval($pno);
}
$kws=explode(' ',$kw);
for($i=0;$i<count($kws);$i++){
   $kws[$i]='fname LIKE "%'.$kws[$i].'%" ';
}
$pageSize=4;
$start=($pno-1)*$pageSize;
$sql="SELECT fid,fname,md,score,release_time,f_ename,type,icon FROM film f,film_pic p where f.fname=p.film_name AND ".join(" AND ",$kws)." ORDER BY score DESC  LIMIT $start,$pageSize";
$output["data"]=sql_execute($sql,MYSQLI_ASSOC);
$sql="SELECT COUNT(*) AS sum FROM film WHERE ".join(" AND ",$kws);
$recordCount=sql_execute($sql,MYSQLI_ASSOC)[0]["sum"];
$pageCount=ceil($recordCount/$pageSize);
$output["pageCount"]=$pageCount;
$output["pno"]=$pno;
echo json_encode($output);

?>