import message from '~comm/components/Message';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as WhitelistActionTypes from 'constants/WhitelistActionTypes';

const defaultErrorMsg = '系统繁忙';

export function getWhitelistSuccess(data) {
  return {
    type: WhitelistActionTypes.GET_WHITELIST_SUCCESS,
    payload: data,
  };
}

export function getWhitelist() {
  return (dispatch, getState) => {
    const { whitelistParams } = getState().whitelist;
    restHub.postForm(ApiUrls.whitelist, {
      body: whitelistParams,
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        dispatch(getWhitelistSuccess(jsonResult));
      } else {
        message.error(errorMsg || defaultErrorMsg);
      }
    });
  };
}

export function toggleAddModal(payload) {
  return {
    type: WhitelistActionTypes.TOGGLE_ADD_MODAL,
    payload,
  };
}

export function addCorpsToRemove(payload) {
  return {
    type: WhitelistActionTypes.ADD_CORPS_TO_REMOVE,
    payload,
  };
}

export function toggleRemoveVisible(payload) {
  return {
    type: WhitelistActionTypes.TOGGLE_REMOVE_VISIBLE,
    payload,
  };
}

export function removeWhitelistCorps(payload) {
  return (dispatch) => {
    restHub.postForm(ApiUrls.whitelistCorpsRemove, {
      body: {
        corp_ids: payload,
      },
    }).then(({ errorMsg }) => {
      if (!errorMsg) {
        dispatch(getWhitelist());
        dispatch(toggleRemoveVisible(true));
      } else {
        message.error(errorMsg || defaultErrorMsg);
      }
    });
  };
}

export function resetAddCorps() {
  return {
    type: WhitelistActionTypes.RESET_ADD_CORPS,
  };
}

export function addWhitelistCorps(payload) {
  return (dispatch) => {
    const corpIds = payload.filter(id => id !== '');
    if (!corpIds.length) {
      message.error('请输入1-5个要加入的企业ID！');
      return false;
    }

    return restHub.postForm(ApiUrls.whitelistCorpsAdd, {
      body: {
        corp_ids: corpIds,
      },
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        message.success(jsonResult.data.msg);
        dispatch(getWhitelist());
        dispatch(toggleAddModal(false));
        dispatch(resetAddCorps());
      } else {
        message.error(errorMsg || defaultErrorMsg);
      }
    });
  };
}

export function addCorpsChange(payload) {
  return {
    type: WhitelistActionTypes.ADD_CORPS_CHANGE,
    payload,
  };
}

export function updateSearchKeyword(payload) {
  return {
    type: WhitelistActionTypes.UPDATE_SEARCH_KEYWORD,
    payload,
  };
}

export function updateWhitelistParams(payload) {
  return {
    type: WhitelistActionTypes.UPDATE_WHITELIST_PARAMS,
    payload,
  };
}

export function asyncExport() {
  return (dispatch, getState) => {
    const filterParams = getState().whitelist.whitelistParams;
    let params = '';
    const keys = Object.keys(filterParams);
    keys.forEach(k => {
      if (k !== 'curr') {
        params += params ? `&${k}=${filterParams[k]}` : `${k}=${filterParams[k]}`;
      }
    });
    return restHub.postForm(ApiUrls.asyncExport, {
      body: {
        from: 13,
        query_string: encodeURIComponent(params),
      },
    }).then(({ errorMsg }) => {
      if (!errorMsg) {
        message.success('导出成功');
        return { errorMsg };
      }

      message.error(errorMsg || defaultErrorMsg);
      return { errorMsg };
    });
  };
}
