import { replace } from 'react-router-redux';
import restHub from '~comm/services/restHub';
import { displayError, serializeObject } from '~comm/utils';
import message from '~comm/components/Message';
import ApiUrls from 'constants/ApiUrls';
import * as HistoryActionTypes from 'constants/HistoryActionTypes';
import HistoryListTypes from 'constants/HistoryListTypes';
// import ECBridge from 'utils/ECBridge.js';

const MsgTypes = {
    TEXT_MSG: 0,
    IMG_MSG: 1,
    SYS_MSG: 2,
};

export function openAddCustomPV() {
    return (dispatch, getState) => {
        const { params, messageInfos } = getState().history;
        const { chatParams } = getState().history.chat;
        const { leftMsgParams } = getState().history;

        // const userId = getState().app.userInfo.userid;
        // const guId = chatParams.guId === '' ? leftMsgParams.guId : chatParams.guId;
        const { crmId } = getState().history.params;
        let guId;
        let markUrl = '';

        switch (params.type * 1) {
            case HistoryListTypes.CHAT_WX: {
                guId = chatParams.guId;
                const { openId } = chatParams;
                markUrl = `https://my.workec.com/crm/user/newuser?_v=newcrm&notag=0&notip=0&f=40&data=${openId}$$0`;
                break;
            }
            case HistoryListTypes.CHAT_QQ: {
                guId = chatParams.guId;
                const { customerName } = messageInfos;
                markUrl = `https://my.workec.com/crm/user/newuser?_v=newcrm&notag=0&notip=0&f=14&qqid=${guId}&name=${customerName}&`;
                break;
            }
            case HistoryListTypes.CHAT_WEB: {
                // console.log('  nnn', chatParams.guId)
                guId = chatParams.guId;
                markUrl = `https://my.workec.com/crm/user/newuser?_v=newcrm&notag=0&notip=0&f=41&data=${guId}$$0`;
                break;
            }
            case HistoryListTypes.CHAT_LEAVE_MSG: {
                // console.log(leftMsgParams, 'leftMsgParams')
                guId = leftMsgParams.guId;
                markUrl = `https://my.workec.com/crm/user/newuser?_v=newcrm&notag=0&notip=0&f=41&data=${guId}$$0`;
                break;
            }
            default:
                break;
        }

        console.log(markUrl, 'markUrl');

        // console.log(`https://my.workec.com/crm/user/newuser?_v=newcrm&notag=0&notip=0&f=41&data=${guId}$$0`, 'url')

        if (crmId > 0) {
            // console.log('yibeizhu');
            window.ECBridge.exec({
                command: 504,
                title: '客户资料',
                url: `https://my.workec.com/crm/detail?crmid=${crmId}#index`,
                needLogin: '1', //0:不需要登录态，1：需要登录态，打开PV时直接写cookie pv_key,httponly格式
                width: '900', //宽度，单位像素
                height: '600', //高度 ，单位像素
                status: '', //状态，max：最大化，不填则为宽高的值，宽高不填，则用默认的宽高
                minButton: '0', //0：需要，1：不需要；如果不传，默认是0
                maxButton: '0', //0：需要，1：不需要；如果不传，默认是0
                titleBar: '0', //0：native的，1：web控制的，如果是1，minButton和maxButton失效，如果不传，默认是0
                resizeAble: '0', //0：可以拖拉变更窗口大小，1：不可以拖拉变更窗口大小，默认0
                callback: (json) => {
                    console.log(json);
                },
            });
        } else {
            window.ECBridge.exec({
                command: 504,
                title: '新增客户',
                // url: `https://my.workec.com/crm/user/newuser?_v=newcrm&notag=0&notip=0&f=41&data=${guId}$$0`,
                url: markUrl,
                needLogin: '1', //0:不需要登录态，1：需要登录态，打开PV时直接写cookie pv_key,httponly格式
                width: '900', //宽度，单位像素
                height: '600', //高度 ，单位像素
                status: '', //状态，max：最大化，不填则为宽高的值，宽高不填，则用默认的宽高
                minButton: '0', //0：需要，1：不需要；如果不传，默认是0
                maxButton: '0', //0：需要，1：不需要；如果不传，默认是0
                titleBar: '0', //0：native的，1：web控制的，如果是1，minButton和maxButton失效，如果不传，默认是0
                resizeAble: '0', //0：可以拖拉变更窗口大小，1：不可以拖拉变更窗口大小，默认0
                callback: (json) => {
                    console.log(json);
                },
            });
        }
        // window.location = `showec://57-${userId}-/crm/user/newuser?_v=newcrm&notag=0&notip=0&f=41&data=${guId}$$0[-]600[-]900[-]0,1[-]15[-]新增客户`;
    };
}

