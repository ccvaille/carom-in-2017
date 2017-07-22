import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { displayError } from '~comm/utils';
import * as CsGroupsActionTypes from 'constants/CsGroupsActionTypes';

export function simulateLogin() {
    return () => restHub.get(ApiUrls.simulateLogin);
}

export function updateGroupErrorMsg(payload) {
    return {
        type: CsGroupsActionTypes.UPDATE_GROUP_ERROR_MSG,
        payload,
    };
}

export function getCsGroupsSuccss(payload) {
    return {
        type: CsGroupsActionTypes.GET_CS_GROUPS_SUCCESS,
        payload,
    };
}

export function getCsGroups() {
    return dispatch => restHub.post(ApiUrls.csGroups)
                                .then(({ errorCode, errorMsg, jsonResult }) => {
                                    if (!errorMsg) {
                                        dispatch(getCsGroupsSuccss(jsonResult));
                                    } else if (errorCode !== 41030) {
                                        displayError(errorMsg);
                                    }
                                });
}

export function upGroup(payload) {
    return {
        type: CsGroupsActionTypes.UP_GROUP_ORDER,
        payload,
    };
}

export function downGroup(payload) {
    return {
        type: CsGroupsActionTypes.DOWN_GROUP_ORDER,
        payload,
    };
}

export function sortGroupRemote(payload) {
    return () => restHub.post(ApiUrls.sortGroup, {
        body: payload,
    }).then(({ errorMsg }) => {
        if (!errorMsg) {
            // dispatch(getCsGroups());
        } else {
            displayError(errorMsg);
        }
    });
}

export function addOrEditGroup(payload) {
    return {
        type: CsGroupsActionTypes.ADD_OR_EDIT_GROUP_LOCAL,
        payload,
    };
}

export function addOrEditGroupRemote(payload) {
    let url = ApiUrls.addGroup;
    if (!payload.id) {
        // eslint-disable-next-line no-param-reassign
        delete payload.id;
    } else {
        url = ApiUrls.editGroup;
    }

    return dispatch => restHub.post(url, {
        body: payload,
    }).then(({ errorMsg }) => {
        if (!errorMsg) {
            dispatch(getCsGroups());
            return { errorMsg };
        }

        dispatch(updateGroupErrorMsg(errorMsg || '系统繁忙'));
        return { errorMsg };
    });
}

export function editGroup() {

}

export function removeGroup(payload) {
    return {
        type: CsGroupsActionTypes.REMOVE_GROUP_LOCAL,
        payload,
    };
}

export function removeGroupRemote(payload) {
    return dispatch => restHub.post(ApiUrls.removeGroup, {
        body: {
            id: payload,
        },
    }).then(({ errorMsg }) => {
        if (!errorMsg) {
            dispatch(getCsGroups());
            return { errorMsg };
        }

        displayError(errorMsg);
        return { errorMsg };
    });
}
