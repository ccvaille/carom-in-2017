import * as funnelTypes from 'constants/funnelTypes';


const initialState = {
	dept:{
		name:'全部'
	},
	data:{},
	billList:[],
	tabIndex:0,
	auth:{
		
	},
	billDetail:{
		
	},
	showGuideModal:false,
	fetching:false
};

function funnelReducers(state = initialState, action) {
	switch(action.type) {
		case funnelTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case funnelTypes.SWITCH_TAB:
			return {
				...state,
				tabIndex: action.payload,
			}
		case funnelTypes.FETCH_AUTH_SUCCESS:
			return {
				...state,
				auth: action.payload,
				fetching:false
			}
		case funnelTypes.FILTER_CHANGE:
			return {
				...state,
				...action.payload
			}
		case funnelTypes.FETCH_FUNNEL_SUCCESS:
			return {
				...state,
				data: action.payload,
				fetching:false
			}
		case funnelTypes.FETCH_GET_TIP_SUCCESS:
			return {
				...state,
				showGuideModal: action.payload
			}
		case funnelTypes.FETCH_SET_TIP_SUCCESS:
			return {
				...state,
				showGuideModal: action.payload
			}
		case funnelTypes.INIT_STATE:
			return initialState
		default:
			return state
	}
}

export default funnelReducers;
