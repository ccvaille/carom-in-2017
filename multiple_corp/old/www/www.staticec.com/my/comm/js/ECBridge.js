var ECBridge = (function () {
    var funcMap = {};
    var registedPVCall = {
        // '499': function () { }
    }

    window.ECPVsuperCall = function (command, json) {
        // var img = document.createElement("img");
        // img.src = "https://www.workec.com/?" + command + ":" + JSON.stringify(json);
        // img.style.display = "none";
        // document.body.appendChild(img);

        var name = json.data.callback;
        if (funcMap[name]) {
            funcMap[name](command, json);
            delete funcMap[name]
        }
        if (registedPVCall[command]) {
            registedPVCall[command](command, json);
        }
    };
    function getName() {
        return "callback_" + Date.now() + '_' + Math.floor(Math.random() * 100000);
    }

    function RegisterECPVCallback(callback) {
        var name = getName();
        while (funcMap[name]) {
            name = getName();
        }
        funcMap[name] = callback;
        return name;
    }

    function exec(params) {
        params = params || {};
        params.callback = RegisterECPVCallback(params.callback);
        window.PVFunction(params.command, JSON.stringify(params));
    }

    //客户端主动调用页面方法，例如广播消息，如果需要取消注册，请用空方法替换
    function registerPVCall(command, callback) {
        registedPVCall[command] = callback;
    }

    return {
        exec: exec,
        registerPVCall: registerPVCall
    };
})();
