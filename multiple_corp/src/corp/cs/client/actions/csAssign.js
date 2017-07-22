import * as CsAssignActionTypes from 'constants/CsAssignActionTypes';
import { displayError } from '~comm/utils';
import message from '~comm/components/Message';
import ApiUrls from 'constants/ApiUrls';
import restHub from '~comm/services/restHub';

// 获取企业微信设置， 用于判断企业是否授权以及是否开启微信客服
export function initWXSettingSuccess(payload) {
    return {
        type: CsAssignActionTypes.INIT_WX_SETTING,
        payload,
    };
}

export function initWXSetting() {
    return (dispatch) => {
        restHub.post(ApiUrls.wxIsOpen).then(({ errorCode, errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(initWXSettingSuccess(jsonResult.data));
                return { errorMsg: null };
            }

            if (errorCode !== 41030) {
                displayError(errorMsg);
            }

            return { errorMsg };
        });
    };
}

export function getSelectedCsListSuccess(payload) {
    return {
        type: CsAssignActionTypes.GET_SELECTED_CS_LIST,
        payload,
    };
}

export function getSelectedCsList() {
    return dispatch => restHub.post(ApiUrls.getSelectedCsList).then(({ errorMsg, jsonResult }) => {
        if (!errorMsg) {
            dispatch(getSelectedCsListSuccess(jsonResult.data));
            return { errorMsg: null };
        }

        displayError(errorMsg);
        return { errorMsg };
    });
}

// 添加客服弹框
export function toggleSelectCsModal(payload) {
    return {
        type: CsAssignActionTypes.TOGGLE_SELECT_CS_MODAL,
        payload,
    };
}

// 显示/隐藏删除客服弹框
export function toggleDelWXCsModal(payload) {
    return {
        type: CsAssignActionTypes.TOGGLE_DEL_WX_CS_MODAL,
        payload,
    };
}

// 删除微信客服
export function updateDelWXCsId(payload) {
    return {
        type: CsAssignActionTypes.UPDATE_DEL_WX_CS_ID,
        payload,
    };
}

// 确认删除微信客服
export function delWeiChatCs() {
    return (dispatch, getState) => {
        const { delWXCsId } = getState().csAssign;
        // console.log(delWXCsId, 'state')
        return restHub.post(ApiUrls.delWXCs, {
            body: {
                csid: delWXCsId,
            },
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                message.success(jsonResult.msg);
                dispatch(getSelectedCsList());
                dispatch(toggleDelWXCsModal(false));
                return { errorMsg: null };
            }

            displayError(errorMsg);
            return { errorMsg };
        });
    };
}


// 更新客服列表数据（csData）
export function updateCsList(payload) {
    return {
        type: CsAssignActionTypes.UPDATE_CS_LIST,
        payload,
    };
}

// 获取客服列表
export function getCsListData() {
    return dispatch => restHub.post(ApiUrls.getCsListData, {
        body: {
        },
    }).then(({ errorMsg, jsonResult }) => {
        if (!errorMsg) {
                // console.log(jsonResult.data, 'jsonResult');

                /*
                csData={
                    csList: [
                      {groupid:,groupname:'',data:[]}
                  ],
                  csPrevList: []
                }
                */
            dispatch(updateCsList(jsonResult.data));
            return { errorMsg: null };
        }
        displayError(errorMsg);
        return { errorMsg };
    });
}


export function UpdateSelectedCs(payload) {
    return {
        type: CsAssignActionTypes.UPDATE_SELECTED_CS,
        payload,
    };
}

export function onSaveSelectedCs(payload) {
    return (dispatch) => {
        // console.log(payload, 'payload');
        const csIds = [];

        for (let i = 0, len = payload.length; i < len; i++) {
            csIds[i] = payload[i].csid;
        }

        // console.log(csIds.join(','), '00')
        restHub.post(ApiUrls.saveSelectedCs, {
            body: {
                csid: csIds.join(','),
            },
        }).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                message.success(jsonResult.msg);
                dispatch(getSelectedCsList());
                dispatch(toggleSelectCsModal(false));
                return { errorMsg: null };
            }

            displayError(errorMsg);
            return { errorMsg };
        });
    };
}
