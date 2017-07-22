import * as EntrySettingActionTypes from 'constants/EntrySettingActionTypes';
import { hexRegex } from 'constants/shared';

const initialState = {
    customerServices: [],
    original: {
        language: 0,
    },
    pc: {
        language: 0, // 0: 简体中文；1: 英文；2: 繁体中文；
        showStyle: 0, // showstyle 类型 0: 列表模式；1：按钮模式
        theme: -1, // -1 按钮颜色，0 自定义， 2-x 系统模板 这里只用于存储后端返回的值，不做为展示用
        listTheme: -1, // 根据 theme 做展示用 -1 系统模板，0 自定义
        btnTheme: -1, // 根据 theme 做展示用，-1 使用按钮颜色，0 自定义
        systemThemeNumber: 1, // 选中的系统模板，根据 theme 得出
        buttonStyleBackgroundColor: '', // bcolor 背景色
        defaultStyle: 0, // autohide 标准模式 0：展开 1：最小化
        buttonStyle: 3, // bmodestyle 按钮样式 0：矩形；横向 1：矩形/竖向；2：方形；3：圆形；
        csSort: 0, // listrand 客服排序 1: 随机； 0: 顺序
        showOffline: 0, // offhide 显示离线客服 0: 显示； 1: 隐藏
        groupButtonColor: '', // btncolor 分组按钮背景色
        groupTextColor: '', // btntxt 分组按钮文字颜色
        fixed: 0, // 是否固定 1: 固定；0: 滚动
        floatPosition: 1, // float 飘窗位置 0: 左边；1: 右边
        sideMargin: 0, // fmargin 左右边距
        topMargin: 50, // ftop 顶部边距
        // listCustomBackgroundPic: '', // bpic1 列表模式自定义图片
        // listMinimizeBackgroundPic: '', // bpic3 列表模式最小化图片
        // btnCustomBackgroudPic: '', // bpic2 按钮模式自定义图片

        btnBackground: '', // bpic2 按钮模式自定义图片
        listBackground: '', // bpic1 列表模式自定义图片
        minimizeBackground: '', // bpic3 列表模式最小化图片

        customGroupTextColor: '',
    },
    mobile: {
        language: 0, // 0: 简体中文；1: 英文；2: 繁体中文；
        showStyle: 1, // showstyle 类型 0: 列表模式；1：按钮模式
        theme: -1, // -1 按钮颜色，0 自定义， 2-x 系统模板 这里只用于存储后端返回的值，不做为展示用
        listTheme: -1, // 根据 theme 做展示用 -1 系统模板，0 自定义
        btnTheme: -1, // 根据 theme 做展示用，-1 使用按钮颜色，0 自定义
        systemThemeNumber: 1, // 选中的系统模板，根据 theme 得出
        buttonStyleBackgroundColor: '', // bcolor 背景色
        defaultStyle: 0, // autohide 标准模式 0：展开 1：最小化
        buttonStyle: 3, // bmodestyle 按钮样式 0：矩形；横向 1：矩形/竖向；2：方形；3：圆形；
        csSort: 0, // listrand 客服排序
        showOffline: 0, // offhide 显示离线客服
        groupButtonColor: '', // btncolor 分组按钮背景色
        groupTextColor: '', // btntxt 分组按钮文字颜色
        fixed: 0, // 是否固定
        floatPosition: 1, // float 飘窗位置
        sideMargin: 0, // fmargin 左右边距
        topMargin: 50, // ftop 顶部边距
        // listCustomBackgroundPic: '', // bpic1 列表模式自定义图片
        // listMinimizeBackgroundPic: '', // bpic3 列表模式最小化图片
        // btnCustomBackgroudPic: '', // bpic2 按钮模式自定义图片

        btnBackground: '', // bpic2 按钮模式自定义图片
        listBackground: '', // bpic1 列表模式自定义图片
        minimizeBackground: '', // bpic3 列表模式最小化图片
    },
};

