import restHub from '~comm/services/restHub';
import { displayError } from '~comm/utils';
import ApiUrls from 'constants/ApiUrls';
import * as InviteSettingActionTypes from 'constants/InviteSettingActionTypes';

export function getInviteSettingSuccess(payload) {
    return {
        type: InviteSettingActionTypes.GET_INVITE_SETTING_SUCCESS,
        payload,
    };
}

export function getInviteSetting(type) {
    return dispatch => restHub.post(ApiUrls.inviteSet, {
        body: {
            type: type === 'pc' ? 0 : 1,
        },
    }).then(({ errorCode, errorMsg, jsonResult }) => {
        if (!errorMsg) {
            dispatch(getInviteSettingSuccess({
                jsonResult: jsonResult.data,
                type,
            }));
        } else if (errorCode !== 41030) {
            displayError(errorMsg);
        }
    });
}

export function updateInviteSettingFields(payload) {
    return {
        type: InviteSettingActionTypes.UPDATE_INVITE_SETTING_FIELDS,
        payload,
    };
}

export function saveSetting(type) {
    return (dispatch, getState) => {
        const data = getState().inviteSetting[type];

        return restHub.post(ApiUrls.saveInviteSet, {
            body: {
                type: type === 'pc' ? 0 : 1,
                theme: data.theme,
                content: data.content,
                show: data.allowAutoInvite,
                inviteAgain: data.allowAutoInviteAgain,
                inviteInter: data.autoInviteInterval,
                defer: data.defer,
                delay: data.closeDelay,
                inviteActive: data.allowManualInvite,
                inviteactiveAgain: data.allowManualInviteAgain,
                inviteactiveInter: data.manualInviteInterval,
                float: data.floatPosition,
            },
        }).then(({ errorMsg }) => {
            if (!errorMsg) {
                dispatch(getInviteSetting(type));
                return { errorMsg: null };
                // dispatch(saveSettingSuccess(type));
            }
            displayError(errorMsg);
            return { errorMsg };
        });
    };
}
