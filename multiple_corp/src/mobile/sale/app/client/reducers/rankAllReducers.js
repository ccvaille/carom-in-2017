import * as rankAllTypes from 'constants/rankAllTypes';


const initialState = {
	year:(new Date()).getFullYear().toString(),
	month:((new Date()).getMonth()+1).toString(),
	dept:{
		
	},
	auth:{
		
	},
	isMore:false,
	pageIndex:0,
	pageData:[],
	pageSize:15,
	tabIndex:0,
	rankData:{},
	fetching:false
};

function rankAllReducers(state = initialState, action) {
	switch(action.type) {
		case rankAllTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case rankAllTypes.FETCH_AUTH_SUCCESS:
			return {
				...state,
				auth: action.payload,
				
			}
		case rankAllTypes.SWITCH_TAB:
			return {
				...state,
				tabIndex: action.payload,
				rankData:{},
				pageIndex:0,
				pageData:[],
				isMore:false,
			}
		case rankAllTypes.FILTER_CHANGE:
			return {
				...state,
				...action.payload,
				rankData:{},
				pageIndex:0,
				pageData:[],
				isMore:false
			}
		case rankAllTypes.FETCH_USER_RANK_SUCCESS:
			var _pageData = state.pageData;
			var _isMore = true;
			if(action.payload.rank&&action.payload.rank.length>0){
				action.payload.rank.sort((a,b)=>{
					return b.money - a.money;
				});

				_pageData = action.payload.rank.slice(0,15);
				if((action.payload.rank.length - _pageData.length)<15){
					_isMore=false;
				}
			}
			
			return {
				...state,
				rankData: action.payload,
				isMore:_isMore,
				pageData:_pageData,
				fetching:false
			}
		case rankAllTypes.FETCH_DEPT_RANK_SUCCESS:
			var _pageData = state.pageData;
			var _isMore = true;
			if(action.payload.rank&&action.payload.rank.length>0){
				action.payload.rank.sort((a,b)=>{
					return b.money - a.money;
				});

				_pageData = action.payload.rank.slice(0,15);
				if((action.payload.rank.length - _pageData.length)<15){
					_isMore=false;
				}
			}
			return {
				...state,
				rankData: action.payload,
				isMore:_isMore,
				pageData:_pageData,
				fetching:false
			}
        case rankAllTypes.INIT_STATE:
			return initialState
		case rankAllTypes.PAGE_CHANGE:
			var _isMore = true;
			var _pageData = state.rankData.rank.slice(0,state.pageSize*(action.payload+1));
			if((state.rankData.rank.length - _pageData.length)<15){
				_isMore=false;
			}
			
			return {
				...state,
				pageData:_pageData,
				isMore:_isMore,
				pageIndex:action.payload
			}
		default:
			return state
	}
}

export default rankAllReducers;
