import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import { displayError } from '~comm/utils';
import message from '~comm/components/Message';
import * as VisitorDetailsActionTypes from 'constants/VisitorDetailsActionTypes';
import { setGuestInfo } from 'actions/chat';

export function updateInfoSavedStatus(payload) {
    return {
        type: VisitorDetailsActionTypes.UPDATE_INFO_SAVED_STATUS,
        payload,
    };
}

export function toggleShowDetail(payload) {
    return {
        type: VisitorDetailsActionTypes.TOGGLE_VISITOR_DETAIL_SHOW,
        payload,
    };
}

export function resetCrmInfo() {
    return {
        type: VisitorDetailsActionTypes.RESET_CRM_INFO,
    };
}

export function resetCrmInfoError() {
    return {
        type: VisitorDetailsActionTypes.RESET_CRM_INFO_ERROR,
    };
}

export function getCrmInfoSuccess(payload) {
    return {
        type: VisitorDetailsActionTypes.GET_CRM_INFO_SUCCESS,
        payload,
    };
}

export function getCrmInfo(guid, type = 1) {
    return (dispatch) => {
        const url = `${ApiUrls.crmInfo}?csguid=${guid}&type=${type}`;
        return restHub.get(url).then(({ errorMsg, jsonResult }) => {
            if (!errorMsg) {
                if (jsonResult) {
                    if (
                        !Array.isArray(jsonResult.data) &&
                        (typeof jsonResult.data === 'object' && Object.keys(jsonResult.data).length !== 0)
                    ) {
                        dispatch(getCrmInfoSuccess(jsonResult.data));
                    } else {
                        dispatch(resetCrmInfo());
                    }
                }
            }
        });
    };
}

export function updateCrmInfoFields(payload) {
    return {
        type: VisitorDetailsActionTypes.UPDATE_CRM_INFO_FIELDS,
        payload,
    };
}

export function updateCrmInfoError(payload) {
    return {
        type: VisitorDetailsActionTypes.UPDATE_CRM_INFO_ERROR,
        payload,
    };
}

export function restoreFieldValue(key) {
    return {
        type: VisitorDetailsActionTypes.RESTORE_FORM_FIELD_VALUE,
        payload: key,
    };
}

export function updateClientStored(payload) {
    return {
        type: VisitorDetailsActionTypes.UPDATE_CLIENT_STORED,
        payload,
    };
}

export function toggleDuplicateModal(payload) {
    return {
        type: VisitorDetailsActionTypes.CRM_DUPLICATE_MODAL_TOGGLE,
        payload,
    };
}

export function updateDuplicateCrmId(payload) {
    return {
        type: VisitorDetailsActionTypes.UPDATE_DUPLICATE_CRM_ID,
        payload,
    };
}

export function updateInfoActiveTab(payload) {
    return {
        type: VisitorDetailsActionTypes.UPDATE_INFO_ACTIVE_TAB_KEY,
        payload,
    };
}

export function syncToOriginalInfo() {
    return {
        type: VisitorDetailsActionTypes.SYNC_TO_ORIGINAL_INFO,
    };
}

export function saveCrmInfo(guid, txguid, type = 1) {
    return (dispatch, getState) => {
        const { currentCrmInfo } = getState().visitorDetails;
        if (!currentCrmInfo.crmid) {
            delete currentCrmInfo.crmid;
        }
        return restHub.postForm(`${ApiUrls.crmSave}`, {
            body: {
                ...currentCrmInfo,
                csguid: guid,
                type,
            },
        }).then(({ errorCode, errorMsg, jsonResult }) => {
            if (!errorMsg) {
                dispatch(updateCrmInfoFields({
                    fields: {
                        crmid: {
                            value: `${jsonResult.crmid}`,
                        },
                    },
                }));
                dispatch(syncToOriginalInfo());
                dispatch(setGuestInfo(txguid, {
                    guidName: currentCrmInfo.name,
                }));
                dispatch(updateInfoSavedStatus(2));
                setTimeout(() => {
                    dispatch(updateInfoSavedStatus(0));
                }, 2000);
                // message.success('保存成功');
            } else {
                if (errorCode === 40003) {
                    dispatch(updateDuplicateCrmId(jsonResult.crmid));
                    dispatch(toggleDuplicateModal({
                        visible: true,
                        content: errorMsg,
                    }));
                    // dispatch(updateClientStored(true));
                    // displayError(errorMsg);
                } else {
                    dispatch(restoreFieldValue('all'));
                    displayError(errorMsg);
                }
                dispatch(updateInfoSavedStatus(0));
            }
        });
    };
}
