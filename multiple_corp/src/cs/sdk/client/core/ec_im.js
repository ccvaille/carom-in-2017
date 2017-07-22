/*eslint-disable */
var ajax = require('../utils/ajax');
var Event = require('../modules/Event');
var consts = require('../modules/const');
var cookie = require('../utils/cookie');

var ECIM_STATUS = consts.ECIM_STATUS,
    ECIM_EVENTS = consts.ECIM_EVENTS,
    COOKIE = consts.COOKIE;

function ECIM(opts) {
    this.init(opts);
}

ECIM.prototype = new Event();

ECIM.prototype.init = function (opts) {
    this.initVars(opts);
    this.bindEvents();
};
ECIM.prototype.initVars = function (opts) {
    opts = opts || {};

    this.heartbeatType = opts.heartbeatType,
    this.heartbeatUrl = opts.heartbeatUrl || '//ecfk.workec.com/heart',
    this.pollingUrl = opts.pollingUrl || '//ecfk.workec.com/invitemsg',
    this.loginUrl = opts.loginUrl || '//ecfk.workec.com/login';
    this.quiteUrl = opts.quiteUrl || '//ecfk.workec.com/quit';
    this.upstatusUrl = opts.upstatusUrl || '//ecfk.workec.com/upstatus';
    this.switchCsUrl = opts.switchCsUrl || '//ecfk.workec.com/switchcs';
    this.heartbeatInterval = opts.heartbeatInterval || 15000,
    this.pollingInterval = opts.pollingInterval;
    this.key = opts.key || '';

    this.guid = opts.guid;
    this.corpid = opts.corpid;
    this.pageid = opts.pageid || 0;
    this.scheme = opts.scheme || 0;

    this.pageType = opts.pageType;
};
ECIM.prototype.bindEvents = function () {
    var self = this;
};
ECIM.prototype.run = function () {
    this.startHeartbeat();
    this.pollingInterval && this.pollingForMsg();
};
ECIM.prototype.startHeartbeat = function () {
    if (this.heartbeatTimer) return;
    var self = this;
    var heartbeatUrl = this.heartbeatUrl,
        heartbeatInterval = this.heartbeatInterval;

    function beat(isFirstBeat) {
        self.heartBeatTimeGap = self.heartbeatInterval;
        if (self.timeGapCounter) {
            clearInterval(self.timeGapCounter);
            self.timeGapCounter = undefined;
        }
        self.timeGapCounter = setInterval(function () {
            self.heartBeatTimeGap -= 100;
        }, 1000);
        ajax.getJSON(heartbeatUrl, {
            CorpID: self.corpid,
            VisitorID: self.guid,
            Type: self.heartbeatType,
            Key: self.key
        }, function (re) {
            if (re.ErrorCode) {
                // 重连机制
                self.emit(ECIM_EVENTS.ERROR, re);
                return;
            }

            // 根据心跳同步可能的状态
            if (re.PageID) {
                self.emit(ECIM_EVENTS.POLLING_STATUS, ECIM_STATUS.CHATTING);
            } else {
                self.emit(ECIM_EVENTS.POLLING_STATUS, ECIM_STATUS.VIEWING);
            }
            if (isFirstBeat && self.heartbeatType === ECIM_STATUS.VIEWING && re.PageID) {
                self.emit(ECIM_EVENTS.ALREADY_CHATTING);
            }
            if (
                self.pageType === ECIM_STATUS.CHATTING // 在会话页面
                && re.PageID // 返回的id不为0 说明当前是最后的会话页面？
                && self.pageid !== re.PageID
            ) {
                self.emit(ECIM_EVENTS.KICKED);
            }
        });
    }
    beat('isFirstBeat');
    this.heartbeatTimer = setInterval(beat, heartbeatInterval);
};
ECIM.prototype.pollingForMsg = function () {
    if (this.pollingTimer) return;

    var self = this;
    var pollingUrl = this.pollingUrl,
        pollingInterval = this.pollingInterval;

    if (this.getLocalStatus() === '0') {
        this.pollingTimer = setInterval(function () {
            ajax.getJSON(pollingUrl, {
                CorpID: self.corpid,
                VisitorID: self.guid,
                Key: self.key
            }, function (re) {
                if (re.ErrorCode) {
                    self.emit(ECIM_EVENTS.ERROR, re);
                    return;
                }
                var msg = re.Body;
                if (msg) {
                    self.emit(ECIM_EVENTS.SYS_MSG, msg);
                }
            });
        }, pollingInterval || 5000);
    }
};
ECIM.prototype.stopHeartbeat = function () {
    clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = undefined;
};
ECIM.prototype.stopPolling = function () {
    // todo :: 根据设置判断是否继续查询
    clearInterval(this.pollingTimer);
    this.pollingTimer = undefined;
};
ECIM.prototype.login = function () {
    var self = this;
    ajax.getJSON(this.loginUrl, {
        CorpID: this.corpid,
        VisitorID: this.guid,
        Template: this.scheme,
        Key: this.key
    }, function (re) {
        if (re.ErrorCode) {
            self.emit(ECIM_EVENTS.ERROR, re);
            return;
        }
        self.emit(ECIM_EVENTS.LOGIN);
    });
};
ECIM.prototype.updateStatus = function (status, csid, isAuto) {
    var self = this;
    isAuto = isAuto ? isAuto : false;
    ajax.getJSON(this.upstatusUrl, {
        Status: status,
        CorpID: this.corpid,
        VisitorID: this.guid,
        CustomerID: csid,
        Key: this.key,
        PageID: this.pageid,
    }, function (re) {
        if (re.ErrorCode) {
            self.emit(ECIM_EVENTS.ERROR, re);
            return;
        }
        self.heartbeatType = status;
        self.pageid = re.PageID || 0; // 3 -> 0 pageid丢失
        self.emit(ECIM_EVENTS.UPDATED, re.SeqID, status, isAuto);
    });
};
ECIM.prototype.quite = function (callback) {
    var self = this;
    ajax.getJSON(this.quiteUrl, {
        CorpID: this.corpid,
        VisitorID: this.guid,
        Key: this.key
    }, function (re) {
        if (re.ErrorCode) {
            self.emit(ECIM_EVENTS.ERROR, re);
            return;
        }
        self.clearHeartbeat();
        if (callback) {
            callback();
        }
        self.emit(ECIM_EVENTS.QUITE);
    });
};

