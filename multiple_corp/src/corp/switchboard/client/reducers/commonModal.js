import * as CommonModalActionTypes from 'constants/CommonModalActionTypes';

const initialState = {
  promptModalVisible: false,
  errorText: '',
  modalContent: '',
};

function commonModal(state = initialState, action) {
  switch (action.type) {
    case CommonModalActionTypes.SET_ERROR_TEXT:
      return {
        ...state,
        errorText: action.payload,
      };
    case CommonModalActionTypes.SET_MODAL_CONTENT:
      return {
        ...state,
        modalContent: action.payload,
      };
    case CommonModalActionTypes.TOGGLE_PROMPT_MODAL_VISIBLE:
      return {
        ...state,
        promptModalVisible: action.payload,
      };
    default:
      return state;
  }
}

export default commonModal;
