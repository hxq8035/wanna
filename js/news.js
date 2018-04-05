(()=>{

    var nid=parseSearch().nid;
    if(!nid){
        nid=1;
    }

    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=news.html?nid="+nid);
    });
    var params=location.search.slice(1);
    $.get("data/news/news.php",params)
        .then(result=>{
            if(result.length==0){
               location.href="notFound.html";
            }else{
                var data=result[0];
                $("title").html(data.title+"--呀呵电影");
                var html=`
                    <h1>${data.title}</h1>
                <div>
                    <span>呀呵电影</span>
                    <span>${data.timer}</span>
                    <span class="view"></span>
                    <span class="view-num">${data.view_num}</span>
                </div>
                `;
                $(".news-title").html(html);

                var contents=data.content.split("%"),html="";
                for(var con of contents){
                    if(con.charAt(0)=='i'){
                        html+=`
                            <p style="text-align: center">
                                 <img src="${con}" >
                            </p>
                        `;
                    }else{
                        html+=`<p>${con}</p>`;
                    }
                }
                $(".news-content").html(html);
            }
            return new Promise(resolve=>resolve())
        })
        .then(()=>{
            loadpage();
        });


    function loadpage(){
        $.get("data/news/comment.php",params+"&pno=1")
            .then(result=>{
                var data=result.data,
                    count=result.count.num;

                if(data.length>0){
                    var html="<ul data-load='comList'>",ids=[];
                    for (var i=0;i<data.length;i++){
                        var com=data[i];
                        ids.push(com.cid);
                        html+=`
                        <li class="comment-item ${count<8&&i==data.length-1?"last":""}" data-value="${com.cid}" data-flag="0">
                        <div class="avatar-container">
                            <div class="avatar">
                                <img src="${com.avatar}">
                            </div>
                            <i class="level-1-icon ${com.user_level==2?"level-2":com.user_level==3?"level-3":com.user_level==4?"level-4":com.user_level==5?"level-5":""}"></i>
                        </div>
                        <div class="comment-main" data-load="responses">
                            <div class="main-header">
                                <div class="user">
                                    <span>${com.uname}</span>
                                </div>
                                <div class="time">
                                    <span title="${com.comment_time}">${com.comment_time.slice(5,10)}</span>
                                </div>
                                <div class="good">
                                    <i class="good-icon" data-act="praise"></i>
                                    <span class="num">${com.praise>0?com.praise:"赞"}</span>
                                </div>
                                <div class="response-tips">回复</div>
                            </div>
                            <div class="comment-content">${com.content}</div>
                        </div>
                    </li>
                    `;
                    }
                    html+="</ul>";

                    if(count>8){
                        html+=`
                        <div class="loading-more" data-act="loadMore">
                            <span class="click" data-act="moreComment">查看更多评论</span>
                        </div>
                    `;
                    }
                    $("[data-load='comments']").html(html);

                }

                return new Promise(resolve=>resolve(ids));
            })
            .then((ids)=>{
                loadResponse(ids);

                var pno=1;
                $(".loading-more").on("click","span.click",()=>{
                    pno++;
                    $(".loading-more").html("<span>加载中...</span>");
                    loadComment(pno);
                });

            });
    }
    function loadComment(n){
        $.get("data/news/comment.php",params+"&pno="+n)
            .then(result=>{
                var data=result.data,
                    count=result.count.num,
                    rCount=result.recordCount;
                var ids=[];
                for (var i=0,html="";i<data.length;i++){
                    var com=data[i];
                    ids.push(com.cid);
                    html+=`
                            <li class="comment-item" data-value="${com.cid}"  data-flag="0">
                            <div class="avatar-container">
                                <div class="avatar">
                                    <img src="${com.avatar}">
                                </div>
                                <i class="level-1-icon ${com.user_level==2?"level-2":com.user_level==3?"level-3":com.user_level==4?"level-4":com.user_level==5?"level-5":""}"></i>
                            </div>
                            <div class="comment-main" data-load="responses">
                                <div class="main-header">
                                    <div class="user">
                                        <span>${com.uname}</span>
                                    </div>
                                    <div class="time">
                                        <span title="${com.comment_time}">${com.comment_time.slice(5,10)}</span>
                                    </div>
                                    <div class="good">
                                        <i class="good-icon" data-act="praise"></i>
                                        <span class="num">${com.praise>0?com.praise:"赞"}</span>
                                    </div>
                                    <div class="response-tips">回复</div>
                                </div>
                                <div class="comment-content">${com.content}</div>
                            </div>
                        </li>
                        `;
                }
                $("[data-load='comList']").append(html);

                var rrco=Math.ceil(count/8)*8,html="";
                if(rrco>rCount){
                    html=`
                            <span class="click" data-act="moreComment">查看更多评论</span>
                        `;
                }else if(rrco<=rCount){
                    html=`
                            <span>无更多内容</span>
                        `;
                }
                $(".loading-more").html(html);

                return new Promise(resolve=>resolve(ids));
            })
            .then(ids=>{
                loadResponse(ids);
            })
    }
    function loadResponse(ids) {
        for(var id of ids){
            $.get("data/news/response.php",{cid:id})
                .then((data)=>{
                    if(data.length>0){
                        var index=data[0].comment_id;
                        var html="";
                        for(res of data){
                            html+= `
                                   <div class="response">
                                        <div class="bubble"></div>
                                        <div class="response-content">
                                            <span class="name">${res.user_name}：</span>
                                            ${res.content}
                                        </div>
                                        </div>     
                                    `;
                        }
                        $(`[data-value=${index}]`).children("[data-load='responses']").append(html);
                    }
                })
        }
    }

    function showComment() {
        if(sessionStorage.getItem("uname")){
            $("#commentBox").fadeIn(200);
            $(".comment-overlay").show();
            disabledMouseWheel();
        }else{
            location="login.html?continue=news.html?nid="+nid;
        }
    }

    var isWho;
    $("[data-act='write']").click(function(){
        showComment();
        isWho=0;
    });
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
                $(".postBtn").removeClass("disabled");
            }).focusout(function () {
                $(this).parent().removeClass("focus");
                if($(".input_text").val()==""){
                    $(".postBtn").addClass("disabled");
                }
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

            $(".input_Foot").on("click","[data-act='postComment']:not(.disabled)",function () {
                var content=replace_em($(".input_text").val()),
                    uid=sessionStorage.getItem("uid"),
                    myTimer=format(new Date());
                if(!content){
                    content='#大爱';
                }

                if(isWho==0){
                    $.get("data/news/insert.php",{uid:uid,nid:nid,time:myTimer,content:content})
                        .then(data=>{
                            if(data.code==200){
                                loadpage();
                                $("#commentBox").fadeOut(200);
                                $(".comment-overlay").hide();
                                $(".input_text").val("");
                                $(".postBtn").addClass("disabled");
                                enableMouseWheel();
                            }
                        });
                }else if(isWho==1){
                    var uname=sessionStorage.getItem("uname");
                    $.get("data/news/insert_response.php",{content:content,resId:responseId,uname:uname})
                        .then(data=>{
                            if(data.code==200){
                                var html=`
                                <div class="response">
                                        <div class="bubble"></div>
                                        <div class="response-content">
                                            <span class="name">${uname}：</span>
                                            ${content}
                                        </div>
                                        </div>
                                `;
                                $(`[data-value=${responseId}]`).children("[data-load='responses']").append(html);
                                $("#commentBox").fadeOut(200);
                                $(".comment-overlay").hide();
                                $(".input_text").val("");
                                $(".postBtn").addClass("disabled");
                                enableMouseWheel();
                            }
                        })
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
            location="login.html?continue=news.html?nid="+nid;
        }
    });

    // 回复
    var responseId;
    $("[data-load='comments']").on("click",".response-tips",function () {
        showComment();
        isWho=1;
        responseId=$(this).parent().parent().parent().data("value");
    })

})();
