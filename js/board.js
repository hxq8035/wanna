(()=>{
    $.get("header.html").then(()=>{
        $("#boards").addClass("active").siblings("active").removeClass("active");
        $("[data-id='login']").attr("href","login.html?continue=boards.html");
    });


    function loadTop(movie,i) {
        var score = movie.score.split("."),
            int = score[0],
            fraction = score[1];
        var html=`
                <div class="list-card ${i==0?"list-card-1":i==1?"list-card-2":"list-card-3"}">
            <dl class="clear" data-value="${movie.fid}">
                <dt>
                    <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                        <img src="${movie.img}" >
                    </a>
                <div class="ranking-icon ranking-top-icon">
                    <span>${i==0?1:i==1?2:3}</span>
                </div>
                </dt>
                <dd class="actor-type">主演：</dd>
            </dl>
            <div class="movie-des">
                    <span class="score">
                            <i class="int">${int}.</i>
                            <i class="fraction">${fraction}</i>
                    </span>
                <div class="movie-name ellipsis">
                    <a href="movie_detail.html?mid=${movie.fid}" target="_blank">${movie.fname}</a>
                </div>
                <div class="release-time">上映时间：${movie.release_time==null?"暂无": movie.release_time}</div>
            </div>
        </div>
            `;
        return html;
    }
    function loadNormalTop(movie,i,rule){
        var html=`
                        <div class="list-card clear ${i==0?"office-top":""}">
                    ${i==0?"<a href='board_rule.html' target='_blank' class='rule'>榜单规则&gt;</a>":""}
                    <dl data-value="${movie.fid}">
                        <dt class="clear">
                            <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                <img src="${movie.img}" >
                            </a>
                        <div class="ranking-icon ${i==1?"top-2":i==2?"top-3":""}">${i==0?'<img src="img/board/1111.png" alt="">':i==1?2:3}</div>
                        </dt>
                        <dd class="actor-type">主演：</dd>
                    </dl>
                    <div class=" movie-des-right">
                        <div class="right-content">
                            <div class="movie-name-time">
                                <div class="movie-name ellipsis">
                                    <a href="movie_detail.html?mid=${movie.fid}" target="_blank ">${movie.fname}</a>
                                </div>
                                <div class="release-time">上映时间：${movie.release_time==null?"暂无": movie.release_time}</div>
                            </div>`;

        if(rule=='expected_num'){
            html+=`
                            <div class="movie-score expect">
                                <p class="p-size text-yellow">
                                    想看人数
                                    <span class="num">${movie.expected_num==null?"暂无":movie.expected_num}</span>
                                    人
                        `;
        }else {
            html+=`
                        <div class="movie-score expect">
                                <p class="p-size text-red">
                                    总票房：
                        `;
            if(movie.total_box_office>10000){
                var num=tranNum(movie.total_box_office).slice(0,-1),
                    up=tranNum(movie.total_box_office).slice(-1);
                html+=`
                                <span class="num">${num}</span>${up}
                            `;
            }else{
                html+=`<span class="num">${movie.total_box_office}</span>`
            }
        }
        html+=`
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                    `;

        return html;
    }
    function loadNormal(movie,i,rule,pno){
        var html=`
                        <div class="list-card clear">
                    <dl data-value="${movie.fid}">
                        <dt class="clear">
                            <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                <img src="${movie.img}" >
                            </a>
                            <div class="ranking-icon">${(i+1)+(pno-1)*10}</div>
                        </dt>
                        <dd class="actor-type">主演：</dd>
                    </dl>
                    <div class=" movie-des-right">
                        <div class="right-content">
                            <div class="movie-name-time">
                                <div class="movie-name ellipsis">
                                    <a href="movie_detail.html?mid=${movie.fid}" target="_blank ">${movie.fname}</a>
                                </div>
                                <div class="release-time">上映时间：${movie.release_time==null?"暂无": movie.release_time}</div>
                            </div>`;
        if(rule=='score'){
            var score = movie.score.split(".");
            var int = score[0];
            var fraction = score[1];
            html+=`
                            <div class="movie-score">
                                <span class="score">
                                    <i class="int">${int}.</i>
                                    <i class="fraction">${fraction}</i>
                                </span>
                            </div>`;
        }else if(rule=='expected_num'){
            html+=`
                            <div class="movie-score expect">
                                <p class="p-size text-yellow">
                                    想看人数
                                    <span class="num">${movie.expected_num==null?"暂无":movie.expected_num}</span>
                                    人
                                 </p>
                             </div>
                        `;
        }else {
            html+=`
                        <div class="movie-score expect">
                                <p class="p-size text-red">
                                    总票房：
                        `;
            if(movie.total_box_office>10000){
                var num=tranNum(movie.total_box_office).slice(0,-1),
                    up=tranNum(movie.total_box_office).slice(-1);
                html+=`
                                <span class="num">${num}</span>${up}
                            `;
            }else{
                html+=`<span class="num">${movie.total_box_office}</span>`
            }
            html+="</p></div>";
        }
        html+=` 
                        </div>
                    </div>
                </div>
                    `;
        return html;
    }
    function loadActors(fids) {
        for(var fid of fids){
            $.get("data/board/actors.php",{fid})
                .then(data=>{
                    if(data.length>0){
                        var html="";
                        var index=data[0].mid;
                        for(var actor of data){
                            html+=`<dd class="main-actor ellipsis" >${actor.star_name}</dd>`;
                        }
                        $(`[data-value=${index}]`).append(html);
                    }

                })
        }
    }

    function loadData(){
        var rule=$("[data-load='boards']").children(".active").data().value;
        var params="rule="+rule+"&pno=1",
            title=$("[data-load='boards']").children(".active").children().html();
        $("title").html(title+"--呀呵电影");
        $.get("data/board/board.php",params)
            .then(data=>{
                var fids=[];
                if(rule=='tips'){
                    rule="score";
                }
                var html="";
                if(rule=='score'){
                    html+=`
                        <div class="board-item-top clear">
                            <a href="board_rule.html" target="_blank" class="rule">榜单规则&gt;</a>
                    `;
                    var h1=loadTop(data[1],1),h2=loadTop(data[0],0),h3=loadTop(data[2],2);
                    html+=h1+h2+h3+"</div>";
                    for(var i=0;i<3;i++){
                        fids.push(data[i].fid);
                    }

                }else{
                    for(var i=0;i<3;i++){
                        var movie=data[i];
                        html+=loadNormalTop(movie,i,rule);
                        fids.push(data[i].fid);
                    }
                }
                for(var i=3;i<data.length;i++){
                    var movie=data[i];
                    html+=loadNormal(movie,i,rule,1);
                    fids.push(data[i].fid);
                }
                $(".board-list").html(html);
                var page=$("[data-load='boards']").children(".active").data().value;
                if(page=='expected_num' ){
                    var page=`
                        <ul class="page-list">
                            <li class="disabled"><a href="javascript:;">上一页</a></li>
                            <li class="active"><a href="javascript:;">1</a></li>
                            <li><a href="javascript:;">2</a></li>
                            <li><a href="javascript:;">3</a></li>
                            <li><a href="javascript:;">4</a></li>
                            <li><a href="javascript:;">5</a></li>
                            <li><a href="javascript:;">下一页</a></li>
                        </ul>
                    `;
                    $("[data-load='pageList']").html(page);
                }else if(page=='score'){
                    var page=`
                        <ul class="page-list">
                            <li class="disabled"><a href="javascript:;">上一页</a></li>
                            <li class="active"><a href="javascript:;">1</a></li>
                            <li><a href="javascript:;">2</a></li>
                            <li><a href="javascript:;">3</a></li>
                            <li><a href="javascript:;">下一页</a></li>
                        </ul>
                    `;
                    $("[data-load='pageList']").html(page);
                }else{
                    $("[data-load='pageList']").html("");
                }
                return new Promise(resolve=>resolve(fids))
            }).then(fids=>{
                loadActors(fids);
        })
    }
    var params=parseSearch();
    var rule=params.rule;
    if(rule=='expected'){
        $("[data-load='boards']").children().eq(1).addClass("active").siblings(".active").removeClass("active");
    }else if(rule=='TOP100'){
        $("[data-load='boards']").children().eq(3).addClass("active").siblings(".active").removeClass("active");
    }

    loadData();

    $("[data-load='boards']").on("click","li a",function(e){
        e.preventDefault();
        $(this).parent().addClass("active").siblings(".active").removeClass("active");
        loadData();
    });

    function loadPage(pno) {
        if(pno==1){
            loadData();
        }else{
            var rule=$("[data-load='boards']").children(".active").data().value;
            var params="rule="+rule+"&pno="+pno;
            $.get("data/board/board.php",params)
                .then(data=>{
                    var fids=[];
                    for(var i=0,html="";i<data.length;i++){
                        var movie=data[i];
                        html+=loadNormal(movie,i,rule,pno);
                        fids.push(data[i].fid);
                    }
                    $(".board-list").html(html);
                    $("[data-load='pageList']").children().children().eq(pno).addClass("active").siblings(".active").removeClass("active");
                    var pageCount;
                    if(rule=='score'){
                        pageCount=3;
                    }else if(rule=='expected_num'){
                        pageCount=5;
                    }
                    if(pno==pageCount){
                        $("[data-load='pageList']").children().children().eq(pageCount+1).addClass("disabled");
                        $("[data-load='pageList']").children().children().eq(0).removeClass("disabled");
                    }
                    if(pno!=1&&pno!=pageCount){
                        $("[data-load='pageList']").children().children().eq(0).removeClass("disabled");
                        $("[data-load='pageList']").children().children().eq(pageCount+1).removeClass("disabled");
                    }
                    return new Promise(resolve=>resolve(fids));
                })
                .then(fids=>{
                    loadActors(fids);
                });
        }
    }

    // 分页按钮点击事件
    $("[data-load='pageList']").on("click","li:not(.disabled):not(.active) a",function (e) {
        e.preventDefault();
        var $a=$(this),
            pno=parseInt($("[data-load='pageList'] li.active>a").html());
        if($a.parent().is(":first-child")){
            loadPage(pno-1);
        }else if($a.parent().is(":last-child")){
            loadPage(pno+1);
        }else{
            loadPage($a.html());
        }
        window.scrollTo(0,0);
    })




})();