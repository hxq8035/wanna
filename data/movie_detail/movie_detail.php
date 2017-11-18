<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("../init.php");

@$mid=$_REQUEST["mid"];
if(!$mid) $mid=1;
$output=array();
if($mid=='undefined'){
    die('{"code":"400","msg":"mid undefined"}');
}

$sql="SELECT * FROM film WHERE fid=$mid";
$result=sql_execute($sql,MYSQLI_ASSOC);
if(count($result)>0){
    $output["banner"]=$result[0];
    $sql="SELECT lg FROM film_pic WHERE film_name=(SELECT fname FROM film WHERE fid=$mid)";
    $output["banner"]["lg"]=sql_execute($sql,MYSQLI_ASSOC)[0]["lg"];
    $sql="SELECT seq_soon_show FROM index_movie WHERE film_name=(SELECT fname FROM film WHERE fid=$mid)";
    $output["banner"]["soon"]=sql_execute($sql,MYSQLI_ASSOC)[0]["seq_soon_show"];

    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%导演%'";
    $output["director"]=sql_execute($sql,MYSQLI_ASSOC);

    $sql="SELECT pic,star_name,role FROM film_actor WHERE film_id=$mid AND type LIKE '%演员%'";
    $output["actor"]=sql_execute($sql,MYSQLI_ASSOC);

    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%制片人%'";
    $output["persons"]["制片人"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%编剧%'";
    $output["persons"]["编剧"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%摄影师%'";
    $output["persons"]["摄影师"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%视觉效果%'";
    $output["persons"]["视觉效果"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%策划%'";
    $output["persons"]["策划"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%出品人%'";
    $output["persons"]["出品人"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%动作指导%'";
    $output["persons"]["动作指导"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%替身%'";
    $output["persons"]["替身"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%后期演员%'";
    $output["persons"]["后期演员"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%剪辑师%'";
    $output["persons"]["剪辑师"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%艺术指导%'";
    $output["persons"]["艺术指导"]=sql_execute($sql,MYSQLI_ASSOC);
    $sql="SELECT pic,star_name FROM film_actor WHERE film_id=$mid AND type LIKE '%美术指导%'";
    $output["persons"]["美术指导"]=sql_execute($sql,MYSQLI_ASSOC);

    $sql="SELECT type FROM film WHERE fid=$mid";
    $type=sql_execute($sql,MYSQLI_ASSOC)[0]["type"];
    $types=explode(',',$type);
    $sql="SELECT fid,fname,score,icon,md FROM film f,film_pic p WHERE f.fname=p.film_name AND (type LIKE '%".$types[0]."%' ";
    for($i=1;$i<count($types);$i++){
        $sql.=" OR type LIKE '%".$types[$i]."%' ";
    }
    $sql.=") LIMIT 0,6";
    $output["rMovie"]=sql_execute($sql,MYSQLI_ASSOC);

    $sql="SELECT fname FROM film WHERE fid=$mid";
    $fname=sql_execute($sql,MYSQLI_ASSOC)[0]['fname'];
    $sql="SELECT nid,img,title,view_num,com_num FROM news WHERE title LIKE '%".$fname."%' OR content LIKE '%".$fname."%' ORDER BY view_num DESC LIMIT 0,6";
    $output["rNews"]=sql_execute($sql,MYSQLI_ASSOC);


    $sql="SELECT fid,icon,fname,score,md FROM film f,film_pic p WHERE f.fname=p.film_name AND fid>$mid ORDER BY expected_num DESC LIMIT 15";
    $result=sql_execute($sql,MYSQLI_ASSOC);
    if(count($result)>0){
        $output["more"]=$result;
    }else{
        $sql="SELECT fid,icon,fname,score,md FROM film f,film_pic p WHERE f.fname=p.film_name AND fid>0 ORDER BY expected_num DESC LIMIT 15";
        $output["more"]=sql_execute($sql,MYSQLI_ASSOC);
    }
    echo json_encode($output);

}else{
    echo '{"code":400,"msg":"err"}';
}


?>