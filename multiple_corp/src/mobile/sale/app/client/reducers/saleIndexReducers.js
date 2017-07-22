import * as saleIndexTypes from '../constants/saleIndexTypes';

let storeState = localStorage.getItem('saleIndexState');
let storeTabIndex =0;
if(storeState){
	storeTabIndex =JSON.parse(storeState).tabIndex;
}

const initialState = {
	tabIndex:storeTabIndex,
	fetching:false,
	year:(new Date()).getFullYear(),
	month:(new Date()).getMonth()+1,
	auth:{
		target:1,
		rank:2,
		funnel:1
	}
};

function saleIndexReducers(state = initialState, action) {
	switch(action.type) {
		case saleIndexTypes.INIT_STATE:
			return initialState;
		case saleIndexTypes.FETCHING:
			return {
				...state,
				fetching: true
			}
		case saleIndexTypes.SWITCH_TAB:
			let newState = {
				...state,
				tabIndex:action.payload
			};
			localStorage.setItem('saleIndexState',JSON.stringify(newState));
			return newState;
		case saleIndexTypes.FETCH_AUTH_SUCCESS:
			return {
				...state,
				auth: action.payload,
				fetching: false
			}
		case saleIndexTypes.FETCH_GOAL_SUCCESS:
			return {
				...state,
				goalData: action.payload,
				fetching: false
			}
		case saleIndexTypes.FETCH_RANK_SUCCESS:
			return {
				...state,
				rankData: action.payload.rank,
				fetching: false
			}
		case saleIndexTypes.FETCH_FUNNEL_SUCCESS:
			return {
				...state,
				funnelData: action.payload,
				fetching: false
			}
		default:
			return state
	}
}

export default saleIndexReducers;
