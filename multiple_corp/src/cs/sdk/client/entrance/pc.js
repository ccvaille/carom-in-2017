/*eslint-disable */
var Event = require('../modules/Event');
var dragable = require('../utils/dragable');

var domUtils = require('../utils/dom'),
    addEvent = domUtils.addEvent,
    removeEvent = domUtils.removeEvent,
    getStyle = domUtils.getStyle;

var serialize = require('../utils/serialize');
var consts = require('../modules/const');
var initInvite = require('../modules/InviteDialog');
var ButtonModeType = require('../modules/ButtonModeType');


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

        addEvent(window, 'message', function (e) {
            if (!SAFE_ORIGIN[e.origin]) {
                return;
            }
            var data = e.data;
            if (data && typeof data === 'string') {
                try {
                    data = JSON.parse(data);
                } catch (err) {}
            }
            var winMode = self.config.talkset.mode;
            switch (data.event) {
                case POST_MSG_TYPES.SELECT_CS: {
                    var csid = data.data;
                    var qqData = data.qqData;

                    window.ec_im.setLocalStatus(ECIM_STATUS.CHATTING);
                    window.ec_im.stopPolling();
                    if (winMode === WINDOW_MODES.STANDARD) {
                        // 标准窗口模式不通过postMessage打开
                        // ie8无法通过postMessage传递该window对象
                        self.sessionWindow = 1;
                        break;
                    }

                    if (self.sessionWindow) {
                        if (csid && csid !== self.csid) {
                            self.initSession(csid, qqData);
                        }
                    } else {
                        self.initSession(csid, qqData);
                    }

                    self.csid = csid;
                    self.showSession();

                    break;
                }
                case POST_MSG_TYPES.SESSION_INITED: {
                    var isInited = data.data.inited;
                    if (!isInited) {
                        return;
                    }
                    var csid = data.data.csid;
                    self.csid = csid;
                    if (winMode === WINDOW_MODES.SMALL) {
                        if (self.sessionStatus === SESSION_STATUS.MAXIMIZED) {
                            self.showSession();
                        }
                    }

                    break;
                }
                case POST_MSG_TYPES.UPDATE_UNREAD_NUMS: {
                    if (winMode !== WINDOW_MODES.SMALL) {
                        // 仅小窗口模式需要更新未读消息数目
                        return;
                    }
                    self.entranceWindow.postMessage(JSON.stringify({
                        event: POST_MSG_TYPES.UPDATE_UNREAD_NUMS,
                        data: data.data, // csid num
                    }), '*');
                    break;
                }
                case POST_MSG_TYPES.SESSION_KICKED: {
                    if (winMode === WINDOW_MODES.STANDARD) {
                        self.sessionWindow = 0;
                        return;
                    }
                    self.hideSession();
                    self.removeSession();
                    break;
                }
                case POST_MSG_TYPES.RESIZE_CS_LIST: {
                    var style = data.data;
                    self.$entrance.width = style.width + 'px';
                    self.$entrance.height = style.height + 'px';
                    break;
                }
                case POST_MSG_TYPES.REMOVE_SESSION: {
                    if (winMode === WINDOW_MODES.STANDARD) {
                        self.sessionWindow = 0;
                        return;
                    }
                    self.hideSession();
                    self.removeSession();
                    break;
                }
                case POST_MSG_TYPES.RESET_CS_ID: {
                    var clIframe = document.getElementById('ec--cs-wrapper').getElementsByTagName('iframe')[0];
                    clIframe.style.display = 'block';
                    // var sessionIframe = parent.document.getElementById('ec--session-wrapper');
                    // sessionIframe.style.display = 'none';
                    self.$sessionWrapper.style.display = 'none';
                    self.sessionWindow = 0;
                    break;
                }
                case POST_MSG_TYPES.HIDE_SAMLL_SESSION: {
                    self.hideSession();
                    break;
                }
                default:
                    break;
            }
        });

        addEvent(window, 'resize', function (e) {
            var $sessionWrapper = self.$sessionWrapper;
            var windowWidth = domUtils.getWindowWidth();
            var windowHeight = domUtils.getWindowHeight();

            if($sessionWrapper) {
                var sessionLeft = $sessionWrapper.style.left.split('px')[0] * 1;
                var sessionTop = $sessionWrapper.style.top.split('px')[0] * 1;
                var sessionWidth = $sessionWrapper.offsetWidth;
                var sessionHeight = $sessionWrapper.offsetHeight;

                var prevWinWidth = $sessionWrapper.getAttribute('window-width');
                var prevWinHeight = $sessionWrapper.getAttribute('window-height');

                var newSessionLeft = (sessionLeft * windowWidth + sessionWidth * (windowWidth - prevWinWidth)) / prevWinWidth;
                var newSessionTop = (sessionTop * windowHeight + sessionHeight * (windowHeight - prevWinHeight)) / prevWinHeight;

                $sessionWrapper.style.left = newSessionLeft + 'px';
                $sessionWrapper.style.top = newSessionTop + 'px';
                // $sessionWrapper.style.cssText += ' left: ' + newSessionLeft +'px; top:' + newSessionTop +'px; ';
                $sessionWrapper.setAttribute('window-width', windowWidth);
                $sessionWrapper.setAttribute('window-height', windowHeight);
            }

        })
    },
    bindSessionHeaderEvents: function () {
        var self = this;
        this.$minifyBtn.onclick = function () {
            self.hideSession();
        };
    },
    showSession: function () {
        this.sessionStatus = SESSION_STATUS.MAXIMIZED;
        this.$sessionWrapper.style.display = 'block';
        this.$entrance.style.display = 'none';

        var winMode = this.config.talkset.mode;
        if (winMode !== WINDOW_MODES.SMALL || !this.sessPageLoaded) {
            return;
        }
        // iframe没有加载页面之前，其origin和host页面相同
        this.sessionWindow.postMessage(JSON.stringify({
            event: POST_MSG_TYPES.SET_SESSION_STATUS,
            data: {
                status: this.sessionStatus
            }
        }), postMsgOrigin);

        this.entranceWindow.postMessage(JSON.stringify({
            event: POST_MSG_TYPES.UPDATE_UNREAD_NUMS,
            data: {
                csid: this.csid,
                num: 0
            }, // csid num
        }), postMsgOrigin);
    },
    hideSession: function () {
        this.sessionStatus = SESSION_STATUS.MINIMIZED;
        this.$sessionWrapper.style.display = 'none';
        this.$entrance.style.display = 'block';

        var winMode = this.config.talkset.mode;
        if (winMode !== WINDOW_MODES.SMALL) {
            return;
        }

        this.sessionWindow.postMessage(JSON.stringify({
            event: POST_MSG_TYPES.SET_SESSION_STATUS,
            data: {
                status: this.sessionStatus
            }
        }), postMsgOrigin);
    },
    removeSession: function () {
        this.sessionWindow = null;
        this.$sessionWrapper.parentNode.removeChild(this.$sessionWrapper);
        this.$sessionWrapper = null;
        this.sessPageLoaded = false;

        var winMode = this.config.talkset.mode;
        if (winMode === WINDOW_MODES.SMALL) {
            removeEvent(window, 'resize', this.updateDragBoundaryFn);
        }
    },
    initEntrance: function () {
        var $wrapper = document.createElement('div');
        $wrapper.id = 'ec--cs-wrapper';
        document.body.appendChild($wrapper);

        var $entrance = document.createElement('iframe');
        $entrance.setAttribute('allowTransparency', true);
        $entrance.setAttribute('scrolling', 'no');
        var params = {
            corpid: window.ec_corpid,
            mode: this.config.talkset.mode,
            guid: window.ec_guid,
            cskey: window.ec_cskey
        };

        $entrance.setAttribute('frameBorder', '0');
        var cslistUrl = CSLIST_CONT.URL + '?' + serialize(params);

        // 判断是列表模式还是按钮模式 0：列表模式 1：按钮模式
        var listSet = this.config.listset;
        // var windowWidth = document.body.clientWidth;
        var windowWidth = domUtils.getWindowWidth();
        // var windowHeight = window.innerHeight || document.documentElement.clientWidth;
        var windowHeight = domUtils.getWindowHeight();
        var $entranceTop = 0;
        var $entranceMargin = 0;

        if (listSet.showstyle !== 1) {  // 列表模式
            $entrance.width = 168;
            $entrance.height = 278;

            if (listSet.autohide * 1 === 1) { // 列表模式最小化
                $entrance.height = 190;
                $entrance.width = 80;
            }
        } else {
            switch (listSet.bmodestyle * 1) {
                case ButtonModeType.RECT_H:
                    $entrance.width = 192;
                    $entrance.height = 70;
                    break;
                case ButtonModeType.RECT_V:
                    $entrance.height = 186;
                    $entrance.width = 70;
                    break;
                case ButtonModeType.SQUARE:
                    $entrance.width = 80;
                    $entrance.height = 80;
                    break;
                case ButtonModeType.CIRCLE:
                    $entrance.width = 82;
                    $entrance.height = 82;
                    break;
            }
        }
        // $wrapper.style

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
        $entranceMargin = (calcMargin + $entrance.width * 1) >= windowWidth ? windowWidth - $entrance.width : $entranceMargin;
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
            guid: window.ec_guid,
            cskey: window.ec_cskey
        };

        if (csid) {
            queryParams.csid = csid;
        } else {
            queryParams.cstype = 'rand';
        }

        this.csid = csid || 0;
        var winMode = this.config.talkset.mode;
        var sessionUrl = SESSION_CONF.URL + '?' + serialize(queryParams);
        // var qqUrl = SESSION_CONF.QQURL + qqData.csqq;
        if (winMode === WINDOW_MODES.STANDARD) {
            // if (qqData.isQQFirst === 1) {
            //     this.sessionWindow = window.open(qqUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
            // } else {
            //     this.sessionWindow = window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
            // }
            this.sessionWindow = window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
        } else {
            if (!this.$sessionWrapper) {
                this.initSessionWrapper();
                document.body.appendChild(this.$sessionWrapper);
                this.initSessionDrager();
            }
            this.$iframe.src = sessionUrl;
            var self = this;
            this.$iframe.onload = function () {
                self.sessPageLoaded = true;
            };
            this.sessionWindow = this.$iframe.contentWindow;

        }
        // window.sessionWindow = this.sessionWindow;
    },
    initSessionWrapper: function () {
        this.initSessionHeader();
        this.initSessionWindow();

        var $sessionWrapper = document.createElement('div');
        $sessionWrapper.id = 'ec--session-wrapper';
        $sessionWrapper.style.cssText = 'width: 382px; height: 522px; position: fixed; bottom: 0; right: 0;z-index: 99999; box-shadow: 0 0 10px #c8c9ca;';
        $sessionWrapper.appendChild(this.$sessionHeader);
        $sessionWrapper.appendChild(this.$iframe);
        $sessionWrapper.setAttribute('window-width', domUtils.getWindowWidth());
        $sessionWrapper.setAttribute('window-height', domUtils.getWindowHeight());
        this.$sessionWrapper = $sessionWrapper;
    },
    initSessionHeader: function () {
        var $header = document.createElement('div');
        var headerStyle = 'position: absolute; top: 0; left: 0;width: 100%; height: 70px;cursor: move; z-index: 9';
        var minifyStyle = 'position: absolute; top: 0; right: 6px;width: 30px; height: 100%; cursor: pointer;text-align: center; color: #fff; line-height: 2.0;';
        $header.style.cssText = headerStyle;
        var $minifyBtn = document.createElement('span');
        // $minifyBtn.href = 'javascript:;';
        $minifyBtn.style.cssText = minifyStyle;

        $minifyBtn.innerText = '_';

        $header.appendChild($minifyBtn);
        this.$sessionHeader = $header;
        this.$minifyBtn = $minifyBtn;
        this.bindSessionHeaderEvents();
    },
    initSessionWindow: function () {
        var $iframe = document.createElement('iframe');
        $iframe.width = 382;
        $iframe.height = 522;
        $iframe.style.border = 'none';
        $iframe.setAttribute('frameBorder', '0');

        this.$iframe = $iframe;
    },
    initSessionDrager: function () {
        var self = this;
        var drager = dragable({
            wrapper: 'onmousemove' in window ? window : document.documentElement,
            ref: this.$sessionHeader,
            ele: this.$sessionWrapper
        });
        drager.$ele.style.right = 'auto';
        drager.$ele.style.bottom = 'auto';
        this.updateDragBoundaryFn = function () {
            drager.updateBoundary();
        };
        addEvent(window, 'resize', this.updateDragBoundaryFn);

        // fix 鼠标脱离子元素范围后 mouseup事件冒泡失败
        var normalHeaderHeight;
        drager.on('start', function () {
            normalHeaderHeight = getStyle(self.$sessionHeader, 'height');
            self.$sessionHeader.style.height = '100%';
            // if (!'onmousemove' in window) {
            //     self.$sessionHeader.style.background = '#fff';
            //     self.$sessionHeader.style.filter = 'alpha(opactiy=10)';
            // }
        });
        drager.on('stop', function () {
            self.$sessionHeader.style.height = normalHeaderHeight;
        });
        this.drager = drager;
    },
    minifySession: function () {

    },
    maxifySession: function () {

    }
};

module.exports = entrance;
