import restHub from '~comm/services/restHub';
import { displayError } from '~comm/utils';
import ApiUrls from 'constants/ApiUrls';
import * as ChatSettingActionTypes from 'constants/ChatSettingActionTypes';

export function getChatSettingSuccess(payload) {
    return {
        type: ChatSettingActionTypes.GET_CHAT_SETTING_SUCCESS,
        payload,
    };
}

export function getChatSetting(type) {
    return dispatch => restHub.post(ApiUrls.chatBoxSet, {
        body: {
            type: type === 'pc' ? 0 : 1,
        },
    }).then(({ errorCode, errorMsg, jsonResult }) => {
        if (!errorMsg) {
            dispatch(getChatSettingSuccess({
                jsonResult: jsonResult.data,
                type,
            }));
        } else if (errorCode !== 41030) {
            displayError(errorMsg);
        }
    });
}

export function updateChatSettingFields(payload) {
    return {
        type: ChatSettingActionTypes.UPDATE_CHAT_SETTING_FIELDS,
        payload,
    };
}

export function saveSetting(type) {
    return (dispatch, getState) => {
        const data = getState().chatSetting[type];
        if (data.mode === 1) {
            data.notice = '';
        }

        return restHub.post(ApiUrls.saveChatBoxSet, {
            body: {
                type: type === 'pc' ? 0 : 1,
                mode: data.mode,
                color: data.themeColor,
                title: data.title,
                notice: data.notice,
                noticemsg: data.leaveMsgnotice,
                onlinemsg: data.welcomeMessage,
            },
        }).then(({ errorMsg }) => {
            if (!errorMsg) {
                dispatch(getChatSetting(type));
                return { errorMsg: null };
                // dispatch(saveSettingSuccess(type));
            }
            displayError(errorMsg);
            return { errorMsg };
        });
    };
}
