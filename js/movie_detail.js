(()=>{

    var fid=parseSearch().mid;
    if(!fid){
        fid=1;
    }

    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=movie_detail.html?mid="+fid);
    });

    //*******动态设置li的宽度
    var LIWIDTH=parseInt($(".img-lg").css("width")),
        SLIWIDTH=80,m=0,
        $lgList=$("[data-load='lgList']"),
        $lgBottomList=$("[data-load='lgBottomList']"),
        bannerImgs=$("[data-load='bannerImgs']"),
        params=location.search.slice(1),
        lgLength=0,
        count=0;


    function loadComment() {
        $.get("data/movie_detail/comment.php",params)
            .then(data=>{
                var comment=data;
                for (var i=0,html="<ul>";i<comment.length;i++){
                    var com=comment[i];
                    html+=`
                     <li class="comment-item ${i==comment.length-1?"last":""}" data-value="${com.cid}" data-flag="0">
                        <div class="avatar-container">
                            <div class="avatar">
                                <img src="${com.avatar}">
                            </div>
                            <i class="level-1-icon ${com.user_level==2?"level-2":com.user_level==3?"level-3":com.user_level==4?"level-4":com.user_level==5?"level-5":""}"></i>
                        </div>
                        <div class="comment-main">
                            <div class="main-header">
                                <div class="user">
                                    <span>${com.uname}</span>
                                </div>
                                <div class="time">
                                    <span title="${com.comment_time}">${com.comment_time.slice(5,10)}</span>
                                    <ul class="score-star clear">
                                        <li>
                                            <i class="half-star left ${com.score>0?"active":""}"></i>
                                            <i class="half-star right ${com.score>1?"active":""}"></i>
                                        </li>
                                        <li>
                                            <i class="half-star left ${com.score>2?"active":""}"></i>
                                            <i class="half-star right ${com.score>3?"active":""}"></i>
                                        </li>
                                        <li>
                                            <i class="half-star left ${com.score>4?"active":""}"></i>
                                            <i class="half-star right ${com.score>5?"active":""}"></i>
                                        </li>
                                        <li>
                                            <i class="half-star left ${com.score>6?"active":""}"></i>
                                            <i class="half-star right ${com.score>7?"active":""}"></i>
                                        </li>
                                        <li>
                                            <i class="half-star left ${com.score>8?"active":""}"></i>
                                            <i class="half-star right ${com.score>9?"active":""}"></i>
                                        </li>
                                    </ul>
                                </div>
                                <div class="good">
                                    <i class="good-icon" data-act="praise"></i>
                                    <span class="num">${com.praise>0?com.praise:"赞"}</span>
                                </div>
                            </div>
                            <div class="comment-content">${com.content}</div>
                        </div>
                    </li>
            `;
                }
                html+="</ul>";
                if(comment.length>0){
                    $("[data-load='comments']").html(html);
                }
            });
    }

    $.get("data/movie_detail/movie_detail.php",params)
        .then(data=>{
            if(data.code==400){
                location="notFound.html";
            }else{
                var banner=data.banner,
                    director=data.director,
                    actors=data.actor,
                    persons=data.persons,
                    more=data.more,
                    rNews=data.rNews,
                    rMovie=data.rMovie;
                $("title").html(banner.fname+"--呀呵电影");
                for(var i=0,html="";i<more.length;i++){
                    var movie=more[i];
                    html+=`
                     <li>
                           <a href="movie_detail.html?mid=${movie.fid}" target="_blank" class="default-img">
                                    <img src="${movie.md}">
                                    <div class="movie-text">
                                        <div class="movie-icon">
                                           ${movie.icon == "3D" ? "<i class='i3d'></i>" : movie.icon == "3DIMAX" ? "<i class='max3d'></i>" : movie.icon == "2DIMAX" ? "<i class='max2d'></i>" : ""}
                                        </div>
                                        <div class="text-bottom">
            `;
                    if (movie.score) {
                        var score = movie.score.split(".");
                        var int = score[0];
                        var fraction = score[1];
                        html += `
                    <div class="movie-score">
                       <i class="score-int">${int + "."}</i>
                       <i class="score-fraction">${fraction}</i>
                    </div>
                    <div class="text-name text-name-padding ellipsis" title="${movie.fname}">${movie.fname}</div>
                `;
                    } else {
                        html += ` <div class="text-name" title="${movie.fname}">${movie.fname}</div>`;
                    }
                    html+=`
                </div>
                                    </div>
                                </a>
                            </li>
            `;
                }
                $(bannerImgs).html(html);

                var html=`<img class="avator" src="${banner.lg}" >
                <div class="movie-icon">
                    ${banner.icon == "3D" ? "<i class='i3d'></i>" : banner.icon == "3DIMAX" ? "<i class='max3d'></i>" : banner.icon == "2DIMAX" ? "<i class='max2d'></i>" : ""}
                 </div>
        `;
                $("#leftShadow").html(html);
                var html=`
            <h3 class="name ellipsis">${banner.fname}</h3>
                        <div class="ename ellipsis">${banner.f_ename}</div>
                        <ul>
                            <li class="ellipsis">${banner.type}</li>
                            <li class="ellipsis">${banner.area}${banner.duration==null?"":"/"+banner.duration+"分钟"}</li>
                            <li class="ellipsis">${banner.release_time==null?"":banner.release_time}大陆上映</li>
                        </ul>
        `;
                $("#topTitle").html(html);
                if(banner.is_onsale>0){
                    $("#buttons").append(`<a href="buy.html?fid=${banner.fid}" target="_blank" class="buy-btn">立即购票</a>`);
                }
                var html=`
            <p class="movie-index-title">${banner.soon==0?"用户评分":"想看数"}</p>
                            <div class="movie-index-content">
                                <span class="index-left">${banner.soon==0?banner.score:tranNum(banner.expected_num)}</span>
        `;
                if(banner.soon==0){
                    html+=`
                     <div class="index-right">
                                    <div class="star-wrapper">
                                        <div class="star-on" style="width:${banner.score*10}%;"></div>
                                    </div>
                                    <span class="score-num">
                                    <span>${tranNum(banner.score_people)}</span>
                                    人评分
                                </span>
                                </div>
            `;
                }
                html+="</div>";
                $("#score").html(html);

                var html="";
                if(banner.total_box_office){
                    if(banner.total_box_office>10000){
                        var num=tranNum(banner.total_box_office).slice(0,-1),
                            up=tranNum(banner.total_box_office).slice(-1);
                        html=`
                    <span class="plnum">${num}</span>
                    <span class="unit">${up}</span>
                `;
                    }else{
                        html=`<span class="plnum">${banner.total_box_office}</span>`;
                    }

                }else{
                    html="<span class=\"no-info\">暂无</span>";
                }
                $("#office").html(html);
                $("[data-load='des']").html(banner.details);

                var html="";
                for(var dir of director){
                    html+=`
                <li>
                    <a class="star-link ">
                        <img src="img/actor/${dir.pic==null?"default-img.png":dir.pic}" class="default-img">
                    </a>
                    <div class="info">
                        <a class="star-name ellipsis">${dir.star_name}</a>
                    </div>
                </li>
            `;
                }
                $("[data-load='director']").html(html);
                $("[data-load='dirAll']").html(html);


                for(var i=0,html="";i<5-director.length;i++){
                    if(i<actors.length){
                        var actor=actors[i];
                        html+=`
                <li>
                    <a class="star-link">
                        <img src="img/actor/${actor.pic==null?"default-img.png":actor.pic}" class="default-img">
                    </a>
                    <div class="info">
                        <a class="star-name ellipsis">${actor.star_name}</a>
                        <br>
                        <span class="role ellipsis">${actor.role==null?"":"饰："+actor.role}</span>
                    </div>
                </li>
            `;
                    }

                }
                $("[data-load='actors']").html(html);

                var html="";
                for(var actor of actors){
                    html+=`
                <li>
                    <a class="star-link">
                        <img src="img/actor/${actor.pic==null?"default-img.png":actor.pic}" class="default-img">
                    </a>
                    <div class="info">
                        <a class="star-name ellipsis">${actor.star_name}</a>
                        <br>
                        <span class="role ellipsis">${actor.role==null?"":"饰："+actor.role}</span>
                    </div>
                </li>
            `;
                }
                $("[data-load='actAll']").html(html);


                $("[data-value='dirNum']").html("（"+director.length+"）");
                $("[data-value='actNum']").html("（"+actors.length+"）");

                var html="";
                for(var person in persons){
                    var pers=persons[person];
                    if(pers.length>0){
                        html+=`
                    <div class="star-group">
                            <div class="star-type">
                                ${person}
                                <span class="actor-num">（${pers.length}）</span>
                            </div>
                            <ul class="star-list clear">
                `;
                        for(per of pers){
                            html+= `
                        <li>
                            <a class="star-link">
                                <img src="img/actor/${per.pic}" class="default-img">
                            </a>
                            <div class="info">
                                <a  class="star-name ellipsis" >${per.star_name}</a>
                            </div>
                        </li>
                    `;
                        }
                        html+="</ul></div>";
                    }
                }
                $("[data-load='allPers']").append(html);

                for(var i=0,html="";i<35;i++){
                    html+= `
                <li data-index="${i}">
                    <img class="default-img" src="img/movie/sm/xxdtq/${i}.jpg" >
                </li>
            `;
                }
                $("[data-load='picAll']").html(html);

                for(var i=0,html="",xhtml="";i<35;i++){
                    html+= `
                    <li >
                    <img src="img/movie/xlg/xxdtq/${i}.jpg" >
                </li>
                `;
                    xhtml+=`
                    <li>
                    <img src="img/movie/sm/xxdtq/${i}.jpg" data-num="${i}">
                </li>
                `;
                }
                $("[data-load='lgList']").html(html);
                $("[data-load='lgBottomList']").html(xhtml);
                $lgList.children().css("width",LIWIDTH);

                var html="";
                if(rNews.length>0){
                    html+=`
                <div class="desc-detail">
                <div class="desc-detail-title">
                    <h3>相关咨讯</h3>
                </div>
                <div class="desc-detail-content">
                    <ul>
            `;
                    for(var news of rNews){
                        html+=`
                    <li class="news-item">
                            <div class="news-img">
                                <a href="news.html?nid=${news.nid}" target="_blank">
                                    <img src="img/loading.png" class="poster-default">
                                    <img src="img/news/md/${news.img}" class="img-detail">
                                </a>
                            </div>
                            <div class="news-detail">
                                <div class="news-detail-title">
                                    <a href="news.html?nid=${news.nid}" target="_blank">${news.title}</a>
                                </div>
                                <div class="news-info">
                                    <span class="news-source">呀呵电影</span>
                                    <span>
                                        <i class="news-icon news-icon-view"></i>
                                        ${news.view_num}
                                    </span>
                                    <span>
                                        <i class="news-icon news-icon-comments"></i>
                                        ${news.com_num}
                                    </span>
                                </div>
                            </div>
                        </li>
                `;
                    }
                    html+=`
                </ul>
                </div>
            </div>
            `;
                }
                if(rMovie.length>0){
                    html+=`
                <div class="desc-detail">
                <div class="desc-detail-title">
                    <h3>相关电影</h3>
                </div>
                <div class="desc-detail-content">
                    <ul class="related-movie clear">
            `;
                    for(var movie of rMovie){
                        html+=`
                    <li class="movie-item">
                            <div class="movie-poster">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <img src="${movie.md}" class="defult-img">
                                </a>
                                <div class="movie-icon">
                                   ${movie.icon == "3D" ? "<i class='i3d'></i>" : movie.icon == "3DIMAX" ? "<i class='max3d'></i>" : movie.icon == "2DIMAX" ? "<i class='max2d'></i>" : ""}
                                </div>
                            </div>
                            <div class="movie-name ellipsis">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">${movie.fname}</a>
                            </div>
                `;
                        if(movie.score){
                            var score = movie.score.split(".");
                            var int = score[0];
                            var fraction = score[1];
                            html+=`
                        <div class="score">
                           <i class="score-int">${int}.</i>
                           <i class="score-fraction">${fraction}</i>
                        </div>
                    `;
                        }else{
                            html+=`<div class="score">暂无评分</div>`;
                        }
                        html+="</li>";
                    }
                    html+=`     </ul>
                </div>
            </div>`;
                }
                $("[data-load='related']").html(html);

                return new Promise(resolve=>resolve());
            }


        })
        .then(()=>{

            loadComment();
            lgLength=$lgList.children().length;
            var moveStep=parseInt(bannerImgs.children().css("marginRight"))+parseInt(bannerImgs.children().css("width"));

            // 下拉查看更多
            $(".change").click(()=>{
                setTimeout(()=>{
                    $("#ban1").hide();
                },400);
                $("#ban2").css("height","376");
            });
            $(".close a").click(()=>{
                $("#ban2").css("height",0);
                $("#ban1").show();
            });

            var n=0;
            $("[data-move='left']").click(function (e) {
                e.preventDefault();
                if(n>0){
                    n--;
                    bannerImgs.css("left",-n*moveStep);
                }
            });
            $("[data-move='right']").click(function (e) {
                e.preventDefault();
                if(n<bannerImgs.children().length-5){
                    n++;
                    bannerImgs.css("left",-n*moveStep);
                }
            });

            $("[data-act='allPer']").click(()=>{
                $("[data-act='show']").children().eq(1).addClass("active").siblings(".active").removeClass("active");
                $("[data-show='container']").children().eq(1).show().siblings().hide();
                window.scrollTo(0,420);
            });
            $("[data-act='allPic']").click(()=>{
                $("[data-act='show']").children().eq(3).addClass("active").siblings(".active").removeClass("active");
                $("[data-show='container']").children().eq(3).show().siblings().hide();
                window.scrollTo(0,420);
            })

        });


    $("[data-act='show']").on("click","div.main-title:not(.title-disable)",function () {
        var index=$(this).data().value;
        $(this).addClass("active").siblings(".active").removeClass("active");
        $("[data-show='container']").children().eq(index).show().siblings().hide();
    });

    function showComment() {
        if(sessionStorage.getItem("uname")){
            $("#commentBox").fadeIn(200);
            $(".comment-overlay").show();
            disabledMouseWheel();
        }else{
            location="login.html?continue=movie_detail.html?mid="+fid;
        }
    }
    //写短评
    $("[data-act='write']").bind("click",showComment);
    $("#scoreBtn").bind("click",showComment);
    var enableClick=true;
    $("#viewBtn").click(function(){
        if(sessionStorage.getItem("uname")){
            if(enableClick){
                $(this).children().children("i").addClass("view-icon").next().html("已想看");
                enableClick=false;
            }else{
                $(this).children().children("i").removeClass("view-icon").next().html("想看");
                $("#scoreBtn").children().children("i").removeClass("score-on").next().html("评分");
                enableClick=true;
            }
        }else{
            location="login.html?continue=movie_detail.html?mid="+fid;
        }


    });


    // 点赞
    $("[data-load='comments']").on("click","[data-act='praise']",e=>{
        if(sessionStorage.getItem("uname")){
            var $span=$(e.target).next(),
                cid=$(e.target).parent().parent().parent().parent().data().value,
                flag=$(e.target).parent().parent().parent().parent().data().flag,
                currentPraise=parseInt($span.html());
            if(isNaN(currentPraise)){
                currentPraise=0;
            }
            if(flag==0){
                $(e.target).addClass("good-icon-active");
                $span.html(currentPraise+1);
                $(e.target).parent().parent().parent().parent().data('flag',1);
                $.get("data/movie_detail/update_praise.php",{cid,praise:(currentPraise+1)});

            }else{
                $(e.target).removeClass("good-icon-active");
                if((currentPraise-1)==0){
                    $span.html("赞");
                }else{
                    $span.html(currentPraise-1);
                }
                $(e.target).parent().parent().parent().parent().data('flag',0);
                $.get("data/movie_detail/update_praise.php",{cid,praise:(currentPraise-1)});
            }
        }else{
            location="login.html?continue=movie_detail.html?mid="+fid;
        }
    });


    function showScoreMsg() {
        var len=$("[data-act='starList']").children().children(".active").length;
        var $scoreContainer=$(".score-msg-container");
        if(len==0){
            $scoreContainer.html("<div class=\"no-score\">请点击星星评分</div>")
        }else {
            var score=0,msg="";
            if(len==1){
                score=1;
                msg="超烂啊";
            }else if(len==2) {
                score = 2;
                msg = "超烂啊";
            }else if(len==3){
                score = 3;
                msg = "比较差";
            }else if(len==4){
                score = 4;
                msg = "比较差";
            } else if(len==5){
                score = 5;
                msg = "一般般";
            }else if(len==6){
                score = 6;
                msg = "一般般";
            }else if(len==7){
                score = 7;
                msg = "比较好";
            }else if(len==8){
                score = 8;
                msg = "比较好";
            }else if(len==9){
                score = 9;
                msg = "棒极了";
            }else if(len==10){
                score = 10;
                msg = "完美";
            }
            var html=`
                 <div class="score">
                    <span class="score-num" data-act="myScore">${score}</span>
                    分
                </div>
                <div class="score-msg">${msg}</div>
            `;
            $scoreContainer.html(html);
        }
    }
    var num=finalnum = tempnum= 0;
    var stars = $("[data-act='starList'] li i");
    //num:传入点亮星星的个数
    //finalnum:最终点亮星星的个数
    //tempnum:一个中间值
    function fnShow(num) {
        finalnum= num || tempnum;//如果传入的num为0，则finalnum取tempnum的值
        for (var i = 0; i < stars.length; i++) {
            if(i<finalnum){
                $(stars[i]).addClass("active");
            }else{
                $(stars[i]).removeClass("active")
            }
            showScoreMsg();
        }
    }
    for (var i = 1; i <= stars.length; i++) {
        stars[i - 1].index = i;
        stars[i - 1].onmouseover = function() {
            fnShow(this.index);
        }
        stars[i - 1].onmouseout = function() { //鼠标离开时星星变暗
            fnShow(0);//传入值为0，finalnum为tempnum,初始为0
        }
        stars[i - 1].onclick = function() { //鼠标点击,同时会调用onmouseout,改变tempnum值点亮星星
            tempnum= this.index;
            $(".postBtn").removeClass("disabled");

        }
    }

    var $viewSpan=$("#hasView"),
        $scoreSpan=$("#hasScore");

    var ImgIputHandler={
        facePath:[
            {faceName:"微笑",facePath:"0.gif"},
            {faceName:"撇嘴",facePath:"1.gif"},
            {faceName:"色",facePath:"2.gif"},
            {faceName:"发呆",facePath:"3.gif"},
            {faceName:"得意",facePath:"4.gif"},
            {faceName:"流泪",facePath:"5.gif"},
            {faceName:"害羞",facePath:"6.gif"},
            {faceName:"闭嘴",facePath:"7.gif"},
            {faceName:"睡",facePath:"8.gif"},
            {faceName:"大哭",facePath:"9.gif"},
            {faceName:"尴尬",facePath:"10.gif"},
            {faceName:"发怒",facePath:"11.gif"},
            {faceName:"调皮",facePath:"12.gif"},
            {faceName:"龇牙",facePath:"13.gif"},
            {faceName:"惊讶",facePath:"14.gif"},
            {faceName:"难过",facePath:"15.gif"},
            {faceName:"酷",facePath:"16.gif"},
            {faceName:"冷汗",facePath:"17.gif"},
            {faceName:"抓狂",facePath:"18.gif"},
            {faceName:"吐",facePath:"19.gif"},
            {faceName:"偷笑",facePath:"20.gif"},
            {faceName:"可爱",facePath:"21.gif"},
            {faceName:"白眼",facePath:"22.gif"},
            {faceName:"傲慢",facePath:"23.gif"},
            {faceName:"饥饿",facePath:"24.gif"},
            {faceName:"困",facePath:"25.gif"},
            {faceName:"惊恐",facePath:"26.gif"},
            {faceName:"流汗",facePath:"27.gif"},
            {faceName:"憨笑",facePath:"28.gif"},
            {faceName:"大兵",facePath:"29.gif"},
            {faceName:"奋斗",facePath:"30.gif"},
            {faceName:"咒骂",facePath:"31.gif"},
            {faceName:"疑问",facePath:"32.gif"},
            {faceName:"嘘",facePath:"33.gif"},
            {faceName:"晕",facePath:"34.gif"},
            {faceName:"折磨",facePath:"35.gif"},
            {faceName:"衰",facePath:"36.gif"},
            {faceName:"骷髅",facePath:"37.gif"},
            {faceName:"敲打",facePath:"38.gif"},
            {faceName:"再见",facePath:"39.gif"},
            {faceName:"擦汗",facePath:"40.gif"},

            {faceName:"抠鼻",facePath:"41.gif"},
            {faceName:"鼓掌",facePath:"42.gif"},
            {faceName:"糗大了",facePath:"43.gif"},
            {faceName:"坏笑",facePath:"44.gif"},
            {faceName:"左哼哼",facePath:"45.gif"},
            {faceName:"右哼哼",facePath:"46.gif"},
            {faceName:"哈欠",facePath:"47.gif"},
            {faceName:"鄙视",facePath:"48.gif"},
            {faceName:"委屈",facePath:"49.gif"},
            {faceName:"快哭了",facePath:"50.gif"},
            {faceName:"阴险",facePath:"51.gif"},
            {faceName:"亲亲",facePath:"52.gif"},
            {faceName:"吓",facePath:"53.gif"},
            {faceName:"可怜",facePath:"54.gif"},
            {faceName:"菜刀",facePath:"55.gif"},
            {faceName:"西瓜",facePath:"56.gif"},
            {faceName:"啤酒",facePath:"57.gif"},
            {faceName:"篮球",facePath:"58.gif"},
            {faceName:"乒乓",facePath:"59.gif"},
            {faceName:"拥抱",facePath:"60.gif"},
            {faceName:"握手",facePath:"61.gif"},
        ]
        ,
        Init:function(){
            var isShowImg=false;
            $(".input_text").focus(function () {
                $(this).parent().addClass("focus");
            }).focusout(function () {
                $(this).parent().removeClass("focus");
            });
            $(".imgBtn").click(function(){
                if(isShowImg==false){
                    isShowImg=true;
                    $(this).parent().prev().animate({marginTop:"-125px"},300);
                    if($(".faceDiv").children().length==0){
                        for(var i=0,html="";i<ImgIputHandler.facePath.length;i++){
                            html+=`
                                <img title="${ImgIputHandler.facePath[i].faceName}" src="img/face/${ImgIputHandler.facePath[i].facePath}" data-value="${i}">
                            `;
                        }
                        $(".faceDiv").append(html);
                        $(".faceDiv>img").click(function(){
                            isShowImg=false;
                            $(this).parent().animate({marginTop:"0px"},300);
//						ImgIputHandler.insertAtCursor($(".Input_text")[0],"["+$(this).attr("title")+"]");
                            ImgIputHandler.insertAtCursor($(".input_text")[0],"[em_"+$(this).data().value+"]");
                        });
                    }
                }else{
                    isShowImg=false;
                    $(this).parent().prev().animate({marginTop:"0px"},300);
                }
            });

            $(".postBtn").on("click",function(){
                var myScore=$("[data-act='myScore']").html(),
                    myMsg=$(".score-msg").html();
                var content=replace_em($(".input_text").val()),
                    uid=sessionStorage.getItem("uid"),
                    myTimer=format(new Date());
                if(!content){
                    content='#好';
                }
                if(myScore){
                    enableClick=false;
                    $.get("data/movie_detail/insert.php",{uid:uid,fid:fid,time:myTimer,content:content,score:myScore})
                        .then(data=>{
                            if(data.code==200){
                                loadComment();
                                $("#commentBox").fadeOut(200);
                                $(".comment-overlay").hide();
                                enableMouseWheel();
                                $viewSpan.html("看过").prev("i").addClass("view-icon");
                                $scoreSpan.html(myScore+"分,"+myMsg).prev("i").addClass("score-on");

                            }
                        });
                }
            });

        },
        insertAtCursor:function(myField, myValue) {
            //    document.selection    表示当前网页中的选中内容 ie
            if (document.selection) {
                myField.focus();
                sel = document.selection.createRange();
                sel.text = myValue;
                sel.select();
            } else if (myField.selectionStart || myField.selectionStart == "0") {
                var startPos = myField.selectionStart;
                var endPos = myField.selectionEnd;
                var restoreTop = myField.scrollTop;
                myField.value = myField.value.substring(0, startPos) + myValue + myField.value.substring(endPos, myField.value.length);
                if (restoreTop > 0) {
                    myField.scrollTop = restoreTop;
                }
                myField.focus();
                myField.selectionStart = startPos + myValue.length;
                myField.selectionEnd = startPos + myValue.length;
            } else {
                myField.value += myValue;
                myField.focus();
            }
        }
    };

    //查看结果
    function replace_em(str){
        str = str.replace(/\</g,'&lt;');
        str = str.replace(/\>/g,'&gt;');
        str = str.replace(/\n/g,'<br/>');
        str = str.replace(/\[em_([0-9]*)\]/g,'<img src="img/face/$1.gif" border="0" />');
        return str;
    }

    ImgIputHandler.Init();

    $(".image-album").on("click",'img',function () {
        m=$(this).data().value;
        $(".img-lg").fadeIn(100);
        $(".img-lg-overlay").fadeIn(100);
        $lgBottomList.parent().addClass("list-bottom-show");
        $("#current").html(m+1);
        $lgList.css("left",-m*LIWIDTH);
        count=parseInt($(".list-bottom").css("width").slice(0,-2)/SLIWIDTH);
        moveBottom();
        disabledMouseWheel();
        showButton();
    });

    //查看大图
    $(".img-box").on("click","li img",function () {
        $(".img-lg").fadeIn(100);
        $(".img-lg-overlay").fadeIn(100);
        $lgBottomList.parent().addClass("list-bottom-show");
        m=$(this).parent().data().index;
        count=parseInt($(".list-bottom").css("width").slice(0,-2)/SLIWIDTH);
        $("#current").html(m+1);
        $lgList.css("transition",'all 0s linear');
        $lgList.css("left",-m*LIWIDTH);
        setTimeout(function () {
            $lgList.css("transition",'all .6s linear');
        },200);
        moveBottom();
        disabledMouseWheel();
        showButton();

    });

    $("[data-move='lg-right']").click(()=>{
       if(m<lgLength-1){
           m++;
           $lgList.css("left",-m*LIWIDTH);
           $("#current").html(m+1);
          moveBottom();
       }
    });
    $("[data-move='lg-left']").click(()=>{
        if(m>0){
            m--;
            $lgList.css("left",-m*LIWIDTH);
            $("#current").html(m+1);
            moveBottom();
        }
    });

    $("[data-act='lgClose']").click(function () {
        $(".img-lg").fadeOut(100);
        $(".img-lg-overlay").fadeOut(100);
        $lgBottomList.parent().removeClass("list-bottom-show");
        enableMouseWheel();
    });
    function showButton(){
        var timer;
        var hidding=false;
        $(document).mousemove(function () {
            if(hidding){
                hidding=false;
                return;
            }
            if(timer){
                clearTimeout(timer);
                timer=null;
            }
            $(".img-lg-top").removeClass("img-lg-top-hide");
            $(".lg-btn-left").removeClass("lg-btn-left-hide");
            $(".lg-btn-right").removeClass("lg-btn-right-hide")
            timer=setTimeout(function () {
                hidding=true;
                $(".img-lg-top").addClass("img-lg-top-hide");
                $(".lg-btn-left").addClass("lg-btn-left-hide");
                $(".lg-btn-right").addClass("lg-btn-right-hide")
            },5000);
        });
    }

   $(window).resize(()=>{
       LIWIDTH=parseInt($(".img-lg").css("width"));
       $lgList.children().css("width",LIWIDTH);
       $lgList.css("transition",'all 0s linear');
       $lgList.css("left",-m*LIWIDTH);
       setTimeout(function () {
           $lgList.css("transition",'all .6s linear');
       },200);
       count=parseInt($(".list-bottom").css("width").slice(0,-2)/SLIWIDTH);
       moveBottom();

   })
    function moveBottom(){
        $lgBottomList.children().eq(m).addClass("active").siblings(".active").removeClass("active");
        if(m>(count/2)&&m<(lgLength-(count/2))){
            var step=(m-count/2)*SLIWIDTH;
            $lgBottomList.css("left",-step);
        }
        if($lgBottomList.css("left").slice(0,-2)<((lgLength-count/2)*LIWIDTH) &&m>=(lgLength-(count/2))){
            var step=$lgBottomList.css("width").slice(0,-2)-$(".list-bottom").css("width").slice(0,-2);
            $lgBottomList.children().eq(m).addClass("active").siblings(".active").removeClass("active");
            $lgBottomList.css("left",-step);
        }
        if(m<=(count/2)&&$lgBottomList.css("left").slice(0,-2)<0){
            $lgBottomList.children().eq(m).addClass("active").siblings(".active").removeClass("active");
            $lgBottomList.css("left",0);
        }
    }

    $lgBottomList.on("click","li img",function(){
        m=$(this).data().num;
        moveBottom();
        $lgList.css("left",-m*LIWIDTH);
        $("#current").html(m+1);
    })


})();