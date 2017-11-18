<?php
header('Content-Type: application/json;charset=UTF-8');
require_once("../init.php");

$kw=$_REQUEST["kw"];
$kws=explode(' ',$kw);
for($i=0;$i<count($kws);$i++){
  $kws[$i]='fname LIKE "%'.$kws[$i].'%" ';
}
$sql="SELECT fid,fname,md FROM film f,film_pic p where f.fname=p.film_name AND ".join(" AND ",$kws)." ORDER BY score DESC  LIMIT 6";
$output=sql_execute($sql,MYSQLI_ASSOC);
echo json_encode($output);

?>