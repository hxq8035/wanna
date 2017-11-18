(()=>{

    function pad0(val) {
        return val>9?val:'0'+val;
    }
    var params=parseSearch();
    var fid=params.fid;
    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=buy.html?fid="+fid);
    });
    var film=params.film,begin=params.begin,hall=params.hall,sell=params.sellPrice,timer=params.vtimer,
        cid=params.cid;

    $("[data-load='film']").html(film);
    $("[data-load='hall']").html(hall);
    $("[data-load='time']").html(timer+" "+begin);
    $("[data-load='sell-price']").html(sell+"/张");
    $.get("data/order/buy.php",{fid})
        .then(data=>{
            var movie=data.movie[0];
            var html=`
                    <div class="poster">
                        <img src="${movie.md}">
                    </div>
                    <div class="content">
                        <p class="name ellipsis">${movie.fname}</p>
                        <div class="info-item">
                            <span>类型 :</span>
                            <span class="value">${movie.type}</span>
                        </div>
                        <div class="info-item">
                            <span>时长 :</span>
                            <span class="value">${movie.duration}分钟</span>
                        </div>
                    </div>
                `;
            $("[data-load='movieInfo']").html(html);
        });

    $.get("data/order/seat.php",{cid})
        .then(data=>{
            var row1='<div class="row">',row2='<div class="row">',row3='<div class="row">',
                row4='<div class="row">',row5='<div class="row">',row6='<div class="row">';
            if(hall.slice(0,1)==2){
                row5+=`<span class="seat empty" data-row-id="6"></span>`;
                row6+=`<span class="seat empty" data-row-id="6"></span><span class="seat empty" data-row-id="6"></span>`;
            }
            for(var seat of data){
                if(seat.srow==1){
                    row1+=`<span class="seat ${seat.is_sale>0?"sold":""}" data-column-id="${seat.scolumn}" data-row-id="${seat.srow}"  data-seat="${seat.sid}"></span>`;
                }else if(seat.srow==2){
                    row2+=`<span class="seat ${seat.is_sale>0?"sold":""}" data-column-id="${seat.scolumn}" data-row-id="${seat.srow}"  data-seat="${seat.sid}"></span>`;
                }else if(seat.srow==3){
                    row3+=`<span class="seat ${seat.is_sale>0?"sold":""}" data-column-id="${seat.scolumn}" data-row-id="${seat.srow}"  data-seat="${seat.sid}"></span>`;
                }else if(seat.srow==4){
                    row4+=`<span class="seat ${seat.is_sale>0?"sold":""}" data-column-id="${seat.scolumn}" data-row-id="${seat.srow}"  data-seat="${seat.sid}"></span>`;
                }else if(seat.srow==5){
                    row5+=`<span class="seat ${seat.is_sale>0?"sold":""}" data-column-id="${seat.scolumn}" data-row-id="${seat.srow}"  data-seat="${seat.sid}"></span>`;
                }else if(seat.srow==6){
                    row6+=`<span class="seat ${seat.is_sale>0?"sold":""}" data-column-id="${seat.scolumn}" data-row-id="${seat.srow}"  data-seat="${seat.sid}"></span>`;
                }
            }
            row1+="</div>";
            row2+="</div>";
            row3+="</div>";
            row4+="</div>";
            row5+="</div>";
            row6+="</div>";
            $(".seat-wrapper").html(row1+row2+row3+row4+row5+row6);
        });



    var num=0;
    $(".seat-wrapper").on("click","span:not(.empty):not(.sold)",function () {
        $(this).toggleClass("selected");
        num=$("span.selected").length;
        if(num>4){
            $(this).toggleClass("selected");
            $(".modal-container").show();
            disabledMouseWheel();
        }
        var total=parseInt(sell.slice(1))*num;
        $("[data-value='total']").html(total);
        if(num>0){
            var str="";
            for(var i=0;i<num;i++){
                str+=$("span.selected")[i].dataset.rowId+"排"+pad0($("span.selected")[i].dataset.columnId)+"座 ";
            }
            $("[data-load='tips']").html(str);
            $("[data-act='confirm']").removeClass("disabled");
            $(".no-selected").hide();
        }else{
            $("[data-act='confirm']").addClass("disabled");
            $("[data-load='tips']").html('一次最多选四个座位');
            $(".no-selected").show();
        }
    });

    $(".ok-btn").click(()=>{
        $(".modal-container").hide();
        enableMouseWheel();
    });

    $(".message").on("click","[data-act='confirm']:not(.disabled)",()=>{
        if(sessionStorage.getItem('uid')){
            var fname=$(".name").html(),
                timer=$("[data-load='time']").html(),
                seat=$("[data-load='tips']").html(),
                totalPrice=$("[data-value='total']").html(),
                sid="";
            var count=$("span.selected").length;
            for(var i=0;i<count;i++){
               sid+=$("span.selected")[i].dataset.seat+",";
            }


            location="order_confirm.html?fname="+fname+"&fid="+fid+"&timer="+timer+"&seat="+seat+"&total="+totalPrice+"&sid="+sid;
        }else{
            location="login.html?continue=buy.html?fid="+fid;
        }
    })






})();