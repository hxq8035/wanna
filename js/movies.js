(()=>{
    $.get("header.html").then(()=>{
        $("#movies").addClass("active").siblings("active").removeClass("active");
        $("[data-id='login']").attr("href","login.html?continue=movies.html");
    });

    var params=parseSearch(),
        subnav=params.subnav,
        type=params.type;
    //subnav的样式处理
    if(subnav=='seq_classic'){
        $(".navbar").children().eq(2).addClass("active").siblings(".active").removeClass("active");
        $("title").html("经典电影--呀呵电影");
    }else if(subnav=='seq_soon_show'){
        $(".navbar").children().eq(1).addClass("active").siblings(".active").removeClass("active");
        $("[data-value='orderList']").children().eq(2).remove();
        $("title").html("即将上映--呀呵电影");
    }else{
        $(".navbar").children().eq(0).addClass("active").siblings(".active").removeClass("active");
        $("title").html("正在热映--呀呵电影");
    }


    // function loadSelects() {

        //加载选择按钮
        var type1=['全部','爱情','喜剧','动画','剧情','恐怖','惊悚','科幻','动作','悬疑','犯罪','冒险','战争','奇幻',
            '运动','家庭','古装','武侠','西部','历史','传记','情色','歌舞','黑色电影','短片','纪录片','其他'],
            type2=['全部','大陆','美国','韩国','日本','中国香港','中国台湾','泰国','印度','法国','英国','俄罗斯',
            '意大利','西班牙','德国','波兰','澳大利亚','伊朗','其他'],
            type3=['全部','2017以后','2017','2016','2015','2014','2013','2012','2011','2010','2000-2010',
            '90年代','80年代','70年代','更早'];

        for(var i=0,html="";i<type1.length;i++){
            html+=`<li ${i==0?"class='active'":""}><a href="javascript:;" data-value="${type1[i]}">${type1[i]}</a></li>`;
        }
        $("[data-value='type1']").html(html);

        for(var i=0,html="";i<type2.length;i++){
            html+=`<li ${i==0?"class='active'":""}><a href="javascript:;">${type2[i]}</a></li>`;
        }
        $("[data-value='type2']").html(html);

        for(var i=0,html="";i<type3.length;i++){
            html+=`<li ${i==0?"class='active'":""}><a href="javascript:;">${type3[i]}</a></li>`;
        }
        $("[data-value='type3']").html(html);

        // return new Promise(resolve=>resolve());
    // }

    //通过首页的分类跳转过来时的处理
    if(type==0){
        $("[data-value='爱情']").parent().addClass("active").siblings(".active").removeClass("active");
    }else if(type==1){
        $("[data-value='喜剧']").parent().addClass("active").siblings(".active").removeClass("active");
    }else if(type==2){
        $("[data-value='动作']").parent().addClass("active").siblings(".active").removeClass("active");
    }else if(type==3){
        $("[data-value='恐怖']").parent().addClass("active").siblings(".active").removeClass("active");
    }else if(type==4){
        $("[data-value='动画']").parent().addClass("active").siblings(".active").removeClass("active");
    }

    function loadMovies(pno=1) {
        var type=$("[data-value='type1']>li.active a").html(),
             area=$("[data-value='type2']>li.active a").html(),
             years=$("[data-value='type3']>li.active a").html(),
             order=$("[data-value='orderList'] span.active").data().order,
             params=location.search.slice(1)+"&type="+type+"&area="+area+"&years="+years+"&order="+order+"&pno="+pno;
        $.get("data/movies.php",params)
            .then(data=>{
                if(data.pageCount==0){
                    var html= "<dd class='no-movies'>抱歉，没有找到相关结果，请尝试用其他条件筛选。</dd>";
                    $("[data-load='movieList']").html(html);
                    $("[data-load='pageList']").html("");
                }else{
                    var pageCount=data.pageCount;
                    var movies=data.data;
                    var pno=data.pno;
                    var html="";
                    for(var movie of movies){
                        html+=`
                        <dd>
                            <div class="movie-item">
                                <div class="movie-poster">
                                    <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                        <img src="${movie.md}">
                                    </a>
                                </div>`;
                        if(subnav=='seq_classic'){
                            html+="";
                        }else if(subnav=='seq_soon_show'){
                            if(movie.is_onsale>0){
                                html+=`<div class="tips-box pre-buy">预售</div>`;
                            }
                        }else{
                            if(movie.is_onsale>0){
                                html+=`<div class="tips-box buy">购票</div>`;
                            }
                        }
                        html+=`
                        <div class="movie-icon">
                                   ${movie.icon == "3D" ? "<i class='i3d'></i>" : movie.icon == "3DIMAX" ? "<i class='max3d'></i>" : movie.icon == "2DIMAX" ? "<i class='max2d'></i>" : ""}
                                </div>
                            </div>
                            <div class="movie-detail ellipsis" title="${movie.fname}">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">${movie.fname}</a>
                            </div>
                            <div class="movie-detail ellipsis text-yellow">${movie.score==null?"暂无评分":movie.score}</div>
                        </dd>
                    `;

                    }
                    $("[data-load='movieList']").html(html);

                    // 加载分页按钮
                    var html="";
                    html+='<li><a href="javascript:;">上一页</a></li>'
                    if(pno-2>0){
                        html+=`<li><a href="javascript:;">${pno-2}</a></li>`;
                    }
                    if(pno-1>0){
                        html+=`<li><a href="javascript:;">${pno-1}</a></li>`;
                    }
                    html+=`<li class="active"><a href="javascript:;">${pno}</a></li>`;
                    if(pno+1<=pageCount){
                        html+=`<li><a href="javascript:;">${pno+1}</a></li>`;
                    }
                    if(pno+2<=pageCount){
                        html+=`<li><a href="javascript:;">${pno+2}</a></li>`;
                    }

                    html+=`<li><a href="javascript:;">下一页</a></li>`;
                    $("[data-load='pageList']").html(html);

                    if(pno==1){
                        $("[data-load='pageList']>li:first-child").addClass("disabled")
                    }
                    if(pno==pageCount){
                        $("[data-load='pageList']>li:last-child").addClass("disabled")
                    }
                    if(pno!=1&&pno!=pageCount){
                        $("[data-load='pageList']>li:first-child,[data-load='pageList']>li:last-child").removeClass("disabled");
                    }
                }

            });
    }

    // loadSelects()
    //     .then(()=>loadMovies());

    loadMovies();


    // 分页按钮点击事件
    $("[data-load='pageList']").on("click","li:not(.disabled):not(.active) a",function (e) {
        e.preventDefault();
        var $a=$(e.target),
            pno=parseInt($("[data-load='pageList']>li.active a").html());

        if($a.parent().is(":first-child")){
            loadMovies(pno-1);
        }else if($a.parent().is(":last-child")){
            loadMovies(pno+1);
        }else{
            loadMovies($a.html());
        }
        window.scrollTo(0,0);
    });

    //排序按钮点击事件
    $("[data-value='orderList']").on("click","li>span",function(){
        $(this).addClass("active").parent().siblings().children(".active").removeClass("active");
        var pno=$("[data-load='pageList']").children(".active").children().html();
        loadMovies(pno);
    });


    //类型，区域，年代选择事件
    $("[data-load='typeList']").on("click","li a",function(e){
        e.preventDefault();
        $(this).parent().addClass("active").siblings(".active").removeClass("active");
        var pno=$("[data-load='pageList']").children(".active").children().html();
        loadMovies(pno);
    });






})();