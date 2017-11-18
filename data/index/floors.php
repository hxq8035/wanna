<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");

$output=array();

//正在热映
$sql="SELECT f.fid,f.fname,f.score,f.icon,p.md AS img,m.seq_top_show FROM film f,film_pic p,index_movie m WHERE f.fname=p.film_name AND f.fname=m.film_name AND seq_top_show>0 ORDER BY seq_top_show DESC LIMIT 8";
$output["topShow"]= sql_execute($sql,MYSQLI_ASSOC);
$sql="SELECT COUNT(*) sum FROM index_movie WHERE seq_top_show>0";
$output["topShowNum"]=sql_execute($sql,MYSQL_ASSOC);


//即将上映
$sql="SELECT f.fid,f.fname,f.icon,f.expected_num,f.release_time,f.is_onsale,p.md AS img,m.seq_soon_show FROM film f,film_pic p,index_movie m WHERE f.fname=p.film_name AND f.fname=m.film_name AND m.seq_soon_show>0 ORDER BY seq_soon_show DESC LIMIT 8";
$output["soonShow"]=sql_execute($sql,MYSQLI_ASSOC);
$sql="SELECT COUNT(*) sum FROM index_movie WHERE seq_soon_show>0";
$output["soonShowNum"]=sql_execute($sql,MYSQL_ASSOC);


//热播电影
$sql="SELECT f.fid,f.fname,f.score,f.icon,p.md AS img,m.seq_top_sale FROM film f,film_pic p,index_movie m WHERE f.fname=p.film_name AND f.fname=m.film_name AND m.seq_top_sale>0 ORDER BY seq_top_sale DESC LIMIT 7";
$output["topSale"]=sql_execute($sql,MYSQLI_ASSOC);


//今日票房
$sql="SELECT fid,film_name,box_office FROM today_office,film WHERE film.fname=today_office.film_name ORDER BY box_office DESC LIMIT 10";
$output["todayOffice"]=sql_execute($sql,MYSQLI_ASSOC);


//最受期待
$sql="SELECT fid,fname,expected_num,release_time FROM film ORDER BY expected_num DESC LIMIT 10";
$output["expected"]=sql_execute($sql,MYSQLI_ASSOC);


//TOP100
$sql="SELECT fid,fname,score FROM film ORDER BY score DESC LIMIT 10";
$output["score"]=sql_execute($sql,MYSQLI_ASSOC);


echo json_encode($output);




?>