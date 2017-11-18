<?php

$db_host = 'qdm147674260.my3w.com';
$db_user = 'qdm147674260';
$db_password = 'dx123456';
$db_database = 'qdm147674260_db';
$db_port = 3306;
$db_charset = 'UTF8';


$conn = mysqli_connect($db_host, $db_user, $db_password, $db_database, $db_port);
mysqli_query($conn, "SET NAMES $db_charset");

function sql_execute($sql,$arr_type){
    global $conn;
    $result = mysqli_query($conn, $sql);
    if($result===false){
        return  "查询执行失败！请检查SQL语法：$sql";
    }
    else{
        if(stripos($sql,"SELECT")===0){
			$posts=array();
			while($row=mysqli_fetch_assoc($result)){
				$posts[]=$row;
			}
            return $posts;
        }else{
//            return $result;
			return mysqli_affected_rows($conn);
        }

    }

}


?>