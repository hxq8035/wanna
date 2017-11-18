(()=>{

    var fid=parseSearch().fid;
    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=buy.html?fid="+fid);
    });

    $.get("data/order/buy.php",{fid})
        .then(data=>{
            if(data.movie.length>0){
                var movie=data.movie[0],
                    actors=data.actors,
                    isWish=data.isWish[0].soon,
                    moviecc=data.cc;
                $("[data-name='movie']").html(movie.fname);
                if(isWish>0){
                    if(movie.expected_num!=null){
                        $("[data-load='score']").html(movie.expected_num);
                        $("[data-load='score']").addClass("wish");
                    }else{
                        $("[data-load='score']").html(0);
                        $("[data-load='score']").addClass("wish");
                    }
                }else{
                    $("[data-load='score']").html(movie.score);
                }
                var arr=[];
                for(var lead of actors){
                    arr.push(lead.star_name);
                }
                var leading=arr.toString();
                var html=`
                    <div>
                        <span class="key">时长 :</span>
                        <span class="value">${movie.duration}分钟</span>
                    </div>
                    <div>
                        <span class="key">类型 :</span>
                        <span class="value"> ${movie.type} </span>
                    </div>
                    <div>
                        <span class="key">主演 :</span>
                        <span class="value"> ${leading}</span>
                    </div>
                `;
                $(".movie-desc").html(html);
                var timer=moviecc[0].ctimer.split(" ");
                $("[data-value='viewTimer']").html(timer[0].slice(5).replace('-','月')+"日");

                for(var i=0,html="";i<moviecc.length;i++){
                    var cc=moviecc[i];
                    html+=`
                        <tr class="${i%2==0?"":"even"}" data-value="${cc.cid}">
                        <td>
                            <span class="film">OAC影院</span>
                        </td>
                        <td>
                            <span class="begin-time">${timer[1].slice(0,5)}</span>
                        </td>
                        <td>
                            <span class="hall">${cc.hall_id}号厅</span>
                        </td>
                        <td>
                            <span class="sell-price">￥${movie.price}</span>
                        </td>
                        <td>
                            <a href="javascript:;" class="buy-btn" >选座购票</a>
                        </td>
                    </tr>
                    `;
                }

                $("tbody").html(html);
            }
        });

        $(".choose table").on("click",".buy-btn",function () {
                if(sessionStorage.getItem("uid")){

                    var film=$(this).parent().parent().find(".film").html(),
                        begin=$(this).parent().parent().find(".begin-time").html(),
                        hall=$(this).parent().parent().find(".hall").html(),
                        sellPrice=$(this).parent().parent().find(".sell-price").html(),
                        vtimer=$("[data-value='viewTimer']").html(),
                        cid=$(this).parent().parent().data().value;
                    location="choose_seat.html?film="+film+"&fid="+fid+"&begin="+begin+"&hall="+hall+"&sellPrice="+sellPrice+"&vtimer="+vtimer+"&cid="+cid;

                }else{
                    location="login.html?continue=buy.html?fid="+fid;
                }
            })



})();