/*eslint-disable */
var serialize = require('./serialize');
var cookie = require('./cookie');

var ajax = function (opts) {
    var url = opts.url,
        type = opts.type || 'get';

    var data = opts.data || {},
        successCallback = opts.successCallback || function () {},
        errorCallback = opts.errorCallback || function () {};

    var xhr;

    if ('XMLHttpRequest' in window) {
        xhr = new window.XMLHttpRequest();
    } else if ('ActiveXObject' in window) {
        xhr = new window.ActiveXObject('Microsoft.XMLHTTP');
    }

    var randomFuncName = ('getJSON_' + new Date().getTime() + Math.random()).replace('.', '_');
    var errorFuncName = ('getJSON_' + new Date().getTime() + Math.random()).replace('.', '_');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            var re = xhr.responseText;
            if (xhr.status >= 200 && xhr.status <= 300 || xhr.status === 304) {
                successCallback(re.indexOf('{') === 0 ? eval('(' + re + ')') : re);
            } else {
                errorCallback(re);
            }
        } else {
            errorCallback();
        }
    };

    var params = '';

    if (Object.prototype.toString.call(data) === '[object Object]' && data.isPrototypeOf) {
        params = serialize(data);
    }

    if (type !== 'post') {
        url += (url.indexOf('?') !== -1 ? '&' : '?') + params;
        if (type === 'jsonp') {
            url += ((params ? '&' : '') + 'callback=' + randomFuncName);
        }
    }

    if (type === 'jsonp') {
        window[randomFuncName] = successCallback;
        if (errorCallback && typeof errorCallback === 'function') {
            window[errorFuncName] = errorCallback;
        }

        var scriptNode = document.createElement('script');
        scriptNode.type = 'text/javascript';
        scriptNode.src = url;
        scriptNode.onload = scriptNode.onreadystatechange = function(){
            if (scriptNode.readyState && scriptNode.readyState !== 'loaded' && scriptNode.readyState !== 'complete') {
              return;
            }
            scriptNode.onload = scriptNode.onreadystatechange = null;
            document.body.removeChild(scriptNode);
        };

        if (window[errorFuncName]) {
            scriptNode.onerror = function() {
                if (scriptNode.readyState && scriptNode.readyState !== 'loaded' && scriptNode.readyState !== 'complete') {
                    return;
                }
                scriptNode.onerror = null;
                document.body.removeChild(scriptNode);
                window[errorFuncName]();
            }
        }

        document.body.appendChild(scriptNode);
        return;
    }

    // 用于前端跨域带cookie 不会影响到同源请求
    xhr.withCredentials = true;
    xhr.open(type === 'jsonp' ? 'get' : type, url, true);

    if (type === 'post') {
        xhr.setRequestHeader(
            'Content-Type', 'application/x-www-form-urlencoded'
        );
        xhr.setRequestHeader(
            'X-XSRF-TOKEN', cookie('XSRF-TOKEN') || window.ec_token
        );
    }
    xhr.send(type === 'post' ? (params || null) : null);

    return xhr;
};

var methods = ['post', 'get', 'getJSON'];
for (var i = 0; i < methods.length; i++) {
    var method = methods[i];
    ajax[method] = (function (method) {
        return function (url, data, successCallback, errorCallback) {
            // var isIE = !!window.ActiveXObject || 'ActiveXObject' in window,
            //     isLowerIE = isIE && !window.FormData,
            //     urlMatchArr = /(((.*?):)?\/\/(.*?))?\/(.*?)/.exec(url);

            // var isCors = false;
            // if (urlMatchArr && urlMatchArr[4] && urlMatchArr[4] !== window.location.host) {
            //     isCors = true;
            // }
            // if (isLowerIE && isCors) {
            //     method = 'getJSON';
            // }
            if (data instanceof Function) {
                errorCallback = successCallback;
                successCallback = data;
                data = {};
            }
            ajax({
                url: url,
                type: method === 'getJSON' ? 'jsonp' : method,
                data: data,
                successCallback: successCallback,
                errorCallback: errorCallback
            });
        };
    })(method);
}

ajax.submitForm = function (url, data, method, target) {
    var form = document.createElement('form');
    form.method = method || 'get';
    form.action = url;
    if (target) {
        form.target = target;
    }
    for (var i in data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = i;
        input.value = data[i];
        form.appendChild(input);
    }

    form.style.display = 'none';

    document.body.appendChild(form);

    form.submit();
};

module.exports = ajax;
