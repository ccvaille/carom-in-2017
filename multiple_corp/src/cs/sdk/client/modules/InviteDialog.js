/* eslint-disable */

var envelopeImage = require('../imgs/invite-envelope.png');
var noteImage = require('../imgs/invite-note.png');
var closeImage = require('../imgs/close-invite.png');

var constants = require('./const');
var Event = require('./Event');
var domUtils = require('../utils/dom');
var $ = require('../utils/dom').$;
var merge = require('../utils/merge');
var serialize = require('../utils/serialize');

var addEvent = domUtils.addEvent;
var addClass = domUtils.addClass;
var removeClass = domUtils.removeClass;

var ECIM_STATUS = constants.ECIM_STATUS;
var ECIM_EVENTS = constants.ECIM_EVENTS;
var POST_MSG_TYPES = constants.POST_MSG_TYPES;
var SAFE_ORIGIN = constants.SAFE_ORIGIN;
var SESSION_CONF = constants.SESSION_CONF;
var COOKIE = constants.COOKIE;
var WINDOW_MODES = constants.WINDOW_MODES;

var autoInviteTimer;
var autoAgainTimer;
var manualAgainTimer;
var autoCloseTimer;
var timeoutTimer;

var isClickAccept = false;
var isClickRefuse = false;
var isAutoInvite = false;

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);

function clearAllTimer() {
    if (autoInviteTimer) {
        clearTimeout(autoInviteTimer);
    }

    if (autoAgainTimer) {
        clearTimeout(autoAgainTimer);
    }

    if (manualAgainTimer) {
        clearTimeout(manualAgainTimer);
    }

    if (autoCloseTimer) {
        clearTimeout(autoCloseTimer);
    }

    if (timeoutTimer) {
        clearTimeout(timeoutTimer);
    }
}

function updateLocalStatus(status) {
    if (status === ECIM_STATUS.INVITING) {
        isClickAccept = false;
    }
    if (status !== ECIM_STATUS.REJECTD) {
        isClickRefuse = false;
    }
    window.ec_im.setLocalStatus(status + '');
}

function acceptInvite() {
    isClickAccept = true;
    clearAllTimer();
    window.ec_im.stopPolling();
    var queryParams = {
        corpid: window.ec_corpid,
        mode: this.opts.mode,
        guid: window.ec_guid
    };

    if (this.csid) {
        queryParams.csid = this.csid;
    } else {
        queryParams.csid = '';
        queryParams.cstype = 'rand';
    }

    updateLocalStatus(ECIM_STATUS.CHATTING);
    var sessionUrl = SESSION_CONF.URL + '?' + serialize(queryParams);

    // 判断窗口模式
    if (isMobile) {
        // this.entrance.sessionWindow = window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
        window.location.href = sessionUrl;
    } else {
        if (this.opts.mode === WINDOW_MODES.STANDARD) {
            this.entrance.sessionWindow = window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
        } else {
            this.entrance.initSession(this.csid);
        }
    }
    // window.top.postMessage({
    //     event: POST_MSG_TYPES.SELECT_CS,
    //     data: this.csid
    // }, '*');
    isAutoInvite = false;
    this.hide();

    if (!timeoutTimer) {
        this.timeout();
    }
}

function rejectInvite(event) {
    var that = this;
    isClickRefuse = true;
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }

    if (event.stopPropagation) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }

    window.ec_im.stopPolling();
    window.ec_im.updateStatus(ECIM_STATUS.REJECTD, this.csid, isAutoInvite);
    isAutoInvite = false;

    this.hide();

    if (!timeoutTimer) {
        this.timeout();
    }

    return false;
}

function InviteDialog(options, entrance) {
    this.init(options, entrance);
}

// InviteDialog.prototype = new Event();
// InviteDialog.constructor = InviteDialog;

