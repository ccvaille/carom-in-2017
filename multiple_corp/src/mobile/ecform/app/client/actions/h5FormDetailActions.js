import mobileError from '~comm/components/mobileError';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as H5FormDetailTypes from 'constants/H5FormDetailTypes';

export function getDataDetail(payload) {
	let url = ApiUrls.getDataDetail +
		'?formId=' + payload.formId +'&dataId=' +  payload.dataId;

	return (dispatch, getState) => {
        dispatch({
            type: H5FormDetailTypes.DETAIL_LOADING,
            payload: true
        })
        const { activeTabGroupMenu } = getState().h5FormReducers;
        if (activeTabGroupMenu == '4') {
            url += '&tome=1';
        }
		return restHub.get(url)
			.then(({ errorMsg, jsonResult }) => {
                dispatch({
                    type: H5FormDetailTypes.DETAIL_LOADING,
                    payload: false
                });
				if (!errorMsg) {
					dispatch({
						type: H5FormDetailTypes.GET_DATA_DETAIL,
						payload: jsonResult.data
					});
				} else {
					mobileError('系统繁忙');
				}
			})
	}
}


