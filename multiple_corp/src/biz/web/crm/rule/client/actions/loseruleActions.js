import * as actionTypes from 'constants/loseruleTypes.js';
import restHub from '~comm/services/restHub';
import Message from '../components/Message';

const apiUrl = {
    getRule: 'https://biz.workec.com/crm/lose/rule', //获取客户回收策略
    setRule: 'https://biz.workec.com/crm/lose/setrule', //设置客户回收策略
    getEarlyWarn: 'https://biz.workec.com/crm/lose/warn', //获取上限预警信息
    setEarlyWarn: 'https://biz.workec.com/crm/lose/setwarn', //设置上限预警信息
    getAllUsers: 'https://api2.workec.com/corp/struct?_site_=biz&with_staff=1', //获取企业架构信息
    getSignTabs: 'https://api2.workec.com/crm/tags?_site_=biz', //获取标签分组信息
    closeGuide: 'https://biz.workec.com/crm/lose/closeguide', //关闭教程弹层
    tipShow: 'https://biz.workec.com/crm/tip/show?pagetype=22', //CRM全局引导
    tipClose: 'https://biz.workec.com/crm/tip/close?pagetype=22' //CRM全局公共引导设置
}

//获取整体策略详情信息
export function getRule() {
    return (dispatch) => {
        restHub.get(apiUrl.getRule).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch(getRuleDetail(jsonResult.data));
                }
            } else {
                Message.error(result.errorMsg);
            }
        });
    }
}
//设置整体策略详情信息
export function setRule(data) {
    return (dispatch) => {
        dispatch({
            type: actionTypes.SEND_RULE_DATA_LOADING,
            isShow: true,
        })
        restHub.postForm(apiUrl.setRule, {
            body: data
        }).then((result) => {
            dispatch({
                type: actionTypes.SEND_RULE_DATA_LOADING,
                isShow: false,
            })
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    Message.success(jsonResult.msg);
                    dispatch(getRule());
                    dispatch(changeSaveConfirmShow(false));
                }
            } else {
                Message.error(result.errorMsg);
            }
        });
    }
}

export function getRuleDetail(result) {
    return {
        type: actionTypes.GET_RULE_DATA,
        data: result,
    }
}




//必选项以及其值
export function changeCondition1(e) {
    return {
        type: actionTypes.CHANGE_CONDITION1,
        isCheck: e.target.checked,
    };
};

export function changeCondition2(e) {
    return {
        type: actionTypes.CHANGE_CONDITION2,
        isCheck: e.target.checked,
    };
};

export function changeCondition3(e) {
    return {
        type: actionTypes.CHANGE_CONDITION3,
        isCheck: e.target.checked,
    };
};
export function changeConditionInput1(e) {
    return {
        type: actionTypes.CHANGE_CON1_TEXT,
        value: e.target.value,
    }
};

export function changeConditionInput2(e) {
    return {
        type: actionTypes.CHANGE_CON2_TEXT,
        value: e.target.value,
    }
};

export function changeConditionInput3(e) {
    return {
        type: actionTypes.CHANGE_CON3_TEXT,
        value: e.target.value,
    }
};

//联系方式选择
export function changContactWays(checkValue) {
    return {
        type: actionTypes.CHANGE_CHECKED_CONTACTWAYS,
        checkValue,
    }
};


//标签相关

//选择无标签
export function changeCheckNoSign(e) {
    return {
        type: actionTypes.CHANGE_NOSIGTNS,
        isCheck: e.target.checked,
    }
};
//选择有标签
export function changeSign(e) {
    return {
        type: actionTypes.CHANGE_SIGNS,
        isCheck: e.target.checked,
    }
};
//修改获取标签状态
export function toggleSignTabsLoading(isShow) {
    return {
        type: actionTypes.CHANGE_SIGNTAB_LIST_LOADING,
        isShow,
    }
}
//获取标签数据
export function loadSignTabs() {
    return (dispatch) => {
        dispatch(toggleSignTabsLoading(true));
        restHub.get(apiUrl.getSignTabs).then((result) => {
            dispatch(toggleSignTabsLoading(false));
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    dispatch({
                        type: actionTypes.LOAD_SIGNTAB_LIST,
                        data: jsonResult.data,
                    });
                }
            } else {
                Message.error(result.errorMsg);
            }
        });
    }
};
//修改已选标签
export function changeCheckedSigns(array) {
    return {
        type: actionTypes.CHANGE_SIGNLIST_ITEM,
        array,
    }
}


