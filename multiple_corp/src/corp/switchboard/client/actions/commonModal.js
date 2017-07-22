import * as CommonModalActionTypes from 'constants/CommonModalActionTypes';

export function setModalContent(payload) {
  return {
    type: CommonModalActionTypes.SET_MODAL_CONTENT,
    payload,
  };
}

export function togglePromptModal(payload) {
  return {
    type: CommonModalActionTypes.TOGGLE_PROMPT_MODAL_VISIBLE,
    payload,
  };
}

export function setErrorText(payload) {
  return {
    type: CommonModalActionTypes.SET_ERROR_TEXT,
    payload,
  };
}
