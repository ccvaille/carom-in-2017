import * as actionTypes from './actionType';
import restHub from '~comm/services/restHub';
import Message from '../components/Message';

const apiUrl = {
    getWarnList: 'https://my.workec.com/crm/lose/warn',
    getWarnIsHave: 'https://my.workec.com/crm/lose/warntip',
    setWarnComment: 'https://my.workec.com/crm/lose/confirm',
    getWarnDetail: 'https://my.workec.com/crm/lose/recover',
    getwarnDetailMore: 'https://my.workec.com/crm/lose/more',
    getShareList: 'https://my.workec.com/crm/share/request',
    setShareComment: 'https://my.workec.com/crm/share/confirm',
    setAllShareComments: 'https://my.workec.com/crm/reqmsg/batchshare',
    getMenuShow: 'https://my.workec.com/crm/msg/menus',
}

function _get(url, data, success, showError = true) {
    let value = '?';
    for (let key in data) {
        value += key + '=' + data[key] + '&&';
    }
    value = value.substr(0, value.length - 2);
    restHub.get(url + value).then((result) => {
        console.log(result);
        if (!result.errorMsg) {
            let jsonResult = result.jsonResult;
            if (jsonResult.code == 200) {
                if (success)
                    success(jsonResult);
            } else {
                if (showError) Message.error(jsonResult.msg);
            }
        } else {
            if (showError) Message.error(result.errorMsg);
        }
    });
}

function _post(url, data, success, showError = true) {
    restHub.postForm(url, {
        body: data
    }).then(result => {
        console.log(result);
        if (!result.errorMsg) {
            let jsonResult = result.jsonResult;
            if (jsonResult.code == 200) {
                if (success)
                    success(jsonResult);
            } else {
                if (showError) Message.error(jsonResult.msg);
            }
        } else {
            if (showError) Message.error(result.errorMsg);
        }
    })
}

//获取是否有新预警信息提示
export function getWarnIsHave() {
    return (dispatch) => {
        _get(apiUrl.getWarnIsHave, {}, ({
            data
        }) => {
            dispatch({
                type: actionTypes.LOAD_WARN_EXIST,
                isHave: data.warn,
            })
        }, false);
    }
}
//获取菜单栏显示
export function getMenuShow(array) {
    if (array && Array.isArray(array))
        return {
            type: actionTypes.LOAD_MENU_SHOW,
            menus: array,
        };
    return (dispatch) => {
        _get(apiUrl.getMenuShow, {}, ({
            data
        }) => {
            dispatch({
                type: actionTypes.LOAD_MENU_SHOW,
                menus: data.menus,
            });
        }, false)
    }
}


//设置预警信息加载情况
export function toggleWarnListLoading(isShow) {
    return {
        type: actionTypes.TOGGLE_WARN_LIST_LOADING,
        isShow,
    }
}

