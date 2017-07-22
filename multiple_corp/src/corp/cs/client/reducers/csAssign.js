import * as CsAssignActionTypes from 'constants/CsAssignActionTypes';

const initialState = {
    selectModalVisible: false,
    delWXCsMoadlVisible: false,
    isSetWXCs: true, // 是否绑定了微信cs
    isWXOpen: 1,  // 是否开启微信
    cswechatList: [],
    delWXCsId: '',
    csData: {
        csList: [],
        csPrevList: [],
    },
};

function csAssign(state = initialState, action) {
    switch (action.type) {
        // 初始化微信设置
        case CsAssignActionTypes.INIT_WX_SETTING: {
            const { wxauthedinfo } = action.payload;
            let isSetWXCs = false;
            if (wxauthedinfo && !Array.isArray(wxauthedinfo) && typeof wxauthedinfo === 'object') {
                isSetWXCs = true;
            }
            return {
                ...state,
                isSetWXCs,
                isWXOpen: action.payload.isopen,
            };
        }

        case CsAssignActionTypes.TOGGLE_SELECT_CS_MODAL:
            return {
                ...state,
                selectModalVisible: action.payload,
            };

        // 显示/隐藏删除微信客服弹框
        case CsAssignActionTypes.TOGGLE_DEL_WX_CS_MODAL:
            return {
                ...state,
                delWXCsMoadlVisible: action.payload,
            };
        case CsAssignActionTypes.UPDATE_CS_LIST:
            return {
                ...state,
                csData: {
                    ...state.csData,
                    csList: action.payload,
                },
            };
        case CsAssignActionTypes.GET_SELECTED_CS_LIST:
            return {
                ...state,
                cswechatList: action.payload,
                csData: {
                    ...state.csData,
                    csPrevList: action.payload,
                },
            };

        // 更新需要删除的微信客服ID
        case CsAssignActionTypes.UPDATE_DEL_WX_CS_ID:
            return {
                ...state,
                delWXCsId: action.payload,
            };
        default:
            return state;
    }
}

export default csAssign;
