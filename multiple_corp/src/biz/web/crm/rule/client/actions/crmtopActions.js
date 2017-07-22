import * as actionTypes from 'constants/crmtopTypes.js';
import restHub from '~comm/services/restHub';
import Message from '../components/Message';

const apiUrl = {
    limitCheck: 'https://biz.workec.com/crm/limit/check',
    setLimit: 'https://biz.workec.com/crm/limit/save'
}

export function checkLimit() {
    return (dispatch) => {
        restHub.get(apiUrl.limitCheck).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.CHECK_IF_LIMIT,
                        data: jsonResult.data
                    })
                }
            } else {
                Message.error(result.errorMsg);
            }
        })
    }
}

export function switchUseState(obj, callback) {
    return (dispatch) => {
        if(obj.justSwitch) {
            dispatch({
                type: actionTypes.SWITCH_USE_STATE,
                ison: obj.value,
                limit: obj.limit
            })
        } else {
            restHub.post(apiUrl.setLimit, {
                body: {
                    ison: obj.value,
                    limit: obj.limit
                }
            }).then((result) => {
                if(callback) callback();
                if (!result.errorMsg) {
                    let jsonResult = result.jsonResult;
                    if (jsonResult.code !== 200) {
                        Message.error(jsonResult.msg);
                    } else {
                        Message.success(jsonResult.msg);
                        dispatch({
                            type: actionTypes.SWITCH_USE_STATE,
                            ison: obj.value,
                            limit: obj.limit
                        })
                    }
                } else {
                    Message.error(result.errorMsg);
                }
            })
        }
    }
}