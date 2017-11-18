(()=>{
    var timer=null,n=0,TRANS=500,INTERVAL=3000,LIWIDTH=1200;
    var $bannerImgs=$("[data-load='bannerImgs']");
    var $bannerInds=$("[data-load='bannerInds']");

    $.get("header.html").then(()=>{
        $("#hot").addClass("active").siblings("active").removeClass("active");
        $("[data-id='login']").attr("href","login.html?continue=hot.html");
    });


    $.get("data/hot/hot_news.php")
        .then(data=>{
            for(var i=0,html="";i<6;i++){
                var news=data[i];
                html+=`
                    <div class="news-box">
                            <a href="news.html?nid=${news.nid}" target="_blank">
                                <img src="img/news/md/${news.img}">
                            </a>
                            <p class="des">
                                <a href="news.html?nid=${news.nid}" target="_blank" class="des-link ellipsis">
                                   ${news.title}
                                </a>
                            </p>
                            <div class="news-info">
                                <span>呀呵电影</span>
                                <span class="images-view view-count">${news.view_num}</span>
                            </div>
                        </div>
                `;
            }
            $("[data-load='news']").html(html);

            for(var i=6,html="";i<data.length;i++){
                var news=data[i];
                if(i==6){
                    html+=`
                        <li class="top-list">
                            <div>
                                <div class="top-list-img">
                                    <a href="news.html?nid=${news.nid}" target="_blank">
                                        <img src="img/news/sm/${news.img}">
                                        <i class="ranking top-ranking red-bg">1</i>
                                    </a>
                                </div>
                                <p class="top-news right-text">
                                    <a href="news.html?nid=${news.nid}" target="_blank" class="ellipsis" title="${news.title}">
                                        ${news.title}
                                    </a>
                                </p>
                            </div>
                        </li>
                    `;
                }else{
                    html+=`
                         <li>
                            <div class="normal-link">
                                <i class="ranking ${i==7?"text-red":i==8?"text-red":""}">${i-5}</i>
                                <p class="normal-news">
                                    <a href="news.html?nid=${news.nid}" target="_blank" class="ellipsis">${news.title}</a>
                                </p>
                            </div>
                        </li>
                    `;
                }
            }
            $("[data-load='rnews']").html(html);

            var html="";
            for(var news of data){
                var cons=news.content.split('%'),
                    ncon="";
                for(var cont of cons){
                    if(cont.charAt(0)!='i'){
                        ncon+=cont;
                        if(ncon.length>87){
                            ncon=ncon.slice(0,87)+"...";
                            break;
                        }
                    }
                }
                html+=`
                <div class="detail-news-box clear">
                    <a href="news.html?nid=${news.nid}" class="news-img" target="_blank">
                        <img src="img/news/md/${news.img}">
                    </a>
                    <div class="news-content">
                        <h4 class="ellipsis news-header">
                            <a href="news.html?nid=${news.nid}" target="_blank">${news.title}</a>
                        </h4>
                        <div class="news-text">
                           ${ncon}
                        </div>
                        <div class="news-info">
                            <span>呀呵电影</span>
                            <span class="news-date">${news.timer}</span>
                            <span class="images-view view-count">${news.view_num}</span>
                        </div>
                    </div>
                </div>
                `;
            }
            $(".detail-news-container").html(html);
        });

    $("[data-act='subnav']").on("click","li a",function (e) {
        e.preventDefault();
        var index=$(this).data().value;
        $(".container").children().eq(index).show().siblings().hide();
        $(this).parent().addClass("active").siblings(".active").removeClass("active");
        if(index==0){
            $("title").html("热点首页--呀呵电影");
        }else if(index==1){
            $("title").html("新闻资讯--呀呵电影");
        }else if(index==2){
            $("title").html("预告片--呀呵电影");
        }else if(index==3){
            $("title").html("精彩图集--呀呵电影");
        }
    });

    $("[data-act='allNews']").click((e)=>{
        e.preventDefault();
        $("title").html("新闻资讯--呀呵电影");
        $(".container").children().eq(1).show().siblings().hide();
        $("[data-act='subnav']").children().eq(1).addClass("active").siblings(".active").removeClass("active");
        window.scrollTo(0,0);
    });
    $("[data-act='allPre']").click((e)=>{
        e.preventDefault();
        $("title").html("预告片--呀呵电影");
        $(".container").children().eq(2).show().siblings().hide();
        $("[data-act='subnav']").children().eq(2).addClass("active").siblings(".active").removeClass("active");
        window.scrollTo(0,0);
    });
    $("[data-act='allImg']").click((e)=>{
        e.preventDefault();
        $("title").html("精彩图集--呀呵电影");
        $(".container").children().eq(3).show().siblings().hide();
        $("[data-act='subnav']").children().eq(3).addClass("active").siblings(".active").removeClass("active");
        window.scrollTo(0,0);
    });

    function moveOnce() {
        n++;
        var left=LIWIDTH*n;
        $bannerImgs.css("left",-left);
        $bannerInds.children().eq(n-1).removeClass("active");
        if(n==($bannerImgs.children().length-1)){
            $bannerInds.children().eq(0).addClass("active");
            setTimeout(()=>{
                $bannerImgs.css({
                    "transition":'all 0s linear',
                    "left":0
                });
                n=0;
                setTimeout(()=>{
                    var tran="all ."+TRANS/100+"s linear";
                    $bannerImgs.css("transition",tran);
                },200)
            },TRANS)
        }else {
            $bannerInds.children().eq(n).addClass("active");
        }
    }
    timer=setInterval(moveOnce,TRANS+INTERVAL);

    $bannerImgs.parent().mouseover( ()=> {
        clearInterval(timer);
        timer=null;
    }).mouseout( ()=> {
        timer=setInterval(moveOnce,INTERVAL+TRANS);
    });

    $bannerInds.on("click","li",(e)=>{
       n=$(e.target).html()-1;
       $bannerImgs.css("left",-n*LIWIDTH);
       $bannerInds.children().eq(n).addClass("active").siblings(".active").removeClass("active");
    })
})();
