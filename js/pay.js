(()=>{
    var params=parseSearch();
    var fid=params.fid,
        price=params.price,
        sid=params.sid;
    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=buy.html?fid="+fid);
    });
    $(".amount-price").html(price);
    $("[data-act='payList']").on("click","li",function(){
        $(this).children(".payment-icon").addClass("checked").parent().siblings().children(".payment-icon.checked").removeClass("checked");
    });
    $("[data-act='pay']").click(()=>{
        if(sessionStorage.getItem('uid')){
            if($("[data-act='payList']").find(".checked").length>0) {
                var sids=sid.slice(0,-1);
                $.get("data/order/update_seat.php",{sid:sids});
                $(".success").show();
                $(".succ-box").show();
                disabledMouseWheel();
                clearInterval(myTimer);
                myTimer=null;
            }else{
                $("[data-act='choosePay']").show();
                disabledMouseWheel();
            }
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
                $("[data-act='rePay']").show();
                disabledMouseWheel();
            }
        }
        $(".minute").html(minute);
        $(".second").html(sec);
    },1000);

    $("[data-act='know']").click(()=>{
        location="buy.html?fid="+fid;
    });

    $("[data-act='goIndex']").click(()=>{
        location.replace("index.html");
    });

    $("[data-act='rem']").click(()=>{
        $("[data-act='choosePay']").hide();
        enableMouseWheel();
    })

})();