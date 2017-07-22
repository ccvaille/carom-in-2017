import fetch from '../utils/fetch'

import {
    CN_LOSS_YEAR_CHANGE,
    CN_TREND_YEAR_CHANGE,
    CN_FETCH_TREND_SUCCESS,
    CN_FETCH_LOSS_SUCCESS,
    CN_FETCH_RETAIN_SUCCESS,
    FETCH_FAILURE,
    CN_DATE_CHANGE
} from '../constants/ActionTypes'


//时间改变了
export const dateChange = (data)=>({
    type: CN_DATE_CHANGE,
    payload: {
        startDate: data.startDate,
        endDate: data.endDate,
        dateType: data.dateType
    }
});

//趋势时间改变了
export const trendYearChange = (data)=>({
    type: CN_TREND_YEAR_CHANGE,
    payload: {
        year: data.year
    }
});

//流失率时间改变了
export const lossYearChange = (data)=>({
    type: CN_LOSS_YEAR_CHANGE,
    payload: {
        year: data.year
    }
});

//增长趋势
export const fetchTrend = (params = {})=>dispatch => {
    let paramsStr = '';
    if (params.time) {
        paramsStr += ('?time=' + params.time)
    }
    return fetch("https://oms.workec.com/buy/index/purbusiness" + paramsStr, "get").then(json => {
        if (json.code == 200) {
            dispatch({
                type: CN_FETCH_TREND_SUCCESS,
                payload: {
                    data: json.data || []
                }
            });
        }
        else {
            dispatch({
                type: FETCH_FAILURE,
                payload: {
                    msg: json.msg
                }
            });
        }
    });
};

//流失率
export const fetchLoss = (params = {})=>dispatch => {
    let paramsStr = '';
    if (params.time) {
        paramsStr += ('?time=' + params.time)
    }
    return fetch("https://oms.workec.com/buy/index/corploss" + paramsStr, "get").then(json => {
        if (json.code == 200) {
            dispatch({
                type: CN_FETCH_LOSS_SUCCESS,
                payload: {
                    data: json.data || []
                }
            });
        }
        else {
            dispatch({
                type: FETCH_FAILURE,
                payload: {
                    msg: json.msg
                }
            });
        }

    });
};


//留存率
export const fetchRetain = (params = {})=>dispatch => {
    let paramsStr = '';
    if (params.start) {
        paramsStr += ('?start=' + params.start)
    }
    if (params.end) {
        paramsStr += ('&end=' + params.end)
    }
    return fetch("https://oms.workec.com/buy/index/retain" + paramsStr, "get").then(json => {
        if (json.code == 200) {
            dispatch({
                type: CN_FETCH_RETAIN_SUCCESS,
                payload: {
                    data: json.data || []
                }
            });
        }
        else {
            dispatch({
                type: FETCH_FAILURE,
                payload: {
                    msg: json.msg
                }
            });
        }

    });
};
