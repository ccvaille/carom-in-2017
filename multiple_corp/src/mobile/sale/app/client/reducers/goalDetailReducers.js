import * as goalDetailTypes from 'constants/goalDetailTypes';


const initialState = {
	goalData:{
		tree:[]
	},
	fetching:false,
	yearRateData:[]
};

function goalDetailReducers(state = initialState, action) {
	switch(action.type) {
		case goalDetailTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case goalDetailTypes.FETCH_GOAL_SUCCESS:
			return {
				...state,
				goalData: action.payload,
				fetching:false
			}
		case goalDetailTypes.FETCH_YEAR_RATE_SUCCESS:
			return {
				...state,
				yearRateData: action.payload,
				fetching:false
			}
		case goalDetailTypes.INIT_STATE:
			return initialState
		default:
			return state
	}
}

export default goalDetailReducers;
