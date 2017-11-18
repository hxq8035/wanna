(()=>{

    var params=parseSearch();
    var href=params.continue;

    $("[data-act='login']").click((e)=>{
        e.preventDefault();
        $.post("data/header/login.php",$("#form").serialize())
            .then(data=>{
                if(data.code==200){
                   if(href==undefined){
                       location="index.html";
                   }else{
                       location=href;
                   }
                   var uname=$("[name='uname']").val(),
                       atatar=data.avatar,
                       uid=data.uid;
                   sessionStorage.setItem("uname",uname);
                   sessionStorage.setItem("avatar",atatar);
                   sessionStorage.setItem("uid",uid);
                }else if(data.code==201){
                    $(".validate-info").css("visibility",'visible');
                    $(".validate-info").children(".vali-icon").addClass("vali-icon-err");
                    $(".validate-info").children("span").html("用户名或密码错误，请重新输入！");
                }else if(data.code==401){
                    $(".validate-info").css("visibility",'visible');
                    $(".validate-info").children(".vali-icon").addClass("vali-icon-err");
                    $(".validate-info").children("span").html("请输入用户名！");
                }
                else if(data.code==402){
                    $(".validate-info").css("visibility",'visible');
                    $(".validate-info").children(".vali-icon").addClass("vali-icon-err");
                    $(".validate-info").children("span").html("请输入密码！");
                }
            })
    });
})()