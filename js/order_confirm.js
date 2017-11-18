(()=>{
    var params=parseSearch();
    var fid=params.fid,
        timer=params.timer,
        total=params.total,
        fname=params.fname,
        seat=params.seat,
        sid=params.sid;
    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=buy.html?fid="+fid);
    });
    var html=`
        <tr>
                <td class="movie-name">${fname}</td>
                <td class="showtime">${timer}</td>
                <td>OAC影城</td>
                <td>${seat}</td>
            </tr>
    `;
    $("tbody").html(html);
    $(".price").html(total);
    $("[data-act='pay-click']").click(()=>{
        if(sessionStorage.getItem('uid')){
            location="pay.html?price="+total+"&fid="+fid+"&sid="+sid;
        }else{
            location="login.html?continue=buy.html?fid="+fid;
        }
    });

    var minute=14,sec=59;
    var myTimer=setInterval(()=>{
        sec--;
        if(sec==0){
            if(minute>0){
                minute-=1;
                sec=59;
            }else{
                clearInterval(myTimer);
                myTimer=null;
                $(".modal-container").show();
                disabledMouseWheel();
            }
        }
        $(".minute").html(minute);
        $(".second").html(sec);
    },1000);

    $(".ok-btn").click(()=>{
        location="buy.html?fid="+fid;
    });

})();