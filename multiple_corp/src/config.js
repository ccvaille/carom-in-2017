/**
 * 统一配置，方便管理
 */
var path = require('path');

var myWork = {
    proxyIP: '10.0.200.162',
    host: '127.0.0.1',
    port: '80'
};

var myForm = {
    proxyIP: '10.0.200.162',
    host: '127.0.0.1',
    port: '5003'
};

var myECApp = {
    proxyIP: '10.0.201.210',
    host: '127.0.0.1',
    port: '80'
};

var oms = {
    proxyIP: '127.0.0.1',
    host: '127.0.0.1',
    port: '80'
};

var bizTag = {
    proxyIP: '10.0.201.122',
    host: '127.0.0.1',
    port: '5000'
}
var wwwHelp = {
    // proxyIP: '10.0.201.122',
    host: '127.0.0.1',
    port: '80'
}

var ECFormPC = {
    host: '127.0.0.1',
    proxyIP: '127.0.0.1',
    port:'80',
}
var mzoneBroadcast = {
    // proxyIP: '10.0.201.122',
    host: '127.0.0.1',
    port: '80'
}

var myPublic = {
     host: '127.0.0.1',
     port: '80'
}

var config = {
    myWork: myWork,
    myForm: myForm,
    myECApp: myECApp,
    oms: oms,
    bizTag: bizTag,
    wwwHelp: wwwHelp,
    ECFormPC:ECFormPC,
    mzoneBroadcast: mzoneBroadcast,
    myPublic: myPublic
};

Object.assign(exports, config);
