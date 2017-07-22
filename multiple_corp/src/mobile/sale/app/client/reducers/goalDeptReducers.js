import * as goalDeptTypes from 'constants/goalDeptTypes';

const initialState = {
	pageData:[],
	goalData:{
		tree:[]
	},
	isMore:false,
	pageIndex:0,
	pageSize:15,
	fetching:false
};

function goalDeptReducers(state = initialState, action) {
	switch(action.type) {
		case goalDeptTypes.PAGE_CHANGE:
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
			
		case goalDeptTypes.FETCHING:
			return {
				...state,
				fetching:true
			}
		case goalDeptTypes.FETCH_AUTH_SUCCESS:
			return {
				...state,
				auth: action.payload
			}
		case goalDeptTypes.FILTER_CHANGE:
			return {
				...state,
				...action.payload
			}
		case goalDeptTypes.FETCH_GOAL_SUCCESS:
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
		case goalDeptTypes.INIT_STATE:
			return initialState
		default:
			return state
	}
}

export default goalDeptReducers;