export function updateGetParams(payload) {
    return {
        type: HistoryActionTypes.UPDATE_GET_PARAMS,
        payload,
    };
}

export function getHistoryListSuccess(payload) {
    return {
        type: HistoryActionTypes.GET_HISTORY_LIST_SUCCESS,
        payload,
    };
}

export function getHistoryList() {
    return (dispatch, getState) => {
        const { params, pagination } = getState().history;
        const type = params.type * 1;
        let url = '';

        if (type === HistoryListTypes.CHAT_WEB) {
            const paramsWeb = {
                body: {
                    date: params.date,
                    page: params.page,
                    pageSize: pagination.pageSize,
                    startDate: params.start,
                    endDate: params.end,
                    csid: params.csId,
                    effect: Number(params.webChatType),
                },
            };

            url = `${ApiUrls.historyWeb}`;

            return restHub.post(url, paramsWeb)
                .then(({ errorMsg, jsonResult }) => {
                    if (!errorMsg) {
                        dispatch(getHistoryListSuccess(jsonResult));
                        return { errorMsg: null };
                    }
                    displayError(errorMsg);
                    return { errorMsg };
                });
        } else if (type === HistoryListTypes.CHAT_LEAVE_MSG) {
            const newParams = {
                body: {
                    date: params.date,
                    startDate: params.start,
                    endDate: params.end,
                    page: params.page,
                    pageSize: pagination.pageSize,
                    csid: params.csId,
                    read: params.msgFilter,
                },
            };
            url = `${ApiUrls.historyLeftMsg}`;

            return restHub.post(url, newParams)
                .then(({ errorMsg, jsonResult }) => {
                    if (!errorMsg) {
                        // eslint-disable-next-line no-param-reassign
                        jsonResult.data.list = jsonResult.data.list.map((item) => {
                            let status = '';
                            if (item.read === 0) {
                                status = '未回复';
                            } else if (item.read === 2) {
                                status = '已回复';
                            } else if (item.read === 3) {
                                status = '待跟进';
                            }
                            return {
                                ...item,
                                statusTxt: status,
                            };
                        });

                        dispatch(getHistoryListSuccess(jsonResult));
                        return { errorMsg: null };
                    }

                    displayError(errorMsg);
                    return { errorMsg };
                }
            );
        } else if (type === HistoryListTypes.CHAT_QQ) {
            const newParams = {
                body: {
                    date: params.date,
                    startDate: params.start,
                    endDate: params.end,
                    page: params.page,
                    pageSize: pagination.pageSize,
                    csid: params.csId,
                },
            };
            url = `${ApiUrls.historyQQList}`;

            return restHub.post(url, newParams)
                .then(({ errorMsg, jsonResult }) => {
                    if (!errorMsg) {
                        dispatch(getHistoryListSuccess(jsonResult));
                        return { errorMsg: null };
                    }

                    displayError(errorMsg);
                    return { errorMsg };
                }
            );
        } else if (type === HistoryListTypes.CHAT_WX) {
            const newParams = {
                body: {
                    date: params.date,
                    startDate: params.start,
                    endDate: params.end,
                    page: params.page,
                    pageSize: pagination.pageSize,
                    csid: params.csId,
                },
            };
            url = `${ApiUrls.historyWXList}`;

            return restHub.post(url, newParams)
                .then(({ errorMsg, jsonResult }) => {
                    if (!errorMsg) {
                        dispatch(getHistoryListSuccess(jsonResult));
                        return { errorMsg: null };
                    }

                    displayError(errorMsg);
                    return { errorMsg };
                }
            );
        }

        return {
            errorMsg: '接待类型错误',
        };
    };
}

