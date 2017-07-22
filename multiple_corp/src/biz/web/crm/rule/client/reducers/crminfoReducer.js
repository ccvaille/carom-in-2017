import * as actionTypes from 'constants/crminfoTypes';
import {CLEAR_STATE} from 'actions/comm'

const defaultState = {
    allUserData: [], //所有员工名单
    checkedUsers: [], //上限预警名单
    initUsers: [], //保存初始名单，以判断是否修改
    ison: 2, 
    initStatus: 2, //保存初始状态，以判断是否修改
    nums: 0, //已修改次数
    ban: 0, //是否可以修改 ， 1表示不能修改
    canSubmit: false,
    dataLoading: true,
    hasChange: false, //数据是否有修改
}

export default function crminfoReducer(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.LOAD_ALL_USERS:
            if (action.data == undefined) 
                return state;
            return {
                ...state,
                allUserData: action.data
            }
        case actionTypes.CHANGE_NOTICUSER_ITEM:
            var hasChange = false;
            const newArray = action.array.slice().sort(function(a,b) {
                return a.id - b.id
            });
            const oldArray = state.initUsers.slice().sort(function(a,b) {
                return a.id - b.id
            });

            if(newArray.length != oldArray.length) {
                hasChange = true;
            } else {
                for(let i = 0, j = newArray.length; i < j; i++) {
                    if(newArray[i].id != oldArray[i].id) {
                        hasChange = true;
                        break;
                    }
                }
            }
            return {
                ...state,
                checkedUsers: action.array,
                hasChange: hasChange
            }
        case actionTypes.GET_PROTECT_CHECK:
            let array = action.data.users.map(function (item) {
                    return {
                        id: item.f_user_id, 
                        name: item.f_name
                    };
                });
            return {
                ...state,
                ison: action.data.ison,
                initStatus: action.data.ison,
                checkedUsers: array,
                initUsers: array,
                nums: action.data.nums,
                ban: action.data.ban,
                canSubmit: true,
                dataLoading: false
            }
        case actionTypes.SWITCH_HIDE_STATE:
            return {
                ...state,
                ison: action.ison
            }
        case actionTypes.PROTECT_SAVE:
            return {
                ...state,
                ison: action.ison,
                initStatus: action.ison,
                hasChange: false,
                nums: action.data.nums,
                ban: action.data.ban,
            }
        case CLEAR_STATE:
            return {
                ...defaultState
            }
        default:
            return state;
    }
}
