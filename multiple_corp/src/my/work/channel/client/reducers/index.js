import {combineReducers} from 'redux';
import {message} from 'antd';
import {TEST} from '../actions';
import channelData from './channelReducer'

const demoInitialState = {
    string: 'demoInitialState',
    arr: [],
    tabIndex: 1,
    config: "",
};


const historyInitialState = {
    string: 'historyInitialState',
    arr: [],
    tabIndex: 1,
    config: "",
};


const employeeInitialState = {
    string: 'employeeInitialState',
    arr: [],
    tabIndex: 1,
    config: "",
};

function dailyData(state = {}, action) {
    const newState = Object.assign({}, demoInitialState, state);

    switch (action.type) {
        case TEST:
            newState.string = TEST;
            break;
        case 'CHANGE_TAB_INDEX':
            newState.tabIndex = action.index;
            break;
        case 'DAILY_DATA_READY':
            newState.config = action.data;
            break;
        case 'DAILY_CLEAR_DATA':
            newState.config = "";
            break;
        default:
            break;
    }

    return newState;
}

function historyData(state = {}, action) {
    const newState = Object.assign({}, historyInitialState, state);

    switch (action.type) {
        case TEST:
            newState.string = TEST;
            break;
        case 'CHANGE_HISTORY_TAB_INDEX':
            newState.tabIndex = action.index;
            break;
        case 'HISTORY_DATA_READY':
            newState.config = action.data;
        case 'HISTORY_CLEAR_DATA':
            newState.config = "";
            break;
        default:
            break;
    }

    return newState;
}



function employeeData(state = {}, action) {
    const newState = Object.assign({}, employeeInitialState, state);

    switch (action.type) {
        case TEST:
            newState.string = TEST;
            break;
        case 'EMPLOYEE_CHANGE_TAB':
            newState.tabIndex = action.index;
            break;
        case 'EMPLOYEE_DATA_READY':
            newState.config = action.data;
        case 'EMPLOYEE_CLEAR_DATA':
            newState.config = "";
            break;
        default:
            break;
    }

    return newState;
}


//将两个reducer合并成一个reducer,也就将全局的state加上postsByReddit,selectedReddit两个属性，每个属性都有自己的state
const rootReducer = combineReducers({
    dailyData,
    historyData,
    employeeData,
    channelData
});

export default rootReducer
