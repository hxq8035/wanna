<?php
header('Content-Type: application/json;charset=UTF-8');
require_once('../init.php');
@$fid=$_REQUEST['fid'] or die ("fid request");
$sql="SELECT star_name,film_id AS mid FROM film_actor WHERE film_id=$fid AND is_leading>0 ORDER BY is_leading";
$output=sql_execute($sql,MYSQLI_ASSOC);
echo json_encode($output);

?>