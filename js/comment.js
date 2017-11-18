//禁用滚轮
function disabledMouseWheel() {
    if (document.addEventListener) {
        document.addEventListener('DOMMouseScroll', scrollFunc, false);
    }//W3C
    window.onmousewheel = document.onmousewheel = scrollFunc;//IE/Opera/Chrome
}
function scrollFunc(evt) {
    evt = evt || window.event;
    if(evt.preventDefault) {
        // Firefox
        evt.preventDefault();
        evt.stopPropagation();
    } else {
        // IE
        evt.cancelBubble=true;
        evt.returnValue = false;
    }
    return false;
}
//开启滚轮
function enableMouseWheel() {
    if (document.addEventListener) {
        document.removeEventListener("DOMMouseScroll",scrollFunc);
    }//W3C
    window.onmousewheel = document.onmousewheel = null;//IE/Opera/Chrome
}

$(".comment-overlay").click(function () {
    $("#commentBox").fadeOut(200);
    $(".comment-overlay").hide();
    $(".postBtn").addClass("disabled");
    enableMouseWheel();

});
$(".close-comment").click(function () {
    $("#commentBox").fadeOut(200);
    $(".comment-overlay").hide();
    $(".postBtn").addClass("disabled");
    enableMouseWheel();
});


