import { combineReducers } from 'redux';
import { message } from 'antd';
import { actions } from '../actions/broadcast';
import { checkCode, commonMessageReady } from './comm';
import { actions as commActions } from '../actions/comm';

const InitialData = {
    userid: '',
    list: [],
    curpage: 1,
    end: 0,
    needShowIndex: 0,//需要滚动到当前窗口的dom索引
    loading: true,
    emptyError: false,//首屏出错，空数据
};


function reducer(state = {}, action) {
    var newState = Object.assign({}, InitialData, state);
    var json = action ? action.json : '';
    checkCode(state, json);

    switch (action.type) {
        case actions['DATA_READY']:
            newState = commonMessageReady(state, newState, action);
            break;
        case actions['LOADING']:
            newState.loading = true;
        case commActions['RESET']:
            newState.needShowIndex = 0;
            break;
    }
    return newState;
}

export default reducer
