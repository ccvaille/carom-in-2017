import * as actionTypes from 'constants/crmstageTypes';
import { CLEAR_STATE, DATA_LOADING } from 'actions/comm'


const defaultState = {
    status: 2,
    stages: [
        '', '', '', ''
    ],
    dataLoading: true,
    tipShow: false
}

export default function crmstageReducer(state = defaultState, action) {
    switch(action.type) {
        case actionTypes.GET_STAGE_DATA:
            return {
                ...state,
                status: action.data.status,
                stages: action.data.stages.map((stage) => stage.name),
                dataLoading: false
            }
        case CLEAR_STATE:
            return {
                ...defaultState
            }
        case actionTypes.SWITCH_STAGE:
            return {
                ...state,
                status: action.status
            }
        case actionTypes.SET_STAGE:
            return {
                ...state,
                status: action.status
            }
        case actionTypes.GET_TIP_STATE:
            return {
                ...state,
                tipShow: action.data.num == 0
            }
        case actionTypes.SET_TIP_STATE:
            return {
                ...state,
                tipShow: false
            }
        default:
            return state
    }
}