export function exportHistoryList() {
    return (dispatch, getState) => {
        const { type } = getState().history.params;
        const { params } = getState().history;
        const tempParams = {
            csid: params.csId,
            date: params.date,
            startDate: params.start,
            endDate: params.end,
        };
        if (type * 1 === HistoryListTypes.CHAT_WEB) {  // 网页会话
            const postParams = serializeObject(tempParams);
            window.location = `${ApiUrls.exportWebHistoryList}?${postParams}`;
        } else if (type * 1 === HistoryListTypes.CHAT_LEAVE_MSG) {   // 离线留言
            tempParams.read = params.msgFilter;
            const postParams = serializeObject(tempParams);
            window.location = `${ApiUrls.exportLeftMsgHistoryList}?${postParams}`;
        } else if (type * 1 === HistoryListTypes.CHAT_QQ) {
            const postParams = serializeObject(tempParams);
            window.location = `${ApiUrls.exportQQHistoryList}?${postParams}`;
        } else if (type * 1 === HistoryListTypes.CHAT_WX) {
            const postParams = serializeObject(tempParams);
            window.location = `${ApiUrls.exportWXHistoryList}?${postParams}`;
        }
    };
}

export function updateKfList(payload) {
    return {
        type: HistoryActionTypes.UPDATE_KF_LIST,
        payload,
    };
}

export function getKfList() {
    return (dispatch) => {
        const url = `${ApiUrls.kfList}`;

        return restHub.post(url)
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch(updateKfList(jsonResult.data));
                    return { errorMsg: null };
                }
                displayError(errorMsg);
                return { errorMsg };
            });
    };
}

export function updateModalStatus(payload) {
    return {
        type: HistoryActionTypes.UPDATE_MODAL_STATUS,
        payload,
    };
}

export function updateLeftMsgFields(payload) {
    return {
        type: HistoryActionTypes.UPDATE_LEFT_MSG_FIELDS,
        payload,
    };
}

export function updateLeftMsgSuccess(payload) {
    return {
        type: HistoryActionTypes.UPDATE_LEFT_MSG_SUCCESS,
        payload,
    };
}

// 获取离线留言部分
export function updateLeftMsgParams(payload) {
    return {
        type: HistoryActionTypes.UPDATE_LEFT_MSG_PARAMS,
        payload,
    };
}

export function getLeftMsgSuccess(payload) {
    return {
        type: HistoryActionTypes.GET_LEFT_MSG_SUCCESS,
        payload,
    };
}

export function getLeftMsg() {
    return (dispatch, getState) => {
        const params = getState().history.leftMsgParams;
        const paramsLeftMsg = {
            body: {
                msgid: params.msgId,
            },
        };

        return restHub.post(ApiUrls.getLeftMsgDetail, paramsLeftMsg)
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch(getLeftMsgSuccess(jsonResult));
                    return { errorMsg: null };
                }

                displayError(errorMsg);
                return { errorMsg };
            });
    };
}

export function saveLeftMsg() {
    return (dispatch, getState) => {
        const { leftMsg, leftMsgParams } = getState().history;
        const paramsEdit = {
            body: {
                msgid: leftMsgParams.msgId,
                read: leftMsg.read,
            },
        };

        return restHub.post(ApiUrls.editLeftMsgDetail, paramsEdit)
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    // displayError('保存成功');
                    message.success('保存成功');
                    dispatch(getHistoryList());
                    setTimeout(() => {
                        dispatch(updateModalStatus(false));
                    }, 500);
                    return { errorMsg: null };
                }
                dispatch(updateModalStatus(false));
                displayError(errorMsg);
                return { errorMsg };
            });
    };
}

// 轨迹部分方法
export function getTrackHistoryListSuccess(payload) {
    return {
        type: HistoryActionTypes.GET_TRACK_HISTORY_LIST_SUCCESS,
        payload,
    };
}

export function updateTrackParams(payload) {
    return {
        type: HistoryActionTypes.UPDATE_TRACK_PARAMS,
        payload,
    };
}