InviteDialog.prototype.init = function init(options, entrance) {
    /**
     * 默认参数
     */
    options = options || {};
    var defaultOpts = {
        csid: 0,
        autoShow: true, // 允许
        content: '测试测试测试', // 邀请文本内容
        type: 0, // 邀请框类型 0: 信封模式；1: 便签模式
        autoInviteDelay: 5, // 访问 xx 秒后自动邀请
        allowAutoAgain: true, // 拒绝后是否允许再次自动邀请
        autoInviteInterval: 10, // 拒绝后自动邀请间隔
        allowManualInvite: true, // 允许手动邀请
        allowManualAgain: true, // 拒绝后是否允许再次手动邀请
        manualInviteInterval: 5, // 拒绝后手动邀请间隔
        autoCloseDelay: 10, // 自动关闭邀请框
        floatPosition: 0,
        mode: 0,
    }

    this.opts = merge({}, defaultOpts, options);
    this.entrance = entrance;

    var tplClass = '';
    var tplContentWrapper = '';
    var contentStyle = '';

    switch (this.opts.type) {
        case 0:
            contentStyle = 'top: 75px; left: 140px';
            break;
        case 1:
            contentStyle = 'top: 120px; left: 80px; max-height: 126px;';
            break;
        default:
            break;
    }

    var tplContent = '<div class="content-text" style="' + contentStyle + '">' +
                        this.opts.content +
                        '<span></span>' +
                    '</div>' +
                    '<div class="close-invite">' +
                        '<img src="' + closeImage + '" alt="关闭" />' +
                    '<div>';

    this.csid = 0;

    switch (this.opts.floatPosition) {
        case 0:
            tplClass += 'ec--cs-invite-center ';
            break;
        case 1:
            tplClass += 'ec--cs-invite-right ';
            break;
        case 2:
            tplClass += 'ec--cs-invite-left ';
            break;
        case 3:
            tplClass += 'ec--cs-invite-bottom ';
            break;
        default:
            break;
    }

    switch (this.opts.type) {
        case 0:
            tplContentWrapper = '<div class="invite-wrapper envelope-invite">' +
                                    '<img src="' + envelopeImage + '" alt="" />' +
                                    tplContent +
                                '</div>';
            tplClass += 'ec--cs-invite-envelope';
            break;
        case 1:
            tplContentWrapper = '<div class="invite-wrapper note-invite">' +
                                    '<img src="' + noteImage + '" alt="" />' +
                                    tplContent +
                                '</div>';
            tplClass += 'ec--cs-invite-note';
            break;
        default:
            break;
    }

    this.tpl = '<div id="ec--cs-invite" class="' + tplClass + '" data-csid="' + this.csid + '">' + tplContentWrapper + '</div>';
    this.$tplElem = document.createElement('div');
    this.$tplElem.innerHTML = this.tpl;
    addClass(this.$tplElem, 'ec--cs-invite-wrapper');
    this.$close = $('.close-invite', this.$tplElem);

    this.bindEvent();

    if (this.opts.autoShow) {
        if (window.ec_im.getLocalStatus() === '0') {
            this.startAutoInviteTimer();
        }
    }
};

