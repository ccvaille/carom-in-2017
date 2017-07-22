//生成API
(function(){    
    window.PVAPI = {  //api全局变量
        hasPVFun: true,
        isMac: navigator.userAgent.toLowerCase().indexOf("mac") > -1,
        version: ''
    };
    var supportAPIList;  //该版本支持的API
    var codeMsg = {
        '-2': 'initializing',
        '-1': 'unsupported'
    };

    var commonAPI = {
        '506': 'setMinimize',
        '507': 'setMaximize',
        '508': 'setNormalize',
        '509': 'closePV',
        '510': 'closeNative',
        '511': 'dragStart',
        '512': 'dragEnd',
        '524': 'relogin'
    };
    var apiList = [501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 512, 513, 514, 515, 516, 517, 518, 519, 520, 521, 522, 524, 525, 526, 527, 534];  //api列表

    // md5库
    (function($){Function.prototype.haodayigekeng=function(){var that=this;var temp=function temporary(){return that.apply(this,arguments)};for(var key in this){if(this.hasOwnProperty(key)){temp[key]=this[key]}}return temp};window._unescape=window.unescape.haodayigekeng();function safeAdd(x,y){var lsw=(x&65535)+(y&65535);var msw=(x>>16)+(y>>16)+(lsw>>16);return(msw<<16)|(lsw&65535)}function bitRotateLeft(num,cnt){return(num<<cnt)|(num>>>(32-cnt))}function md5cmn(q,a,b,x,s,t){return safeAdd(bitRotateLeft(safeAdd(safeAdd(a,q),safeAdd(x,t)),s),b)}function md5ff(a,b,c,d,x,s,t){return md5cmn((b&c)|((~b)&d),a,b,x,s,t)}function md5gg(a,b,c,d,x,s,t){return md5cmn((b&d)|(c&(~d)),a,b,x,s,t)}function md5hh(a,b,c,d,x,s,t){return md5cmn(b^c^d,a,b,x,s,t)}function md5ii(a,b,c,d,x,s,t){return md5cmn(c^(b|(~d)),a,b,x,s,t)}function binlMD5(x,len){x[len>>5]|=128<<(len%32);x[(((len+64)>>>9)<<4)+14]=len;var i;var olda;var oldb;var oldc;var oldd;var a=1732584193;var b=-271733879;var c=-1732584194;var d=271733878;for(i=0;i<x.length;i+=16){olda=a;oldb=b;oldc=c;oldd=d;a=md5ff(a,b,c,d,x[i],7,-680876936);d=md5ff(d,a,b,c,x[i+1],12,-389564586);c=md5ff(c,d,a,b,x[i+2],17,606105819);b=md5ff(b,c,d,a,x[i+3],22,-1044525330);a=md5ff(a,b,c,d,x[i+4],7,-176418897);d=md5ff(d,a,b,c,x[i+5],12,1200080426);c=md5ff(c,d,a,b,x[i+6],17,-1473231341);b=md5ff(b,c,d,a,x[i+7],22,-45705983);a=md5ff(a,b,c,d,x[i+8],7,1770035416);d=md5ff(d,a,b,c,x[i+9],12,-1958414417);c=md5ff(c,d,a,b,x[i+10],17,-42063);b=md5ff(b,c,d,a,x[i+11],22,-1990404162);a=md5ff(a,b,c,d,x[i+12],7,1804603682);d=md5ff(d,a,b,c,x[i+13],12,-40341101);c=md5ff(c,d,a,b,x[i+14],17,-1502002290);b=md5ff(b,c,d,a,x[i+15],22,1236535329);a=md5gg(a,b,c,d,x[i+1],5,-165796510);d=md5gg(d,a,b,c,x[i+6],9,-1069501632);c=md5gg(c,d,a,b,x[i+11],14,643717713);b=md5gg(b,c,d,a,x[i],20,-373897302);a=md5gg(a,b,c,d,x[i+5],5,-701558691);d=md5gg(d,a,b,c,x[i+10],9,38016083);c=md5gg(c,d,a,b,x[i+15],14,-660478335);b=md5gg(b,c,d,a,x[i+4],20,-405537848);a=md5gg(a,b,c,d,x[i+9],5,568446438);d=md5gg(d,a,b,c,x[i+14],9,-1019803690);c=md5gg(c,d,a,b,x[i+3],14,-187363961);b=md5gg(b,c,d,a,x[i+8],20,1163531501);a=md5gg(a,b,c,d,x[i+13],5,-1444681467);d=md5gg(d,a,b,c,x[i+2],9,-51403784);c=md5gg(c,d,a,b,x[i+7],14,1735328473);b=md5gg(b,c,d,a,x[i+12],20,-1926607734);a=md5hh(a,b,c,d,x[i+5],4,-378558);d=md5hh(d,a,b,c,x[i+8],11,-2022574463);c=md5hh(c,d,a,b,x[i+11],16,1839030562);b=md5hh(b,c,d,a,x[i+14],23,-35309556);a=md5hh(a,b,c,d,x[i+1],4,-1530992060);d=md5hh(d,a,b,c,x[i+4],11,1272893353);c=md5hh(c,d,a,b,x[i+7],16,-155497632);b=md5hh(b,c,d,a,x[i+10],23,-1094730640);a=md5hh(a,b,c,d,x[i+13],4,681279174);d=md5hh(d,a,b,c,x[i],11,-358537222);c=md5hh(c,d,a,b,x[i+3],16,-722521979);b=md5hh(b,c,d,a,x[i+6],23,76029189);a=md5hh(a,b,c,d,x[i+9],4,-640364487);d=md5hh(d,a,b,c,x[i+12],11,-421815835);c=md5hh(c,d,a,b,x[i+15],16,530742520);b=md5hh(b,c,d,a,x[i+2],23,-995338651);a=md5ii(a,b,c,d,x[i],6,-198630844);d=md5ii(d,a,b,c,x[i+7],10,1126891415);c=md5ii(c,d,a,b,x[i+14],15,-1416354905);b=md5ii(b,c,d,a,x[i+5],21,-57434055);a=md5ii(a,b,c,d,x[i+12],6,1700485571);d=md5ii(d,a,b,c,x[i+3],10,-1894986606);c=md5ii(c,d,a,b,x[i+10],15,-1051523);b=md5ii(b,c,d,a,x[i+1],21,-2054922799);a=md5ii(a,b,c,d,x[i+8],6,1873313359);d=md5ii(d,a,b,c,x[i+15],10,-30611744);c=md5ii(c,d,a,b,x[i+6],15,-1560198380);b=md5ii(b,c,d,a,x[i+13],21,1309151649);a=md5ii(a,b,c,d,x[i+4],6,-145523070);d=md5ii(d,a,b,c,x[i+11],10,-1120210379);c=md5ii(c,d,a,b,x[i+2],15,718787259);b=md5ii(b,c,d,a,x[i+9],21,-343485551);a=safeAdd(a,olda);b=safeAdd(b,oldb);c=safeAdd(c,oldc);d=safeAdd(d,oldd)}return[a,b,c,d]}function binl2rstr(input){var i;var output="";var length32=input.length*32;for(i=0;i<length32;i+=8){output+=String.fromCharCode((input[i>>5]>>>(i%32))&255)}return output}function rstr2binl(input){var i;var output=[];output[(input.length>>2)-1]=undefined;for(i=0;i<output.length;i+=1){output[i]=0}var length8=input.length*8;for(i=0;i<length8;i+=8){output[i>>5]|=(input.charCodeAt(i/8)&255)<<(i%32)}return output}function rstrMD5(s){return binl2rstr(binlMD5(rstr2binl(s),s.length*8))}function rstrHMACMD5(key,data){var i;var bkey=rstr2binl(key);var ipad=[];var opad=[];var hash;ipad[15]=opad[15]=undefined;if(bkey.length>16){bkey=binlMD5(bkey,key.length*8)}for(i=0;i<16;i+=1){ipad[i]=bkey[i]^909522486;opad[i]=bkey[i]^1549556828}hash=binlMD5(ipad.concat(rstr2binl(data)),512+data.length*8);return binl2rstr(binlMD5(opad.concat(hash),512+128))}function rstr2hex(input){var hexTab="0123456789abcdef";var output="";var x;var i;for(i=0;i<input.length;i+=1){x=input.charCodeAt(i);output+=hexTab.charAt((x>>>4)&15)+hexTab.charAt(x&15)}return output}function str2rstrUTF8(input){return window._unescape(encodeURIComponent(input))}function rawMD5(s){return rstrMD5(str2rstrUTF8(s))}function hexMD5(s){return rstr2hex(rawMD5(s))}function rawHMACMD5(k,d){return rstrHMACMD5(str2rstrUTF8(k),str2rstrUTF8(d))}function hexHMACMD5(k,d){return rstr2hex(rawHMACMD5(k,d))}function md5(string,key,raw){if(!key){if(!raw){return hexMD5(string)}return rawMD5(string)}if(!raw){return hexHMACMD5(key,string)}return rawHMACMD5(key,string)}if(typeof define==="function"&&define.amd){define(function(){return md5})}else{if(typeof module==="object"&&module.exports){module.exports=md5}else{$.md5=md5}}}(window.PVAPI));

    window.ECBridge = (function () {
        var funcMap = {};
        var registedPVCall = {}

        window.ECPVsuperCall = function (command, json) {
            if (json.data && json.data.callback && funcMap[json.data.callback]) {
                funcMap[json.data.callback](json);
                delete funcMap[json.data.callback]
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
            if(typeof window.PVFunction=='function'){
                window.PVFunction(params.command, JSON.stringify(params));
            }else if(typeof window.top.PVFunction=='function'){  //iframe获取最初页面PVFunction
                window.top.PVFunction(params.command, JSON.stringify(params));
            }
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

    function getParam(key, url){
        var n = arguments[1] || window.location.search
            , r = new RegExp("(^|&)" + key + "=([^&]*)(&|$)","i")
            , o = n.substr(n.indexOf("?") + 1).match(r);
        return o != null ? o[2] : ""
    }

    function addParam(url, param){
        var n = url.split("#");
        var r = n[1];
        var o = url.indexOf("?") >= -1;
        url = n[0];
        for (var i in param) {
            var a = new RegExp("([?&])" + i + "=[^&]*(&|$)","i");
            if (a.test(url)) {
                url = url.replace(a, "$1" + i + "=" + param[i] + "$2")
            } else {
                url += (url.indexOf("?") > -1 ? "&" : "?") + i + "=" + param[i]
            }
        }
        if (r) {
            url = url + "#" + r
        }
        return url        
    }

    function getpvkey(path, key, url){
        var md5ValueArr = [];
        if(!path){  //没有指定path以url为key
            return false;
        }
        md5ValueArr.push(path);
        if(key && key.length > 0){  //参数排序取值
            key.sort();
            key.map(function(item){
                md5ValueArr.push(item + '=' + getParam(item, url));
            });
        }
        return PVAPI.md5(md5ValueArr.join(","));
    }

    function checkAPI(api){
        return 0;
        // if(!supportAPIList){  //初始化未完成
        //     return -2;
        // }else if(supportAPIList.indexOf(api) > -1){  //支持
        //     return 0;
        // }else{  //不支持
        //     return -1
        // }
    }

    if(!window.PVFunction && !window.top.PVFunction){
        PVAPI.hasPVFun = false;
        return;
    }  
    PVAPI.version = navigator.userAgent.toLowerCase().split("ec/")[1];
    ECBridge.exec({
        command: 501,
        callback: function(json){
            if(json.code == 0 && json.data && json.data.funcs){
                supportAPIList = json.data.funcs;
            }

        }
    });    
    for(var i = 0 , len = apiList.length ; i < len ; i ++){
        (function(api){
            switch(api){
                case 501: 
                    PVAPI.getFunctionList = function(){
                        var cb = arguments[0];
                        if(!cb){
                            return;
                        }
                        var code = checkAPI(api);
                        if(code != 0){
                            cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    "funcs": []
                                }
                            }); 
                            return;                            
                        }
                        cb({
                            "code": 0,
                            "msg": "success",
                            "data": {
                                "funcs": supportAPIList
                            }
                        });  
                    }
                    break;
                case 502: 
                    PVAPI.getClientVersion = function(){
                        var cb = arguments[0];
                        if(!cb){
                            return;
                        }   
                        var code = checkAPI(api);
                        if(code != 0){
                            cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {

                                }
                            }); 
                            return;                            
                        }                               
                        ECBridge.exec({
                            command: 502,
                            callback: cb
                        });                                      
                    }
                    break;
                case 503: 
                    PVAPI.broadcast = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        if(!param){
                            return;
                        }    
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }   
                        newParam.command = 503;
                        newParam.json = param;   
                        newParam.callback = function(json){
                            cb && cb(json);
                        }          
                        ECBridge.exec(newParam);                                           
                    }
                    PVAPI.broadcastRegister = function(){
                        var cb = arguments[0];
                        if(!cb){
                            return;
                        }    
                        ECBridge.registerPVCall(503, function(command, json){
                            cb && cb(json);
                        });              
                    }
                    break;
                case 504: 
                    PVAPI.openPV = function(){
                        var newParam = {};
                        var param = arguments[0];
                        var cb = arguments[1];
                        var key;
                        if(!param){
                            return;
                        }
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        for(var item in param){
                            if(item != "key" && item != "path"){
                                newParam[item] = param[item];
                            }
                        }
                        newParam.command = 504;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        if(!newParam.url){
                            newParam.callback(504, {code: 1, msg: 'url is empty'});
                            return;
                        }
                        if(param.defaultKey){
                            newParam.key = param.defaultKey;
                        }else{
                            key = getpvkey(param.path, param.key, param.url);
                            if(key){
                                newParam.key = key;
                            }
                        }
                        newParam.url = encodeURI(newParam.url);  //mac汉字编码
                        if(newParam.height){  //加上标题高度
                            newParam.height = parseInt(newParam.height, 10);
                            if(PVAPI.isMac){
                                newParam.height += 20;
                            }else{
                                newParam.height += 40;
                            }
                            newParam.height = newParam.height + '';
                        }
                        if(!newParam.titleIcon){
                            newParam.titleIcon = '201';
                        }
                        ECBridge.exec(newParam);
                    }
                    break;
                case 505: 
                    PVAPI.checkOpenPV = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var oldKey,newKey;
                        if(!param){
                            return;
                        }
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }  
                        newParam.command = 505;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        if(!param.newUrl){
                            newParam.callback({code: 1, msg: 'new url is empty'});
                            return;
                        }
                        newParam.oldUrl = param.oldUrl || location.href;
                        newParam.newUrl = param.newUrl;
                        oldKey = getpvkey(param.oldPath, param.oldKey, newParam.oldUrl);
                        newKey = getpvkey(param.newPath, param.newKey, newParam.newUrl);
                        if(oldKey){
                            newParam.oldKey = oldKey;
                        }
                        if(newKey){
                            newParam.newKey = newKey;
                        }
                        newParam.newUrl = encodeURI(newParam.newUrl);  //mac汉字编码
                        ECBridge.exec(newParam);
                    }
                    break;
                case 506: 
                case 507: 
                case 508:   
                case 509:              
                case 510:  
                case 511:  
                case 512:  
                case 524:  
                    PVAPI[commonAPI[api]] = function(){
                        var cb = arguments[0];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;       
                case 513:  
                    PVAPI.getWindowStatus = function(){
                        var cb = arguments[0];
                        var newParam = {};
                        if(!cb){
                            return;
                        } 
                        var code = checkAPI(api);
                        if(code != 0){
                            cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = 513;
                        newParam.callback = function(json){
                            cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break; 
                case 514:   
                    PVAPI.openChatWindow = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = 514;
                        newParam.id = param.id;
                        newParam.name = param.name;
                        newParam.type = param.type;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break; 
                case 515:    
                    PVAPI.sendMessage = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = 515;
                        newParam.id = param.id;
                        newParam.type = param.type;
                        newParam.list = param.list;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break; 
                case 516:     
                    PVAPI.phone = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.phone = param.phone;
                        newParam.id = param.id;
                        newParam.type = param.type;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break; 
                case 517:     
                    PVAPI.addFriend = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.id = param.id;
                        newParam.crmid = param.crmid;
                        newParam.type = param.type;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
                case 518:  
                    PVAPI.openBrowser = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        if(!param){
                            return;
                        }
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = 518;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        newParam.url = param.url;
                        newParam.needLogin = param.needLogin;
                        if(!newParam.url){
                            newParam.callback(518, {code: 1, msg: 'url is empty'});
                            return;
                        }                        
                        ECBridge.exec(newParam);
                    }
                    break; 
                case 519:     
                    PVAPI.openSelectFriendWindow = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.relate = param.relate;
                        newParam.crmid = param.crmid;
                        newParam.type = param.type;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
                case 520:     
                    PVAPI.changeBindedQQAccount = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.uid = param.uid;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
                case 521:      
                    PVAPI.salePlan = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.planid = param.planid;
                        newParam.type = param.type;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
                case 522:       
                    PVAPI.RegAndFindPwd = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.type = param.type;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
                case 525: 
                    PVAPI.sendMail = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        if(!param){
                            return;
                        }
                        var code = checkAPI(api);
                        if(code != 0){
                            cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                         
                        newParam.command = 525;
                        newParam.addr = param.addr;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        if(!newParam.addr || newParam.addr.length == 0){
                            param.callback(525, {code: 1, msg: 'mail addr is empty'});
                            return;
                        }
                        ECBridge.exec(newParam);
                    }                
                    break;
                case 526:    
                    PVAPI.changeAvatar = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.uid = param.uid;
                        newParam.type = param.type;
                        newParam.url = param.url;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
                case 527:    
                    PVAPI.OpenPopupWindow = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.type = param.type;
                        newParam.num = param.num;
                        newParam.dtype = param.dtype;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
                case 534:    
                    PVAPI.onbeforeunload = function(){
                        var param = arguments[0];
                        var cb = arguments[1];
                        var newParam = {};
                        var code = checkAPI(api);
                        if(code != 0){
                            cb && cb({
                                "code": code,
                                "msg": codeMsg[code],
                                "data": {
                                    
                                }
                            }); 
                            return;                            
                        }                          
                        newParam.command = api;
                        newParam.type = param.type;
                        newParam.callback = function(json){
                            cb && cb(json);
                        }
                        ECBridge.exec(newParam);                        
                    }           
                    break;
            }
        })(apiList[i]);
    }
})();