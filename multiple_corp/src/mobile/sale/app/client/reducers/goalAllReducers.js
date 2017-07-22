import * as goalAllTypes from 'constants/goalAllTypes';


const initialState = {
	year:(new Date()).getFullYear().toString(),
	month:((new Date()).getMonth()+1).toString(),
	dept:{
		
	},
	pageData:[],
	goalData:{
		tree:[]
	},
	auth:{

	},
	isMore:false,
	pageIndex:0,
	pageSize:15,
	fetching:false
};

function goalReducers(state = initialState, action) {
	switch(action.type) {
		case goalAllTypes.PAGE_CHANGE:
			var _pageData=[];
			var _isMore=true;
			if(state.goalData.tree&&state.goalData.tree.length>1){
				_pageData = state.goalData.tree.slice(0,state.pageSize*(action.payload+1));
				if((state.goalData.tree.length - _pageData.length)<15){
					_isMore=false;
				}
			}
			else if(state.goalData.tree&&state.goalData.tree.length==1&&state.goalData.tree[0].children&&state.goalData.tree[0].children.length>0){
				_pageData =state.goalData.tree[0].children.slice(0,state.pageSize*(action.payload+1));
				if((state.goalData.tree[0].children.length - _pageData.length)<15){
					_isMore=false;
				}
			}
			
			return {
				...state,
				pageData:_pageData,
				isMore:_isMore,
				pageIndex:action.payload
			}
			
		case goalAllTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case goalAllTypes.FETCH_AUTH_SUCCESS:
			return {
				...state,
				auth: action.payload
			}
		case goalAllTypes.FILTER_CHANGE:
			return {
				...state,
				...action.payload,
			}
		case goalAllTypes.FETCH_GOAL_SUCCESS:
			var _pageData=[];
			if(action.payload.tree&&action.payload.tree.length>1){
				_pageData = action.payload.tree.slice(0,state.pageSize*(state.pageIndex+1));
			}
			else if(action.payload.tree&&action.payload.tree.length==1&&!action.payload.tree[0].children){
				_pageData = action.payload.tree.slice(0,state.pageSize*(state.pageIndex+1));
			}
			else if(action.payload.tree&&action.payload.tree.length==1&&action.payload.tree[0].children&&action.payload.tree[0].children.length>0){
				_pageData =action.payload.tree[0].children.slice(0,state.pageSize*(state.pageIndex+1));
			}
			var _isMore=true;
			if(_pageData.length<15){
				_isMore=false;
			}
			return {
				...state,
				goalData: action.payload,
				pageData:_pageData,
				isMore:_isMore,
				fetching:false
			}
		case goalAllTypes.INIT_STATE:
			return initialState
		default:
			return state
	}
}

export default goalReducers;
