/*eslint-disable */
var msgTypes = require('~cscommon/consts/msgTypes'),
    msgSubTypes = require('~cscommon/consts/msgSubTypes'),
    guestTypes = require('~cscommon/consts/guestTypes');

function text(opts) {
    var text = opts.text,
        accid = opts.accid,
        acctype = opts.acctype,
        seqid = opts.seqid || window.seqid || 0,
        corpid = opts.corpid || window.corpid;

    return {
        Type: msgTypes.SESSION,
        MsgBody: {
            ID: '' + accid,
            AccountType: acctype,
            MsgEles: [{
                SubType: msgSubTypes.SESSION.TEXT,
                Content: text
            }],
            SeqID: seqid,
            CorpID: corpid
        }
    };
}
function image(opts) {
    var srcs = opts.srcs,
        accid = opts.accid,
        acctype = opts.acctype,
        seqid = opts.seqid || window.seqid || 0,
        corpid = opts.corpid || window.corpid;

    return {
        Type: msgTypes.SESSION,
        MsgBody: {
            ID: '' + accid,
            AccountType: acctype,
            MsgEles: [{
                SubType: msgSubTypes.SESSION.IMAGE,
                Content: '',
                Srcs: srcs
            }],
            SeqID: seqid,
            CorpID: corpid
        }
    };
}
function newSess(opts) {
    var accid = opts.accid,
        acctype = opts.acctype,
        guname = opts.guname,
        pic = opts.pic,
        terminal = opts.terminal,
        seqid = opts.seqid || window.seqid || 0,
        corpid = opts.corpid || window.corpid;

    return {
        Type: msgTypes.TRACK,
        MsgBody: {
            SubType: msgSubTypes.TRACK.NEW_SESSION,
            Content: guname + ' 进入对话',
            ID: '' + accid,
            AccountType: acctype,
            Name: guname,
            Pic: pic,
            SeqID: seqid,
            CorpID: corpid,
            Terminal: terminal
        }
    }
}
function closeSess(opts) {
    var accid = opts.accid,
        acctype = opts.acctype,
        guname = opts.guname,
        seqid = opts.seqid || window.seqid || 0,
        corpid = opts.corpid || window.corpid;

    return {
        Type: msgTypes.TRACK,
        MsgBody: {
            SubType: msgSubTypes.TRACK.CLOSE_SESSION,
            Conent: guname + ' 已关闭会话',
            ID: '' + accid,
            AccountType: acctype,
            SeqID: seqid,
            CorpID: corpid
        }
    }
}
function timeout(opts) {
    var accid = opts.accid,
        acctype = opts.acctype,
        guname = opts.guname,
        seqid = opts.seqid || window.seqid || 0,
        corpid = opts.corpid || window.corpid;

    return {
        Type: msgTypes.TRACK,
        MsgBody: {
            SubType: msgSubTypes.TRACK.TIMEOUT,
            Conent: guname + ' 会话已超时',
            ID: '' + accid,
            AccountType: acctype,
            SeqID: seqid,
            CorpID: corpid
        }
    }
}
function switchCs(opts) { // 仅客服端
    var switchData = opts.switchData,
        accid = opts.accid,
        acctype = opts.acctype,
        seqid = opts.seqid || 0,
        corpid = opts.corpid;

    return {
        Type: msgTypes.TRACK,
        MsgBody: {
            SubType: msgSubTypes.TRACK.SWITCH_CS,
            ID: '' + accid,
            AccountType: acctype,
            SwitchData: switchData,
            SeqID: seqid,
            CorpID: corpid
        }
    }
}
function switchCsMsgs(opts) {
    var accid = opts.accid,
        acctype = opts.acctype,
        fromId = opts.fromId,
        toId = opts.toId,
        msgs = opts.msgs,
        seqid = opts.seqid || window.seqid || 0,
        corpid = opts.corpid || window.corpid;

    return {
        Type: msgTypes.SWITCH_LAST_MSG,
        MsgBody: {
            ID: '' + accid,
            AccountType: acctype,
            Msgs: msgs,
            SwitchData: {
                FromAccount: fromId,
                ToAccount: toId
            },
            SeqID: seqid,
            CorpID: corpid
        }
    };
}
function previewMsg(opts) {
    var accid = opts.accid,
        acctype = opts.acctype,
        content = opts.content;

    return {
        Type: msgTypes.LOCAL_CUSTOM,
        MsgBody: {
            SubType: msgSubTypes.PREIVEW_MSG,
            ID: '' + accid,
            AccountType: acctype,
            Content: content
        }
    }
}
function leaveMsgSucc(opts) {
    var accid = opts.accid,
        acctype = opts.acctype;

    return {
        Type: msgTypes.LOCAL_CUSTOM,
        MsgBody: {
            SubType: msgSubTypes.LEAVE_MSG_SUCCESS,
            ID: '' + accid,
            AccountType: acctype
        }
    }
}
function offlinePushInfo(opts) {
    var pushflag = opts.pushflag || 0,
        ext = opts.ext,
        desc = opts.desc,
        androidSound = opts.androidSound || 'android.mp3',
        apnsSound = opts.apnsSound || 'apns.mp3';

    return {
        PushFlag: pushflag,
        Desc: desc,
        Ext: ext,
        AndroidInfo: {
            Sound: androidSound
        },
        ApnsInfo: {
            Sound: apnsSound,
            BadgeMode: 1
        }
    };
}
function txMsg(fromId, sendToId) {
    var session = new webim.Session(
        webim.SESSION_TYPE.C2C,
        sendToId,
        sendToId,
        '',
        Math.round(new Date().getTime() / 1000)
    );
    return new webim.Msg(
        session,
        true,
        -1,
        Math.round(Math.random() * 4294967296),
        Math.round(new Date().getTime() / 1000),
        fromId,
        webim.C2C_MSG_SUB_TYPE.COMMON
    );
}
module.exports = {
    txMsg: txMsg,
    sess: {
        text: text,
        image: image
    },
    track: {
        newSess: newSess,
        closeSess: closeSess,
        timeout: timeout,
        switchCs: switchCs
    },
    localCustom: {
        switchCsMsgs: switchCsMsgs,
        previewMsg: previewMsg,
        leaveMsgSucc: leaveMsgSucc
    },
    offlinePushInfo: offlinePushInfo
};
