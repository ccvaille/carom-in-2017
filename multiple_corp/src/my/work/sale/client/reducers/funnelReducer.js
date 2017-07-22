import * as ActionTypes from '../constants/ActionTypes'

const initialState={
    membersData:[],
    funnelData:{},
    billData:[],
    loading:false
};

export default (state = initialState,action)=>{
    let newState;
    switch (action.type) {
        case ActionTypes.FETCHING:
            newState = {
                ...state,
                billData:[],
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
        case ActionTypes.FETCH_FUNNEL_DATE_SUCCESS:
            newState = {
                ...state,
                funnelData:action.payload,
                loading:false
            };
            return newState;
        case ActionTypes.FETCH_BILL_DATA_SUCCESS:
            newState = {
                ...state,
                billData:action.payload,
                loading:false
            };
            return newState;
    }
    return {...state};
};