InviteDialog.prototype.bindEvent = function bindEvent() {
    var that = this;

    addEvent(this.$tplElem, 'click', acceptInvite.bind(this));
    addEvent(this.$close, 'click', rejectInvite.bind(this));

    // 页面内主动状态变化才会进入这里
    window.ec_im.on(ECIM_EVENTS.UPDATED, function(data, status, isAuto) {
        var instanceOpts = that.opts;
        if (status === ECIM_STATUS.VIEWING) {
            clearAllTimer();
            updateLocalStatus(ECIM_STATUS.VIEWING);
            window.ec_im.pollingForMsg();
        } else if (status === ECIM_STATUS.INVITING) {
            // 邀请中
            clearAllTimer();
            isAutoInvite = false;
            updateLocalStatus(ECIM_STATUS.INVITING);
            that.startAutoCloseTimer();
            that.show();
        } else if (status === ECIM_STATUS.REJECTD) {
            // 已拒
            clearAllTimer();
            updateLocalStatus(ECIM_STATUS.REJECTD);
            that.startRejectedTimer(isAuto);
        } else if (status === ECIM_STATUS.CHATTING) {
            // 不会到这里
            clearAllTimer();
            updateLocalStatus(ECIM_STATUS.CHATTING);
            that.hide();
        }
    });

    window.ec_im.on(COOKIE.LOCAL_STATUS_UPDATED, this.followLocalStatus.bind(this));
    /**
     * 根据心跳传过来的状态来更新本地状态
     * 只有当本地状态不为`邀请中`或者`被拒绝`，而且本地状态与后端状态不同，才更新本地状态
     */
    window.ec_im.on(ECIM_EVENTS.POLLING_STATUS, function(data) {
        var currentLocalStatus = window.ec_im.getLocalStatus();
        if (
            (currentLocalStatus != ECIM_STATUS.INVITING &&
            currentLocalStatus != ECIM_STATUS.REJECTD) &&
            currentLocalStatus != data
        ) {
            clearAllTimer();
            switch (data) {
                case ECIM_STATUS.VIEWING:
                    updateLocalStatus(ECIM_STATUS.VIEWING);
                    window.ec_im.pollingForMsg();
                    break;
                case ECIM_STATUS.CHATTING:
                    updateLocalStatus(ECIM_STATUS.CHATTING);
                    break;
                // case ECIM_STATUS.INVITING:
                //     isAutoInvite = false;
                //     updateLocalStatus(ECIM_STATUS.INVITING);
                //     that.startAutoCloseTimer();
                //     that.show();
                // case ECIM_STATUS.REJECTD:
                //     clearAllTimer();
                //     updateLocalStatus(ECIM_STATUS.REJECTD);
                //     that.startRejectedTimer(isAutoInvite);
                default:
                    break;
            }
        }
    });

    addEvent(window, 'message', function (e) {
        if (!SAFE_ORIGIN[e.origin]) {
            return;
        }
        var data = e.data;
        if (data && typeof data === 'string') {
            data = JSON.parse(data);
        }
        switch (data.event) {
            // case RANDOM_CS_TYPES.GET_RANDOM_CS_ID: {
            //     that.csid = data.data.data;
            //     if (that.opts.autoShow) {
            //         if (window.ec_im.getLocalStatus() === '0') {
            //             that.startAutoInviteTimer();
            //         }
            //     }
            //     break;
            // }
            case ECIM_EVENTS.UPDATED: {
                clearAllTimer();
                var receivedStatus = data.data.status;
                if (receivedStatus === ECIM_STATUS.CHATTING) {
                    updateLocalStatus(ECIM_STATUS.CHATTING);
                    that.hide();
                } else if (receivedStatus === ECIM_STATUS.VIEWING || receivedStatus === ECIM_STATUS.CLOSE) {
                    updateLocalStatus(ECIM_STATUS.VIEWING);
                    that.hide();
                }
                break;
            }
            default:
                break;
        }
        return true;
    });
};

// cookie 轮询会调用这个函数，不与 ECIM_EVENTS.UPDATED 事件冲突
InviteDialog.prototype.followLocalStatus = function followLocalStatus(status) {
    status = status || window.ec_im.getLocalStatus();
    switch (status) {
        // 浏览
        case '0': {
            if (autoAgainTimer) {
                clearTimeout(autoAgainTimer);
            }

            if (manualAgainTimer) {
                clearTimeout(manualAgainTimer);
            }

            if (!isAutoInvite && autoCloseTimer) {
                clearTimeout(autoCloseTimer);
            }

            window.ec_im.pollingForMsg();
            break;
        }
        // 邀请中
        case '1': {
            if (!autoCloseTimer) {
                this.startAutoCloseTimer();
            }

            if (autoAgainTimer) {
                clearTimeout(autoAgainTimer);
            }

            if (manualAgainTimer) {
                clearTimeout(manualAgainTimer);
            }

            if (!isClickAccept) {
                this.show();
            }
            break;
        }
        // 已拒绝
        case '2': {
            if (this.opts.autoShow) {
                if (this.opts.allowAutoAgain && !autoAgainTimer) {
                    this.startAutoAgainTimer();
                }
            } else if (this.opts.allowManualAgain) {
                if (!manualAgainTimer) {
                    this.startManualAgainTimer();
                }
            }

            if (!isClickRefuse && autoCloseTimer) {
                clearTimeout(autoCloseTimer);
            }

            if (!isClickRefuse) {
                this.hide();
            }
            break;
        }
        // 会话中
        case '3': {
            clearAllTimer();
            this.hide();
        }
        default:
            break;
    }
}

