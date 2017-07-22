import * as InviteSettingActionTypes from 'constants/InviteSettingActionTypes';

const initialState = {
    pc: {},
    mobile: {},
};

function inviteSetting(state = initialState, action) {
    switch (action.type) {
        case InviteSettingActionTypes.GET_INVITE_SETTING_SUCCESS: {
            return {
                ...state,
                pc: action.payload.pcBoxSet,
                mobile: action.payload.mobileBoxSet,
            };
        }

        default:
            return state;
    }
}

export default inviteSetting;