//获取预警信息列表
export function getWarnList(pageIndex) {
    return (dispatch) => {
        dispatch(toggleWarnListLoading(true));
        _get(apiUrl.getWarnList, {
            page: pageIndex
        }, ({
            data
        }) => {
            dispatch(toggleWarnListLoading(false));
            dispatch({
                type: actionTypes.LOAD_WARN_LIST,
                data: {
                    list: data,
                    pageIndex,
                }
            });
        });
    }
}
//发送预警信息处理意见
export function setWarnComment(id, isAgree, callBack) {
    return (dispatch) => {
        restHub.postForm(apiUrl.setWarnComment, {
            body: {
                id,
                status: isAgree ? 1 : 2
            }
        }).then(result => {
            console.log(result);
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code == 200) {
                    Message.success(jsonResult.msg);
                    if (callBack) {
                        callBack();
                    }
                    if (window.parent && window.parent.pc10Obj && window.parent.pc10Obj.msgBox && window.parent.pc10Obj.msgBox.changeMsgNumber) {
                        window.parent.pc10Obj.msgBox.changeMsgNumber('losewarn', 1);
                    } else if (window.parent && window.parent.crmActObj && window.parent.crmActObj.msgBox && window.parent.crmActObj.msgBox.changeMsgNumber) {
                        window.parent.crmActObj.msgBox.changeMsgNumber('losewarn', 1);
                    }
                    dispatch(getWarnList(1));
                    dispatch({
                        type: actionTypes.LOAD_WARN_EXIST,
                        isHave: false,
                    })
                } else {
                    if (showError) Message.error(jsonResult.msg);
                }
            } else {
                if (result.errorCode == 40402) {
                    Message.warning(result.errorMsg);
                    if (callBack) {
                        callBack();
                    }
                    dispatch(getWarnList(1));
                } else
                    Message.error(result.errorMsg);
            }
        })
    }
}
//获取预警消息详情
export function getWarnDetail(pageIndex) {
    return (dispatch) => {
        dispatch(toggleWarnDetailLoading(true));
        _get(apiUrl.getWarnDetail, {
            page: pageIndex
        }, ({
            data
        }) => {
            dispatch({
                type: actionTypes.LOAD_WARN_DETAIL,
                data: {
                    detail: data,
                    pageIndex,
                }
            });
            dispatch(toggleWarnDetailLoading(false));
        });
    }
}
//设置预警列表加载情况
export function toggleWarnDetailLoading(isShow) {
    return {
        type: actionTypes.TOGGLE_WARN_DETAIL_LOADING,
        isShow,
    }
}
//加载预警员工下更多收回客户
export function loadWarnMore(pageIndex, id) {
    return (dispatch) => {
        _get(apiUrl.getwarnDetailMore, {
            page: pageIndex,
            user_id: id
        }, ({
            data
        }) => {
            dispatch({
                type: actionTypes.LOAD_WARN_DETAIL_MORE,
                data: {
                    id,
                    pageIndex,
                    list: data,
                }
            });
        });
    }
}
//重置预警员工下收回客户为两个
export function resetWarnMore(id) {
    return {
        type: actionTypes.RESET_WARN_DETAIL_MORE,
        id,
    }
}

//获取共享请求列表
export function getShareList(pageIndex) {
    return (dispatch) => {
        dispatch(toggleShareLoading(true));
        _get(apiUrl.getShareList, {
            page: pageIndex
        }, ({
            data
        }) => {
            dispatch({
                type: actionTypes.LOAD_SHARE_LIST,
                data: {
                    pageIndex,
                    list: data
                }
            });
            dispatch(toggleShareLoading(false));
        });
    }
}
//设置共享请求列表加载情况
export function toggleShareLoading(isShow) {
    return {
        type: actionTypes.TOGGLE_SHARE_LIST_LOADING,
        isShow,
    }
}

//发送共享请求处理意见
export function setShareRequestComment(crmid, reqid, requid, act) {
    return (dispatch) => {
        let data = {
            crm_id: crmid,
            id: reqid,
            req_user_id: requid,
            status: act,
        }
        _post(apiUrl.setShareComment, data, ({
            data
        }) => {
            Message.success('处理成功');
            if (window.parent && window.parent.pc10Obj && window.parent.pc10Obj.msgBox && window.parent.pc10Obj.msgBox.changeMsgNumber) {
                window.parent.pc10Obj.msgBox.changeMsgNumber('req', 1);
            }else if (window.parent && window.parent.crmActObj && window.parent.crmActObj.msgBox && window.parent.crmActObj.msgBox.changeMsgNumber) {
                window.parent.crmActObj.msgBox.changeMsgNumber('req', 1);
            } 
            dispatch(getShareList(1));
        });
    }
}

//发送共享请求批量处理意见
export function setAllShareRequestComments() {
    return (dispatch) => {
        _post(apiUrl.setAllShareComments, {}, ({
            data
        }) => {
            Message.success('处理成功');
           if (window.parent && window.parent.pc10Obj && window.parent.pc10Obj.msgBox && window.parent.pc10Obj.msgBox.changeMsgNumber) {
                window.parent.pc10Obj.msgBox.changeMsgNumber('req', -1);
            }else if (window.parent && window.parent.crmActObj && window.parent.crmActObj.msgBox && window.parent.crmActObj.msgBox.changeMsgNumber) {
                window.parent.crmActObj.msgBox.changeMsgNumber('req', -1);
            } 
            dispatch(getShareList(1));
        });
    }
}
