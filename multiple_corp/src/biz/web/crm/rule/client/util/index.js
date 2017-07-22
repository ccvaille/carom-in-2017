const getWindowHeight = function () {
    let height = window.innerHeight;

    if (window.innerHeight) {
        height = window.innerHeight;
    }    else if ((document.body) && (document.body.clientHeight)) {
        height = document.body.clientHeight;
    }
    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (document.documentElement && document.documentElement.clientHeight && document.documentElement.clientWidth) {
        height = document.documentElement.clientHeight;
    }
    /*if (_height < 768){
        debugger;
        _height = 768;
    }*/
    return height;
};

export { getWindowHeight };
