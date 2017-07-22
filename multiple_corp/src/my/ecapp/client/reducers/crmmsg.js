import { combineReducers } from 'redux';
import { message } from 'antd';
import { actions } from '../actions/crmmsg';
import { checkCode, commonMessageReady } from './comm';
import { actions as commActions } from '../actions/comm';
import { broadCastToAllPage } from './index';

const InitialData = {
    userid: '',
    list: [],
    curpage: 1,
    end: 1,
    needShowIndex: 0,//需要滚动到当前窗口的dom索引
    loading: true,
    emptyError: false,//首屏出错，空数据
    reqData: '',//正在处理的请求数据
    crmType: 0
};

function reducer(state = {}, action) {
    var newState = Object.assign({}, InitialData, state);
    var json = action ? action.json : '';
    checkCode(state, json);

    switch (action.type) {
        case actions['DATA_READY']:
            // newState = commonMessageReady(state, newState, action);
            
            var json = action.json;
            var index = json.data.length - 2;
            var list = action.isFirstPage ? json.data.reverse() : json.data.reverse().concat(newState.list);
            if (index <= -1) {
                index = 1;
            }
            if (list.length <= 1) {
                index = list.length - 1;
            }
            if (json.code == 401) {
                return state;
            }
            if (json.code != 200) {//后台出错
                newState.loading = false;
            } else {
                newState = Object.assign({}, state, {
                    userid: json.userid || '',
                    list: list,
                    end: json.is_have_next,
                    loading: false,
                    isFirstPage: action.isFirstPage,
                    crmType: action.crmType,
                    // curpage: json.page.curpage,
                    needShowIndex: index
                });
            }
            if (json.code != 200 && newState.list.length == 0) {
                newState.emptyError = true;
            } else {
                newState.emptyError = false;
            }
            break;
        case actions['SET_REQ_DATA']:
            newState.reqData = action.reqData;
            break;
        case actions['LOADING']:
            newState.loading = true;
            if(newState.crmType != action.crmType) {
                newState.list = [];
            }
            break;
        case actions['OPERATE_REQUEST']:
            var msgId = newState.reqData.msg_id;
            var doType = newState.reqData.do_type;

            if (json.code == 200) {
                newState.list.forEach(function (item, index) {
                    if (item.id == msgId) {
                        item.dotype = doType;
                    }
                });
                //通知到其他页面
                broadCastToAllPage({
                    msg_id: msgId,
                    do_type: doType
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