ECIM.prototype.switchCs = function (csid, csname, fromcsid) {
    var self = this;

    ajax.getJSON(this.switchCsUrl, {
        CorpID: this.corpid,
        VisitorID: this.guid,
        Template: this.scheme,
        CustomerID: csid,
        Key: this.key
    }, function (re) {
        if (re.ErrorCode) {
            self.emit(ECIM_EVENTS.ERROR, re);
            return;
        }
        self.emit(ECIM_EVENTS.SWITCH_CS, csid, csname, fromcsid, re.SeqID);
    });
};

ECIM.prototype.getLocalStatus = function getLocalStatus() {
    return cookie(COOKIE.NAME);
}

ECIM.prototype.setLocalStatus = function setLocalStatus(status) {
    cookie(COOKIE.NAME, status, null, '/');
}

ECIM.prototype.emitLocalStatus = function emitLocalStatus() {
    var status = this.getLocalStatus();
    this.emit(COOKIE.LOCAL_STATUS_UPDATED, status);
}

ECIM.prototype.getTabNum = function getIsMultiTab() {
    return cookie(COOKIE.TAB_NUM);
}

ECIM.prototype.setTabNum = function setIsMultiTab(num) {
    return cookie(COOKIE.TAB_NUM, num, null, '/');
}

ECIM.prototype.resetPageId = function resetPageId() {
    this.pageid = 0;
}

module.exports = ECIM;