function entrySetting(state = initialState, action) {
    switch (action.type) {
        case EntrySettingActionTypes.GET_ENTRY_SETTING_SUCCESS: {
            const { jsonResult, type } = action.payload;
            let haveData = false;
            if (!Array.isArray(jsonResult) && Object.keys(jsonResult).length > 0) {
                haveData = true;
            }

            const { theme, showstyle: showStyle } = jsonResult;
            let listTheme = initialState[type].listTheme;
            let btnTheme = initialState[type].btnTheme;
            let systemThemeNumber = initialState[type].systemThemeNumber;

            /* eslint-disable eqeqeq */
            if (showStyle == 0) {
                if (theme == -1) {
                    listTheme = -1;
                    btnTheme = -1;
                } else if (theme == 0) {
                    listTheme = 0;
                    btnTheme = -1;
                } else if (theme > 0) {
                    listTheme = -1;
                    btnTheme = -1;
                    systemThemeNumber = theme;
                }
            } else if (showStyle == 1) {
                if (theme == -1) {
                    listTheme = -1;
                    btnTheme = -1;
                } else if (theme == 0) {
                    listTheme = -1;
                    btnTheme = 0;
                } else if (theme > 0) {
                    listTheme = -1;
                    btnTheme = -1;
                    systemThemeNumber = theme;
                }
            }
            /* eslint-enable eqeqeq */

            return {
                ...state,
                [type]: haveData ? {
                    language: jsonResult.language,
                    showStyle: jsonResult.showstyle,
                    theme: jsonResult.theme,
                    listTheme, // 根据 theme 做展示用 -1 系统模板，0 自定义
                    btnTheme, // 根据 theme 做展示用，-1 使用按钮颜色，0 自定义
                    systemThemeNumber, // 选中的系统模板，根据 theme 得出
                    buttonStyleBackgroundColor: jsonResult.bcolor || '#2580e6',
                    defaultStyle: jsonResult.autohide,
                    buttonStyle: jsonResult.bmodestyle,
                    csSort: jsonResult.listrand,
                    showOffline: jsonResult.offhide,
                    groupButtonColor: jsonResult.btncolor || '#2580e6',
                    groupTextColor: jsonResult.btntxt || '#2580e6',
                    fixed: jsonResult.fixed,
                    floatPosition: jsonResult.float,
                    sideMargin: jsonResult.fmargin,
                    topMargin: jsonResult.ftop,

                    btnBackground: jsonResult.bpic2,
                    listBackground: jsonResult.bpic1,
                    minimizeBackground: jsonResult.bpic3,

                    customGroupTextColor: jsonResult.btntxt,
                    // btnBackground: '',
                    // listBackground: '',
                    // minimizeBackground: '',
                } : {
                    ...initialState[type],
                    buttonStyleBackgroundColor: '#2580e6',
                    groupButtonColor: '#2580e6',
                },
                original: {
                    language: jsonResult.language || 0,
                },
            };
        }
        case EntrySettingActionTypes.UPDATE_ENTRY_SETTING_FIELDS: {
            const { fields, type } = action.payload;
            const key = Object.keys(fields)[0];
            let value = fields[key].value;

            if ((key === 'sideMargin' || key === 'topMargin') && value > 100) {
                value = 100;
            }

            if ((key === 'sideMargin' || key === 'topMargin') && value < 0) {
                value = 0;
            }

            if ((key === 'sideMargin' || key === 'topMargin') && isNaN(value)) {
                value = 0;
            }

            if (key === 'customGroupTextColor') {
                if (!hexRegex.test(value)) {
                    return {
                        ...state,
                        [type]: {
                            ...state[type],
                            [key]: value,
                        },
                    };
                }

                return {
                    ...state,
                    [type]: {
                        ...state[type],
                        [key]: value,
                        groupTextColor: value,
                    },
                };
            }

            if (key === 'groupTextColor') {
                return {
                    ...state,
                    [type]: {
                        ...state[type],
                        [key]: value,
                        customGroupTextColor: value,
                    },
                };
            }

            return {
                ...state,
                [type]: {
                    ...state[type],
                    [key]: value,
                },
            };
        }
        case EntrySettingActionTypes.UPLOAD_IMAGE_SUCCESS: {
            const { url, opts } = action.payload;
            return {
                ...state,
                [opts.type]: {
                    ...state[opts.type],
                    [opts.imageType]: `//${url}`,
                },
            };
        }
        case EntrySettingActionTypes.GET_CUSTOMER_SERVICES_SUCCESS: {
            const { cslist: customerServices } = action.payload;
            // let customerServices = [];
            // 测试用
            //  if (!customerServices.length) {
            //      customerServices = [{
            //          name: '分组1',
            //          data: [{
            //              showname: '客服1',
            //          }],
            //      }, {
            //          name: '分组2',
            //          data: [{
            //              showname: '客服2',
            //          }, {
            //              showname: '客服3',
            //          }],
            //      }, {
            //          name: '分组3',
            //          data: [{
            //              showname: '客服1',
            //          }, {
            //              showname: '客服132',
            //          }, {
            //              showname: '客服13442',
            //          }],
            //      }, {
            //          name: '分组4',
            //          data: [{
            //              showname: '客服121',
            //          }, {
            //              showname: '客服3212434',
            //          }],
            //      }, {
            //          name: '分组5',
            //          data: [{
            //              showname: '客服112',
            //          }, {
            //              showname: '客服123',
            //          }],
            //      }, {
            //          name: '分组6',
            //          data: [{
            //              showname: '客服1242',
            //          }, {
            //              showname: '客服124',
            //          }],
            //      }];
            //  }
            return {
                ...state,
                customerServices,
            };
        }
        default:
            return state;
    }
}
export default entrySetting;
