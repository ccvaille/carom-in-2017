import * as WechatSettingActionTypes from 'constants/WechatSettingActionTypes';

const initialState = {
    officialAccount: {
        logoUrl: '',
        name: 'EC微客通',
    },     // 已经接入的微信公众号
    isHadCustomerService: false,  // 是否设置了微信接待人员
    isOpen: 0, // 1: 微信接入是否开启, 0: 微信接入关闭
    openWXCsModalVisible: false,
    closeWXCsModalVisible: false,
    isCloseCsLoading: false,
    isOpenCsLoading: false,
};

function wechatSetting(state = initialState, action) {
    switch (action.type) {
        case WechatSettingActionTypes.INIT_WECHAT_SETTING:
            return {
                ...state,
                officialAccount: action.payload.wxauthedinfo,
                isOpen: action.payload.isopen,
                isHadCustomerService: action.payload.wxcstotal * 1,
            };

        // 显示或隐藏开启提示弹框
        case WechatSettingActionTypes.TOGGLE_OPEN_WX_CS_MODAL:
            return {
                ...state,
                openWXCsModalVisible: action.payload,
            };

        // 显示或隐藏关闭提示弹框
        case WechatSettingActionTypes.TOGGLE_CLOSE_WX_CS_MODAL:
            return {
                ...state,
                closeWXCsModalVisible: action.payload,
            };

        // 开启或关闭微信客服
        case WechatSettingActionTypes.TOGGLE_WX_CS_STATUS:
            return {
                ...state,
                isOpen: action.payload,
            };

        // 更改开启微信modal loading
        case WechatSettingActionTypes.TOGGLE_OPEN_WX_CS_LOADING:
            return {
                ...state,
                isOpenCsLoading: action.payload,
            };

        case WechatSettingActionTypes.TOGGLE_CLOSE_WX_CS_LOADING:
            return {
                ...state,
                isCloseCsLoading: action.payload,
            };

        default:
            return {
                ...state
            };

    }
}

export default wechatSetting;
