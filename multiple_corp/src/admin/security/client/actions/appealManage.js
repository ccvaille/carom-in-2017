import message from '~comm/components/Message';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as AppealActionTypes from 'constants/AppealManageActionTypes';

const defaultErrorMsg = '系统繁忙';

export function getAppealListSuccess(payload) {
  return {
    type: AppealActionTypes.GET_APPEAL_LIST_SUCCESS,
    payload,
  };
}

export function getAppealList() {
  return (dispatch, getState) => {
    const { appealParams } = getState().appealManage;
    restHub.postForm(ApiUrls.appealList, {
      body: appealParams,
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        dispatch(getAppealListSuccess(jsonResult));
      } else {
        message.error(errorMsg || defaultErrorMsg);
      }
    });
  };
}

export function updateSearchUser(payload) {
  return {
    type: AppealActionTypes.UPDATE_SEARCH_USER,
    payload,
  };
}

export function updateSearchPhone(payload) {
  return {
    type: AppealActionTypes.UPDATE_SEARCH_PHONE,
    payload,
  };
}

export function updateAppealParams(payload) {
  return {
    type: AppealActionTypes.UPDATE_APPEAL_PARAMS,
    payload,
  };
}

export function toggleAppealHandle(payload, id) {
  return {
    type: AppealActionTypes.APPEAL_HANDLE_VISIBLE_TOGGLE,
    payload: {
      open: payload,
      id,
    },
  };
}

export function toggleHandleModal(payload) {
  return {
    type: AppealActionTypes.HANDLE_MODAL_VISIBLE_TOGGLE,
    payload,
  };
}

export function handleAppeal(payload) {
  return (dispatch) => {
    return restHub.postForm(ApiUrls.handleAppeal, {
      body: {
        id: payload,
      },
    }).then(({ errorMsg }) => {
      if (!errorMsg) {
        dispatch(getAppealList());
        dispatch(toggleHandleModal(false));
        // dispatch(toggleAppealHandle(false));
      } else {
        message.error(errorMsg || defaultErrorMsg, 2);
      }
    });
  };
}

export function toggleReleaseSuccessModal(payload) {
  return {
    type: AppealActionTypes.RELEASE_MODAL_VISIBLE_TOGGLE,
    payload,
  };
}

export function toggleReleaseFailModal(payload) {
  return {
    type: AppealActionTypes.RELEASE_FAIL_MODAL_VISIBLE_TOGGLE,
    payload,
  };
}

export function setReleaseResultType(payload) {
  return {
    type: AppealActionTypes.SET_RELEASE_RESULT_TYPE,
    payload,
  };
}

export function setCurrentReleaseId(payload) {
  return {
    type: AppealActionTypes.SET_CURRENT_RELEASE_ID,
    payload,
  };
}

export function releaseCheck(payload) {
  return (dispatch) => {
    restHub.postForm(ApiUrls.releaseCheck, {
      body: {
        id: payload,
      },
    }).then(({ errorMsg }) => {
      if (!errorMsg) {
        // dispatch(setReleaseResultType(Number(jsonResult.data)));
        dispatch(toggleReleaseSuccessModal(true));
      } else {
        dispatch(toggleReleaseFailModal(true));
        // message.error('申诉号码还未释放！请督促占号用户释放申诉号码', 3);
      }
    });
  };
}

export function sendReleaseSms() {
  return (dispatch, getState) => {
    const id = getState().appealManage.currentReleaseId;
    restHub.postForm(ApiUrls.sendSms, {
      body: {
        id,
      },
    }).then(({ errorMsg }) => {
      if (!errorMsg) {
        message.success('短信已发送');
        dispatch(getAppealList());
        setTimeout(() => {
          dispatch(toggleReleaseSuccessModal(false));
        }, 1000);
      } else {
        message.error(errorMsg || defaultErrorMsg);
      }
    });
  };
}

export function asyncExport() {
  return (dispatch, getState) => {
    const filterParams = getState().appealManage.appealParams;
    let params = '';
    const keys = Object.keys(filterParams);
    keys.forEach(k => {
      if (k !== 'curr') {
        params += params ? `&${k}=${filterParams[k]}` : `${k}=${filterParams[k]}`;
      }
    });
    return restHub.postForm(ApiUrls.asyncExport, {
      body: {
        from: 14,
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

export function withdrawAppeal(uid) {
  return (dispatch) => restHub.postForm(ApiUrls.withdrawAppeal, {
    body: {
      uid,
    },
  }).then(({ errorMsg }) => {
    if (!errorMsg) {
      dispatch(getAppealList());
      message.success('用户申诉已撤回');
      dispatch(toggleHandleModal(false));
      dispatch(toggleReleaseFailModal(false));
    } else {
      message.error(errorMsg || defaultErrorMsg);
    }
  });
}
