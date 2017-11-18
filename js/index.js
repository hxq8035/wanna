(() => {

    var bannerImgs = $("[data-load='bannerImgs']"),
        bannerInds = $("[data-load='bannerInds']");
    var timer = null, n = 0, TRANS = 500, INTERVAL = 3000;



    $.get("header.html").then(()=>{
        $("#index").addClass("active").siblings("active").removeClass("active");
        $("[data-id='login']").attr("href","login.html?continue=index.html");
    });

    $.get("data/index/banner.php", data => {
        var html = "",inds="";
        for (var i = 0; i < data.length; i++) {
            var img = data[i];
            html += `
            <a href="${img.href}" ${i==0?"class='showImg'":""} target="_blank" data-index="${i}" style=" background: url(${img.img}) center top no-repeat"></a>
        `;
            inds+=`
                <li ${i==0?"class='hover'":""} data-item="${i}"></li>
            `;
        }
        bannerImgs.html(html);
        bannerInds.html(inds);


    })
        .then(() => {
            function moveOnce() {
                n++;
                if (n == bannerImgs.children().length) {
                    n = 0;
                    bannerInds.children("[data-item=" + (bannerImgs.children().length - 1) + "]").removeClass("hover");
                    bannerImgs.children("[data-index=" + (bannerImgs.children().length - 1) + "]").removeClass("showImg")
                } else {
                    bannerInds.children("[data-item=" + (n - 1) + "]").removeClass("hover");
                    bannerImgs.children("[data-index=" + (n - 1) + "]").removeClass("showImg");
                }
                bannerImgs.children("[data-index=" + n + "]").addClass("showImg");
                bannerInds.children("[data-item=" + n + "]").addClass("hover");
            }

            timer = setInterval(moveOnce, INTERVAL + TRANS);
            return new Promise(resolve => resolve(moveOnce));
        })
        .then((moveOnce) => {
            bannerImgs.parent().mouseover(() => {
                clearInterval(timer);
                timer = null;
                $("a.ck-slide").show();
            }).mouseout(() => {
                timer = setInterval(moveOnce, INTERVAL + TRANS);
                $("a.ck-slide").hide();
            });

            bannerInds.on("click", "li", function () {
                n = $(this).data().item;
                bannerImgs.children(".showImg").removeClass("showImg");
                bannerImgs.children("[data-index=" + n + "]").addClass("showImg");
                $(this).addClass("hover").siblings(".hover").removeClass("hover");
            });

            $("[data-move=left]").click(e => {
                e.preventDefault();
                if (n > 0) {
                    n--;
                    bannerImgs.children("[data-index=" + (n + 1) + "]").removeClass("showImg").prev().addClass("showImg");
                    bannerInds.children("[data-item=" + (n + 1) + "]").removeClass("hover").prev().addClass("hover");
                } else {
                    n = bannerImgs.children().length - 1;
                    bannerImgs.children("[data-index=" + 0 + "]").removeClass("showImg");
                    bannerImgs.children("[data-index=" + n + "]").addClass("showImg");
                    bannerInds.children("[data-item=" + 0 + "]").removeClass("hover");
                    bannerInds.children("[data-item=" + n + "]").addClass("hover");

                }
            });
            $("[data-move=right]").click(e => {
                e.preventDefault();
                if (n < (bannerImgs.children().length - 1)) {
                    n++;
                    bannerImgs.children("[data-index=" + (n - 1) + "]").removeClass("showImg").next().addClass("showImg");
                    bannerInds.children("[data-item=" + (n - 1) + "]").removeClass("hover").next().addClass("hover");
                } else {
                    n = 0;
                    bannerImgs.children("[data-index=" + (bannerImgs.children().length - 1) + "]").removeClass("showImg");
                    bannerImgs.children("[data-index=" + n + "]").addClass("showImg");
                    bannerInds.children("[data-item=" + (bannerImgs.children().length - 1) + "]").removeClass("hover");
                    bannerInds.children("[data-item=" + n + "]").addClass("hover");

                }
            })
        })
        .catch(err => {
            console.log(err)
        });

    $.get("data/index/floors.php").then(
        (data) => {
            var f1 = data.topShow;
            var f1Num=data.topShowNum[0].sum;
            var f2 = data.soonShow;
            var f2Num=data.soonShowNum[0].sum;
            var f3 = data.topSale;
            var aside1=data.todayOffice;
            var aside2=data.expected;
            var aside3=data.score;


            for (var i = 0, html = ""; i < f1.length; i++) {
                var movie = f1[i];
                html += `
                    <li>
                       <div class="movie-item">
                        <div class="movie-poster">
                            <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                <img src="${movie.img}">
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
                html += `
                    </div>
                        </div>
                            </a>
                                </div>
                                <div class="buy-btn">
                                    <a href="buy.html?fid=${movie.fid}" target="_blank" class="ellipsis">购票</a>
                                </div>
                            </div>
                        </li> 
                `;
            }
            $("#floor1 .movie-list").html(html);
            $("#num1").html("（" + f1Num + "部）");

            for (var i = 0, html = ""; i < f2.length; i++) {
                var movie = f2[i];
                var time = movie.release_time.split('-');
                var month = time[1];
                var day = time[2];
                html += `
                        <li>
                            <div class="movie-item">
                                <div class="movie-poster">
                                    <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                        <img src="${movie.img}">
                                        <div class="movie-text">
                                            <div class="movie-icon">
                                                ${movie.icon == "3D" ? "<i class='i3d'></i>" : movie.icon == "3DIMAX" ? "<i class='max3d'></i>" : movie.icon == "2DIMAX" ? "<i class='max2d'></i>" : ""}
                                            </div>
                                            <div class="text-bottom">
                                                  <div class="text-name ellipsis" title="${movie.fname}">${movie.fname}</div>
                                            </div>
                                        </div>
                                    </a>
                                </div>
                                <div class="movie-detail ellipsis movie-wish ">
                                    <span>${movie.expected_num}</span>
                                    人想看
                                </div>
                                <div class="movie-detail ellipsis movie-grid">
                                    <a class="preView">预告片</a>
                                    <a href="buy.html?fid=${movie.fid}" target="_blank" class="preSale ${movie.is_onsale == 0 ? "" : "active"}">预售</a>
                                </div>
                            </div>
                            <div class="movie-detail ellipsis show-time">${month == null ? "暂定" : month + "月" + day + "日上映"}</div>
                        </li>
                `;
            }
            $("#floor2 .movie-list").html(html);
            $("#num2").html("（" + f2Num + "）部");

            for(var i=0,html="";i<f3.length;i++){
                var movie=f3[i];
                html+=`
                    <li>
                        <div class="movie-item">
                            <div class="movie-poster ${i==0?"movie-poster-long":""}">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                            <img src="${movie.img}">
                            <div class="movie-text">
                            <div class="movie-icon">
                                 ${movie.icon == "3D" ? "<i class='i3d'></i>" : movie.icon == "3DIMAX" ? "<i class='max3d'></i>" : movie.icon == "2DIMAX" ? "<i class='max2d'></i>" : ""}
                            </div>
                            <div class="text-bottom">`;
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
                            </div>
                        </div>
                    </li>
                `;
            }
            $("#floor3 .movie-list").html(html);


            for(var i=0,html="";i<aside1.length;i++){
                var movie=aside1[i];
                if(i==0){
                    html+= `
                        <li class=" ranking-item ranking-top">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <div class="ranking-top-img">
                                        <i></i>
                                        <img src="img/movie/sm/aside/wptg.jpg">
                                    </div>
                                    <div class="ranking-top-details">
                                        <div class="ranking-top-details-main">
                                            <span class="ranking-top-name ellipsis">${movie.film_name}</span>
                                            <p class="ranking-top-wish text-red">
                                                <span>${tranNum(movie.box_office)}</span>
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                    `;
                }else{
                    html+=`
                    <li class=" ranking-item">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <span class="normal-rank">
                                        <i class="ranking-index ${i==1?"text-red":i==2?"text-red":""}">${i+1}</i>
                                        <span class="normal-rank-name ellipsis">${movie.film_name}</span>
                                        <span class="normal-rank-num">
                                            ${tranNum(movie.box_office)}
                                        </span>
                                    </span>
                                </a>
                            </li>  
                `;
                }
            }
            $(".today-incomes .ranking-list").html(html);

            for(var i=0,html="";i<aside2.length;i++){
                var movie=aside2[i];
                if(i==0){
                    html+=`
                        <li class=" ranking-item ranking-top">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <div class="ranking-top-img">
                                        <i></i>
                                        <img src="img/movie/md/tlbj.jpg">
                                    </div>
                                    <div class="ranking-top-details">
                                        <div class="ranking-top-details-main">
                                            <span class="ranking-top-name ellipsis">${movie.fname}</span>
                                            <p class="release-time">上映时间：${movie.release_time}</p>
                                            <p class="ranking-top-wish text-yellow">
                                                <span>${movie.expected_num}</span>
                                                人想看
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                    `;
                } else if(i==1 || i==2){
                    html+=`
                        <li class=" ranking-item ${i==1?"ranking-index-2":"ranking-index-3"}">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                        <i class="ranking-index">${i+1}</i>
                                        <span>
                                            <img src="${i==1?"img/movie/sm/aside/qqfb.jpg":"img/movie/sm/aside/cszg.jpg"}">
                                        </span>
                                        <span class="top-name normal-rank-name  ellipsis">${movie.fname}</span>
                                        <span class="normal-rank-num">
                                            <span>${movie.expected_num}</span>
                                            人想看
                                        </span>
                                </a>
                            </li>
                    `;
                }else{
                    html+=`
                    <li class=" ranking-item ${i==3?"ranking-index-4":""}">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <span class="normal-rank">
                                        <i class="ranking-index">${i+1}</i>
                                        <span class="normal-rank-name ellipsis">${movie.fname}</span>
                                        <span class="normal-rank-num">
                                            <span>${movie.expected_num}</span>
                                            人想看
                                        </span>
                                    </span>
                                </a>
                            </li>
                `;
                }
            }
            $(".most-expect .ranking-list").html(html);


            for(var i=0,html="";i<aside3.length;i++){
                var movie=aside3[i];
                if(i==0){
                    html+=`
                        <li class=" ranking-item ranking-top">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <div class="ranking-top-img">
                                        <i></i>
                                        <img src="img/movie/sm/aside/bwbj.jpg">
                                    </div>
                                    <div class="ranking-top-details">
                                        <div class="ranking-top-details-main">
                                            <span class="ranking-top-name ellipsis">${movie.fname}</span>
                                            <p class="ranking-top-wish text-yellow">
                                                <span >${movie.score}</span>
                                                分
                                            </p>
                                        </div>
                                    </div>
                                </a>
                            </li>
                    `;
                }else{
                    html+=`
                         <li class=" ranking-item">
                                <a href="movie_detail.html?mid=${movie.fid}" target="_blank">
                                    <span class="normal-rank">
                                        <i class="ranking-index ${i==1?"text-yellow":i==2?"text-yellow":""}">${i+1}</i>
                                        <span class="normal-rank-name ellipsis">${movie.fname}</span>
                                        <span class="normal-rank-num">
                                            <span>${movie.score}</span>
                                            分
                                        </span>
                                    </span>
                                </a>
                            </li>
                    `;
                }
            }
            $(".top-100 .ranking-list").html(html);

        }
    );

    var date=format2(new Date());
    $("#time").html("北京时间"+date);
    setInterval(()=>{
        date=format2(new Date());
        $("#time").html("北京时间"+date);
    },60000);




})();