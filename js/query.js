(()=>{
    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=query.html");
    });

    var kw=decodeURIComponent(parseSearch().kw);

   if(kw!=""&&kw!='undefined'){
        $(".lg-search").val(kw);
        loadPage();
    }
    function loadPage(pno=1){
        $.get("data/query.php",{kw:$(".lg-search").val(),pno})
            .then(data=>{
                var movies=data.data,
                    pageCount=data.pageCount,
                    pno=data.pno;
                if(movies.length>0){
                    var html=`
                    <ul class="result-list">
                    `;
                    for(var movie of movies ){
                        html+=`
                             <li>
                                <a class="movie-img" href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <img src="${movie.md}">
                                    <div class="movie-icon">
                                      ${movie.icon == "3D" ? "<i class='i3d'></i>" : movie.icon == "3DIMAX" ? "<i class='max3d'></i>" : movie.icon == "2DIMAX" ? "<i class='max2d'></i>" : ""}
                                    </div>
                                </a>
                                <div class="movie-info">
                                    <div class="movie-name">
                                        <a href="movie_detail.html?mid=${movie.fid}" target="_blank">${movie.fname}</a>
                                    </div>
                                    <div class="ename">${movie.f_ename}</div>
                                    <div class="score">${movie.score==null?"暂无评分":movie.score}</div>
                                    <div class="movie-type">${movie.type}</div>
                                    <div class="timer">${movie.release_time}</div>
                                </div>
                             </li>
                        `;
                    }
                    html+=`
                        </ul>
                        <div class="pages" style="margin-top: 80px">
                         <ul class="page-list" data-load="pageList">
                         <li><a href="javascript:;">上一页</a></li>
                    `;
                    if(pno-2>0){
                        html+=`<li><a href="javascript:;">${pno-2}</a></li>`
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
                    html+=`
                            <li><a href="javascript:;">下一页</a></li>
                        </ul>
                        </div>
                    `;
                    $(".search-box").html(html);
                    if(pno==1){
                        $("[data-load='pageList']>li:first-child").addClass("disabled")
                    }
                    if(pno==pageCount){
                        $("[data-load='pageList']>li:last-child").addClass("disabled")
                    }
                    if(pno!=1&&pno!=pageCount){
                        $("[data-load='pageList']>li:first-child,[data-load='pageList']>li:last-child").removeClass("disabled");
                    }

                }else{
                    var html=`
                        <div class="empty">
                            <h3>抱歉没有找到相关影视剧</h3>
                            <dl>
                                <dt>小喵建议您：</dt>
                                <dd>1. 请检查输入的关键词是否有误</dd>
                                <dd>2. 请缩短关键词</dd>
                            </dl>
                        </div>
                    `;
                    $(".search-box").html(html);
                }
                return new Promise(resolve=>resolve())
            }).then(()=>{
            $("[data-load='pageList']").on("click","li:not(.disabled):not(.active) a",function (e) {
                e.preventDefault();
                var $a=$(e.target),
                    pno=parseInt($("[data-load='pageList']>li.active a").html());

                if($a.parent().is(":first-child")){
                    loadPage(pno-1);
                }else if($a.parent().is(":last-child")){
                    loadPage(pno+1);
                }else{
                    loadPage($a.html());
                }
                window.scrollTo(0,0);
            });
        })
    }

    var $searchList=$("#searchList"),$searchInput=$("#searchInput");
    $(window).click(e=>{
        if($(e.target).attr("id")!="searchList" && $(e.target).attr("id")!="searchInput"){
            $searchList.hide();
        }
    });

    $searchInput.focus(e=>{
        loadSearch(e,$searchInput,$searchList);
    });
    $searchInput.keyup(e=>{
        loadSearch(e,$searchInput,$searchList);
    });
    $searchInput.keydown(function(e){
        loadKeyDown(e,$searchInput,$searchList);
    });

    $("#searchBtn").click(()=>{
        if($searchInput.val()!=""){
            loadPage();
        }
    })



})();