import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as CorpStructureActionTypes from 'constants/CorpStructureActionTypes';

function getCorpDeptsSuccess(payload) {
    return {
        type: CorpStructureActionTypes.GET_CORP_DEPTS_SUCCESS,
        payload,
    };
}

// eslint-disable-next-line import/prefer-default-export
export function getCorpDepts() {
    return dispatch => restHub.postForm(ApiUrls.corpstruct)
                        .then(({ errorMsg, jsonResult }) => {
                            if (!errorMsg) {
                                dispatch(getCorpDeptsSuccess(jsonResult));
                            }
                        });
}
