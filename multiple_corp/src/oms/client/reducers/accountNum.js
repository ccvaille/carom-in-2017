import {AN_TREND_YEAR_CHANGE,AN_LOSS_YEAR_CHANGE,AN_FETCH_TREND_SUCCESS,AN_FETCH_LOSS_SUCCESS,FETCH_FAILURE} from '../constants/ActionTypes';

let currentYear=(new Date()).getFullYear().toString();

const initialState = {
    tYear:currentYear,
    tData:[],
    lYear:currentYear,
    lData:[],
    isFetching:true,
};

const accountNum=(state = initialState,action)=>{
    let newState=Object.assign({},state);
    switch (action.type){
        case AN_TREND_YEAR_CHANGE:
            newState.tYear=action.payload.year;
            newState.tData=[];
            newState.isFetching=true;
            break;
        case AN_LOSS_YEAR_CHANGE:
            newState.lYear=action.payload.year;
            newState.lData=[];
            newState.isFetching=true;
            break;
        case AN_FETCH_TREND_SUCCESS:
            newState.tData=action.payload.data;
            newState.isFetching=false;
            break;
        case AN_FETCH_LOSS_SUCCESS:
            newState.lData=action.payload.data;
            newState.isFetching=false;
            break;

    }
    return newState;
};

export {accountNum};