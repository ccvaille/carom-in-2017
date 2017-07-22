import restHub from '~comm/services/restHub';
import { displayError } from '~comm/utils';
import ApiUrls from 'constants/ApiUrls';
import { ACTIVE_PACKAGE_SUCCESS } from 'constants/ActivePackageActionTypes';

export function activePackageSuccess() {
    return {
        type: ACTIVE_PACKAGE_SUCCESS,
    };
}

export function activePackage() {
    return dispatch => restHub.post(ApiUrls.activePackage)
                                .then(({ errorMsg }) => {
                                    if (!errorMsg) {
                                        dispatch(activePackageSuccess());
                                        // window.location.href = '/kf/index/float?type=pc';
                                    } else {
                                        displayError(errorMsg);
                                    }
                                });
}
