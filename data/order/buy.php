<?php
header('Content-Type: application/json;charset=UTF-8');
require_once("../init.php");
@$fid=$_REQUEST["fid"] or die('{"code":400,"msg":"fid request"}');
$sql="SELECT fname,expected_num,score,duration,type,md,price FROM film f,film_pic p WHERE f.fname=p.film_name AND fid=$fid";
$output["movie"]=sql_execute($sql,MYSQLI_ASSOC);
$sql="SELECT star_name FROM film_actor WHERE film_id=$fid AND is_leading>0 ORDER BY is_leading";
$output["actors"]=sql_execute($sql,MYSQLI_ASSOC);
$sql="SELECT seq_soon_show AS soon FROM index_movie WHERE film_name=(SELECT fname FROM film WHERE fid=$fid)";
$output["isWish"]=sql_execute($sql,MYSQLI_ASSOC);
$sql="SELECT cid,ctimer,hall_id FROM changci WHERE film_id=$fid";
$output["cc"]=sql_execute($sql,MYSQLI_ASSOC);

echo json_encode($output);

?>