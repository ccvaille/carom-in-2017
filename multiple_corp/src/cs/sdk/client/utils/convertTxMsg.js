/*eslint-disable */
var getQueryParams = require('./search');
var usedEmotions = require('~cscommon/consts/usedEmotions');
var consts = require('../modules/const'),
    SESSION_MSG_TYPES = consts.SESSION_MSG_TYPES,
    MSG_STATES = consts.MSG_STATES;

function matchEmotions(content) {
    return content.replace(/\[[^\[\]]*\]/g, function (key) {
        var keyEmotion = key.replace(/\[|\]/g, '');
        var hasEmotion = usedEmotions.findIndex(function (emotion) {
                             return keyEmotion === emotion;
                         }) === -1;
        if (hasEmotion) {
            return key;
        }
        return '<img class="ec-qq-emoji" src="//www.staticec.com/my/images/qqimg/' + keyEmotion + '.png">';
    });
}
function matchUrl(content) {

}
function convertSessionMsg(txMsg, isImg) {
    var html = '', ele, type, content;
    var eles = txMsg.getElems();
    var imgMsgResult = {};
    for (var i in eles) {
        ele = eles[i];
        type = ele.getType();
        content = ele.getContent();

        switch (type) {
            case webim.MSG_ELEMENT_TYPE.TEXT:
                html += convertTextMsg(content);
                break;
            case webim.MSG_ELEMENT_TYPE.IMAGE: {
                imgMsgResult = convertImageMsg(content);
                html += imgMsgResult.html;
                break;
            }
            default:
                break;
        }
    }

    var msg = {
        type: SESSION_MSG_TYPES.SESSION_MSG,
        fromId: txMsg.fromAccount,
        msgId: txMsg.seq,
        msgContent: isImg ? '<img src="' + require('../imgs/loading.gif') + '">' : html,
        abstractText: isImg || /^<img .*>$/.test(txMsg.toHtml()) ? '[图片]' : txMsg.toHtml(),
        msgTime: txMsg.time * 1000
    };
    if (isImg || /^<img .*>$/.test(txMsg.toHtml())) {
        msg.srcs = imgMsgResult.srcs;
    }
    return msg;
}
function convertTextMsg(content) {
    return matchEmotions(content.getText());
}
function convertImageMsg(content) {
    var smallImage = content.getImage(webim.IMAGE_TYPE.SMALL);
    // var bigImage = content.getImage(webim.IMAGE_TYPE.LARGE);
    var oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN);
    return {
        html: '<a href="' + oriImage.getUrl() + '" target="_blank"><img src="' + smallImage.getUrl() + '" /></a>',
        srcs: {
            smallImage: smallImage.getUrl(),
            oriImage: oriImage.getUrl()
        }
    };
}
function convertCustomMsg(txMsg) {
    var msgContent = txMsg.getElems()[0].getContent();

    var ext = getQueryParams(msgContent.getExt());

    return {
        type: SESSION_MSG_TYPES.TIP_MSG,
        fromId: txMsg.fromAccount,
        msgId: txMsg.seq,
        msgContent: ext.action,
        msgTime: txMsg.time * 1000
    };
}

function convertTxMsg(txMsg) {
    var msgEle = txMsg.getElems()[0];
    if (!msgEle) { // msgEle为空则是发送的图片消息
        return convertSessionMsg(txMsg, 'isImg');
    }
    var msgType = txMsg.getElems()[0].getType();
    switch (msgType) {
        case webim.MSG_ELEMENT_TYPE.CUSTOM:
            return convertCustomMsg(txMsg);
        default:
            return convertSessionMsg(txMsg);
    }
}
module.exports = convertTxMsg;
