/**
 * Created by borgxiao on 2017/6/6.
 */
$(function(){
    var oWinwidth = 0;
    function size() {
        oWinwidth = $(window).width();
        $(".head-items li").removeAttr("style").width(oWinwidth);
        if (oWinwidth < 640) {
            $(".head-items li").height(oWinwidth / 2.1333);
        }
    }
    //banner 切换
    var oHeadItems = $(".head-items li").length;
    oAni = null,
        oHeadLi = 0;
    $(".head-items").append($(".head-items").html());
    if (oHeadItems == 1) {} else {
        for (var i = 0; i < oHeadItems; i++) {
            $(".head-span").append("<span class='head-dian'></span>");
        }
    }
    $(".head-span .head-dian").eq(0).addClass("head-click");
    function ani() {
        oAni = setInterval(function() {
            oHeadLi++;
            if (oHeadLi > oHeadItems) {
                oHeadLi = 1;
                $(".head-items").css("margin-left", -(oHeadLi - 1) * oWinwidth + "px")
            }

            $(".head-items").stop().animate({
                marginLeft: -oHeadLi * oWinwidth
            }, 500);
            var gg = oHeadLi >= oHeadItems ? oHeadItems - oHeadLi : oHeadLi;
            $(".head-span .head-dian").removeClass("head-click");
            $(".head-span .head-dian").eq(gg).addClass("head-click");

        }, 3000);

    }
    $(window).load(function() {
        if (oHeadItems == 1) {} else {
            ani();
        }
    });

    $(".head-span .head-dian").click(function() {
        clearInterval(oAni);
        oHeadLi = $(".head-span .head-dian").index(this);
        $(".head-items").stop().animate({
            marginLeft: -oHeadLi * oWinwidth
        }, 500);
        $(".head-span .head-dian").removeClass("head-click");
        $(".head-span .head-dian").eq(oHeadLi).addClass("head-click");
        ani();
    });
    $(window).resize(function() {
        size();
    });
    size();
});