/*eslint-disable */
var brokenImage = require('~cscommon/images/broken-img.png');
window.imgMsgError = function ($img, srcs) {
    // if ($img.src === 'loading.gif') {
    //     return;
    // }
    $img.src = brokenImage;
    $img.onclick = function (e) {
        $img.src = srcs.SmallImage;
        $img.parentNode.href = 'javascript:;';
    };
    $img.onload = function () {
        $img.onclick = null;
        var href = srcs.OriImage;
        if (typeof window.PVFunction === 'function') {
            href = 'javascript:ecShowImg(\'' + srcs.OriImage + '\')';
        }
        $img.parentNode.href = href;

        window.fixScroll($img);
    };

    window.fixScroll($img);
};
// msgImgLoadTimer
window.imgMsgLoaded = function ($img, srcs) {
    $img.onclick = null;

    var href = srcs.OriImage;
    if (typeof window.PVFunction === 'function') {
        href = 'javascript:ecShowImg(\'' + srcs.OriImage + '\')';
    }
    $img.parentNode.href = href;

    window.fixScroll($img);
};
