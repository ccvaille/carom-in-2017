import * as CustomerServiceActionTypes from 'constants/CustomerServicesActionTypes';

const initialState = {
    services: [],
    params: {
        search: '',
    },
};

function customerService(state = initialState, action) {
    switch (action.type) {
        case CustomerServiceActionTypes.GET_SERVICES_SUCCESS:
            return {
                ...state,
                services: action.payload,
            };
        case CustomerServiceActionTypes.UPDATE_PARAMS:
            return {
                ...state,
                params: {
                    ...state.params,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
}

export default customerService;
