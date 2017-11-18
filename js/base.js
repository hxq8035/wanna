
function loadSearch(e,$txtSearch,$shelper) {
    var e=e||window.event;
    if(e.keyCode!=38&&e.keyCode!=40&&e.keyCode!=13){
        if($txtSearch.val()!=""){
            $shelper.show();
            $.get("data/header/search.php",{kw:$txtSearch.val(),count:6})
                .then(data=>{
                    if(data.length>0){
                        var html="";
                        for(var movie of data){
                            html+= `
                                        <li>
                                            <a href="movie_detail.html?mid=${movie.fid}" title="${movie.fname}" target="_blank">
                                                <img src="${movie.md}">
                                                <span>${movie.fname}</span>
                                            </a>
                                        </li>
                                    `;
                        }
                        $shelper.html(html);
                    }else{
                        $shelper.html("<li style='height:30px;color: #ef4238;line-height: 30px;padding-left:8px;'>未找到匹配影视</li>");
                    }
                    return new Promise(resolve=>resolve())
                })
                .then(()=>{
                    $("[data-trigger='search']").on("click",function () {
                        if($txtSearch.val()!=""){
                            location="query.html?kw="+$txtSearch.val();
                        }
                    })
                })
        }else{
            $shelper.hide();
        }
    }
}
function loadKeyDown(e,$txtSearch,$shelper){
    if($shelper.css("display")=="block" && $shelper.children().length!=0){
        if(e.keyCode==38 || e.keyCode==40){
            var $focusLi=$shelper.find(".focus");
            if($focusLi[0]==undefined){
                $shelper.children(":first-child").addClass("focus");
            }else{
                switch(e.keyCode){
                    case 38:
                        if($focusLi[0]==$shelper.children(":first-child")[0]){
                            $focusLi.removeClass("focus");
                            $shelper.children(":last-child").addClass("focus");
                        }else{
                            $focusLi.removeClass("focus").prev().addClass("focus");
                        }
                        break;
                    case 40:
                        if($focusLi[0]==$shelper.children(":last-child")[0]){
                            $focusLi.removeClass("focus");
                            $shelper.children(":first-child").addClass("focus");
                        }else{
                            $focusLi.removeClass("focus").next().addClass("focus");
                        }
                        break;
                }
            }
            $txtSearch.val($shelper.children(".focus").children().attr("title"));
        }else if(e.keyCode==13){
            var href=$shelper.children(".focus").children().attr("href");
            if(href){
                location=href;
            }
        }
    }
}
(()=>{

    function parseSearch(){
        var search=location.search.slice(1);
        var params={};
        var strs=search.split("&");
        for(var str of strs){
            var arr=str.split("=");
            var key=arr[0],value=arr[1];
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
    var city=parseSearch().city;

    // 异步加载页头
    $(".header").load("header.html",function () {
        $(".header-box").css("height",81);

        // 设置城市列表显示隐藏
        $("#selCity").hover(()=>{
            $("#cityList").toggle();
        });
        var $a=$("[data-load='cityList'] li").children(`[data-id=${city}]`),
            cityName=$a.html(),
            $curCity=$("#curCity");
        if(cityName==undefined){
            $curCity.html("杭州");
        }else{
            $curCity.html(cityName);
            $a.addClass("current").siblings(".current").removeClass("current");
            $a.parent().siblings().children(".current").removeClass("current");
        }

        var $cityDetail=$(".city-details");
        $("[data-trigger='searchCity']").click(function () {
            var txt=$(this).prev().val();
            if(txt==""){
                $cityDetail.scrollTop(0);
            }else{
                var $selectCity=$(`[data-load='cityList'] a:contains(${txt})`);
                var $selLiPrev=$selectCity.parent().prevAll(),
                    height=0;
                for(var cur of $selLiPrev){
                    height+=parseInt($(cur).css("height").slice(0,-2))+10;
                }
                $cityDetail.scrollTop(height);
                $cityDetail.children().children("a.current").removeClass("current");
                $selectCity.addClass("current");
            }
        });

        var $shelper=$("#shelper"),$txtSearch=$("#txtSearch");
        $(window).click(e=>{
            if($(e.target).attr("id")!="shelper" && $(e.target).attr("id")!="txtSearch"){
                $shelper.hide();
            }
        });

        $txtSearch.focus(e=>{
            loadSearch(e,$txtSearch,$shelper);
        });
        $txtSearch.keyup(e=>{
            loadSearch(e,$txtSearch,$shelper);
        });
        $txtSearch.keydown(function(e){
            loadKeyDown(e,$txtSearch,$shelper);
        });


        //设置头像的鼠标进入事件
        $("#login").hover(()=>{
            $("#userMenue").toggle();
        });

        $(".download").hover(()=>{
            $(".download-icon").toggle();
        });

        var uname=sessionStorage.getItem("uname");
        if(uname){
            var html=`
                 <li>
                <span class="login-name">${uname}</span>
                </li>
                <li>
                <a href="javascript:;" data-act="logout">退出登录</a>
                </li>
            `;
            $("#userMenue").html(html);
            var avatar=sessionStorage.getItem('avatar');
            $("[data-load='user']").attr("src",avatar);
        }

        $("[data-act='logout']").click((e)=>{
            e.preventDefault();
            sessionStorage.clear();
            location.reload();
        })

    });

    var $top=$(".top");
    $(window).scroll(()=>{
        var viewHeight=$(window).height(),//可见高度
            contentHeight=$("body").height(),//内容高度
            scrollHeight=$(window).scrollTop();//滚动高度
        if(scrollHeight>400){
            $top.show();
        }else{
            $top.hide();
        }
        if(scrollHeight>(contentHeight-viewHeight-171)) {
            var height=scrollHeight-(contentHeight-viewHeight-171)+20;
            $top.css("bottom",height);
        }else{
            $top.css("bottom",20);
        }
    });

    $top.click(e=>{
        window.scrollTo(0,0);
    });


    // 异步加载页尾
    $(".footer").load("footer.html");





})();