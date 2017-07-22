/* eslint-disable */
import { push, replace } from 'react-router-redux';
import message from '~comm/components/Message';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as ManagePasswordActionTypes from 'constants/ManagePasswordActionTypes';

export function toggleGetCodeDisabled(payload) {
  return {
    type: ManagePasswordActionTypes.TOGGLE_GET_CODE_DISABLED,
    payload,
  };
}

function updateCountdown(payload) {
  return {
    type: ManagePasswordActionTypes.UPDATE_COUNTDOWN,
    payload,
  };
}

function startCountdown() {
  return (dispatch, getState) => {
    const countInterval = setInterval(() => {
      const { codeCountDown: prevCount } = getState().managePassword;
      if (prevCount > 0) {
        dispatch(updateCountdown(prevCount - 1));
      } else {
        clearInterval(countInterval);
        dispatch(toggleGetCodeDisabled(false));
        dispatch(updateCountdown(120));
      }
    }, 1000)
  }
}

export function sendSms() {
  return (dispatch, getState) => {
    const { currentPhone } = getState().managePassword;
    return restHub.postForm(ApiUrls.sendSms, {
      body: {
        type: 3,
        mobile: currentPhone,
      }
    }).then(({ errorMsg }) => {
      if (!errorMsg) {
        dispatch(toggleGetCodeDisabled(true));
        dispatch(startCountdown());
      } else {
        dispatch(updateErrorText(errorMsg));
      }
    });
  }
}

export function setPassword() {
  return (dispatch, getState) => {
    const { password, repeatPassword } = getState().managePassword.setting;
    restHub.postForm(ApiUrls.setManagePassword, {
      body: {
        password,
        re_password: repeatPassword,
      }
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        // browserHistory.push('/manage/password');
        dispatch(push('/manage/password'));
        dispatch({
          type: ManagePasswordActionTypes.RESET_SETTING_FORM,
        });
      } else {
        dispatch(updateErrorText(errorMsg));
      }
    });
  }
}

export function confirmPassword() {
  return (dispatch, getState) => {
    const password = getState().managePassword.confirm.password;
    restHub.postForm(ApiUrls.managePasswordLogin, {
      body: { password }
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        // 替换成跳转 url
        location.replace(jsonResult.data.url);
        dispatch({
          type: ManagePasswordActionTypes.RESET_CONFIRM_FORM,
        });
      } else {
        dispatch(updateErrorText(errorMsg));
      }
    });
  }
}

export function checkOldPassword(payload) {
  return (dispatch) => restHub.postForm(ApiUrls.checkOldManagePwd, {
    body: {
      password: payload,
    }
  }).then(({ errorMsg, jsonResult }) => {
    if (!errorMsg) {
      if (jsonResult.data && jsonResult.data.result == 0) {
        dispatch(updateErrorText('旧管理密码错误！'));
      }
    } else {
      dispatch(updateErrorText(errorMsg || '旧管理密码错误！'));
    }
  })
}

export function modifyPassword() {
  return (dispatch, getState) => {
    const { password, repeatPassword, oldPassword } = getState().managePassword.modify;
    restHub.postForm(ApiUrls.setManagePassword, {
      body: {
        old_password: oldPassword,
        password,
        re_password: repeatPassword,
      }
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        message.success('密码修改成功');
        dispatch(replace('/manage/password'));
        dispatch({
          type: ManagePasswordActionTypes.RESET_MODIFY_FORM,
        });
      } else {
        dispatch(updateErrorText(errorMsg));
      }
    });
  }
}

export function findPassword() {
  return (dispatch, getState) => {
    const { find: findForm } = getState().managePassword;
    return restHub.postForm(ApiUrls.findManagePassword, {
      body: {
        user_name: findForm.userName,
        corp_name: findForm.corpName,
        sms_code: findForm.smsCode,
        password: findForm.password,
        re_password: findForm.repeatPassword,
      }
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        message.success('密码找回成功');
        dispatch(replace('/manage/password'));
        dispatch({
          type: ManagePasswordActionTypes.RESET_FIND_FORM,
        });
      } else {
        dispatch(updateErrorText(errorMsg));
      }
    });
  }
}

export function getCurrentPhone() {
  return (dispatch) => {
    return restHub.postForm(ApiUrls.getCurrentPhone, {
      body: {}
    }).then(({ errorMsg, jsonResult }) => {
      if (!errorMsg) {
        dispatch({
          type: ManagePasswordActionTypes.GET_CURRENT_PHONE_SUCCESS,
          payload: jsonResult.data,
        });
      } else {
        dispatch(updateErrorText(errorMsg));
      }
    })
  }
}

export function updateErrorText(payload) {
  return {
    type: ManagePasswordActionTypes.UPDATE_ERROR_TEXT,
    payload,
  };
}

export function updateSettingForm(payload) {
  return {
    type: ManagePasswordActionTypes.UPDATE_SETTING_FORM,
    payload,
  };
}

export function updateConfirmForm(payload) {
  return {
    type: ManagePasswordActionTypes.UPDATE_CONFIRM_FORM,
    payload,
  };
}

export function updateModifyForm(payload) {
  return {
    type: ManagePasswordActionTypes.UPDATE_MODIFY_FORM,
    payload,
  };
}

export function updateFindForm(payload) {
  return {
    type: ManagePasswordActionTypes.UPDATE_FIND_FORM,
    payload,
  };
}
