import {
    CN_LOSS_YEAR_CHANGE,
    CN_TREND_YEAR_CHANGE,
    CN_FETCH_TREND_SUCCESS,
    CN_FETCH_LOSS_SUCCESS,
    CN_FETCH_RETAIN_SUCCESS,
    FETCH_FAILURE,
    CN_DATE_CHANGE
} from '../constants/ActionTypes'
import moment from 'moment';

let currentYear=(new Date()).getFullYear().toString();

const initialState = {
    tYear:currentYear,
    tData:[],
    lYear:currentYear,
    lData:[],
    rData:[],
    isFetching:true,
    startDate:moment().startOf('year').format('YYYY-MM-DD'),
    endDate:moment().format('YYYY-MM-DD'),
    dateType:4
};

const companyNum=(state = initialState,action)=>{
    let newState=Object.assign({},state);
    switch (action.type){
        case CN_TREND_YEAR_CHANGE:
            newState.tYear=action.payload.year;
            newState.tData=[];
            newState.isFetching=true;
            break;
        case CN_LOSS_YEAR_CHANGE:
            newState.lYear=action.payload.year;
            newState.lData=[];
            newState.isFetching=true;
            break;
        //时间改变了
        case CN_DATE_CHANGE:
            newState.startDate=action.payload.startDate;
            newState.endDate=action.payload.endDate;
            newState.dateType=action.payload.dateType;
            newState.rData=[];
            newState.isFetching=true;
            break;
        case CN_FETCH_TREND_SUCCESS:
            newState.tData=action.payload.data;
            newState.isFetching=false;
            break;
        case CN_FETCH_LOSS_SUCCESS:
            newState.lData=action.payload.data;
            newState.isFetching=false;
            break;
        case CN_FETCH_RETAIN_SUCCESS:
            newState.rData=action.payload.data;
            newState.isFetching=false;
            break;

    }
    return newState;
};

export {companyNum};