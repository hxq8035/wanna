(()=>{
    var $uname=$("#uname"),
        $upwd=$("#upwd"),
        $reupwd=$("#reupwd"),
        $phone=$("#phone"),
        flag1=false,
        flag2=false,
        flag3=false,
        flag4=false,
        enable=false;

    function checkFocus($input,txt) {
        $input.next().show();
        $input.next().children("span").html(txt);
        $input.next().children(".vali-icon").removeClass("vali-icon-succ").removeClass("vali-icon-err");
        $input.removeClass("error");
        $input.prev().removeClass("text-red");
    }

    $uname.focus(e=>{
        checkFocus($(e.target),"由1~10位字符组成");
    }).blur(()=>{
        valiUname();
    });

    function error($input,txt) {
        $input.next().children(".vali-icon").removeClass("vali-icon-succ").addClass("vali-icon-err");
        $input.next().children("span").html(txt);
        $input.addClass("error");
        $input.prev().addClass("text-error");
    }
    function success($input,txt) {
        $input.next().children(".vali-icon").removeClass("vali-icon-err").addClass("vali-icon-succ");
        $input.next().children("span").html(txt);
        $input.removeClass("error");
        $input.prev().removeClass("text-error");
    }
    function valiUname(){
       return new Promise(resolve=>{
            if($uname.val()==""){
                error($uname,"用户名不能为空！");
                flag1=false;
            }else {
                if($uname.val().length>10){
                    error($uname,"用户名长度不能超过10位！");
                    flag1=false;
                } else{
                    $.post("data/register/vali.php",{uname:$uname.val()})
                        .then(data=>{
                            if(data.code==200){
                                success($uname,"通过");
                                flag1=true;
                                resolve();
                            }else{
                                error($uname,"用户名已存在！");
                                flag1=false;
                            }
                        })
                }
            }
            return flag1;
       })
    }
    
    function checkPwd() {
        return new Promise(resolve=>{
            if($upwd.val()!=$reupwd.val()){
                error($reupwd,"两次输入密码不一致！");
                flag2=false;
            }else if($reupwd.val()==""){
                error($reupwd,"请再次输入密码！");
                flag2=false;
            }else{
                success($reupwd,"通过");
                flag2=true;
                resolve();
            }
            return flag2;
        })

    }

    function valiUpwd(){
        return new Promise(resolve=>{
            if($upwd.val()==""){
                error($upwd,"请输入密码！");
                flag3=false;

            }else{
                if($upwd.val().length<6){
                    error($upwd,"密码太短，至少6个字符！");
                    flag3=false;
                }else if($upwd.val().length>20){
                    error($upwd,"密码太长，最多20个字符！");
                    flag3=false;
                }else{
                    success($upwd,"通过");
                    flag3=true;
                    resolve();
                }
            }
            return flag3;
        })
    }

    $upwd.focus(e=>{
       checkFocus($(e.target),"由6~20位字符组成");
    }).blur(()=>{
        valiUpwd();
        if(enable){
            checkPwd();
        }
    });
    var regs=[/[a-z]/,/[A-Z]/,/[0-9]/,/[%&*_~@#]/],
        $bar=$("[data-act='strength']");
    $upwd.keyup(e=>{
        var strength=0;
        for(var i=0;i<regs.length;i++){
            if(regs[i].test($upwd.val())){
                strength++;
            }
        }
        if($upwd.val().length>9){
            strength++;
        }
        switch (strength){
            case 1:
            case 2:
            case 3:
                $bar.removeClass("strength-strong strength-normal").addClass("strength-week");
                break;
            case 4:
                $bar.removeClass("strength-strong strength-week").addClass("strength-normal");
                break;
            case 5:
                $bar.removeClass("strength-normal strength-week").addClass("strength-strong");
                break;
            case 0:
                $bar.removeClass("strength-strong strength-normal strength-week");
                break;
        }
    });

    $reupwd.blur(e=>{
        enable=true;
        $(e.target).next().show();
        checkPwd();
    });

    function valiPhone() {
        return new Promise(resolve=>{
            var reg=/^1[34578]\d{9}$/;
            if($phone.val()==""){
                error($phone,"手机号不能为空！");
                flag4=false;
            }else{
                if(reg.test($phone.val())){
                    success($phone,"通过");
                    flag4=true;
                    resolve();
                }else{
                    error($phone,"请输入正确的手机号!");
                    flag4=false;
                }
            }
            return flag4;
        })
    }
    $phone.focus((e)=>{
        checkFocus($(e.target),"建议使用常用手机号");
    }).blur(e=>{
        valiPhone();
    });

    $("[data-act='register']").click(e=>{
        e.preventDefault();
        Promise.all([
            valiUname(),
            valiUpwd(),
            checkPwd(),
            valiPhone()
        ]).then(()=>{
            if(flag1 && flag2 && flag3 && flag4){
                $.post("data/register/register.php",$("#form").serialize())
                    .then(data=>{
                        if(data.code==200){
                            $(".success").show();
                            $(".succ-box").show();
                        }
                    })
            }
        })

    })

    $(".success").click(()=>{
        $(".success").hide();
        $(".succ-box").hide();
    });
    $("[data-act='lgClose']").click(()=>{
        $(".success").hide();
        $(".succ-box").hide();
    });




})();



