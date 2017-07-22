import {combineReducers} from 'redux';
import {message} from 'antd';
import {
    TEST
} from '../actions/demo.js';

const initialState = {
    string: 'string',
    arr: []
};

//废弃、接收到、开始接受新闻后，将state.postsByReddit设为相关参数
function demo(state = {}, action) {
    const newState = Object.assign({}, initialState, state);

    switch (action.type) {
        case TEST:
            newState.string = TEST;
            break;
        default:
            break;
    }

    return newState;
}


//将两个reducer合并成一个reducer,也就将全局的state加上postsByReddit,selectedReddit两个属性，每个属性都有自己的state
const rootReducer = combineReducers({
    demo
});

export default rootReducer
