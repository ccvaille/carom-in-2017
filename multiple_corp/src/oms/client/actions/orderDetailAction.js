import fetch from '../utils/fetch';
import isoFetch from 'isomorphic-fetch';
import {message} from 'antd';
import {OD_KEYWORDS_CHANGE,OD_SHOW_CONFIRM_CHANGE,OD_PAGE_CHANGE,OD_AGENTTYPE_CHANGE,OD_TYPE_CHANGE,OD_EPACKAGETYPE_CHANGE,OD_YPACKAGETYPE_CHANGE,OD_ZPACKAGETYPE_CHANGE,OD_DATE_CHANGE,OD_SEARCH_TEXT_CHANGE,OD_FETCH_SEARCH_REQUEST,OD_ADDRESS_CHANGE,OD_FETCH_FAILURE,OD_FETCH_SEARCH_FAILURE,OD_FETCH_SEARCH_SUCCESS} from '../constants/ActionTypes';

//搜索文字改变了
export const searchTextChange = (data)=>({
    type: OD_SEARCH_TEXT_CHANGE,
    payload: {searchText: data}
});

//搜索文字改变了的时候
export const keyWordsChange = (data)=>({
    type: OD_KEYWORDS_CHANGE,
    payload: {searchText: data}
});


//地区选择改变了
export const addressChange = (data)=>({
    type: OD_ADDRESS_CHANGE,
    payload: {
        province:data.province,
        city:data.city
    }
});

//显示导出提示框
export const showConfirm = (data)=>({
    type: OD_SHOW_CONFIRM_CHANGE,
    payload: {
        isShowConfirm:data.isShowConfirm
    }
});

//时间改变了
export const dateChange = (data)=>({
    type: OD_DATE_CHANGE,
    payload: {
        startDate:data.startDate,
        endDate:data.endDate,
        dateType:data.dateType
    }
});

//类型改变了
export const typeChange = (data)=>({
    type: OD_TYPE_CHANGE,
    payload: {
        type:data.type
    }
});

//代理商类型改变了
export const agentTypeChange = (data)=>({
    type: OD_AGENTTYPE_CHANGE,
    payload: {
        type:data.type
    }
});

//ec套餐改变了
export const ePackageTypeChange = (data)=>({
    type: OD_EPACKAGETYPE_CHANGE,
    payload: {
        type:data.type
    }
});

//硬件设备改变了
export const yPackageTypeChange = (data)=>({
    type: OD_YPACKAGETYPE_CHANGE,
    payload: {
        type:data.type
    }
});

//增值服务改变了
export const zPackageTypeChange = (data)=>({
    type: OD_ZPACKAGETYPE_CHANGE,
    payload: {
        type:data.type
    }
});

//表格跳转页码
export const pageChange = (data)=>({
    type: OD_PAGE_CHANGE,
    payload: {
        current:data.current,
        pageSize:data.pageSize
    }
});

//搜索
export const fetchSearch = (params={})=>dispatch => {
    let paramsStr='?';
    for(var i in params){
        if(params[i]!==undefined){
            paramsStr+=(i+'='+params[i]+'&');
        }
    }
    return fetch("https://oms.workec.com/order/index/orderdetail"+paramsStr, "get").then(json => {
        if(json.code==200){
            dispatch({
                type: OD_FETCH_SEARCH_SUCCESS,
                payload: {
                    current:json.page.curr,
                    pageData:json.data,
                    shopOrderNum:json.extra.buy,
                    upgradeOrderNum:json.extra.upgrade,
                    renewOrderNum:json.extra.renew,
                    totalOrderNum:json.page.totalcount,
                    totalPrice:json.extra.money
                }
            });
        }
        else{
            dispatch({
                type: OD_FETCH_SEARCH_FAILURE,
                payload: json
            });
        }

    });
};



const fetchNew = (url, type, body) => {
    var reqHeader = {
        credentials: 'include',
        method: type,
        // mode: 'no-cors',
        headers: {
            // "X-Requested-With": "XMLHttpRequest",
            // 'Content-Type':'text/plain'
        }
    };
    if (reqHeader.method === "post") {
        // reqHeader.headers['Content-Type'] = 'text/plain';
        // reqHeader.headers['Content-Type'] = 'application/json';
        reqHeader.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        // reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
        // reqHeader.body = new FormData(body);

        // reqHeader.body = body;
        reqHeader.body = JSON.stringify(body);
    }
    return isoFetch(url, reqHeader).then(res=>{
        if (res.status >= 200 && res.status < 300) {
            return res.json()
        }else if (res.status === 401) {
            location.href = "//corp.workec.com";
        } else if (res.status === 403) {
            message.error('您没有权限！');
        } else if (res.status === 500) {
            message.error('服务器内部错误，请稍后再试！');
        } else if (res.status === 404) {
            message.error('接口返回错误！');
        }else if (res.status === 302) {
            location.href = "/login/guide";
        }
    });
};

//导出
export const fetchExport = (params={})=>dispatch => {
    let queryStr='';
    // for(var i in params){
    //     if(params[i]!==undefined&&params[i]!==''){
    //         queryStr+=(i+'='+params[i]+'&');
    //     }
    // }
    for(var i in params){
        if(params[i]!==undefined){
            queryStr+=(i+'='+params[i]+'&');
        }
    }

    let req={
        from:9,
        query_string:queryStr
    };


    return fetchNew("https://admin.workec.com/default/index/asyncexport", "post",req).then(json => {
        if(json.code==0){
            dispatch(showConfirm({
                isShowConfirm:false
            }));
            message.success('导出成功！');
        }
        else{
            dispatch({
                type: OD_FETCH_SEARCH_FAILURE,
                payload: json
            });

        }
    });
};
