import restHub from '~comm/services/restHub';
import * as visitorInfoType from '../constants/visitorInfoTypes';

export function getVisitorInfo(data){
    return {
        type:visitorInfoType.GET_VISITOR_INFO,
        data,
    }
}