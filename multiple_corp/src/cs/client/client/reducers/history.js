import * as HistoryActionTypes from 'constants/HistoryActionTypes';
import moment from 'moment';
import csDefaultAvatar from 'images/cs-default.png';

const today = moment();
const todayValue = today.format('YYYY-MM-DD');

const initialState = {
    historyList: [],
    pagination: {
        total: 0,
        current: 1,
        pageSize: 20,
    },
    params: {
        page: 1,
        date: 0,  // 0:今天，1：昨天，2：过去7天，3：过去30天，4：自定义日期
        start: todayValue,
        end: todayValue,
        type: 1,   // 1:网页会话，2：离线留言
        csId: 0,
        crmId: 0, // 0:未备注， >0 已结备注过了
        msgFilter: '-1',   // 离线留言筛选状态，1: 全部，2：已回复，3：未回复，4：待跟进
        webChatType: '3', // @todo 网页会话筛选状态 1: 无效会话，2：有效会话，3: 全部
    },
    kfList: [{
        id: 0,
        name: '全部客服',
    }],
    leftMsgParams: {
        msgId: '',
        guId: '',
    },
    leftMsg: {
        name: '',
        title: '',
        tel: '',
        qq: '',
        content: '',
        read: 0,        // 0: 未回复，2：已回复，3：待跟进
        email: '',
    },
    visible: false,   // 用于控制弹框是否显示 - 离线留言和聊天记录
    trackList: [{      // 轨迹列表
        date: '',
        engine: '',
        keyword: '',
        referer: '',
        list: [],
    }],
    trackParams: {
        page: 1,
        start: todayValue,
        end: todayValue,
        guId: 0,
        type: 0, // 0:今天, 1:昨天，2：近一周，3：近一个月
        isNext: false,
        isCompleted: false,
        isLoading: true,
    },
    trackPagination: {
        total: 0,
        current: 1,
        pageSize: 2,
    },
    chat: {
        chatParams: {
            page: 1,
            csId: 0, // 客服id
            guId: 0, // 访客id
            period: 'today', // 查询的时间段
            begin: 0, // 查询偏移量
            pageSize: 5, // 查询的条数
            isCompleted: false,
            isNext: false,
        },
        chatList: [],
    },   // 聊天记录列表
    // modal 内使用的信息
    messageInfos: {
        talkId: '',  // 会话记录id,
        csId: '',
        csPic: '',
        guId: '',   // 访客id
        guTerminal: '',
        visitorName: '',
        kfName: '',
        crmId: '',
    },
    showDatePicker: false,
};

function history(state = initialState, action) {
    switch (action.type) {
        case HistoryActionTypes.GET_HISTORY_LIST_SUCCESS: {
            const page = {
                total: action.payload.data.total,
                current: action.payload.data.page,
                pageSize: action.payload.data.pageSize,
            };
            return {
                ...state,
                historyList: action.payload.data.list || [],
                pagination: page || initialState.pagination,
            };
        }
        case HistoryActionTypes.UPDATE_GET_PARAMS:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...action.payload,
                },
            };

        case HistoryActionTypes.UPDATE_KF_LIST: {
            return {
                ...state,
                kfList: [
                    ...state.kfList,
                    ...action.payload,
                ]
            };
        }

        case HistoryActionTypes.UPDATE_LEFT_MSG_FIELDS: {
            const fields = action.payload.fields;
            const key = Object.keys(fields)[0];
            const value = fields[key].value;
            return {
                ...state,
                leftMsg: {
                    ...state.leftMsg,
                    [key]: value,
                },
            };
        }
        case HistoryActionTypes.UPDATE_LEFT_MSG_SUCCESS: {
            return {
                ...state,
            };
        }
        case HistoryActionTypes.UPDATE_LEFT_MSG_PARAMS: {
            return {
                ...state,
                leftMsgParams: action.payload,
            };
        }
        case HistoryActionTypes.GET_LEFT_MSG_SUCCESS: {
            return {
                ...state,
                leftMsg: action.payload.data,
            };
        }

        case HistoryActionTypes.UPDATE_MODAL_STATUS: {
            return {
                ...state,
                visible: action.payload,
            };
        }
        case HistoryActionTypes.GET_TRACK_HISTORY_LIST_SUCCESS:
            return {
                ...state,
                trackList: (action.payload.trackList.length > 0 && action.payload.trackList)
                || initialState.trackList,
                trackPagination: action.payload.page || initialState.trackPagination,
            };
        case HistoryActionTypes.UPDATE_TRACK_PARAMS:
            return {
                ...state,
                trackParams: {
                    ...state.trackParams,
                    ...action.payload,
                },
            };
        case HistoryActionTypes.UPDATE_CHAT_PARAMS:
            return {
                ...state,
                chat: {
                    ...state.chat,
                    chatParams: {
                        ...state.chat.chatParams,
                        ...action.payload,
                    },
                },
            };
        case HistoryActionTypes.GET_CHAT_LIST_SUCCESS: {
            return {
                ...state,
                chat: {
                    ...state.chat,
                    chatList: action.payload.data.list || [],
                },
            };
        }
        case HistoryActionTypes.FALLBACK_AVATAR_TO_DEFAULT: {
            const { id, type } = action.payload;
            let newList = state.historyList;
            if (type === 'talk') {
                /* eslint-disable eqeqeq, no-param-reassign */
                newList = state.historyList.map((l) => {
                    if (l.talkid == id) {
                        l.csface = csDefaultAvatar;
                        return l;
                    }
                    return l;
                });
            } else if (type === 'message') {
                newList = state.historyList.map((l) => {
                    if (l.msgid == id) {
                        l.csface = csDefaultAvatar;
                        return l;
                    }
                    return l;
                });
            }
            /* eslint-enable eqeqeq, no-param-reassign */
            return {
                ...state,
                historyList: newList,
            };
        }
        case HistoryActionTypes.UPDATE_CURRENT_CRM_INFO: {
            const { crmid } = action.payload;
            return {
                ...state,
                params: {
                    ...state.params,
                    crmId: Number(crmid),
                },
            };
        }
        case HistoryActionTypes.UPDATE_MESSAGE_INFOS: {
            return {
                ...state,
                messageInfos: {
                    ...state.messageInfos,
                    ...action.payload,
                },
            };
        }
        case HistoryActionTypes.SET_SHOW_DATE_PICKER:
            return {
                ...state,
                showDatePicker: action.payload,
            };
        default:
            return state;
    }
}

export default history;
