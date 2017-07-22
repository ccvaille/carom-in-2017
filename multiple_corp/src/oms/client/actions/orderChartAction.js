import fetch from '../utils/fetch'
import { message, Button } from 'antd';
import {OC_SEARCH_TEXT_CHANGE,OC_FETCH_SEARCH_REQUEST,OC_FETCH_SEARCH_FAILURE,OC_FETCH_SEARCH_SUCCESS,OC_ADDRESS_CHANGE,OC_YEAR_CHANGE} from '../constants/ActionTypes'

//搜索文字改变了
export const searchTextChange = (data)=>({
    type: OC_SEARCH_TEXT_CHANGE,
    payload: {searchText: data}
});

//地区选择改变了
export const addressChange = (data)=>({
    type: OC_ADDRESS_CHANGE,
    payload: {
        province:data.province,
        city:data.city
    }
});

//时间改变了
export const yearChange = (data)=>({
    type: OC_YEAR_CHANGE,
    payload: {
        year:data.year
    }
});


//搜索
export const fetchSearch = (params)=>dispatch => {

    let paramsStr='?';
    for(var i in params){
        if(params[i]!==undefined&&params[i]!==''){
            paramsStr+=(i+'='+params[i]+'&');
        }
    }
    return fetch("https://oms.workec.com/order/index/analysisdiagram"+paramsStr, "get").then(json => {
        if(json.code==200){
            dispatch({
                type: OC_FETCH_SEARCH_SUCCESS,
                payload: {
                    data:json.data||[]
                }
            });
        }
        else{
            dispatch({
                type: OC_FETCH_SEARCH_FAILURE,
                payload: {
                    msg:json.msg
                }
            });
        }
    });
};