export function getTrackHistoryList() {
    return (dispatch, getState) => {
        const { guId, type, isNext, page } = getState().history.trackParams;
        const prevTrackList = getState().history.trackList;
        const url = `${ApiUrls.trackList}/${guId}/${type}?page=${page}`;

        return restHub.get(url)
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    let trackList = [];
                    let itemIndex = 0;
                    jsonResult.data.data.forEach((item, i) => {
                        if (i === 0 || item.f_date !== jsonResult.data.data[i - 1].f_date) {
                            const trackItem = {
                                keyword: item.f_keyword,
                                date: item.f_date,
                                engine: item.f_from,
                                referer: item.f_referer,
                                guId: item.f_guid,
                                list: [],
                            };

                            const listItem = {
                                type: item.f_type,
                                id: item.f_id,
                                corpId: item.f_corp_id,
                                ip: item.f_ip,
                                time: item.f_time,
                                engine: item.f_from,
                                url: item.f_url,
                                stayTime: item.f_stay_time,
                                title: item.f_title,
                            };

                            trackItem.list.push(listItem);
                            trackList.push(trackItem);
                            itemIndex += 1;
                        } else {
                            const listItem = {
                                type: item.f_type,
                                id: item.f_id,
                                corpId: item.f_corp_id,
                                ip: item.f_ip,
                                time: item.f_time,
                                engine: item.f_from,
                                url: item.f_url,
                                stayTime: item.f_stay_time,
                                title: item.f_title,
                            };

                            trackList[itemIndex - 1].list.push(listItem);
                        }
                    });

                    if (isNext) {
                        const prevLen = prevTrackList.length;
                        const trackLen = trackList.length;

                        if (trackLen > 0 && prevLen > 0 &&
                            trackList[0].date === prevTrackList[prevLen - 1].date
                        ) {
                            prevTrackList[prevLen - 1].list =
                                prevTrackList[prevLen - 1].list.concat(trackList[0].list);

                            trackList.shift();
                            trackList = prevTrackList.concat(trackList);
                        } else {
                            trackList = prevTrackList.concat(trackList);
                        }
                    }

                    if (jsonResult.data.current_page === jsonResult.data.last_page) {
                        dispatch(
                            updateTrackParams({
                                isCompleted: true,
                                isNext: false,
                            })
                        );
                    }

                    const trackData = {
                        page: {
                            total: jsonResult.data.total,
                            current: jsonResult.data.current_page,
                            pageSize: jsonResult.data.per_page,
                            lastPage: jsonResult.data.last_page,
                        },
                        trackList,
                    };

                    dispatch(updateTrackParams({
                        isLoading: false,
                    }));
                    dispatch(getTrackHistoryListSuccess(trackData));
                    return { errorMsg: null };
                }

                displayError(errorMsg);
                return { errorMsg };
            }
        );
    };
}

// 获取聊天记录部分(弹框)
export function updateChatParams(payload) {
    return {
        type: HistoryActionTypes.UPDATE_CHAT_PARAMS,
        payload,
    };
}

export function getChatListSuccess(payload) {
    return {
        type: HistoryActionTypes.GET_CHAT_LIST_SUCCESS,
        payload,
    };
}

