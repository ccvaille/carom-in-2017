import * as funnelAllTypes from 'constants/funnelAllTypes';


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
	fetching:false,
	showGuideModal:false
};

function funnelAllReducers(state = initialState, action) {
	switch(action.type) {
		case funnelAllTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case funnelAllTypes.SWITCH_TAB:
			return {
				...state,
				tabIndex: action.payload,
			}
		case funnelAllTypes.FETCH_AUTH_SUCCESS:
			return {
				...state,
				auth: action.payload,
				fetching:false
			}
		case funnelAllTypes.FILTER_CHANGE:
			return {
				...state,
				...action.payload
			}
		case funnelAllTypes.FETCH_FUNNEL_SUCCESS:
			return {
				...state,
				data: action.payload,
				fetching:false
			}
		case funnelAllTypes.FETCH_GET_TIP_SUCCESS:
			return {
				...state,
				showGuideModal: action.payload
			}
		case funnelAllTypes.FETCH_SET_TIP_SUCCESS:
			return {
				...state,
				showGuideModal: action.payload
			}
		case funnelAllTypes.INIT_STATE:
			return initialState
		default:
			return state
	}
}

export default funnelAllReducers;
