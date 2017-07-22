import * as stageTypes from 'constants/stageTypes';


const initialState = {
	dept:{
		name:'全部'
	},
	data:{},
	billList:[],
	isMore:false,
	pageIndex:1,
	pageSize:15,
	fetching:false
};

function stageReducers(state = initialState, action) {
	switch(action.type) {
		case stageTypes.FILTER_CHANGE:
			return {
				...state,
				...action.payload
			}
		case stageTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case stageTypes.PAGE_CHANGE:
			return {
				...state,
				pageIndex:action.payload
			}
		case stageTypes.INIT_STATE:
			return {
				...initialState,
				...action.payload
			}
		case stageTypes.FETCH_BILL_LIST_SUCCESS:
			var _isMore = state.isMore;
			if(state.pageIndex*action.payload.pagesize>=action.payload.total){
				_isMore = false;
			}
			else{
				_isMore = true;
			}
			return {
				...state,
				billList: state.pageIndex===1?action.payload.data:state.billList.concat(action.payload.data),
				isMore:_isMore,
				fetching:false
			}
		default:
			return state
	}
}

export default stageReducers;
