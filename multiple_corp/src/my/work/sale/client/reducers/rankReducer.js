import * as ActionTypes from '../constants/ActionTypes'

const initialState={
    membersData:[],
    deptData:[],
    userRankData:{},
    deptRankData:{},
    loading:false
};

export default (state = initialState,action)=>{
    let newState;
    switch (action.type) {
        case ActionTypes.FETCHING:
            newState = {
                ...state,
                loading:true
            };
            return newState;
        case ActionTypes.FETCH_MEMBERS_SUCCESS:
            newState = {
                ...state,
                membersData: action.payload,
                loading:false
            };
            return newState;
        case ActionTypes.FETCH_DEPTS_SUCCESS:
            newState = {
                ...state,
                deptData: action.payload,
                loading:false
            };
            return newState;
        case ActionTypes.FETCH_USER_RANK_SUCCESS:
            newState = {
                ...state,
                userRankData:action.payload,
                loading:false
            };
            return newState;
        case ActionTypes.FETCH_DEPT_RANK_SUCCESS:
            newState = {
                ...state,
                deptRankData:action.payload,
                loading:false
            };
            return newState;
    }
    return {...state};
};
