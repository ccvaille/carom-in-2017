/*eslint-disable */
require('~cscommon/lib/base64');
require('~cscommon/utils/imgMsgStateFn');
require('~cscommon/utils/audioMsgStateFn');
var usedEmotions = require('~cscommon/consts/usedEmotions');
var loadingImg = require('~cscommon/images/loading.gif');
var makeCustomMsg = require('~cscommon/utils/makeCustomMsg');
var msgTypes = require('~cscommon/consts/msgTypes'),
    msgSubTypes = require('~cscommon/consts/msgSubTypes'),
    sessionMsgTypes = require('~cscommon/consts/sessionMsgTypes'),
    emotionPath = require('~cscommon/consts/emotionPath');

function matchEmotions(content) {
    // 兼容QQ[[表情]]格式
    return content.replace(/\[[^\[\]]*\]|\[\[[^\[\]]*\]\]/g, function (key) {
        var keyEmotion = key.replace(/\[|\]|\[\[|\]\]/g, '');
        var hasEmotion = usedEmotions.findIndex(function (emotion) {
                             return keyEmotion === emotion;
                         }) === -1;
        if (hasEmotion) {
            return key;
        }
        return '<img class="ec-qq-emoji" src="' + emotionPath + keyEmotion + '.png" width="24" height="24" />';
    });
}
function matchUrl(content) {
    return content.replace(/(((http|ftp|https):)\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g, '<a href="$1" target="_blank">$1</a>');
}
function formatText(text) {
    return text.replace(/ /g, '&nbsp')
               .replace(/\n/g, '<br />');
}

function textTransfer(content) {
    return matchEmotions(
           formatText(
           xssFilter(
           content)));
}
function xssFilter(content) {
    var chars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2f;'
    };
    var pattern = new RegExp('(' + Object.keys(chars).join('|') + ')', 'g');
    var safeCont = content.replace(pattern, function (key) {
        return chars[key];
    });
    return safeCont;
}
function textParseLink(content) {
    var linkPattern = /(((http|ftp|https):)\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?)/g;

    var result = [],
        startPos = 0,
        endPos = 0,
        tempResult = linkPattern.exec(content);

    while(tempResult) {
        endPos = linkPattern.lastIndex;
        result.push({
            type: 'text',
            cont: content.slice(startPos, endPos).replace(tempResult[0], '')
        });
        result.push({
            tyle: 'link',
            cont: tempResult[0]
        });
        startPos = endPos;
        tempResult = linkPattern.exec(content);
    }
    result.push({
        type: 'text',
        cont: content.slice(startPos)
    });
    // console.log(result);
    return result;
}
function parseText(content) {
    var temp = textParseLink(content);
    return temp.map(function (node) {
        if (node.type === 'text') {
            return textTransfer(node.cont);
        }
        return matchUrl(node.cont);
    }).join('');
}

function getMsg(txMsg) {
    var msgEle = txMsg.getElems()[0];
    if (!msgEle) {
        return makeCustomMsg.sess.image({
            srcs: {
                SmallImage: '',
                BigImage: '',
                OriImage: ''
            }
        });
    }
    var msgContent = msgEle.getContent(),
        data = msgContent.getData();
    var msg;
    try {
        msg = JSON.parse(window.Base64.decode(data))
    } catch(e) {
        console.error(window.Base64.decode(data), 'data decoded');
        console.error(data, 'origin data');
        // console.log(txMsg, data);
    }
    return msg;
}

function getMsgBody(txMsg) {
    var msgBody = getMsg(txMsg).MsgBody;
    msgBody.txMsgInfo = {
        msgId: txMsg.seq,
        msgTime: txMsg.time * 1000,
        fromId: txMsg.fromAccount,
        seqId: msgBody.SeqID
    };
    return msgBody;
}
// 目的：convert后是可以直接addMsg的
function convertSysMsg(txMsg) {
    return getMsgBody(txMsg);
}
function convertTrackMsg(txMsg) {
    var msgBody = getMsgBody(txMsg);

    var msgInfo = msgBody.txMsgInfo;
    var trackSubType = msgSubTypes.TRACK;
    var result = {
        type: sessionMsgTypes.TIP_MSG
    };
    switch (msgBody.SubType) {
        case trackSubType.NEW_SESSION:
            result.msgContent = msgBody.Content;
            result.guestInfo = {
                guid: msgBody.ID,
                name: msgBody.Name,
                pic: msgBody.Pic,
                visitortype: msgBody.AccountType,
                terminal: msgBody.Terminal,
            };
            break;
        case trackSubType.CLOSE_SESSION:
        case trackSubType.TIMEOUT:
            result.msgContent = msgBody.Content;
            break;
        case trackSubType.SWITCH_CS:
            result.msgContent = msgBody.Content;
            break;
        default:
            break;
    }
    return Object.assign(result, msgInfo);
}
function convertSessionMsgs(txMsg) {
    var msgBody = getMsgBody(txMsg);

    var msgInfo = msgBody.txMsgInfo;

    var sessionSubType = msgSubTypes.SESSION;
    var results = [];

    msgBody.MsgEles.forEach(function (item, index) {
        var result = {
            type: sessionMsgTypes.SESSION_MSG
        };
        switch (item.SubType) {
            case sessionSubType.TEXT:
                Object.assign(result, convertTextMsg(item));
                break;
            case sessionSubType.IMAGE:
                Object.assign(result, convertImageMsg(item));
                break;
            case sessionSubType.AUDIO:
                Object.assign(result, convertAudioMsg(item));
            default:
                break;
        }
        results.push(Object.assign(result, msgInfo, {
            subType: item.SubType,
            msgId: msgInfo.msgId + '_' + index
        }));
    });
    return results;
}
function convertTextMsg(msgEle)  {
    return {
        msgContent: msgEle.Content,
        text: msgEle.Content,
        abstractText: msgEle.Content
    }
}

function convertImageMsg(msgEle) {
    return {
        srcs: msgEle.Srcs,
        msgContent: msgEle.Content,
        abstractText: '[图片]'
    };
}
function convertAudioMsg(msgEle) {
    return {
        audio: msgEle.Audio,
        msgContent: msgEle.Content,
        abstractText: '[语音]'
    }
}
function convertLocalCustomMsg(txMsg) {
    var msgBody = getMsg(txMsg);
    var msgInfo = msgBody.txMsgInfo;
    var result = {
        type: sessionMsgTypes.OTHER
    };
    switch (msgBody.SubType) {
        case msgSubTypes.LOCAL_CUSTOM.PREIVEW_MSG:
            result.msgContent = msgBody.Content;
            break;
        case msgSubTypes.LOCAL_CUSTOM.LEAVE_MSG_SUCCESS:
            break;
    }
    return Object.assign(result, msgInfo);
}
// 返回结果 不处理相关业务
function convertTxMsg(txMsg) {
    var msg = getMsg(txMsg);
    switch (msg.Type) {
        case msgTypes.SYSTEM:
            return convertSysMsg(txMsg);
        case msgTypes.TRACK:
            return convertTrackMsg(txMsg);
        case msgTypes.SESSION:
            return convertSessionMsgs(txMsg);
        case msgTypes.LOCAL_CUSTOM:
            return convertLocalCustomMsg(txMsg);
        default:
            return '';
    }
}

module.exports = {
    msgData: getMsg,
    sys: convertSysMsg,
    track: convertTrackMsg,
    sess: convertSessionMsgs,
    custom: convertLocalCustomMsg,
    convertTxMsg: convertTxMsg
};
