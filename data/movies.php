<?php
header("Content-Type:application/json;charset=UTF-8");
require_once("init.php");

@$subnav=$_REQUEST["subnav"];
if(!$subnav){
    $subnav='seq_top_show';
}

$sql="SELECT COUNT(*) FROM index_movie m,film f WHERE m.film_name=f.fname ";

$cond=" AND $subnav>0 ";
@$type=$_REQUEST["type"];
if($type){
    if($type!='全部'){
        if($type=='其他'){
            $cond.=" AND fname NOT IN (SELECT fname FROM film WHERE type LIKE '%爱情%' OR type LIKE '%喜剧%' OR type LIKE '%动画%' OR type LIKE '%剧情%' OR type LIKE '%恐怖%' OR type LIKE '%惊悚%' OR type LIKE '%科幻%' OR type LIKE '%动作%' OR type LIKE '%悬疑%' OR type LIKE '%犯罪%' OR type LIKE '%冒险%' OR type LIKE '%战争%' OR type LIKE '%奇幻%' OR type LIKE '%运动%' OR type LIKE '%家庭%' OR type LIKE '%古装%' OR type LIKE '%武侠%' OR type LIKE '%西部%' OR type LIKE '%历史%' OR type LIKE '%传记%' OR type LIKE '%情色%' OR type LIKE '%歌舞%' OR type LIKE '%黑色电影%' OR type LIKE '%短片%' OR type LIKE '%纪录片%')";
        }else{
            $cond.=" AND type LIKE '%".$type."%' ";
        }
    }
}

@$area=$_REQUEST["area"];
if($area){
    if($area!='全部'){
        if($area=='其他'){
            $cond.=" AND fname NOT IN (SELECT fname FROM film WHERE area LIKE '%大陆%' OR area LIKE '%中国%' OR area LIKE '%美国%' OR area LIKE '%韩国%' OR area LIKE '%日本%' OR area LIKE '%中国香港%' OR area LIKE '%中国台湾%' OR area LIKE '%泰国%' OR area LIKE '%印度%' OR area LIKE '%法国%' OR area LIKE '%英国%' OR area LIKE '%俄罗斯%' OR area LIKE '%意大利%' OR area LIKE '%西班牙%' OR area LIKE '%德国%' OR area LIKE '%波兰%' OR area LIKE '%澳大利亚%' OR area LIKE '%伊朗%')";
        }else if($area=='大陆'){
            $cond.=" AND fname IN (SELECT fname FROM film WHERE area LIKE '%".$area."%' OR area LIKE '%中国%')";
        }else{
            $cond.=" AND area LIKE '%".$area."%' ";
        }
    }
}

@$years=$_REQUEST["years"];
if($years){
    if($years!='全部'){
        if($years=='2017以后'){
            $cond.=" AND release_time>='2018'";
        }else if($years=='2000-2010'){
            $cond.=" AND release_time BETWEEN '2000' AND '2010-12-31' ";
        }else if($years=='90年代'){
            $cond.=" AND release_time BETWEEN '1990' AND '1999-12-31'";
        }else if($years=='80年代'){
            $cond.=" AND release_time BETWEEN '1980' AND '1989-12-31'";
        }else if($years=='70年代'){
            $cond.=" AND release_time BETWEEN '1970' AND '1979-12-31'";
        }else if($years=='更早'){
            $cond.=" AND release_time<'1979-12-31'";
        }else{
            $cond.=" AND release_time LIKE '%".$years."%'";
        }

    }
}

$sql.=$cond;
$recordCount=sql_execute($sql,MYSQLI_ASSOC)[0]["COUNT(*)"];

@$order=$_REQUEST["order"];
if(!$order){
    $order='expected_num';
}
$cond.=" ORDER BY $order DESC";

@$pno=$_REQUEST["pno"];
if(!$pno){
  $pno = 1;
}else {
  $pno = intval($pno);
}
$output["pno"]=$pno;
$count=30;
$start=($pno-1)*$count;
$cond.=" LIMIT $start,$count";

$pageCount=ceil($recordCount/$count);
$output["pageCount"]=$pageCount;

$sql="SELECT fid,fname,score,is_onsale,icon,md FROM film f,film_pic p,index_movie m WHERE f.fname=p.film_name AND m.film_name=f.fname".$cond;
$output["data"]=(sql_execute($sql,MYSQLI_ASSOC));
$output["sal"]=$sql;
$sql="SELECT fid FROM film";
$result=sql_execute($sql,MYSQLI_ASSOC);
$arr=array();
$actors=array();
foreach($result as $f){
	$arr[]=intval($f['fid']);
}
foreach($arr as $i){
	$sql="SELECT star_name,film_id AS mid FROM film_actor WHERE film_id=$i AND is_leading>0 ORDER BY is_leading";
	$result=sql_execute($sql,MYSQLI_ASSOC);
	$str="";
	foreach($result as $j){
		$str.=$j["star_name"].',';
	}
	$actors[$i]=$str;
}

$output["actors"]=$actors;

echo json_encode($output);



?>