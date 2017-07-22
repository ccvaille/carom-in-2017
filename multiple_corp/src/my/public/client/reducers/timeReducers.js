import * as messageTypes from 'constants/messageTypes';
const initialState = {
    time: ['12:30', '12:30']
}

function timeReducers(state = initialState, action) {
    switch(action.type) {
        case messageTypes.GET_DEFAULT_TIME:  
            return {
                ...state,
                time: getDefaultTime(action.payload)
            }
        case messageTypes.CHANGE_TIME:
            var time = [];
            if (Array.isArray(action.payload)) {
                time = [].concat(action.payload)
            } else {
                time = [].concat(state.time);
                time[action.payload.index] = action.payload.time;

            }
            return {
                ...state,
                time: time
            }
        default:
            return state
    }
}
function getDefaultTime(data) {
    var time = ['12:30', '12:30'];
    var setting = data.settings; 
    if (setting[1]) {
        time[0] = setting[1] ? setting[1].f_time : '12:30';
    }
    if (setting[2]) {
        time[1] = setting[2] ? setting[2].f_time : '12:30';
    }
    return time;
}
export default timeReducers;