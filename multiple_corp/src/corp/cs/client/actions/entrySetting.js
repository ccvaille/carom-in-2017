import restHub from '~comm/services/restHub';
import { displayError } from '~comm/utils';
import ApiUrls from 'constants/ApiUrls';
import * as EntrySettingActionTypes from 'constants/EntrySettingActionTypes';
import { setLocale } from './locale';

export function getEntrySettingSuccess(payload) {
    return {
        type: EntrySettingActionTypes.GET_ENTRY_SETTING_SUCCESS,
        payload,
    };
}

export function getEntrySetting(type) {
    return (dispatch, getState) => {
        const originalLanguage = getState().entrySetting.original.language;
        return restHub.post(ApiUrls.entrySet, {
            body: {
                type: type === 'pc' ? 0 : 1,
            },
        }).then(({ errorCode, errorMsg, jsonResult }) => {
            if (!errorMsg) {
                let language = 'zh-cn';
                if (jsonResult.data) {
                    language = jsonResult.data.language || 0;
                } else {
                    language = originalLanguage;
                }

                switch (language) {
                    case 0:
                        dispatch(setLocale('zh-cn'));
                        break;
                    case 1:
                        dispatch(setLocale('en-us'));
                        break;
                    case 2:
                        dispatch(setLocale('zh-tw'));
                        break;
                    default:
                        dispatch(setLocale('zh-cn'));
                }

                dispatch(getEntrySettingSuccess({
                    jsonResult: jsonResult.data || {},
                    type,
                }));
            } else if (errorCode !== 41030) {
                displayError(errorMsg);
            }
        });
    };
}

export function getServicesSuccess(payload) {
    return {
        type: EntrySettingActionTypes.GET_CUSTOMER_SERVICES_SUCCESS,
        payload,
    };
}

export function getServices() {
    return dispatch => restHub.post(ApiUrls.getServices)
                                .then(({ errorCode, errorMsg, jsonResult }) => {
                                    if (!errorMsg) {
                                        dispatch(getServicesSuccess(jsonResult.data));
                                    } else if (errorCode !== 41030) {
                                        displayError(errorMsg);
                                    }
                                });
}

export function updateEntrySettingFields(payload) {
    return {
        type: EntrySettingActionTypes.UPDATE_ENTRY_SETTING_FIELDS,
        payload,
    };
}

export function uploadImageSuccess(data, opts) {
    return {
        type: EntrySettingActionTypes.UPLOAD_IMAGE_SUCCESS,
        payload: {
            url: data.data.url,
            opts,
        },
    };
}

export function uploadImage(payload, opts) {
    return dispatch => restHub.uploadImage(ApiUrls.uploadImage, {
        body: payload,
        isOss: false,
    }).then(({ errorMsg, jsonResult }) => {
        if (!errorMsg) {
            dispatch(uploadImageSuccess(jsonResult, opts));
        } else {
            displayError(errorMsg);
        }
    });
}

export function saveSetting(type) {
    return (dispatch, getState) => {
        const saveState = getState().entrySetting[type];
        const {
            showStyle,
            theme,
            listTheme,
            btnTheme,
            systemThemeNumber,
            buttonStyleBackgroundColor,
            groupTextColor,
            listBackground,
            btnBackground,
            minimizeBackground,
        } = saveState;
        let finalTheme = theme;
        let btnStyleBgColor = buttonStyleBackgroundColor;
        let groupTxtColor = groupTextColor;
        let listBg = listBackground;
        let btnBg = btnBackground;
        let minimizeBg = minimizeBackground;

        if (type === 'pc') {
            if (showStyle === 0) {
                if (listTheme === -1) {
                    finalTheme = systemThemeNumber;
                    listBg = '';
                    minimizeBg = '';
                } else {
                    finalTheme = listTheme;
                }
                btnBg = '';
                btnStyleBgColor = '';
            } else if (saveState.showStyle === 1) {
                finalTheme = btnTheme;
                listBg = '';
                minimizeBg = '';
                groupTxtColor = '';
            }
        } else if (showStyle === 0) {  // 0:列表模式
            finalTheme = btnTheme;
            btnBg = '';
            btnStyleBgColor = '';
        } else if (showStyle === 1) {  // 1:按钮模式
            finalTheme = btnTheme;
            listBg = '';
            minimizeBg = '';
            groupTxtColor = '';
        }

        const data = {
            type: type === 'pc' ? 0 : 1,
            language: saveState.language,
            showstyle: saveState.showStyle,
            theme: finalTheme,
            bcolor: btnStyleBgColor,
            autohide: saveState.defaultStyle,
            bmodestyle: saveState.buttonStyle,
            listrand: saveState.csSort,
            offhide: saveState.showOffline,
            btntxt: groupTxtColor,
            fixed: saveState.fixed,
            float: saveState.floatPosition,
            fmargin: saveState.sideMargin,
            ftop: saveState.topMargin,
            bpic1: listBg,
            bpic3: minimizeBg,
            bpic2: btnBg,
        };

        return restHub.post(ApiUrls.saveEntrySet, {
            body: data,
        }).then(({ errorMsg }) => {
            if (!errorMsg) {
                dispatch(getEntrySetting(type));
                return { errorMsg: null };
                // dispatch(saveSettingSuccess(type));
            }

            displayError(errorMsg);
            return { errorMsg };
        });
    };
}
