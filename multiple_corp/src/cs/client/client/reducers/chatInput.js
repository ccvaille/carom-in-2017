import * as ChatActionTypes from '../constants/ChatActionTypes';

const initialState = {
    drafts: {},
    textPos: {},
    isShowEmotion: false,
    tipText: '',
};

export default (state = initialState, action) => {
    switch (action.type) {
        case ChatActionTypes.SET_INPUT_VALUE:
            return {
                ...state,
                value: action.payload.value,
            };
        case ChatActionTypes.SET_DRAFT:
            return {
                ...state,
                drafts: {
                    ...state.drafts,
                    [action.payload.txguid]: action.payload.draft,
                },
            };
        case ChatActionTypes.SET_IS_SHOW_EMOTION:
            return {
                ...state,
                isShowEmotion: action.payload.isShowEmotion,
            };
        case ChatActionTypes.SAVE_TEXT_POS:
            return {
                ...state,
                textPos: {
                    ...state.textPos,
                    [action.payload.txguid]: action.payload.pos,
                },
            };
        case ChatActionTypes.SET_TIP_TEXT:
            return {
                ...state,
                tipText: action.payload.tipText,
            };
        default:
            return {
                ...state,
            };
    }
};
