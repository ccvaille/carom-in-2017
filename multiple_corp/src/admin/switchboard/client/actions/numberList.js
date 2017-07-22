import message from '~comm/components/Message';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as NumberListActionTypes from 'constants/NumberListActionTypes';

export function getNumberListSuccess(payload) {
  return {
    type: NumberListActionTypes.GET_NUMBER_LIST_SUCCESS,
    payload,
  };
}

export function getNumberList() {
  return (dispatch, getState) => {
    const { numberListParams } = getState().numberList;
    return restHub.postForm(ApiUrls.numberList, {
      body: numberListParams,
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        dispatch(getNumberListSuccess(jsonResult));
      } else {
        message.error(errorMsg);
      }
    });
  };
}

export function updateListParams(payload) {
  return {
    type: NumberListActionTypes.UPDATE_LIST_PARAMS,
    payload,
  };
}

export function asyncExport() {
  return (dispatch, getState) => {
    const filterParams = getState().numberList.numberListParams;
    let params = '';
    const keys = Object.keys(filterParams);
    keys.forEach(k => {
      if (k !== 'curr') {
        params += params ? `&${k}=${filterParams[k]}` : `${k}=${filterParams[k]}`;
      }
    });
    return restHub.postForm(ApiUrls.asyncExport, {
      body: {
        from: 11,
        query_string: encodeURIComponent(params),
      },
    }).then(({ errorMsg }) => {
      if (!errorMsg) {
        message.success('导出成功');
        return { errorMsg };
      }

      message.error(errorMsg);
      return { errorMsg };
    });
  };
}
