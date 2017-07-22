import * as actionTypes from 'constants/crmstageTypes.js';
import restHub from '~comm/services/restHub';
import Message from '../components/Message';

const apiUrl = {
    getStageData: 'https://biz.workec.com/crm/stage/show', //获取客户阶段
    setStage: 'https://biz.workec.com/crm/stage/edit',  //设置客户阶段
    tipShow: 'https://biz.workec.com/crm/tip/show?pagetype=26', //CRM全局引导
    tipClose: 'https://biz.workec.com/crm/tip/close?pagetype=26' //CRM全局公共引导设置
}

export function getStageData() {
    return (dispatch) => {
        restHub.get(apiUrl.getStageData).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.GET_STAGE_DATA,
                        data: jsonResult.data
                    });
                }
            } else {
                Message.error(result.errorMsg);
            }
        })
    }
}

export function setStage(obj, callback) {
    return (dispatch) => {
        if(obj.justSwitch) {
            dispatch({
                type: actionTypes.SWITCH_STAGE,
                status: obj.value
            })
        } else {
            const params = {};
            params.status = obj.value;
            if(obj.stages) {
                params.names = obj.stages
            }
            restHub.post(apiUrl.setStage, {
                body: params
            }).then((result) => {
                if(callback) callback();
                if (!result.errorMsg) {
                    let jsonResult = result.jsonResult;
                    if (jsonResult.code !== 200) {
                        Message.error(jsonResult.msg);
                    } else {
                        Message.success(jsonResult.msg);
                        dispatch({
                            type: actionTypes.SET_STAGE,
                            status: obj.value
                        });
                    }
                } else {
                    Message.error(result.errorMsg);
                }
            })
        }
    }
}

export function getTipState() {
    return (dispatch) => {
        restHub.get(apiUrl.tipShow).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.GET_TIP_STATE,
                        data: jsonResult.data
                    });
                }
            } else {
                Message.error(result.errorMsg);
            }
        })
    }
}

export function setTipState() {
    return (dispatch) => {
        restHub.get(apiUrl.tipClose).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.SET_TIP_STATE
                    });
                }
            } else {
                Message.error(result.errorMsg);
            }
        })
    }
}