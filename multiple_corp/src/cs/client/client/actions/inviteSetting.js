import restHub from '~comm/services/restHub';
import { displayError } from '~comm/utils';
import ApiUrls from 'constants/ApiUrls';
import { getVisitors } from 'actions/visitors';
import * as InviteSettingActionTypes from 'constants/InviteSettingActionTypes';

export function getInviteSettingSuccess(payload) {
    return {
        type: InviteSettingActionTypes.GET_INVITE_SETTING_SUCCESS,
        payload,
    };
}

export function getInviteSetting() {
    return dispatch => restHub.post(ApiUrls.inviteSetting)
                                .then(({ errorMsg, jsonResult }) => {
                                    if (!errorMsg) {
                                        dispatch(getVisitors());
                                        dispatch(getInviteSettingSuccess(jsonResult.data));
                                    } else {
                                        displayError(errorMsg);
                                    }
                                });
}
