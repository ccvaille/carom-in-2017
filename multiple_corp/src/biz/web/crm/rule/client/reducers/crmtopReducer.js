import * as actionTypes from 'constants/crmtopTypes'
import {CLEAR_STATE} from 'actions/comm'

const defaultState = {
    ison: 2,
    limit: 0, 
    stageStatus: 0,  //客户阶段打开状态
    isUserDefined: false,  //是否为自定义
    dataLoading: true
}

export default function crmtopReducer(state = defaultState, action) {
    switch(action.type) {
        case actionTypes.CHECK_IF_LIMIT:
            var isUserDefined = false;
            if(![0, 100, 200, 300, 400].includes(parseInt(action.data.limit))) {
                isUserDefined = true;
            }
            return {
                ...state,
                ison: action.data.ison,
                limit: action.data.limit,
                stageStatus: action.data.isstep,
                isUserDefined: isUserDefined,
                dataLoading: false
            }
        case actionTypes.SWITCH_USE_STATE:
            return {
                ...state,
                ison: action.ison,
                limit: action.limit
            }
        case CLEAR_STATE:
            return {
                ...defaultState
            }
        default:
            return state
    }
}