
// 将search转为对象
function parseSearch(){
    var search=location.search.slice(1);
    var params={};
    var strs=search.split("&");
    for(var str of strs){
        var index=str.indexOf("=");
        var key=str.slice(0,index),value=decodeURIComponent(str.slice(index+1));
        //如果对象中，不存在该属性
        if(params[key]==undefined){
            params[key]=value;
        }else{
            if(!Array.isArray(params[key])){
                params[key]=[params[key]];//则转为数组
            }
            params[key].push(value);//再压入新值
        }
    }
    return params;
}

// 格式化日期
function format(date){
    function pad0(val){
        return val<10?(val="0"+val):val;
    }
    var y=date.getFullYear();
    var M=pad0(date.getMonth()+1);
    var d=pad0(date.getDate());
    var h=pad0(date.getHours());
    var m=pad0(date.getMinutes());
    var s=pad0(date.getSeconds());
    return y+"-"+M+"-"+d+" "+h+":"+m+":"+s

}

//格式化时间2
function format2(date) {
    function pad0(val){
        return val<10?(val="0"+val):val;
    }
    var h=date.getHours();
    var m=pad0(date.getMinutes());
    var s=pad0(date.getSeconds());
    return h+":"+m+":"+s;
}


// 数字转换
function tranNum(num){
    if(num==null){
        return '暂无';
    }else{
        if(num>=100000000){
            num=(Math.round(num/100000000*100)/100).toFixed(2)+'亿';
        }else if(num>10000){
            num=(Math.round(num/10000*100)/100).toFixed(2)+'万';
        }else {
            num=num;
        }
        return num;
    }

}