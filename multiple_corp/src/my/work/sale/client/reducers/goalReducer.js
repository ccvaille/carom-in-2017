import * as ActionTypes from '../constants/ActionTypes'

const initialState={
    membersData:[],
    searchMembersData:[],
    searchText:'',
    goalData:{},
    goalStatData:{},
    yearRateData:[],
    loading:false,
    filterParams:{
        users:[],
        year:2017,
        month:'000'
    }
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
        case ActionTypes.GET_GOAL_SUCCESS:
            newState = {
                ...state,
                goalData:action.payload
            };
            return newState;
        case ActionTypes.FETCH_ALLGOAL_SUCCESS:
            newState = {
                ...state,
                allGoalData:action.payload,
                loading:false
            };
            return newState;
        case ActionTypes.FETCH_GOAL_STAT_SUCCESS:
            newState = {
                ...state,
                goalStatData:action.payload,
                loading:false
            };
            return newState;
        case ActionTypes.FETCH_YEAR_RATE_SUCCESS:
            newState = {
                ...state,
                yearRateData:action.payload
            };
            return newState;
        case ActionTypes.SET_GOAL_SUCCESS:
            newState = {
                ...state,
                goalData:{}
            };
            return newState;
    }
    return {...state};
};
