/*eslint-disable*/
// window.name = 'session';
window.SparkMD5 = require('~cscommon/lib/spark-md5');
require('~cscommon/lib/webim1.7.0');

var isIE = !!window.ActiveXObject || 'ActiveXObject' in window;
if (isIE) {
    require('./polyfill');
}
require('./methodPolyfill');
var ajax = require('./utils/ajax');
var getQueryParams = require('./utils/search');
var commDomUtils = require('~cscommon/utils/dom');
var queryParams = getQueryParams();

var consts = require('./modules/const');
var SESSION_CONF = consts.SESSION_CONF;
var INIT_CONFIG = consts.INIT_CONFIG;
var POST_MSG_TYPES = consts.POST_MSG_TYPES;
var ECIM_STATUS = consts.ECIM_STATUS;
var HEARTBEAT_TYPES = consts.HEARTBEAT_TYPES;
var ECIM = require('./core/ec_im');

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);
var isAndroid = /Android/i.test(window.navigator.userAgent);
var corpid = queryParams.corpid,
    csid = queryParams.csid,
    guid = queryParams.guid;

window.ec_cskey = queryParams.cskey || '';

var data = {
        corpid: corpid,
        deviceType: isMobile ? 1 : 0,
        cstype: 'rand',
        referUrl: document.referrer,
        cskey: window.ec_cskey
    };
var localVisitorId = commDomUtils.localStorageFix.getItem('EcLocalVisitorId') || '';
// 临时
if (localVisitorId === 'undefined') {
    localVisitorId = '';
}
if (csid) {
    data.csid = csid;
    data.cstype = 'special';
}
window.onImgError = function () {
    this.src = '';
}
ajax.getJSON('//kf.ecqun.com/index/talk/init?CorpID=' + corpid + '&storage=' + localVisitorId + '&guid=' + guid || '', data, function (re) {
    if (re.code !== 200) {
        return;
    }

    commDomUtils.localStorageFix.setItem('EcLocalVisitorId', re.data.storage || '');

    // 如果企业没有配置，则设置默认配置
    if (re.data.talkset == false) {
        re.data.talkset = INIT_CONFIG.talkset;
    }

    window.ec_token = re.data['xsrf-token'];
    window.sessionData = re.data;

    var csinfo = re.data.csinfo;
    // var csinfo = {
    //     showqq: 1,
    //     qqfirst: 1,
    //     csid: 2139041,
    //     qq: 2715561711,
    // }
    if (csinfo.showqq === 1 && csinfo.qqfirst === 1) {  // showqq是否显示qq, qqfirst: 是否qq优先接待
        window.ec_im = new ECIM({
            heartbeatType: HEARTBEAT_TYPES.VIEWING,
            guid: re.data.guid,
            corpid: re.data.corpid,
            key: re.data.key,
            // pageType: ECIM_STATUS.VIEWING
        });

        // window.open(SESSION_CONF.QQURL + csinfo.qq, csinfo.showname);
        if (!isMobile && re.data.talkset.mode !== 2) { // 2 是浮窗模式
            window.location.href = SESSION_CONF.QQURL + csinfo.qq;
        } else if (isMobile) {
            if (isAndroid) {
                window.location.href = SESSION_CONF.QQURLAndroid + csinfo.qq;
            } else {
                window.location.href = SESSION_CONF.QQURLIOS + csinfo.qq;
            }
        } else {
            var iframeQQ = document.createElement('iframe');
            iframeQQ.style.display = 'none';
            document.body.appendChild(iframeQQ);
            iframeQQ.src = SESSION_CONF.QQURLSAMLL + csinfo.qq;
        }

         if (isMobile) {
             setTimeout(function () {
                 window.history.go(-1);
             }, 5000)
            //  window.history.go(-1);
         } else if (re.data.talkset.mode === 2){
             window.top.postMessage(JSON.stringify({
                 event: POST_MSG_TYPES.RESET_CS_ID,
                 data: '',
             }), '*');

         }

         window.ec_im.setLocalStatus(ECIM_STATUS.VIEWING + '');
         window.ec_im.updateStatus(ECIM_STATUS.VIEWING + '', re.data.csid);
         return;
    }

    // var iframeQQ = document.createElement('iframe');
    // iframeQQ.style.display = 'none';
    // document.body.appendChild(iframeQQ);
    // iframeQQ.src = SESSION_CONF.QQURL + '2459870745';

    // window.resizeTo(0,0);
    // return;

    if (re.data) {
        if (re.data.talkset.mode === 0 && window.parent != window) {
            return;
        } else if (re.data.talkset.mode === 2 && window.parent != window.top) {
            return;
        }
    }

    // if (!isMobile) {
    //     require.ensure(['./SessionWindow'], function() {
    //         require('./SessionWindow');
    //     });
    // } else {
    //     require.ensure(['./react/mobile/index'], function() {
    //         requrie('./react/mobile/index');
    //     });
    // }
    if (!isMobile) {
        require('./SessionWindow');
    } else {
        require('./react/mobile/index');
    }
    // require('./SessionWindow');

});
