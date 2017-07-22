import * as ChatActionTypes from '../constants/ChatActionTypes';

const initialState = {
    corpid: 0,
    csid: 0,
    guid: 0,
    txguid: '',
    txcsid: '',
    shortCutKey: 1,
    sendSettingWrapperVisible: false,
    seqid: 0,
    loginInfo: {},
    csInfo: {},
    autoreply: '欢迎',
    ecim: '',
    tipMsg: '',
    guests: {},
    msgs: {},
    switchMsgs: {},
    previewMsgs: {},
    historyMsgs: {},
    sessions: [],
    sessMap: {},
    visitorPaths: {},
    newMsgTipStates: {},
    isInBottoms: {},
    currentSession: '',
    switchCsError: '',
    isTxImLogined: false,
    isShowSwitchCs: false,
    isShowVisitorPathDetial: false,
    isShowFastReply: false,
    replies: {
        commonGroup: [],
        myGroup: [],
        hotGroup: [],
    },
    haveUnread: false,
    hasH5Form: false,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ChatActionTypes.INIT_SESSION:
            return {
                ...state,
            };
        case ChatActionTypes.SET_CS_INFO:
            return {
                ...state,
                csid: +action.payload.info.userid,
                txcsid: `${action.payload.info.userid}`,
                corpid: +action.payload.info.corpid,
                csInfo: action.payload.info,
                key: action.payload.info.key,
                shortCutKey: action.payload.info.shortcutkey,
            };
        case ChatActionTypes.SET_HAS_H5_FORM:
            return {
                ...state,
                hasH5Form: action.payload.hasH5Form,
            };
        case ChatActionTypes.SET_GUEST_INFO:
            return {
                ...state,
                guests: {
                    ...state.guests,
                    [action.payload.txguid]: {
                        ...state.guests[action.payload.txguid] || {},
                        ...action.payload.info,
                    },
                },
            };
        case ChatActionTypes.SET_TX_LOGIN_INFO:
            return {
                ...state,
                loginInfo: action.payload.loginInfo,
            };
        case ChatActionTypes.SET_TX_LOGINED:
            return {
                ...state,
                isTxImLogined: action.payload.isTxImLogined,
            };
        case ChatActionTypes.SET_CURRENT_SESSION:
            return {
                ...state,
                currentSession: action.payload.session,
            };
        case ChatActionTypes.SET_CURRENT_TX_SESSION:
            return {
                ...state,
                currentTxSession: action.payload.txSession,
            };
        case ChatActionTypes.UPDATE_SESSIONS: {
            if (JSON.stringify(state.sessions) === JSON.stringify(action.payload.sessions)) {
                return state;
            }
            // eslint-disable-next-line max-len
            const sortedSessions = action.payload.sessions.sort((prev, next) => next.lastmsgtime - prev.lastmsgtime);
            return {
                ...state,
                sessions: sortedSessions,
            };
        }
        case ChatActionTypes.INIT_ECIM:
            return {
                ...state,
                ecim: action.payload.ecim,
            };
        case ChatActionTypes.SET_TX_SESSION:
            return {
                ...state,
                txSessions: action.payload.txSessions,
            };
        case ChatActionTypes.SELECT_SESSION:
            return {
                ...state,
                guid: action.payload.guid,
                txguid: action.payload.guid ? action.payload.txguid : '',
            };
        case ChatActionTypes.UPDATE_MSGS:
            return {
                ...state,
                msgs: {
                    ...action.payload.msgs,
                },
            };
        case ChatActionTypes.SET_GUEST_LIST:
            return {
                ...state,
                guest: action.payload.guests,
            };
        case ChatActionTypes.ADD_HISTORY_MSGS:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        msgs: [
                            ...action.payload.msgs || [],
                            ...(state.historyMsgs[action.payload.txguid].msgs || []),
                        ],
                        lastMsgTime: action.payload.lastMsgTime,
                    },
                },
            };
        case ChatActionTypes.UPDATE_HISTORY_MSG:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        ...action.payload.msgData,
                    },
                },
            };
        case ChatActionTypes.SET_IS_GETTING_HISTORY_MSGS:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        isGetting: action.payload.isGetting,
                    },
                },
            };
        case ChatActionTypes.SET_IS_GET_HISTORY_COMPLETED:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        isCompleted: action.payload.isCompleted,
                    },
                },
            };
        case ChatActionTypes.SET_HAS_HISTORY_TIP:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        hasHistoryTip: action.payload.hasHistoryTip,
                    },
                },
            };
        case ChatActionTypes.SET_IS_SHOW_HISTORY_MSG_LIST:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        isShowHistoryMsgList: action.payload.isShowHistoryMsgList,
                    },
                },
            };
        case ChatActionTypes.SET_HISTORY_MAX_PAGE:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        maxPage: action.payload.maxPage,
                    },
                },
            };
        case ChatActionTypes.SET_HISTORY_SCROLL_PAGE:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        scrollPage: action.payload.scrollPage,
                    },
                },
            };
        case ChatActionTypes.SET_HISTORY_LIST_PAGE:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        listPage: action.payload.listPage,
                    },
                },
            };
        case ChatActionTypes.SET_IS_GETTING_HISTORY_MSG_BY_SCROLL:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        isScrollGetting: action.payload.isScrollGetting,
                    },
                },
            };
        case ChatActionTypes.SET_PREVIEW_MSG:
            return {
                ...state,
                previewMsgs: {
                    ...state.previewMsgs,
                    [action.payload.txguid]: action.payload.content,
                },
            };
        case ChatActionTypes.ADD_MSG_TO_HISTORY:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        msgs: [
                            ...((state.historyMsgs[action.payload.txguid] || {}).msgs || []),
                            action.payload.msg,
                        ],
                    },
                },
            };
        case ChatActionTypes.SET_HISTORY_LAST_MSG_KEY:
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        lastMsgKey: action.payload.msgKey,
                    },
                },
            };
        case ChatActionTypes.SET_HISTORY_RESP_COMPLETE: {
            return {
                ...state,
                historyMsgs: {
                    ...state.historyMsgs,
                    [action.payload.txguid]: {
                        ...state.historyMsgs[action.payload.txguid],
                        isRespCompleted: action.payload.isRespCompleted,
                    },
                },
            };
        }
        case ChatActionTypes.TOGGLE_SWITCH_CS_SHOW:
            return {
                ...state,
                isShowSwitchCs: action.payload,
            };
        case ChatActionTypes.UPDATE_SWITCH_CS_ERROR:
            return {
                ...state,
                switchCsError: action.payload,
            };
        case ChatActionTypes.SET_IS_SHOW_VISITOR_PATH_DETAIL:
            return {
                ...state,
                isShowVisitorPathDetial: action.payload.isShowVisitorPathDetial,
            };
        case ChatActionTypes.SET_IS_SHOW_FAST_REPLY:
            return {
                ...state,
                isShowFastReply: action.payload.isShowFastReply,
            };
        case ChatActionTypes.SET_FASET_REPLY:
            return {
                ...state,
                replies: {
                    ...state.replies,
                    ...action.payload.replies,
                },
            };
        case ChatActionTypes.SET_HAVE_UNREAD:
            return {
                ...state,
                haveUnread: action.payload,
            };
        // case ChatActionTypes.UPDATE_FASET_REPLY_GROUP: {
        //     const { groupType, newGroup } = action.payload;
        //     return {
        //         ...state,
        //         replies: {
        //             [groupType]: [newGroup].concat(state.replies[groupType]),
        //         },
        //     };
        // }
        // case ChatActionTypes.UPDATE_FASET_REPLY: {
        //     const { groupType, groupId, newReply } = action.payload;
        //     return {
        //         ...state,
        //         replies: {
        //             [groupType]: state.replies[groupType].map((group) => {
        //                 const replies = group.replyList || [];
        //                 if (group.f_id === groupId) {
        //                     return {
        //                         ...group,
        //                         replyList: [newReply].concat(replies),
        //                     };
        //                 }
        //                 return group;
        //             }),
        //         },
        //     };
        // }
        case ChatActionTypes.SET_SEQID:
            return {
                ...state,
                seqid: action.payload.seqid,
            };
        case ChatActionTypes.SET_SWITCH_MSGS:
            return {
                ...state,
                switchMsgs: {
                    ...state.switchMsgs,
                    [action.payload.txguid]: action.payload.msgs,
                },
            };
        case ChatActionTypes.UPDATE_SESSION_IN_MAP:
            return {
                ...state,
                sessMap: {
                    ...state.sessMap,
                    [action.payload.txguid]: action.payload.session,
                },
            };
        case ChatActionTypes.SET_VISITOR_CURR_PATH:
            return {
                ...state,
                visitorPaths: {
                    ...state.visitorPaths,
                    [action.payload.txguid]: action.payload.path,
                },
            };

        case ChatActionTypes.UPDATE_SHORT_CUT_KEY:
            return {
                ...state,
                ...action.payload,
            };
        case ChatActionTypes.SET_SHORT_CUT_KEY_WRAPPER:
            return {
                ...state,
                sendSettingWrapperVisible: action.payload,
            };
        case ChatActionTypes.SET_IS_SCROLL_TO_BOTTOM:
            return {
                ...state,
                isInBottoms: {
                    ...state.isInBottoms,
                    [action.payload.txguid]: action.payload.isInBottom,
                },
            };
        case ChatActionTypes.SET_IS_SHOW_NEW_MSG_TIP:
            return {
                ...state,
                newMsgTipStates: {
                    ...state.newMsgTipStates,
                    [action.payload.txguid]: action.payload.isShowNewMsgTip,
                },
            };
        default:
            return {
                ...state,
            };
    }
};
