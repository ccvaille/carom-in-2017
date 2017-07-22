import { combineReducers } from 'redux';
import { message } from 'antd';
import { actions } from '../actions/share';
import { checkCode, commonMessageReady } from './comm';
import { actions as commActions } from '../actions/comm';
import { broadCastToAllPage } from './index';

const InitialData = {
    userid: '',
    list: [],
    curpage: 1,
    end: 0,
    needShowIndex: 0,//需要滚动到当前窗口的dom索引
    loading: true,
    emptyError: false,//首屏出错，空数据
    reqData: ''//正在处理的请求数据
};

function reducer(state = {}, action) {
    var newState = Object.assign({}, InitialData, state);
    var json = action ? action.json : '';
    checkCode(state, json);

    switch (action.type) {
        case actions['DATA_READY']:
            newState = commonMessageReady(state, newState, action);
            break;
        case actions['SET_REQ_DATA']:
            newState.reqData = action.reqData;
            break;
        case actions['LOADING']:
            newState.loading = true;
            break;
        case actions['OPERATE_REQUEST']:
            var reqid = newState.reqData.reqid;
            var act = newState.reqData.act;

            if (json.code == 0) {
                newState.list.forEach(function (item, index) {
                    if (item.f_req_id == reqid) {
                        item.f_status = act;
                    }
                });
                //通知到其他页面
                broadCastToAllPage({
                    reqid: reqid,
                    act: act
                });
            }
            newState.reqData = '';

            break;
        case commActions['RESET']:
            newState.needShowIndex = 0;
            break;
    }
    return newState;
}

export default reducer