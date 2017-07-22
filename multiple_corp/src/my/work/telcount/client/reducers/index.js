import {combineReducers} from 'redux';
import {message} from 'antd';

const demoInitialState = {
    string: 'demoInitialState',
    isPerson: ISPERSON,
    tabIndex: 1,
    data: "",  //接口数据
    selected: [],
};


const historyInitialState = {
    string: 'historyInitialState',
    isPerson: ISPERSON,
    tabIndex: 1,
    data: "",  //接口数据
    dateType: 0,
    startdate: "",
    enddate: "",
    selected: [],
    callMode: 0, //通话方式(0 全部、1呼出、2 呼入 默认0)
    callCategory: 0, //电话分类(0全部、1座机、2 EC云呼 默认0)   
    callTimeType: 0, //通话时长(0全部、1(0秒)、2(1-30秒)、3(31-60秒)、4(61-180秒)、5(180秒以上))   
};


const employeeInitialState = {
    string: 'employeeInitialState',
    data: "",  //接口数据
    tabIndex: 1,
    selected: [],
    startdate: "",
    enddate: "",
    dateType: 0,
    piArr: [],
    pi: 1,
    tips: '',
    rankTips: '',
    rank_sort: 0,  //0：未排序1:正序2:倒序
    num_sort: 0,
    change_sort: 0,
    num: 0,
    callpercent: 0,
    calltime: 0,
    contact: 0,
    timeaverage: 0,
};

const exportInitialState = {
    exportData: {},
    ischange: 0,
}

function dailyData(state = {}, action) {
    const newState = Object.assign({}, demoInitialState, state);

    switch (action.type) {
        case 'CHANGE_TAB_INDEX':
            newState.tabIndex = action.index;
            break;
        case 'DAILY_DATA_READY':
            newState.config = action.data;
            break;
        case 'DAILY_CLEAR_DATA':
            newState.data = "";
            break;
        case 'CHANGE_TODAY_DATA':
            newState.data = action.data;
            break;  
        case 'TODAY_EXPORT_MSG':
            newState.exportMsg = action.exportMsg;
            newState.exportIndex = +new Date();
            break;  
        case 'CHANGE_TODAY_SELECT':
            const arr = newState.selected;
            if(action.operate == "add"){
                return {
                    ...state,
                    selected: newState.selected.concat(action.obj)
                }
            }else if(action.operate == "del"){
                const arr2 = [];
                for(var i = 0; i < arr.length ; i ++){
                    if(i == action.index){
                        continue;
                    }
                    arr2.push(Object.assign({}, arr[i]));
                }
                return {
                    ...state,
                    selected: arr2
                }
            }else{
                return {
                    ...state,
                    selected: []
                }
            }
            break;                                         
        default:
            break;
    }
    return newState;
}

