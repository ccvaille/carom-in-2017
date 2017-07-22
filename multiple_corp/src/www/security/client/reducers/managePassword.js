import * as ManagePasswordActionTypes from 'constants/ManagePasswordActionTypes';

const initialState = {
  setting: {
    password: '',
    repeatPassword: '',
  },
  modify: {
    oldPassword: '',
    password: '',
    repeatPassword: '',
  },
  find: {
    userName: '',
    corpName: '',
    smsCode: '',
    password: '',
    repeatPassword: '',
  },
  confirm: {
    password: '',
  },
  errorText: '',
  currentPhone: '',
  isDisableGetCode: false,
  codeCountDown: 120,
};

function managePassword(state = initialState, action) {
  switch (action.type) {
    case ManagePasswordActionTypes.UPDATE_ERROR_TEXT:
      return {
        ...state,
        errorText: action.payload,
      };
    case ManagePasswordActionTypes.UPDATE_SETTING_FORM: {
      const { fields } = action.payload;
      const key = Object.keys(fields)[0];
      const value = fields[key].value;
      return {
        ...state,
        setting: {
          ...state.setting,
          [key]: value,
        },
      };
    }
    case ManagePasswordActionTypes.RESET_SETTING_FORM:
      return {
        ...state,
        setting: {
          password: '',
          repeatPassword: '',
        },
      };
    case ManagePasswordActionTypes.UPDATE_CONFIRM_FORM: {
      const { fields } = action.payload;
      const key = Object.keys(fields)[0];
      const value = fields[key].value;
      return {
        ...state,
        confirm: {
          ...state.confirm,
          [key]: value,
        },
      };
    }
    case ManagePasswordActionTypes.RESET_CONFIRM_FORM:
      return {
        ...state,
        confirm: {
          password: '',
        },
      };
    case ManagePasswordActionTypes.UPDATE_MODIFY_FORM: {
      const { fields } = action.payload;
      const key = Object.keys(fields)[0];
      const value = fields[key].value;
      return {
        ...state,
        modify: {
          ...state.modify,
          [key]: value,
        },
      };
    }
    case ManagePasswordActionTypes.RESET_MODIFY_FORM:
      return {
        ...state,
        modify: {
          oldPassword: '',
          password: '',
          repeatPassword: '',
        },
      };
    case ManagePasswordActionTypes.UPDATE_FIND_FORM: {
      const { fields } = action.payload;
      const key = Object.keys(fields)[0];
      const value = fields[key].value;
      return {
        ...state,
        find: {
          ...state.find,
          [key]: value,
        },
      };
    }
    case ManagePasswordActionTypes.RESET_FIND_FORM:
      return {
        ...state,
        find: {
          userName: '',
          corpName: '',
          smsCode: '',
          password: '',
          repeatPassword: '',
        },
      };
    case ManagePasswordActionTypes.GET_CURRENT_PHONE_SUCCESS:
      return {
        ...state,
        currentPhone: action.payload.mobile,
      };
    case ManagePasswordActionTypes.UPDATE_COUNTDOWN:
      return {
        ...state,
        codeCountDown: action.payload,
      };
    case ManagePasswordActionTypes.TOGGLE_GET_CODE_DISABLED:
      return {
        ...state,
        isDisableGetCode: action.payload,
      };
    default:
      return state;
  }
}

export default managePassword;
