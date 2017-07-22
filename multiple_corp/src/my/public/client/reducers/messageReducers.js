import * as messageTypes from 'constants/messageTypes';

const initialState = {
    formInfo: {
        '1': {

        }
    },
    formInfoSave: [false, false, false],
    editFormInfoSave: true,
    settingInfo: {

    },
    iframeVisible: false,
    deleteFormVisible: false,
    isAuth: 0,
    isVerify: 0,
    isRoleLoading: false, //是否正在拉取权限
    isRoleLoaded: false, //权限是否拉取过
    modalVisible: {
        isAuthVisible: true,
        hasAuthVisible: true,
        isFirstVisible: true
    },
    goToNextliModal: false, //是否需要保存当前设置
    switchGoToTransform: false,//切换路由，消息推送是否保存modal显示
    activeLi: 1,
    nextActiveLi: 1,
    imageLoading: false,
};

function messageReducers(state = initialState, action) {
    switch(action.type) {
        case messageTypes.SET_FORM_INFO:
            var data = {};
            Object.assign(data, state.formInfo);
            data[action.payload.index] = data[action.payload.index] || {};
            Object.keys(action.payload.data).forEach(item => {
                data[action.payload.index][item] = action.payload.data[item];
            });
            return {
                ...state,
                formInfo: data
            }
        case messageTypes.SWITCH_IFRAME_VISIBLE:
            return {
                ...state,
                iframeVisible: action.payload
            }
        case messageTypes.GET_SETTING:
            var data = getSetting(action.payload);
            return {
                ...state,
                settingInfo: data.settingInfo,
                formInfo: data.formInfo,
                formInfoSave: data.formInfoSave,
                editFormInfoSave: true
            }
        case messageTypes.SWITCH_DELETE_VISIBLE:
            return {
                ...state,
                deleteFormVisible: action.payload
            }
        case messageTypes.DELETE_FORM:
            var formInfo = {};
            Object.assign(formInfo, state.formInfo);
            [1, 2, 3].filter((item, index) => {
                 return item >= action.payload
            }).forEach((ele, i) => {
                formInfo[ele] = {};
            });
            return {
                ...state,
                formInfo: formInfo
            }
        case messageTypes.ADD_FORM:
            var formInfo = {};
            Object.assign(formInfo, state.formInfo);
            formInfo[action.payload.index].f_id = action.payload.f_id;
            return {
                ...state,
                formInfo: formInfo
            }
        case messageTypes.GET_ROLE:
            return {
                ...state,
                modalVisible: action.payload
            }
        case messageTypes.SAVE_AUTH:
            return {
                ...state,
                isAuth: action.payload.isAuth,
                isVerify: action.payload.isVerify
            }
        case messageTypes.SWITCH_MODAL_VISIBLE:
            var modalVisible = {};
            Object.assign(modalVisible, state.modalVisible);
            if (Array.isArray(action.payload.modal)) {
                    action.payload.modal.forEach((item, index) => {
                    modalVisible[item] = action.payload.visible[index];
                });
            } else {
                modalVisible[action.payload.modal] = action.payload.visible;
            }
            return {
                ...state,
                modalVisible: modalVisible
            }
        case messageTypes.IS_ROLELOADING:
            return {
                ...state,
                isRoleLoading: action.payload
            }
        case messageTypes.IS_ROLELOADED:
            return {
                ...state,
                isRoleLoaded: action.payload
            }
        case messageTypes.SET_TABPUSH_LI:
            return {
                ...state,
                activeLi: action.payload
            }
        case messageTypes.SET_FORMINFO_SAVE:
            return {
                ...state,
                formInfoSave: action.payload   
            }
        case messageTypes.SWITCH_EDITFORMINFO_SAVE:
            return {
                ...state,
                editFormInfoSave: action.payload
            } 
        case messageTypes.SWTICH_GOTONEXTLI_MODAL:
            return {
                ...state,
                goToNextliModal: action.payload
            }
        case messageTypes.SET_NEXTACTIVELI:
            return {
                ...state,
                nextActiveLi: action.payload
            }
        case messageTypes.RESET_EDITFORMINFOSAVE:
            return {
                ...state,
                editFormInfoSave: true
            }
        case messageTypes.SET_FORMINFOTIME:
            var formInfo = {};
            Object.assign(formInfo, state.formInfo);
            if (formInfo[2]) {
                formInfo[2].f_time = action.payload[0];
            }
            if (formInfo[3]) {
                formInfo[3].f_time = action.payload[1];
            }
            return {
                ...state,
                formInfo: formInfo
            }
        case messageTypes.SWITCH_GOTO_TRANSFORM:
            return {
                ...state,
                switchGoToTransform: action.payload
            }
        case messageTypes.IMAGE_LOADING:
            return {
                ...state,
                imageLoading: action.payload
            }
        default:
            return state
    }
}


function getSetting(data) {
    var settingInfo = {};
    var formInfo = {};
    var formInfoSave = [false, false, false];

    data.settings.forEach((item, index) => {
        formInfo[index + 1] = item;
        formInfoSave[index] = item.f_url ? true : false;
    })
    settingInfo = data.public;
    // preImageLoad(formInfo);
    return {
        settingInfo: settingInfo,
        formInfo: formInfo,
        formInfoSave: formInfoSave
    }
}
/*图片预加载*/
function preImageLoad(obj) {
    if (!obj) {
        return;
    }
    Object.keys(obj).forEach((item) => {
        if (obj[item].f_url) {
            let img = new Image();
            img.src = obj[item].f_url;
        }
    })
}
export default messageReducers;
