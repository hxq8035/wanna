(()=>{
    $.get("header.html").then(()=>{
        $("[data-id='login']").attr("href","login.html?continue=board_rule.html");
    });
})()