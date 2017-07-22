import * as H5FormDetailTypes from 'constants/H5FormDetailTypes';

const initialState = {
	detailData: {
		form: {},
		detail: []
	},
    isDetailLoading: false
};

function H5FormDetailReducers(state = initialState, action) {
	switch(action.type) {
		case H5FormDetailTypes.GET_DATA_DETAIL:
			return {
				...state,
				detailData: action.payload
			}
        case H5FormDetailTypes.DETAIL_LOADING:
            return {
                ...state,
                isDetailLoading: action.payload
            }
		default:
			return state
	}
}

export default H5FormDetailReducers;
