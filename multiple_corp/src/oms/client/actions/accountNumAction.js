import fetch from '../utils/fetch'
import { message, Button } from 'antd';
import {AN_TREND_YEAR_CHANGE,AN_LOSS_YEAR_CHANGE,AN_FETCH_TREND_SUCCESS,AN_FETCH_LOSS_SUCCESS,FETCH_FAILURE} from '../constants/ActionTypes'

//趋势时间改变了
export const trendYearChange = (data)=>({
    type: AN_TREND_YEAR_CHANGE,
    payload: {
        year:data.year
    }
});

//流失率时间改变了
export const lossYearChange = (data)=>({
    type: AN_LOSS_YEAR_CHANGE,
    payload: {
        year:data.year
    }
});

//增长趋势
export const fetchTrend = (params={})=>dispatch => {
    let paramsStr='';
    if(params.time){
        paramsStr+=('?time='+params.time)
    }
    return fetch("https://oms.workec.com/buy/index/grtrend"+paramsStr, "get").then(json => {
        if(json.code==200){
            dispatch({
                type: AN_FETCH_TREND_SUCCESS,
                payload: {
                    data:json.data||[]
                }
            });
        }
        else{
            dispatch({
                type: FETCH_FAILURE,
                payload: {
                    msg:json.msg
                }
            });
        }
    });
};

//流失率
export const fetchLoss = (params={})=>dispatch => {
    let paramsStr='';
    if(params.time){
        paramsStr+=('?time='+params.time)
    }
    return fetch("https://oms.workec.com/buy/index/acloss"+paramsStr, "get").then(json => {
        if(json.code==200){
            dispatch({
                type: AN_FETCH_LOSS_SUCCESS,
                payload: {
                    data:json.data||[]
                }
            });
        }
        else{
            dispatch({
                type: FETCH_FAILURE,
                payload: {
                    msg:json.msg
                }
            });
        }

    });
};
