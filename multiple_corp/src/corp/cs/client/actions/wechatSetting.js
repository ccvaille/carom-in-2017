import restHub from '~comm/services/restHub';
import { displayError } from '~comm/utils';
import message from '~comm/components/Message';
import ApiUrls from 'constants/ApiUrls';
import * as WechatSettingActionTypes from 'constants/WechatSettingActionTypes';

export function getWechatSettingSuccess(payload) {
    return {
        type: WechatSettingActionTypes.INIT_WECHAT_SETTING,
        payload,
    };
}

// 获取初始化配置
export function getWechatSetting() {
    return dispatch => restHub.post(ApiUrls.wxIsOpen, {
        body: {},
    }).then(({ errorCode, errorMsg, jsonResult }) => {
        if (!errorMsg) {
            dispatch(getWechatSettingSuccess(jsonResult.data));
            return { errorMsg: null };
        }

        if (errorCode !== 41030) {
            displayError(errorMsg);
        }
        return { errorMsg };
    });
}

// 显示或隐藏开启提示弹框
export function toggleOpenWXCsModal(payload) {
    return {
        type: WechatSettingActionTypes.TOGGLE_OPEN_WX_CS_MODAL,
        payload,
    };
}

// 显示或隐藏关闭提示弹框
export function toggleCloseWXCsModal(payload) {
    return {
        type: WechatSettingActionTypes.TOGGLE_CLOSE_WX_CS_MODAL,
        payload,
    };
}

// 修改关闭微信客服弹框确定按钮的状态
export function toggleCloseWXCsLoading(payload) {
    return {
        type: WechatSettingActionTypes.TOGGLE_CLOSE_WX_CS_LOADING,
        payload,
    };
}

// 修改开启微信客服弹框确定按钮的状态
export function toggleOpenWXCsLoading(payload) {
    return {
        type: WechatSettingActionTypes.TOGGLE_OPEN_WX_CS_LOADING,
        payload,
    };
}

// 开启或关闭微信客服
export function toggleWXCsStatus(payload) {
    return {
        type: WechatSettingActionTypes.TOGGLE_WX_CS_STATUS,
        payload,
    };
}

// 确定关闭微信客服
export function closeWXCs(payload) {
    // eslint-disable-next-line consistent-return
    return (dispatch, getState) => {
        dispatch(toggleCloseWXCsLoading(true));
        const { isCloseCsLoading } = getState().wechatSetting;

        if (isCloseCsLoading) {
            return restHub.post(ApiUrls.wxClose).then(({ errorMsg, jsonResult }) => {
                dispatch(toggleCloseWXCsLoading(false));
                if (!errorMsg) {
                    message.success(jsonResult.msg);
                    dispatch(toggleWXCsStatus(payload));
                    dispatch(toggleCloseWXCsModal(false));
                    return { errorMsg: null };
                }
                displayError(errorMsg);
                return { errorMsg };
            });
        }
    };
}

// 确定开启微信客服
export function openWXCs(payload, callback) {
    // eslint-disable-next-line consistent-return
    return (dispatch, getState) => {
        dispatch(toggleOpenWXCsLoading(true));
        const { isOpenCsLoading } = getState().wechatSetting;

        // console.log(getState(), 'state');
        if (isOpenCsLoading) {
            return restHub.post(ApiUrls.wxOpen).then(({ errorMsg, jsonResult }) => {
                dispatch(toggleOpenWXCsLoading(false));
                // console.log('helsoo', !callback)
                if (!errorMsg) {
                    if (!callback) {
                        message.success(jsonResult.msg);
                    }
                    dispatch(toggleWXCsStatus(payload));
                    if (callback) {
                        dispatch(toggleOpenWXCsModal(false));
                        callback();
                    }
                    return { errorMsg: null };
                }
                displayError(errorMsg);
                return { errorMsg };
            });
        }
    };
}

// 跳转到微信客服分配页面
export function goWXAssign(callback) {
    return (dispatch) => {
        dispatch(openWXCs(1, callback));
        // window.location.reload();
    };
}
