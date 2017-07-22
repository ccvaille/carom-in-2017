/* eslint-disable */
import restHub from '~comm/services/restHub';
import message from '~comm/components/Message';
import ApiUrls from 'constants/ApiUrls';
import { displayError } from '~comm/utils';
import { getCsGroups } from './csGroups';
import * as PermissionSetActionTypes from 'constants/PermissionSetActionTypes';

export function updateCsFormErrorMsg(payload) {
    return {
        type: PermissionSetActionTypes.UPDATE_CS_FORM_ERROR_MSG,
        payload,
    };
}

export function updateActiveGroup(groupId) {
    return {
        type: PermissionSetActionTypes.UPDATE_ACTIVE_CS_GROUP,
        payload: groupId,
    };
}

export function getCsListSuccess(payload) {
    return {
        type: PermissionSetActionTypes.GET_CS_LIST_SUCCESS,
        payload,
    };
}

export function getCsList(groupId) {
    let url = ApiUrls.allCsList;
    let body = {};

    if (groupId !== 'all' && groupId !== '0' && groupId !== '') {
        url = ApiUrls.csList;
        body = {
            groupid: groupId,
        };
    }

    return (dispatch) => restHub.post(url, {
        body,
    }).then(({ errorCode, errorMsg, jsonResult }) => {
        if (!errorMsg) {
            dispatch(getCsListSuccess({
                jsonResult,
                groupId,
            }));
        } else if (errorCode !== 41030) {
            displayError(errorMsg);
        }
    });
}

export function toggleCsModalVisible(payload) {
    return {
        type: PermissionSetActionTypes.TOGGLE_CS_MODAL_VISIBLE,
        payload,
    };
}

export function toggleCsRemoveModal(payload) {
    return {
        type: PermissionSetActionTypes.TOGGLE_CS_REMOVE_MODAL_VISIBLE,
        payload,
    };
}

export function updateCsInfo(payload) {
    return {
        type: PermissionSetActionTypes.UPDATE_CURRENT_EDIT_CS_INFO,
        payload,
    };
}

export function getCsInfoSuccess(payload) {
    return {
        type: PermissionSetActionTypes.GET_CS_INFO_SUCCESS,
        payload,
    };
}

export function getCsInfo(payload) {
    return (dispatch) => restHub.post(ApiUrls.getCsInfo, {
        body: {
            uid: payload,
        },
    }).then(({ errorMsg, jsonResult }) => {
        if (!errorMsg) {
            dispatch(getCsInfoSuccess({
                ...jsonResult.data,
                csId: payload,
            }));
            dispatch(updateCsFormErrorMsg(''));
            return { errorMsg };
        }

        displayError(errorMsg);
        return { errorMsg };
    });
}

export function updateCsInfoFields(payload) {
    return {
        type: PermissionSetActionTypes.UPDATE_CS_INFO_FIELDS,
        payload,
    };
}

export function addOrEditCs(isEdit) {
    return (dispatch, getState) => {
        const { activeGroupId, currentEditCs: currentCs } = getState().permissionSet;
        let url = ApiUrls.addCs;

        if (isEdit) {
            url = ApiUrls.saveCs;
        }

        return restHub.post(url, {
            body: {
                csid: currentCs.csId,
                showname: currentCs.name,
                iscs: currentCs.isCs,
                ismanager: currentCs.isManager,
                contact: currentCs.contact,
                tel: currentCs.tel,
                mobile: currentCs.mobile,
                email: currentCs.email,
                groupid: currentCs.groupId || activeGroupId,
                showqq: currentCs.showQQ,
                qqfirst: currentCs.isQQFirst,
                qq: currentCs.qqNumber ? currentCs.qqNumber.trim() : currentCs.qqNumber,
            },
        }).then(({ errorMsg }) => {
            if (!errorMsg) {
                dispatch(getCsGroups());
                dispatch(getCsList(activeGroupId));
                if (isEdit) {
                    message.success('修改客服成功');
                } else {
                    message.success('添加客服成功');
                }
                dispatch(toggleCsModalVisible(false));
            } else {
                // displayError(errorMsg);
                dispatch(updateCsFormErrorMsg(errorMsg));
            }
        });
    };
}

export function removeCs(payload) {
    return (dispatch, getState) => {
        const { activeGroupId } = getState().permissionSet;
        const { csid: csId, type } = payload;
        let url = ApiUrls.removeCs;

        if (type === 'manager') {
            url = ApiUrls.removeCsManager;
        }

        return restHub.post(url, {
            body: {
                csid: csId,
            },
        }).then(({ errorMsg }) => {
            if (!errorMsg) {
                if (type === 'manager') {
                    message.success('删除客服经理成功');
                } else {
                    message.success('删除客服成功');
                }
                dispatch(getCsGroups());
                dispatch(getCsList(activeGroupId));
                dispatch(toggleCsRemoveModal(false));
            } else {
                displayError(errorMsg);
            }
        });
    };
}

// 获取是否显示QQ客服
// export function getQQCsStatusSuccess(payload) {
//     return {
//         type: PermissionSetActionTypes.GET_QQ_CS_STATUS_SUCCESS,
//         payload,
//     };
// }
//
// export function getQQCsStatus() {
//     return (dispatch) => {
//         dispatch(getQQCsStatusSuccess(1));
//         // restHub.post(ApiUrls.getQQCsStatus).then(({ errorMsg, jsonResult }) => {
//         //     if (!errorMsg) {
//         //         dispatch(getQQCsStatus(jsonResult.data));
//         //         return { errorMsg: null };
//         //     }
//         //     displayError(errorMsg);
//         //     return { errorMsg };
//         // });
//     };
// }
