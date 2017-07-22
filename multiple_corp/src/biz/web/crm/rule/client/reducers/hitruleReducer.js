import * as actionTypes from 'constants/hitruleTypes';
import { CLEAR_STATE, DATA_LOADING } from 'actions/comm'


const defaultState = {
    status: 2,
    dataLoading: true
}

export default function crmstageReducer(state = defaultState, action) {
    switch(action.type) {
        case actionTypes.GET_HIT_RULE:
            return {
                ...state,
                status: action.data.status,
                dataLoading: false
            }
        case CLEAR_STATE:
            return {
                ...defaultState
            }
        case actionTypes.SWITCH_HIT_RULE:
            return {
                ...state,
                status: action.status
            }
        default:
            return state
    }
}