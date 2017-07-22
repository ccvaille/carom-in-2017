/*eslint-disable */
var version = '0.0.4';

var isIE = !!window.ActiveXObject || 'ActiveXObject' in window;
if (isIE) {
    require('./polyfill');
}
require('./methodPolyfill');
// var entrance = require('./entrance/pc');
var ECIM = require('./core/ec_im');
var inviteDialog = require('./modules/InviteDialog');

var ajax = require('./utils/ajax');
var Event = require('./modules/Event');
var consts = require('./modules/const');
var getQueryParams = require('./utils/search');
var commDomUtils = require('~cscommon/utils/dom');

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);

if (isMobile) {
    entrance = require('./entrance/mobile');
} else {
    entrance = require('./entrance/pc');
}
window.entrance = entrance;

var STATUS = consts.STATUS,
    HEARTBEAT_TYPES = consts.HEARTBEAT_TYPES,
    ECIM_EVENTS = consts.ECIM_EVENTS,
    ECIM_STATUS = consts.ECIM_STATUS,
    COOKIE = consts.COOKIE,
    WINDOW_MODES = consts.WINDOW_MODES,
    INIT_CONFIG = consts.INIT_CONFIG;

window.ec_corpid = window.ec_corpid || getQueryParams().corpid;

(function init() {
    var localVisitorId = commDomUtils.localStorageFix.getItem('EcLocalVisitorId') || '';
    // 临时
    if (localVisitorId === 'undefined') {
        localVisitorId = '';
    }
    ajax.getJSON('//kf.ecqun.com/index/index/init?CorpID=' + window.ec_corpid + '&storage=' + localVisitorId, {
        corpid: window.ec_corpid,
        scheme: 0,
        referUrl: document.referrer,
        visitUrl: window.location.href,
        title: document.title,
        type: isMobile ? 1 : 0,
        cskey: window.ec_cskey
    }, function (re) {
        if (re.code !== 200) {
            // alert('初始化请求失败');
            return;
        }

        var inviteSet = re.data.boxset || {
            show: true,
            content: '',
            theme: 0,
            defer: 30,
            inviteAgain: 1,
            inviteInter: 30,
            inviteActive: 1,
            activeinviteAgain: 1,
            activeinviteInter: 10,
            delay: 60,
            float: 0,
        }
        window.ec_token = re.data['xsrf-token'];
        window.ec_guid = re.data.guid || '';

        window.ec_im = new ECIM({
            heartbeatType: HEARTBEAT_TYPES.VIEWING,
            pollingInterval: 5000,
            guid: re.data.guid,
            corpid: window.ec_corpid,
            key: re.data.key,
            pageType: ECIM_STATUS.VIEWING
        });

        var sessionInterval = setInterval(function () {
            if (!entrance.sessionWindow && window.ec_im.getLocalStatus() === '3') {
                window.ec_im.setLocalStatus(ECIM_STATUS.VIEWING + '');
            }
        }, 1000);

        // Safari 隐身模式不能写 localStorage
        // commDomUtils.localStorageFix.setItem('EcLocalVisitorId', re.data.storage || '');

        window.onbeforeunload = function() {
            var tabNum = Number(window.ec_im.getTabNum());
            if (tabNum - 1 < 0) {
                window.ec_im.setTabNum(0);
            } else {
                window.ec_im.setTabNum(tabNum - 1);
            }

            if (entrance.sessionWindow && window.ec_im.getLocalStatus() === '3' ) {
                window.ec_im.setLocalStatus(ECIM_STATUS.VIEWING + '');
            }

            clearInterval(sessionInterval);
        }

        window.ec_im.on(ECIM_EVENTS.LOGIN, function () {
            this.run();
        });
        window.ec_im.on(ECIM_EVENTS.SYS_MSG, inviteDialog.onInviteMsgReceived);
        window.ec_im.on(ECIM_EVENTS.ERROR, function (errorInfo) {
            if (errorInfo.ErrorCode === 5) {
                this.login();
            }
        });
        window.ec_im.once(ECIM_EVENTS.ALREADY_CHATTING, function () {
            if (!isMobile) {
                if (re.data.talkset.mode === WINDOW_MODES.SMALL) {
                    entrance.initSession();
                }
            }
        });
        window.ec_im.login();
        var prevTabNum = window.ec_im.getTabNum();

        if (prevTabNum === '0' || !prevTabNum) {
            window.ec_im.setTabNum(1);
            if (window.ec_im.getLocalStatus() === '2') {
                window.ec_im.setLocalStatus(ECIM_STATUS.VIEWING + '');
            }
        } else {
            window.ec_im.setTabNum(Number(prevTabNum) + 1);
        }

        if (!window.ec_im.getLocalStatus()) {
            window.ec_im.setLocalStatus(ECIM_STATUS.VIEWING + '');
        }

        window.ec_im.emitLocalStatus();
        setInterval(function() {
            window.ec_im.emitLocalStatus();
        }, 1000);

        // inviteDialog.getInstance();
        // 载入配置
        // inviteDialog.getInstance({
        //     autoShow: inviteSet.show === 1,
        //     content: inviteSet.content,
        //     type: inviteSet.theme,
        //     autoInviteDelay: inviteSet.defer || 30000,
        //     allowAutoAgain: inviteSet.inviteAgain === 1,
        //     autoInviteInterval: inviteSet.inviteInter || 30000,
        //     allowManualInvite: inviteSet.inviteActive === 1,
        //     allowManualAgain: inviteSet.activeinviteAgain === 1,
        //     manualInviteInterval: inviteSet.activeinviteInter || 10000,
        //     autoCloseDelay: inviteSet.delay || 60000,
        //     floatPosition: inviteSet.float,
        //     mode: re.data.talkset && re.data.talkset.mode, // 会话窗口模式
        // });

        // 如果企业未设置， 设置默认值
        if (re.data.listset == false) {
            if (isMobile) {
                re.data.listset = INIT_CONFIG.listsetmobile;

            } else {
                re.data.listset = INIT_CONFIG.listsetpc;

            }
        }
        if (re.data.boxset == false) {
            re.data.boxset = INIT_CONFIG.boxset;
        }
        if (re.data.talkset == false) {
            re.data.talkset = INIT_CONFIG.talkset;
        }

        entrance.init(re.data);
    });
})();

// (function () {
//     var localVersion = window.localStorage.getItem('ec_cs_version');
//     if (version !== localVersion) {
//         window.localStorage.setItem('ec_cs_version', version);
//         var scriptNode = window.ec_cs_sn;
//         document.head.removeChild(scriptNode);
//         window.ec_cs(window, document, '?' + new Date().getTime());
//         return;
//     }
//     init();
// })();
