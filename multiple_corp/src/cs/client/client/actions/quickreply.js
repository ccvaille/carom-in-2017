import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { displayError } from '~comm/utils';
import message from '~comm/components/Message';
import * as QuickReplyActionTypes from 'constants/QuickReplyActionTypes';

export function updateGroupName(payload) {
    return {
        type: QuickReplyActionTypes.UPDATE_GROUP_NAME,
        payload,
    };
}

export function toggleRemoveGroupModal(payload) {
    return {
        type: QuickReplyActionTypes.TOGGLE_REMOVE_GROUP_MODAL_VISIBLE,
        payload,
    };
}

export function toggleEditReplyModal(payload) {
    return {
        type: QuickReplyActionTypes.TOGGLE_EDIT_REPLY_MODAL_VISIBLE,
        payload,
    };
}

export function toggleRemoveReplyModal(payload) {
    return {
        type: QuickReplyActionTypes.TOGGLE_REMOVE_REPLY_MODAL_VISIBLE,
        payload,
    };
}

export function getReplyGroupsSuccess(payload) {
    return {
        type: QuickReplyActionTypes.GET_REPLY_GROUPS_SUCCESS,
        payload,
    };
}

export function getReplyGroups() {
    return dispatch => restHub.get(ApiUrls.replyGroups)
                                .then(({ errorMsg, jsonResult }) => {
                                    if (!errorMsg) {
                                        dispatch(getReplyGroupsSuccess(jsonResult));
                                    } else {
                                        displayError(errorMsg);
                                    }
                                });
}

export function addGroupRemote(payload) {
    return (dispatch) => {
        const { value, type } = payload;
        return restHub.post(ApiUrls.addReplyGroup, {
            body: {
                name: value,
                type: type === '0' ? 0 : null,
            },
        }).then(({ errorMsg }) => {
            dispatch(getReplyGroups());
            if (!errorMsg) {
                return { errorMsg };
            }

            displayError(errorMsg);
            return { errorMsg };
        });
    };
}

export function addGroup(payload) {
    const { value, type } = payload;
    switch (type) {
        case '0':
            return {
                type: QuickReplyActionTypes.ADD_COMMON_GROUP_LOCAL,
                payload: value,
            };
        case '1':
            return {
                type: QuickReplyActionTypes.ADD_MY_GROUP_LOCAL,
                payload: value,
            };
        default:
            break;
    }

    return {
        type: '',
    };
}

export function saveGroupEdit(payload) {
    return (dispatch) => {
        const { id, value } = payload;
        return restHub.post(`${ApiUrls.editReplyGroup}/${id}`, {
            body: {
                name: value,
            },
        }).then(({ errorMsg }) => {
            dispatch(getReplyGroups());
            if (!errorMsg) {
                return { errorMsg };
            }

            displayError(errorMsg);
            return { errorMsg };
        });
    };
}

export function removeGroup(payload) {
    const { removeId, type } = payload;
    switch (type) {
        case '0':
            return {
                type: QuickReplyActionTypes.REMOVE_COMMON_GROUP_LOCAL,
                payload: removeId,
            };
        case '1':
            return {
                type: QuickReplyActionTypes.REMOVE_MY_GROUP_LOCAL,
                payload: removeId,
            };
        default:
            break;
    }

    return {
        type: '',
    };
}

export function removeGroupRemote(payload, type) {
    return dispatch => restHub.post(`${ApiUrls.removeReplyGroup}/${payload}`)
                        .then(({ errorMsg }) => {
                            if (!errorMsg) {
                                /**
                                 * 提前删除的原因：如果是删除当前 active 的分组
                                 * 在获取新的分组列表前，这个分组还会显示在侧边栏，并且是 active 的
                                 * 分组获取成功后，会明显看到分组和 active 状态的变化，所以先处理
                                 */
                                dispatch(removeGroup({
                                    removeId: payload,
                                    type,
                                }));
                                dispatch(toggleRemoveGroupModal(false));
                                // dispatch(getReplyGroups());
                                return { errorMsg };
                            }

                            displayError(errorMsg);
                            return { errorMsg };
                        });
}

export function getQuickRepliesSuccess(payload) {
    return {
        type: QuickReplyActionTypes.GET_QUICK_REPLIES_SUCCESS,
        payload,
    };
}

export function getQuickReplies(payload) {
    return dispatch => restHub.get(`${ApiUrls.quickReply}/${payload}`)
                                .then(({ errorCode, errorMsg, jsonResult }) => {
                                    if (errorCode === 404) {
                                        dispatch(getReplyGroups());
                                    }
                                    if (!errorMsg) {
                                        dispatch(getQuickRepliesSuccess(jsonResult));
                                    } else {
                                        message.error(errorMsg);
                                    }
                                });
}

function reFetchReplies(dispatch, res, groupId) {
    const { errorMsg } = res;
    if (!errorMsg) {
        dispatch(getQuickReplies(groupId));
    } else {
        displayError(errorMsg);
    }

    return res;
}

// function updateChatReplies(dispatch, {
//     res,
//     type,
//     content,
//     groupId,
// }) {
//     const groupType = type === '0' ? 'commonGroup' : 'myGroup';
//     dispatch(updateFastReply({
//         groupType,
//         newReply: {
//             f_content: content,
//             f_group_id: groupId,
//         },
//     }));
//     return res;
// }

export function addReply(payload) {
    return (dispatch) => {
        const { groupId, content } = payload;
        return restHub.post(ApiUrls.addQuickReply, {
            body: {
                group_id: groupId,
                content,
            },
        })
        .then(res => reFetchReplies(dispatch, res, groupId))
        .then(({ errorCode, errorMsg }) => {
            if (errorCode === 4001) {
                dispatch(getReplyGroups());
            }
            if (!errorMsg) {
                message.success('添加回复语成功');
                dispatch(toggleEditReplyModal(false));
            }

            return { errorMsg };
        });
    };
}

export function editReply(payload) {
    return (dispatch) => {
        const { id, groupId, content } = payload;
        return restHub.post(`${ApiUrls.editQuickReply}/${id}`, {
            body: {
                group_id: groupId,
                content,
            },
        }).then(res => reFetchReplies(dispatch, res, groupId))
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    message.success('编辑回复语成功');
                    dispatch(toggleEditReplyModal(false));
                }

                return { errorMsg };
            });
    };
}

export function removeReply(payload) {
    return (dispatch) => {
        const { id, groupId } = payload;
        return restHub.post(`${ApiUrls.removeQuickReply}/${id}`)
                        .then(res => reFetchReplies(dispatch, res, groupId))
                        .then(({ errorMsg }) => {
                            if (!errorMsg) {
                                message.success('回复语已删除');
                                dispatch(toggleRemoveReplyModal(false));
                            }
                        });
    };
}
