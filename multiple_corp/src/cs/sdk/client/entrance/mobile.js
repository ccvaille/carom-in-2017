/*eslint-disable */
var Event = require('../modules/Event');

var addEvent = require('../utils/dom').addEvent;
var serialize = require('../utils/serialize');
var consts = require('../modules/const');
var initInvite = require('../modules/InviteDialog');
var ButtonModeType = require('../modules/ButtonModeType');
var domUtils = require('../utils/dom');

var WINDOW_MODES = consts.WINDOW_MODES,
    CSLIST_CONT = consts.CSLIST_CONT,
    SESSION_CONF = consts.SESSION_CONF,
    POST_MSG_TYPES = consts.POST_MSG_TYPES,
    SAFE_ORIGIN = consts.SAFE_ORIGIN,
    SESSION_STATUS = consts.SESSION_STATUS,
    postMsgOrigin = consts.host,
    ECIM_STATUS = consts.ECIM_STATUS;

require('../less/customer.less');

var entrance = {
    init: function (opts) {
        this.initVars(opts);
        this.initEntrance();
        // this.initSessionWrapper();
        this.initInviteDialog();
        this.bindEvents();
    },
    initVars: function (opts) {
        // 配置信息
        this.csid = 0;
        this.config = opts;
        // window 之间通过postMessage通信
        this.entranceWindow = '';
        this.sessionWindow = '';

        this.sessionStatus = SESSION_STATUS.MAXIMIZED;
    },
    bindEvents: function () {
        var self = this;
        // this.$minifyBtn.onclick = function () {
        //     self.hideSession();
        // };
        addEvent(window, 'message', function (e) {
            if (!SAFE_ORIGIN[e.origin]) {
                return;
            }
            var data = e.data;
            if (data && typeof data === 'string') {
                data = JSON.parse(data);
            }
            var winMode = self.config.talkset.mode;
            switch (data.event) {
                case POST_MSG_TYPES.SELECT_CS: {
                    var csid = data.data;
                    window.ec_im.setLocalStatus(ECIM_STATUS.CHATTING);

                    window.ec_im.stopPolling();
                    self.sessionWindow = 1;
                    var queryParams = {
                        corpid: window.ec_corpid,
                        csid: csid,
                        mode: self.config.talkset.mode || 0
                    };
                    var sessionUrl = SESSION_CONF.URL + '?' + serialize(queryParams);
                    window.location.href = sessionUrl;
                    break;
                }
                // case POST_MSG_TYPES.SESSION_INITED: {
                //     this.csid = data.csid;
                //     if (winMode === WINDOW_MODES.SMALL) {
                //         if (self.sessionStatus === SESSION_STATUS.MAXIMIZED) {
                //             self.showSession();
                //         }
                //     }
                //     break;
                // }
                // case POST_MSG_TYPES.UPDATE_UNREAD_NUMS: {
                //     if (winMode !== WINDOW_MODES.SMALL) {
                //         // 仅小窗口模式需要更新未读消息数目
                //         return;
                //     }
                //     self.entranceWindow.postMessage(JSON.stringify({
                //         event: POST_MSG_TYPES.UPDATE_UNREAD_NUMS,
                //         data: data, // csid num
                //     }), postMsgOrigin);
                //     break;
                // }
                // case POST_MSG_TYPES.SESSION_KICKED: {
                //     self.hideSession();
                //     self.removeSession();
                //     break;
                // }
                default:
                    break;
            }
        });
    },
    // showSession: function () {
    //     this.sessionStatus = SESSION_STATUS.MAXIMIZED;
    //     this.$sessionWrapper.style.display = 'block';
    //     this.$entrance.style.display = 'none';
    //     this.sessionWindow.postMessage(JSON.stringify({
    //         event: POST_MSG_TYPES.SET_SESSION_STATUS,
    //         data: {
    //             status: this.sessionStatus
    //         }
    //     }), postMsgOrigin);
    //     this.entranceWindow.postMessage(JSON.stringify({
    //         event: POST_MSG_TYPES.UPDATE_UNREAD_NUMS,
    //         data: {
    //             csid: this.csid,
    //             num: 0
    //         }, // csid num
    //     }), postMsgOrigin);
    // },
    // hideSession: function () {
    //     this.sessionStatus = SESSION_STATUS.MINIMIZED;
    //     this.$sessionWrapper.style.display = 'none';
    //     this.$entrance.style.display = 'block';

    //     this.sessionWindow.postMessage(JSON.stringify({
    //         event: POST_MSG_TYPES.SET_SESSION_STATUS,
    //         data: {
    //             status: this.sessionStatus
    //         }
    //     }), '*');
    // },
    // removeSession: function () {
    //     this.sessionWindow = null;
    //     this.$sessionWrapper.parentNode.removeChild(this.$sessionWrapper);
    // },
    initEntrance: function () {
        var $wrapper = document.createElement('div');
        $wrapper.id = 'ec--cs-wrapper';
        document.body.appendChild($wrapper);

        var $entrance = document.createElement('iframe');
        $entrance.setAttribute('allowTransparency', true);
        $entrance.setAttribute('scrolling', 'no');
        var params = {
            corpid: window.ec_corpid,
            mode: this.config.talkset.mode
        }
        var cslistUrl = CSLIST_CONT.URL + '?' + serialize(params);

        // 判断是列表模式还是按钮模式 0：列表模式 1：按钮模式
        var listSet = this.config.listset;
        var windowWidth = domUtils.getWindowWidth();
        var windowHeight = domUtils.getWindowHeight();
        var $entranceTop = 0;
        var $entranceMargin = 0;

        switch (listSet.bmodestyle * 1) {
            case ButtonModeType.RECT_H:
                // $entrance.width = 184;
                // $entrance.height = 70;
                $entrance.width = 170;
                $entrance.height = 56;
                break;
            case ButtonModeType.RECT_V:
                // $entrance.height = 175;
                // $entrance.width = 65;
                $entrance.height = 165;
                $entrance.width = 56;
                break;
            case ButtonModeType.SQUARE:
                // $entrance.width = 70;
                // $entrance.height = 78;
                $entrance.width = 66;
                $entrance.height = 66;
                break;
            case ButtonModeType.CIRCLE:
                // $entrance.width = 68;
                // $entrance.height = 72;
                $entrance.width = 66;
                $entrance.height = 66;
                break;
        }

        // 判断固定还是滚动 1: 固定，0：滚动
        listSet.fixed * 1 === 1 ? $wrapper.style.position = 'fixed'
            : $wrapper.style.position = 'absolute';

        var calcTop = windowHeight * listSet.ftop / 100;
        $entranceTop = calcTop - ($entrance.height / 2);
        $entranceTop = $entranceTop > 0 ? $entranceTop : calcTop;
        $entranceTop = (calcTop + $entrance.height * 1) >= windowHeight ? windowHeight - $entrance.height - 5 : $entranceTop;
        $wrapper.style.top = $entranceTop + 'px';

        // 左边还是右边 0：左边 1：右边
        var calcMargin = windowWidth * listSet.fmargin / 100;
        $entranceMargin = calcMargin - ($entrance.width / 2);
        $entranceMargin = $entranceMargin > 0 ? $entranceMargin : calcMargin;
        $entranceMargin = (calcMargin + $entrance.width * 1) >= windowWidth ? (windowWidth - $entrance.width) / 2 : $entranceMargin;
        listSet.float * 1 === 1 ? $wrapper.style.right = $entranceMargin + 'px'
            : $wrapper.style.left = $entranceMargin + 'px';

        $entrance.src = cslistUrl;
        $wrapper.appendChild($entrance);

        $wrapper.style.zIndex = 99999;

        this.entranceWindow = $entrance.contentWindow;
        this.$wrapper = $wrapper;
        this.$entrance = $entrance;
    },
    initInviteDialog: function () {
        var self = this;
        var inviteSet = this.config.boxset;

        this.inviteDialog = initInvite.getInstance({
            csid: 0,
            autoShow: inviteSet.show === 1,
            content: inviteSet.content,
            type: inviteSet.theme,
            autoInviteDelay: inviteSet.defer || 30,
            allowAutoAgain: inviteSet.inviteAgain === 1,
            autoInviteInterval: inviteSet.inviteInter || 30,
            allowManualInvite: inviteSet.inviteActive === 1,
            allowManualAgain: inviteSet.activeinviteAgain === 1,
            manualInviteInterval: inviteSet.activeinviteInter || 10,
            autoCloseDelay: inviteSet.delay || 60,
            floatPosition: inviteSet.float,
            mode:this.config.talkset.mode, // 会话窗口模式
        }, this);
        // this.inviteDialog.show();
        // return this.inviteDialog;
        // this.inviteDialog.on('accept', function () {
        //     self.initSession(this.csid);
        //     window.ec_im.updateStatus('accept');
        // });
        // this.inviteDialog.on('reject', function () {
        //     window.ec_im.updateStatus('reject');
        // });
    },
    closeInviteDialog: function () {
        if (this.inviteDialog) {
            this.inviteDialog.hide();
        }
    },
    initSession: function (csid) { // 为空则是随机客服
        var queryParams = {
            corpid: window.ec_corpid,
            mode: this.config.talkset.mode,
            guid: window.ec_guid
        };

        if (csid) {
            queryParams.csid = csid;
        } else {
            queryParams.cstype = 'rand';
        }

        this.csid = csid || 0;
        var winMode = this.config.talkset.mode;
        var sessionUrl = SESSION_CONF.URL + '?' + serialize(queryParams);

        this.sessionWindow = window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
        // if (winMode === WINDOW_MODES.STANDARD) {
        //     this.sessionWindow = window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
        // } else {
        //     document.body.appendChild(this.$sessionWrapper);
        //     this.$iframe.src = sessionUrl;
        //     this.sessionWindow = this.$iframe.contentWindow;
        // }
        window.sessionWindow = this.sessionWindow;
    },
    // initSessionWrapper: function () {
    //     var $sessionWrapper = document.createElement('div');
    //     var $iframe = document.createElement('iframe');
    //     $sessionWrapper.style.cssText = 'position: absolute; bottom: 0; right: 0;';
    //     $iframe.width = 382;
    //     $iframe.height = 540;
    //     $iframe.style.border = 'none';

    //     $sessionWrapper.appendChild($iframe);


    //     this.$sessionWrapper = $sessionWrapper;
    //     this.$iframe = $iframe;

    //     this.initSessionHeader();
    // },
    // initSessionHeader: function () {
    //     if (this.$sessionHeader) {
    //         return;
    //     }
    //     var $header = document.createElement('div');
    //     var headerStyle = 'position: absolute; top: 0; left: 0;width: 100%; height: 50px;';
    //     var minifyStyle = 'position: absolute; top: 13px; right: 21px;width: 9px; height: 17px;';
    //     $header.style.cssText = headerStyle;
    //     var $minifyBtn = document.createElement('a');
    //     $minifyBtn.href = 'javascript:;';
    //     $minifyBtn.style.cssText = minifyStyle;
    //     $header.appendChild($minifyBtn);
    //     this.$sessionHeader = $header;
    //     this.$minifyBtn = $minifyBtn;
    //     this.$sessionWrapper.appendChild($header);
    // },
};

module.exports = entrance;
