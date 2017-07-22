import * as visitorInfoType from '../constants/visitorInfoTypes';

const defaultVisitorInfo = {
    info:{},
};

export default function visitorInfoReducer(state = defaultVisitorInfo, action) {
    switch (action.type) {
        case visitorInfoType.GET_VISITOR_INFO:
        return {
            ...state,
            info:action.data,
        }
        default:
        return {
            ...state
        }
    }
}
 