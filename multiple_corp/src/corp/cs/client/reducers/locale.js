import { SET_LOCALE } from 'constants/LocaleActionTypes';

const initialState = 'zh-cn';

function localeSetting(state = initialState, action) {
    switch (action.type) {
        case SET_LOCALE:
            return action.payload;
        default:
            return state;
    }
}

export default localeSetting;
