import * as actionTypes from 'constants/hitruleTypes.js';
import restHub from '~comm/services/restHub';
import Message from '../components/Message';

const apiUrl = {
    getHitrule: 'https://biz.workec.com/crm/hit/show', //获取客户阶段
    setHitrule: 'https://biz.workec.com/crm/hit/edit',  //设置客户阶段
}


export function getHitrule() {
    return (dispatch) => {
        restHub.get(apiUrl.getHitrule).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.GET_HIT_RULE,
                        data: jsonResult.data
                    });
                }
            } else {
                Message.error(result.errorMsg);
            }
        })
    }
}

export function setHitrule(obj, callback) {
    return (dispatch) => {
        if(obj.justSwitch) {
            dispatch({
                type: actionTypes.SWITCH_HIT_RULE,
                status: obj.status
            })
        } else {
            restHub.post(apiUrl.setHitrule, {
                body: {
                    status: obj.status
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
                            type: actionTypes.SWITCH_HIT_RULE,
                            status: obj.status
                        });
                    }
                } else {
                    Message.error(result.errorMsg);
                }
            })
        }
    }
}