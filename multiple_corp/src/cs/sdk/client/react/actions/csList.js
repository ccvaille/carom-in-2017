/*eslint-disable */
var shortid = require('shortid');
var ajax = require('../../utils/ajax');
var getQueryParams = require('../../utils/search');
var serialize = require('../../utils/serialize');
var addEvent = require('../../utils/dom').addEvent;
var openQQ = require('../../utils/openQQ');

var consts = require('../../modules/const'),
    SESSION_CONF = consts.SESSION_CONF,
    POST_MSG_TYPES = consts.POST_MSG_TYPES,
    SAFE_ORIGIN = consts.SAFE_ORIGIN,
    WINDOW_MODES = consts.WINDOW_MODES,
    CS_LIST_STYLE = consts.CS_LIST_STYLE;

var actTypes = {
    INIT_CS_LIST: 'INIT_CS_LIST',
    SELECT_CS: 'SELECT_CS',
    CSLIST_UPDATE_UNREAD_NUMS: 'CSLIST_UPDATE_UNREAD_NUMS',
    RESIZE_CS_LIST: 'RESIZE_CS_LIST'
};

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);

var csListActs = {
    actTypes: actTypes,
    init: function () {
        var queryParams = getQueryParams();
        window.corpid = queryParams.corpid;
        window.ec_guid = queryParams.guid || '';
        window.ec_cskey = queryParams.cskey || '';

        return function (dispatch, getState) {
            ajax.getJSON('//kf.ecqun.com/index/index/getonlines?CorpID=' + window.corpid, {
                corpid: window.corpid,
                scheme: 0,
                referUrl: document.referrer,
                visitUrl: window.location.href,
                title: document.title,
                type: isMobile ? 1 : 0,
                cskey: window.ec_cskey
            }, function (re) {
                // alert(JSON.stringify(re);
                if (re.code !== 200) {
                    return;
                }
                dispatch(csListActs.doInitCsList(re.data));
                dispatch(csListActs.initWindowEvts());
            });
        }
    },
    initWindowEvts: function () {
        return function (dispatch) {
            addEvent(window, 'message', function (e) {
                var msg = e.data;
                if (msg && typeof msg === 'string') {
                    try {
                        msg = JSON.parse(msg);
                    } catch (err) {}
                }
                switch (msg.event) {
                    case POST_MSG_TYPES.UPDATE_UNREAD_NUMS: {
                        dispatch(csListActs.updateUnreadNums(msg.data.csid, msg.data.num));
                        break;
                    }
                    default:
                        break;
                }
            });
        };
    },
    doInitCsList: function (data) {
        // var onlineCs = data.onlinecslist;
        // var keys = Object.keys(onlineCs);
        // var randKey = keys[Math.floor(Math.random() * keys.length>>0)]

        // window.top.postMessage({
        //     event: RANDOM_CS_TYPES.GET_RANDOM_CS_ID,
        //     data: randKey
        // }, '*');
        window.openWin = function () {
            csListActs.openWin();
        };

        function getRandomNum() {
            return Math.random() > 0.5 ? -1 : 1;
        }

        data.cslist.map(function (item) {
            var onlines = [], offlines = [];

            item.data.forEach(function (cs) {
                var isOnline = !!data.onlinecslist[cs.csid];
                if (isOnline) {
                    onlines.push(cs);
                } else {
                    offlines.push(cs);
                }
            });
            if (data.listset.listrand * 1 === 1) {  // 1:随机， 0：顺序
                item.data = onlines.sort(getRandomNum).concat(offlines.sort(getRandomNum));
            } else {
                item.data = onlines.concat(offlines);
            }
        });

        return {
            type: actTypes.INIT_CS_LIST,
            payload: {
                data: data
            }
        };
    },
    openWin: function (csid) {
        var queryParams = {
            corpid: window.corpid,
            csid: csid,
            guid: window.ec_guid
        };
        var sessionUrl = SESSION_CONF.URL + '?' + serialize(queryParams);
        window.open(sessionUrl, SESSION_CONF.NAME + shortid.generate(), SESSION_CONF.SETTINGS);
    },
    selectCs: function (csid, groupid, isQQFirst, csqq, showqq, isOnline) {
        return function (dispatch, getState) {
            dispatch(csListActs.doSelectCs(groupid, csid));

            var listState = getState().csList;

            var mode = listState.mode;
            var listStyle = listState.config.showstyle;

            var queryParams = {
                corpid: window.corpid,
                csid: csid,
                mode: mode,
                guid: window.ec_guid,
                cskey: window.ec_cskey
            };
            var sessionUrl = SESSION_CONF.URL + '?' + serialize(queryParams);
            var qqUrl = SESSION_CONF.QQURL + csqq;

            if (!isMobile) {
                // 列表模式下按钮模式，直接打开会话框
                // if (mode === WINDOW_MODES.STANDARD && listStyle === CS_LIST_STYLE.LIST_STYLE) { // 模式
                //     if (isQQFirst === 1) {
                //         // window.open(qqUrl);
                //         var iframeQQ = document.createElement('iframe');
                //         iframeQQ.setAttribute('src', qqUrl);
                //         iframeQQ.style.display = 'none';
                //         document.body.appendChild(iframeQQ);
                //         // window.location = qqUrl;
                //     } else {
                //         window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
                //     }
                //
                //     return;
                // }

                // 如果是列表模式
                // 1. 小浮框的情况&& QQ优先接待的情况，直接打开会话窗口
                if (listStyle === CS_LIST_STYLE.LIST_STYLE) {
                    if (isQQFirst === 1 && showqq === 1) {
                        // window.location.href = qqUrl;
                        // var iframeQQ = document.createElement('iframe');
                        // iframeQQ.setAttribute('src', qqUrl);
                        // iframeQQ.setAttribute('name', csid);
                        // iframeQQ.style.display = 'none';
                        // document.body.appendChild(iframeQQ);
                        window.open(qqUrl)
                        return;
                    }
                }

                // 列表模式下按钮模式，直接打开会话框
                if (mode === WINDOW_MODES.STANDARD) {
                    window.open(sessionUrl, SESSION_CONF.NAME + shortid.generate(), SESSION_CONF.SETTINGS);
                    return;
                }

                // queryParams.mode = 0;
                // sessionUrl = SESSION_CONF.URL + '?' + serialize(queryParams);
                /**
                 * 手机要先 postMessage 更新状态，然后离开页面
                 */
                // window.top.postMessage(JSON.stringify({
                //     event: POST_MSG_TYPES.SELECT_CS,
                //     data: csid
                // }), '*');
                // setTimeout(function() {
                //     window.top.location.href = sessionUrl;
                // }, 300);
                // window.open(sessionUrl, SESSION_CONF.NAME, SESSION_CONF.SETTINGS);
            }

            // parent open iframe
            window.top.postMessage(JSON.stringify({
                event: POST_MSG_TYPES.SELECT_CS,
                data: csid,
                qqData: {
                    isQQFirst: isQQFirst,
                    csqq: csqq
                }
            }), '*');
        };
    },
    doSelectCs: function (groupid, csid) {
        return {
            type: actTypes.SELECT_CS,
            payload: {
                groupid: groupid,
                csid: csid
            }
        };
    },
    updateUnreadNums: function (csid, num) {
        return {
            type: actTypes.CSLIST_UPDATE_UNREAD_NUMS,
            payload: {
                csid: csid,
                num: num
            }
        };
    },
    resizeCsList: function (style) {
        var $list = document.querySelector('.cs-list');
        $list.style.width = style.width - 22 + 'px';
        $list.style.height = style.height - 22 + 'px';

        window.top.postMessage(JSON.stringify({
            event: POST_MSG_TYPES.RESIZE_CS_LIST,
            data: style
        }), '*');
        return {
            type: actTypes.RESIZE_CS_LIST,
            payload: {
                width: style.width,
                height: style.height
            }
        }
    }
};

module.exports = csListActs;
