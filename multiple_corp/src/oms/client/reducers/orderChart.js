
import {OC_SEARCH_TEXT_CHANGE,OC_FETCH_SEARCH_REQUEST,OC_FETCH_SEARCH_FAILURE,OC_FETCH_SEARCH_SUCCESS,OC_ADDRESS_CHANGE,OC_YEAR_CHANGE} from '../constants/ActionTypes';

let currentYear=(new Date()).getFullYear().toString();

const initialState = {
    searchText:'',
    year:currentYear,
    province:'',
    city:'',
    isFetching:true,
    data:[]
};

const orderChart=(state = initialState,action)=>{
    let newState=Object.assign({},state);
    switch (action.type){
        case OC_SEARCH_TEXT_CHANGE:
            newState=initialState;
            newState.searchText=action.payload.searchText;
            break;
        case OC_FETCH_SEARCH_SUCCESS:
            newState.data=action.payload.data;
            newState.isFetching=false;
            break;
        case OC_ADDRESS_CHANGE:
            newState.data=[];
            newState.isFetching=true;
            newState.province=action.payload.province;
            newState.city=action.payload.city;
            break;
        case OC_YEAR_CHANGE:
            newState.data=[];
            newState.isFetching=true;
            newState.year=action.payload.year;
            break;
    }
    return newState;
};

export {orderChart};