import * as billDetailTypes from 'constants/billDetailTypes';


const initialState = {
	fetching:false,
	billDetail:{
		
	}
};

function billDetailReducers(state = initialState, action) {
	switch(action.type) {
		case billDetailTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case billDetailTypes.FETCH_BILL_DETAIL_SUCCESS:
			return {
				...state,
				billDetail: action.payload,
				fetching:false
			}
		case billDetailTypes.INIT_STATE:
			return initialState
		default:
			return state
	}
}

export default billDetailReducers;
