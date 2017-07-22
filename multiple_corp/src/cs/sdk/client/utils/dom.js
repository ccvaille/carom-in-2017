/*eslint-disable */
function addEvent(eles, evtName, cb, capture) {
    if (!Array.isArray(eles)) {
        eles = [eles];
    }
    eles.forEach(function (ele) {
        evtName.split(' ').forEach(function (evtName) {
            if (window.addEventListener) {
                ele.addEventListener(evtName, cb, !!capture);
            } else if (window.attachEvent) {
                ele.attachEvent('on' + evtName, function () {
                    cb.apply(ele, arguments);
                });
            } else {
                ele['on' + evtName] = cb;
            }
        });
    });
}

function removeEvent(eles, evtName, cb) {
    if (!Array.isArray(eles)) {
        eles = [eles];
    }
    eles.forEach(function (ele) {
        evtName.split(' ').forEach(function (evtName) {
            if (window.addEventListener) {
                ele.removeEventListener(evtName, cb);
            } else if (window.attachEvent) {
                ele.detachEvent('on' + evtName, cb);
            } else {
                ele['on' + evtName] = null;
            }
        });
    });
}

function removeClass(ele, cls) {
    ele.className = (' ' + ele.className + ' ').replace(' ' + cls, '').replace(/^\s+|\s+$/g, '');
}

function addClass(ele, cls) {
    removeClass(ele, cls); // 去重
    ele.className = ele.className + ' ' + cls;
}

function $(selector, context) {
    selector = selector || 'html';
    context = context || document;

    var nodeList = context.querySelectorAll(selector);
    if (nodeList.length > 1) {
        return nodeList;
    }
    return nodeList[0];
}

function getWindowHeight() {
    var height = window.innerHeight;

    if (window.innerHeight) {
        height = window.innerHeight;
    } else if ((document.body) && (document.body.clientHeight)) {
        height = document.body.clientHeight;
    }

    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (
        document.documentElement &&
        document.documentElement.clientHeight &&
        document.documentElement.clientWidth
    ) {
        height = document.documentElement.clientHeight;
    }

    return height;
}

function getWindowWidth() {
    var width = window.innerWidth;

    if (window.innerWidth) {
        width = window.innerWidth;
    } else if ((document.body) && (document.body.clientWidth)) {
        width = document.body.clientWidth;
    }

    // 通过深入 Document 内部对 body 进行检测，获取窗口大小
    if (
        document.documentElement &&
        document.documentElement.clientWidth &&
        document.documentElement.clientWidth
    ) {
        width = document.documentElement.clientWidth;
    }

    return width;
}

function getStyle(ele, prop) {
    var style = ele.currentStyle || window.getComputedStyle(ele, '');
    if(prop === 'opacity' && navigator.userAgent.indexOf('MSIE') != -1 && !window.addEventListener) // ie6-8 opacity 补丁
        if (ele.style.filter && ele.style.filter != 'none') {
            return ele.style.filter.match(/\d+/g)[0];
        } else {
            return 1;
        }
    return style[prop];
}

function setStyle(ele, props) {
    for (var prop in props) {
        if(prop === 'opacity' && navigator.userAgent.indexOf('MSIE') != -1 && !window.addEventListener) // ie6-8 opacity 补丁
            ele.style.filter = 'alpha(' + prop + '=' + props[prop]*100 + ')';
        else ele.style[prop] = props[prop];
    }
}

module.exports = {
    addEvent: addEvent,
    removeEvent: removeEvent,
    removeClass: removeClass,
    addClass: addClass,
    getWindowHeight: getWindowHeight,
    getWindowWidth: getWindowWidth,
    getStyle: getStyle,
    setStyle: setStyle,
    $: $
};