export function getChatList() {
    return (dispatch, getState) => {
        const params = getState().history.chat.chatParams;
        const prevChatList = getState().history.chat.chatList;
        const { type } = getState().history.params;

        const postParams = {
            csid: params.csId,
            pageSize: params.pageSize,
            begin: params.begin,
            period: params.period,
        };

        let url = '';
        if (type * 1 === HistoryListTypes.CHAT_WEB) {
            url = `${ApiUrls.chatList}`;
            postParams.guid = params.guId;
        } else if (type * 1 === HistoryListTypes.CHAT_QQ) {
            url = `${ApiUrls.chatQQList}`;
            postParams.qqid = params.guId;
        } else if (type * 1 === HistoryListTypes.CHAT_WX) {
            url = `${ApiUrls.chatWXList}`;
            postParams.wxid = params.guId;
        }

        const paramsChat = {
            body: postParams,
        };

        return restHub.post(url, paramsChat)
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    if (jsonResult.data.list.length < params.pageSize) {
                        dispatch(updateChatParams({ isCompleted: true }));
                    }

                    dispatch(updateChatParams({
                        begin: jsonResult.data.nextBegin,
                        period: jsonResult.data.nextPeriod,
                    }));

                    let newJsonResult = [];

                    if (type * 1 === HistoryListTypes.CHAT_WEB) {
                        newJsonResult = jsonResult.data.list.map((item) => {
                            const itemType = item.f_type;
                            const content = item.f_msg;
                            const sysContent = JSON.parse(content);
                            // let newContent = '';

                            return {
                                type: itemType,
                                fromId: item.f_talk_flag,
                                msgId: item.f_msg_seq,
                                msgContent: sysContent,
                                msgContentAbstract: sysContent,
                                msgTime: item.f_time * 1000,
                                csId: item.f_cs_id,
                                guId: item.f_guid,
                            };
                        });
                    } else if (type * 1 === HistoryListTypes.CHAT_QQ) {
                        if (jsonResult.data.list.length > 0) {
                            let tempZoreTime = new Date(jsonResult.data.list[0].time);
                            tempZoreTime.setHours(0);
                            tempZoreTime.setMinutes(0);
                            tempZoreTime.setSeconds(0);
                            tempZoreTime.setMilliseconds(0);

                            let tempZoreTimeStamp = tempZoreTime.getTime();

                            jsonResult.data.list.forEach((item, i) => {
                                const content = item.msg;
                                // console.log(item, 'i')
                                const sysContent = content || '';
                                // let newContent = '';

                                // console.log(item.type === 1, 'true')
                                let itemType;
                                if (item.type === 1) {
                                    itemType = 0;
                                }
                                if (item.type === 0) {
                                    itemType = 1;
                                }

                                const itemTimeStamp = (new Date(item.time)).getTime();

                                if (itemTimeStamp < tempZoreTimeStamp) {
                                    newJsonResult.push({
                                        type: MsgTypes.SYS_MSG,
                                        fromId: '',  // 0:访客发送， 1：客服发送
                                        msgId: '',
                                        msgContent: { Content: '' },
                                        msgContentAbstract: { Content: '' },
                                        // eslint-disable-next-line max-len
                                        msgTime: (new Date(jsonResult.data.list[i - 1].time)).getTime(),
                                        csId: item.userid,
                                        guId: item.qqid,
                                    });

                                    tempZoreTime = new Date(item.time);
                                    tempZoreTime.setHours(0);
                                    tempZoreTime.setMinutes(0);
                                    tempZoreTime.setSeconds(0);
                                    tempZoreTime.setMilliseconds(0);
                                    tempZoreTimeStamp = tempZoreTime.getTime();
                                }

                                newJsonResult.push({
                                    type: MsgTypes.TEXT_MSG,
                                    fromId: itemType,  // 0:访客发送， 1：客服发送
                                    msgId: item.fid,
                                    msgContent: sysContent,
                                    msgContentAbstract: sysContent,
                                    msgTime: (new Date(item.time)).getTime(),
                                    csId: item.userid,
                                    guId: item.qqid,
                                });

                                if (
                                    i === jsonResult.data.list.length - 1
                                    && itemTimeStamp > tempZoreTimeStamp
                                ) {
                                    newJsonResult.push({
                                        type: MsgTypes.SYS_MSG,
                                        fromId: '',  // 0:访客发送， 1：客服发送
                                        msgId: '',
                                        msgContent: { Content: '' },
                                        msgContentAbstract: { Content: '' },
                                        msgTime: itemTimeStamp,
                                        csId: item.userid,
                                        guId: item.qqid,
                                    });
                                }
                            });
                        }
                    } else if (type * 1 === HistoryListTypes.CHAT_WX) {
                        if (jsonResult.data.list.length > 0) {
                            let tempZoreTime = new Date(jsonResult.data.list[0].f_msg_time);
                            tempZoreTime.setHours(0);
                            tempZoreTime.setMinutes(0);
                            tempZoreTime.setSeconds(0);
                            tempZoreTime.setMilliseconds(0);

                            let tempZoreTimeStamp = tempZoreTime.getTime();

                            jsonResult.data.list.forEach((item, i) => {
                                const msgType = item.f_msg_type === 3 ? 2 : item.f_msg_type;
                                const content = item.f_msg;
                                // console.log(item, 'i')
                                const sysContent = (content && (JSON.parse(content))) || '';
                                // let newContent = '';
                                const itemTimeStamp = (new Date(item.f_msg_time)).getTime();

                                if (itemTimeStamp < tempZoreTimeStamp) {
                                    newJsonResult.push({
                                        type: MsgTypes.SYS_MSG,
                                        fromId: '',  // 0:访客发送， 1：客服发送
                                        msgId: '',
                                        msgContent: { Content: '' },
                                        msgContentAbstract: { Content: '' },
                                        // eslint-disable-next-line max-len
                                        msgTime: (new Date(jsonResult.data.list[i - 1].f_msg_time)).getTime(),
                                        csId: item.f_user_id,
                                        guId: item.f_wx_id,
                                    });

                                    tempZoreTime = new Date(item.f_msg_time);
                                    tempZoreTime.setHours(0);
                                    tempZoreTime.setMinutes(0);
                                    tempZoreTime.setSeconds(0);
                                    tempZoreTime.setMilliseconds(0);
                                    tempZoreTimeStamp = tempZoreTime.getTime();
                                }

                                newJsonResult.push({
                                    type: msgType,
                                    fromId: item.f_send_type,  // 0:访客发送， 1：客服发送
                                    msgId: item.f_id,
                                    msgContent: sysContent,
                                    msgContentAbstract: sysContent,
                                    msgTime: (new Date(item.f_msg_time)).getTime(),
                                    csId: item.f_user_id,
                                    guId: item.f_wx_id,
                                });

                                if (
                                    i === jsonResult.data.list.length - 1
                                    && itemTimeStamp > tempZoreTimeStamp
                                ) {
                                    newJsonResult.push({
                                        type: MsgTypes.SYS_MSG,
                                        fromId: '',  // 0:访客发送， 1：客服发送
                                        msgId: '',
                                        msgContent: { Content: '' },
                                        msgContentAbstract: { Content: '' },
                                        msgTime: itemTimeStamp,
                                        csId: item.f_user_id,
                                        guId: item.f_wx_id,
                                    });
                                }
                            });
                        }
                    }

                    /* eslint-disable no-param-reassign */
                    jsonResult.data.list = newJsonResult;

                    if (params.isNext) {
                        jsonResult.data.list = jsonResult.data.list.reverse().concat(prevChatList);
                    } else {
                        jsonResult.data.list = jsonResult.data.list.reverse();
                    }
                    /* eslint-enable no-param-reassign */

                    dispatch(getChatListSuccess(jsonResult));
                    return { errorMsg: null };
                }

                displayError(errorMsg);
                return { errorMsg };
            }
        );
    };
}