//客户收回策略协议

export function changeAgreeProtcol(isCheck) {
    return {
        type: actionTypes.CHANGE_AGREE_PROTCOL,
        isCheck,
    }
};
export function changeProtcolShow(isShow) {
    return {
        type: actionTypes.CHANGE_PROTCOL_SHOW,
        isShow,
    }
};



//上限预警相关

//显示上限预警弹窗
export function showEarlyWarn(isShow) {
    return {
        type: actionTypes.CHANGE_EARLYWARN_SHOW,
        isShow,
    }
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
//修改上限阈值
export function changeNoticNum(number) {
    return {
        type: actionTypes.CHANGE_NOTIC_NUMBER,
        number: number,
    }
}
//获取上限预警信息
export function getEarlyWarn() {
    return (dispatch) => {
        dispatch(showEarlyWarn(true));
        restHub.get(apiUrl.getEarlyWarn).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                        dispatch({
                            type: actionTypes.LOAD_EARLYWARN_DATA,
                            data: jsonResult.data
                        });
                }
            } else {
                Message.error(result.errorMsg);
            }
        });
    }
}
//设置上限预警信息
export function setEarlyWarn(data) {
    return (dispatch) => {
        dispatch({
            type: actionTypes.SEND_EARLYWARN_LOADING,
            isShow: true,
        })
        restHub.postForm(apiUrl.setEarlyWarn, {
            body: data
        }).then((result) => {
            dispatch({
                type: actionTypes.SEND_EARLYWARN_LOADING,
                isShow: false,
            })
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    Message.success(jsonResult.msg);
                    dispatch(showEarlyWarn(false));
                }
            } else {
                Message.error(result.errorMsg);
            }
        });
    }
}



//收回时间相关
export function changeBackDate(date) {
    return {
        type: actionTypes.CHANGE_BACK_DATE_VALUE,
        date,
    }
}


//保存Confirm相关
export function changeSaveConfirmShow(isShow) {
    return {
        type: actionTypes.SHOW_SAVE_CONFIRM,
        isShow,
    }
}

//收回规则开关
export function openBackRuleStatus() {
    return {
        type: actionTypes.CHANGE_BACK_RULE_STATE,
        status: 1,
    }
}
export function closeBackRuleStatus(callBack) {
    return (dispatch) => {
        dispatch({
            type:actionTypes.CLOSE_BACK_RULE_LOADING,
            isShow:true,
        })
        restHub.postForm(apiUrl.setRule, {
            body: {
                status: 0
            }
        }).then((result) => {
            dispatch({
                type:actionTypes.CLOSE_BACK_RULE_LOADING,
                isShow:false,
            })
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code !== 200) {
                    Message.error(jsonResult.msg);
                } else {
                    Message.success(jsonResult.msg);
                    if(callBack)callBack();
                    dispatch(getRule());
                }
            } else {
                Message.error(result.errorMsg);
            }
        });
    }
}

//教学弹层
export function closeGuide() {
    return (dispatch) => {
        restHub.postForm(apiUrl.closeGuide, {
            body: {}
        }).then((result) => {
            if (!result.errorMsg) {
                let jsonResult = result.jsonResult;
                if (jsonResult.code == 200) {
                    dispatch({
                        type: actionTypes.CLOSE_GUIDE,
                        close: false,
                    })
                }
            }
        });
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
