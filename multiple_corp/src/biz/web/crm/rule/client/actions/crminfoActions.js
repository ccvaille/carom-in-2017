import * as actionTypes from 'constants/crminfoTypes.js';
import restHub from '~comm/services/restHub';
import Message from '../components/Message';

const apiUrl = {
    getAllUsers: 'https://api2.workec.com/corp/struct?_site_=biz&with_staff=1', //获取企业架构信息
    getProtectCheck: 'https://biz.workec.com/crm/protect/check', //获取客户保护配置
    protectSave: 'https://biz.workec.com/crm/protect/save', //客户资料保护数据保存
}

//获取选择员工所用信息
export function loadAllUsers() {
    return (dispatch) => {
        restHub.get(apiUrl.getAllUsers).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.LOAD_ALL_USERS,
                        data: jsonResult.data
                    });
                }
            } else {
                Message.error(result.errorMsg);
            }
        });
    }
}

//修改选取的员工
export function changeCheckedUsers(array) {
    return {
        type: actionTypes.CHANGE_NOTICUSER_ITEM,
        array,
    }
}

export function protectCheck() {
    return (dispatch) => {
        restHub.get(apiUrl.getProtectCheck).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.GET_PROTECT_CHECK,
                        data: jsonResult.data
                    });
                }
            } else {
                Message.error(result.errorMsg);
            }
        })
    }
}

export function switchHideState(obj, callback) {
    return (dispatch) => {
        if(!obj.justSwitch) {
            var users = [];
            const checkedUsers = obj.checkedUsers ? obj.checkedUsers : [];
            for(var user of checkedUsers) {
                users.push(parseInt(user.id));
            }
            restHub.post(apiUrl.protectSave, {
                body: {
                    ison: obj.value,
                    users: users
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
                            type: actionTypes.PROTECT_SAVE,
                            ison: obj.value,
                            data: jsonResult.data
                        });
                    }
                } else {
                    Message.error(result.errorMsg);
                }
            })
        } else {
            dispatch({
                type: actionTypes.SWITCH_HIDE_STATE,
                ison: obj.value
            })
        }
    }
}