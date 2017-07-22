import {
    FETCH_CHANNEL_REQUEST,
    FETCH_CHANNEL_FAILURE,
    FETCH_CHANNEL_SUCCESS,
    FETCH_CHANNEL_DISABLEDDATE_REQUEST,
    FETCH_CHANNEL_DISABLEDDATE_FAILURE,
    FETCH_CHANNEL_DISABLEDDATE_SUCCESS,
    CHANNEL_DATE_CHANGE
} from '../constants/actionTypes.js'
import fetch from 'isomorphic-fetch';
import {message} from 'antd';
import Cookie from 'react-cookie';


//时间改变
export const channelDateChange = (startDate, endDate) => ({
    type: CHANNEL_DATE_CHANGE,
    payload: {
        startDate: startDate,
        endDate: endDate
    }
});

//开始获取渠道数据
export const fetchChannelRequest = () => ({
    type: FETCH_CHANNEL_REQUEST
});

//获取渠道数据成功
export const fetchChannelSuccess = (data) => ({
    type: FETCH_CHANNEL_SUCCESS,
    payload: data
});

//获取渠道数据失败
export const fetchChannelFailure = () => ({
    type: FETCH_CHANNEL_FAILURE
});

//获取渠道统计数据
export const fetchChannel = (startDate, endDate)=>dispatch=> {
    dispatch(fetchChannelRequest());
    let bodyData = JSON.stringify({
        'startdate': startDate,
        'enddate': endDate
    });

    let url = '/work/channel/view?startdate=' + startDate + '&enddate=' + endDate;
    return fetch(url, {
        method: 'GET',
        mode: 'no-cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': Cookie.load('XSRF-TOKEN'),
            'X-Requested-With': "XMLHttpRequest"
        },
        // body:bodyData
    })
        .then(response=> {
            if (response.status === 401) {
                location.href = "//corp.workec.com";
            } else if (response.status === 403) {
                message.error('您没有权限！');
            } else if (response.status === 500) {
                message.error('服务器内部错误，请稍后再试！');
            } else if (response.status === 404) {
                message.error('接口返回错误！');
            } else if (response.status == 200) {
                return response.json();
            }
        })
        .then(json => dispatch(fetchChannelSuccess(json.data)))
        .catch(err=> {
            message.error('服务器异常')
        });
};