function historyData(state = {}, action) {
    const newState = Object.assign({}, historyInitialState, state);

    switch (action.type) {
        case 'CHANGE_HISTORY_DATA': 
            newState.data = action.data;
            break;
        case 'HISTORY_CLEAR_DATA':
            newState.data = "";
            break;            
        case 'CHANGE_HISTORY_TAB_INDEX':
            newState.tabIndex = action.index;
            break;
        case 'CHANGE_HISTORY_TIMETAB':
            newState.dateType = action.index;
            break;   
        case 'HISTORY_EXPORT_MSG':
            newState.exportMsg = action.exportMsg;
            newState.exportIndex = +new Date();
            break; 
        case 'CHANGE_HISTORY_SELECT':
            const arr = newState.selected;
            if(action.operate == "add"){
                return {
                    ...state,
                    selected: newState.selected.concat(action.obj)
                }
            }else if(action.operate == "del"){
                const arr2 = [];
                for(var i = 0; i < arr.length ; i ++){
                    if(i == action.index){
                        continue;
                    }
                    arr2.push(Object.assign({}, arr[i]));
                }
                return {
                    ...state,
                    selected: arr2
                }
            }else{
                return {
                    ...state,
                    selected: []
                }
            }
            break;               
        case 'CHANGE_HISTORY_BEGINANDEND':
            newState.startdate = action.obj.startdate;
            newState.enddate = action.obj.enddate;
            break; 
        case 'CHANGE_HISTORY_TYPE':
            if(action.data.type == "mode"){
                newState.callMode = action.data.value;
            }else if(action.data.type == "cate"){
                newState.callCategory = action.data.value;
            }else{
                newState.callTimeType = action.data.value;
            }
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
        case 'EMPLOYEE_CHANGE_TAB':
            newState.tabIndex = action.index;
            break;
        case 'CHANGE_RANK_TIMETAB':
            newState.dateType = action.index;
            break;   
        case 'CHANGE_RANK_BEGINANDEND':
            newState.startdate = action.obj.startdate;
            newState.enddate = action.obj.enddate;
            break;  
        case 'RANK_EXPORT_MSG':
            newState.exportMsg = action.exportMsg;
            newState.exportIndex = +new Date();
            break;                       
        case 'CHANGE_RANK_DATA': 
            const _piArr = [];
            let _pi = 1;
            for (let i = 0; i < action.data.data.list.length; i = i + 6) {
                _piArr.push(_pi);
                _pi++;
            }
            newState.table = action.data.data;  
            newState.data = action.data.data.list;
            newState.tips = action.data.data.tips;
            newState.rankTips = action.data.data.datetips;  
            newState.piArr = _piArr;      
            break;
        case 'EMPLOYEE_CLEAR_DATA':
            newState.data = "";
            newState.pi = 1;
            newState.tips = "";
            newState.rankTips = "";
            newState.piArr = [];
            newState.rank_sort = 0;
            newState.num_sort = 0;
            newState.change_sort = 0;
            break;
        case 'CHANGE_HISTORY_BEGINANDEND':
            newState.startdate = action.obj.startdate;
            newState.enddate = action.obj.enddate;
            break;             
        case 'CHANGE_RANK_SELECT':
            const arr = newState.selected;
            if(action.operate == "add"){
                return {
                    ...state,
                    selected: newState.selected.concat(action.obj)
                }
            }else if(action.operate == "del"){
                const arr2 = [];
                for(var i = 0; i < arr.length ; i ++){
                    if(i == action.index){
                        continue;
                    }
                    arr2.push(Object.assign({}, arr[i]));
                }
                return {
                    ...state,
                    selected: arr2
                }
            }else{
                return {
                    ...state,
                    selected: []
                }
            }
            break;  
        case 'CHANGE_RANK_SORT':
            if(action.option == "up"){
                newState[action.key] = 1;
            }else{
                newState[action.key] = 2;
            }
            newState.data = sortData(newState.data, action.key, action.option);
            break; 
        case 'CHANGE_RANK_PI':
            newState.pi = action.index;          
        default:
            break;
    }

    return newState;
}

function exportData(state = {}, action) {
    const newState = Object.assign({}, exportInitialState, state);

    switch(action.type) {
        case 'CHANGE_EXPORT_MSG':
            newState.exportData = action.exportData;
            newState.ischange = +new Date();
        default: 
            break;
    }

    return newState;
}
const sortData = (data, key, option) => {
    const backData = [];
    const map = {
        rank_sort: 'id',
        // num_sort: 'value',
        num: 'num',
        callpercent: 'callpercent',
        calltime: 'calltime',
        contact: 'contact',
        timeaverage: 'timeaverage',
        // change_sort: 'rank'
    }
    if(option == "up"){
        data.sort((a, b) => {
            return parseInt(a[map[key]], 10) - b[map[key]];
        })
    }else{
        data.sort((a, b) => {
            return parseInt(b[map[key]], 10) - a[map[key]];
        })  
    }
    data.map((item, index) => {
        backData.push(Object.assign({}, item));
    })
    return backData;
}


//将两个reducer合并成一个reducer,也就将全局的state加上postsByReddit,selectedReddit两个属性，每个属性都有自己的state
const rootReducer = combineReducers({
    dailyData,
    historyData,
    employeeData,
    exportData
});

export default rootReducer
