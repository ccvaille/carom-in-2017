import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as transformTypes from 'constants/transformTypes';
import {message} from 'antd';
import Message from '~comm/components/Message';

//获取转化分析数据
export function getAnalysis(params) {
    return (dispatch, getState) => {
        return restHub.get(ApiUrls.getAnalysis, {
            params: params ? params : {}
        }).then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch({
                        type: transformTypes.FETCH_ANALYSIS_DATA,
                        analysisData: jsonResult.data
                    });
                } else {
                    Message.error(errorMsg);
                }
            })
    }
}

//获取关键指标
export function getKeyData(params) {
    return (dispatch, getState) => {
        return restHub.get(ApiUrls.getKeyData, {
            params: params ? params : {}
        }).then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch({
                        type: transformTypes.FETCH_KEY_DATA,
                        keyData: jsonResult.data
                    });
                } else {
                    Message.error(errorMsg);
                }
            })
    }
}

export function switchIndex(index) {
    return {
        type: transformTypes.SWITCH_ACTIVE_INDEX,
        activeIndex: index
    }
}