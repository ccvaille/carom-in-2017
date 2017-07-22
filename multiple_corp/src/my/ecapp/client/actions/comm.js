const host = "https://my.workec.com";
const actions = {
    'RESET': Symbol(),
    'NULL': Symbol()
};


function checkHttpStatus(res) {
    if (res.status === 401) {
        location.href = "//corp.workec.com";
    } else if (res.status === 403) {
        message.error('您没有权限！');
    } else if (res.status === 500) {
        message.error('服务器内部错误，请稍后再试！');
    } else if (res.status === 404) {
        message.error('接口返回错误！');
    }
}


//打开PV页面
function openPV(param) {
    var url = param.url;
    if (!url) {
        return;
    }

    if (window.PVFunction && window.ECBridge) {
        param.command = 504;
        window.ECBridge.exec(param);
    } else {
        window.open(url, "_blank");
    }
    //action需要返回值
    return { type: "NULL" }
}
//打开聊天窗口
function openChatWindow(param) {
    if (window.PVFunction && window.ECBridge) {
        param.command = 514;
        window.ECBridge.exec(param);
    }
    //action需要返回值
    return { type: "NULL" }
}

function resetShowIndex() {
    return { type: actions["RESET"] };
}

var Cookie = {
    get: function (name) {
        var reg = new RegExp("(^| )" + name + "(?:=([^;]*))?(;|$)"), val = document.cookie.match(reg);
        return val ? (val[2] ? unescape(val[2]).replace(/(^")|("$)/g, "") : "") : null;
    },
    set: function (name, value, expires, path, domain, secure) {
        var exp = new Date(), expires = arguments[2] || null, path = arguments[3] || "/", domain = arguments[4] || null, secure = arguments[5] || false;
        expires ? exp.setMinutes(exp.getMinutes() + parseInt(expires)) : "";
        document.cookie = name + '=' + escape(value) + (expires ? ';expires=' + exp.toGMTString() : '') + (path ? ';path=' + path : '') + (domain ? ';domain=' + domain : '') + (secure ? ';secure' : '');
    }
};

var bindScrollGetMore = (function () {
    var scrollFn;
    var timer;

    var wrapScrollFn = function (fn) {
        clearTimeout(timer);
        var _fn = function (e) {
            clearTimeout(timer);
            //防止初始化的时候，滚动高度为0，如果100毫秒后，还是0，说明真的需要加载了
            timer = setTimeout(function () {
                if (document.body.scrollTop == 0) {
                    fn();
                }
            }, 100);
        }
        return _fn;
    }
    return function (fn) {
        if (scrollFn) {
            window.removeEventListener('scroll', scrollFn);
        }
        if (fn) {
            fn = wrapScrollFn(fn);
            window.addEventListener('scroll', fn);
            scrollFn = fn;
        }
        return { type: actions["NULL"] };
    }
})();

export {
    actions,
    host,
    checkHttpStatus,
    openPV,
    openChatWindow,
    resetShowIndex,
    Cookie,
    bindScrollGetMore
}