InviteDialog.prototype.startAutoInviteTimer = function startAutoInviteTimer() {
    var that = this;
    if (this.opts.autoShow) {
        autoInviteTimer = setTimeout(function() {
            that.autoInvite();
        }, this.opts.autoInviteDelay * 1000);
    }
}

InviteDialog.prototype.startAutoCloseTimer = function startAutoCloseTimer() {
    var that = this;
    autoCloseTimer = setTimeout(function() {
        window.ec_im.updateStatus(ECIM_STATUS.VIEWING, that.csid);
        that.hide();
    }, this.opts.autoCloseDelay * 1000);
}

InviteDialog.prototype.startRejectedTimer = function startRejectedTimer(isAuto) {
    var that = this;
    if (isAuto) {
        if (this.opts.autoShow && this.opts.allowAutoAgain) {
            this.startAutoAgainTimer();
        }
    } else {
        if (this.opts.allowManualAgain) {
            this.startManualAgainTimer();
        }
    }
}

InviteDialog.prototype.startAutoAgainTimer = function() {
    var that = this;
    autoAgainTimer = setTimeout(function () {
        that.autoInvite(that.csid);
    }, this.opts.autoInviteInterval * 1000);
}

InviteDialog.prototype.startManualAgainTimer = function() {
    var that = this;
    manualAgainTimer = setTimeout(function () {
        window.ec_im.updateStatus(ECIM_STATUS.VIEWING, that.csid);
    }, this.opts.manualInviteInterval * 1000);
}

InviteDialog.prototype.show = function show() {
    if (!$('.ec--cs-invite-wrapper')) {
        document.body.appendChild(this.$tplElem);
    } else {
        removeClass(this.$tplElem, 'ec--hide-elem');
    }
};

InviteDialog.prototype.hide = function hide() {
    addClass(this.$tplElem, 'ec--hide-elem');
};

InviteDialog.prototype.autoInvite = function autoInvite() {
    isAutoInvite = true;
    this.show();
    this.startAutoCloseTimer();
    // window.ec_im.updateStatus(ECIM_STATUS.INVITING, csid, true);
}

InviteDialog.prototype.timeout = function timeout() {
    var that = this;
    timeoutTimer = setTimeout(function() {
        window.ec_im.updateStatus(ECIM_STATUS.VIEWING, that.csid);
    }, 60000);
};

var initInvite = (function() {
    var instance = null;
    return {
        getInstance: function (options, entrance) {
            if (!instance) {
                instance = new InviteDialog(options, entrance);
                return instance;
            }
            return instance;
        },
        onInviteMsgReceived: function (msg) {
            // this 为 ec_im
            // todo :: inviteDialog 点击 reject accept
            if (window.ec_im.getLocalStatus() === '0') {
                var that = this;
                var csid = msg.CustomerID;
                clearAllTimer();

                this.stopPolling();

                instance.csid = csid;
                instance.show();
                // entrance.initInviteDialog(csid);
                this.updateStatus(ECIM_STATUS.INVITING, csid);
                var instanceOpts = instance.opts;

                autoCloseTimer = setTimeout(function() {
                    instance.hide();
                    that.pollingForMsg();
                }, instanceOpts.autoCloseDelay * 1000);
            }
        }
    };
})();

module.exports = initInvite;