export function fallbackAvatar(payload) {
    return {
        type: HistoryActionTypes.FALLBACK_AVATAR_TO_DEFAULT,
        payload,
    };
}

export function updateCurrentCrmInfo(payload) {
    return {
        type: HistoryActionTypes.UPDATE_CURRENT_CRM_INFO,
        payload,
    };
}

export function updateMessageInfos(payload) {
    return {
        type: HistoryActionTypes.UPDATE_MESSAGE_INFOS,
        payload,
    };
}

export function handleCrmSaveSuccess(payload) {
    return (dispatch, getState) => {
        const { chat, visible, leftMsgParams } = getState().history;
        const { data } = payload;
        setTimeout(() => {
            dispatch(getHistoryList());
        }, 2000);

        /* eslint-disable eqeqeq */
        if (
            visible &&
            (data.guid == chat.chatParams.guId || data.guid == leftMsgParams.guId)
        ) {
            dispatch(updateCurrentCrmInfo({
                crmid: data.crmid,
                guid: data.guid,
            }));

            dispatch(updateMessageInfos({
                visitorName: data.crmname,
            }));
        }
        /* eslint-enable eqeqeq */
    };
}

export function handleOfflineMessageRedirect(payload) {
    return (dispatch) => {
        const { dateType } = payload;
        dispatch(updateGetParams({
            type: '2',
            date: `${dateType}`,
        }));
        dispatch(getHistoryList());
        dispatch(replace('/kf/client/history'));
    };
}

export function setShowDatePicker(payload) {
    return {
        type: HistoryActionTypes.SET_SHOW_DATE_PICKER,
        payload,
    };
}
