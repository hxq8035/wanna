<?php
header('Content-Type: application/json;charset=UTF-8');
require_once('../init.php');

@$rule=$_REQUEST['rule'];
if(!$rule) $rule="tips";
@$pno=$_REQUEST["pno"];
if(!$pno) $pno=1;
$start=($pno-1)*10;

if($rule=='tips'){
    $sql="SELECT md AS img,fname,release_time,fid,score FROM film f,film_pic p,index_movie m WHERE f.fname=p.film_name AND f.fname=m.film_name AND seq_top_show>0 AND is_onsale>0 ORDER BY score DESC LIMIT $start,10";
}else{
    $sql="SELECT md AS img,fname,release_time,fid,$rule FROM film f,film_pic p WHERE f.fname=p.film_name ORDER BY $rule DESC LIMIT $start,10";
}
$output=sql_execute($sql,MYSQLI_ASSOC);

echo json_encode($output);

?>