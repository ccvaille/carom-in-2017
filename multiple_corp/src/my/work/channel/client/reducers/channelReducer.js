import {
    FETCH_CHANNEL_REQUEST,
    FETCH_CHANNEL_FAILURE,
    FETCH_CHANNEL_SUCCESS,
    FETCH_CHANNEL_DISABLEDDATE_REQUEST,
    FETCH_CHANNEL_DISABLEDDATE_FAILURE,
    FETCH_CHANNEL_DISABLEDDATE_SUCCESS,
    CHANNEL_DATE_CHANGE
} from '../constants/actionTypes.js'



const initialState = {
    isFetching: false,
    startDate: '2016-11-28',
    endDate: '2016-11-31',
    data: [],
    disabledDates: []
};

const channelData = (state = initialState, action) => {
    let newState = Object.assign({}, state);
    switch (action.type) {
        case CHANNEL_DATE_CHANGE:
            newState.startDate = action.payload.startDate;
            newState.endDate = action.payload.endDate;
            break;
        case FETCH_CHANNEL_REQUEST:
            newState.isFetching=true;
            newState.data=[];
            break;
        case FETCH_CHANNEL_SUCCESS:
            newState.data=action.payload;
            newState.isFetching=false;
            break;
    }
    return newState;
};

export default channelData;

