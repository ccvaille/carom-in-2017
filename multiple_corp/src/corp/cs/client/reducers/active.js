import * as ActivePackageActionTypes from 'constants/ActivePackageActionTypes';

const initialState = {
    promptModalVisible: false,
};

function active(state = initialState, action) {
    switch (action.type) {
        case ActivePackageActionTypes.ACTIVE_PACKAGE_SUCCESS:
            return {
                ...state,
                promptModalVisible: true,
            };
        default:
            return state;
    }
}

export default active;
