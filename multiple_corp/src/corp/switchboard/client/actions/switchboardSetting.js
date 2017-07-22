import { replace } from "react-router-redux";
import message from "~comm/components/Message";
import restHub from "~comm/services/restHub";
import ApiUrls from "constants/ApiUrls";
import * as SettingActionTypes from "constants/SettingActionTypes";

export function getSettingSuccess(payload) {
    return {
        type: SettingActionTypes.GET_SETTING_SUCCESS,
        payload
    };
}

export function getSetting() {
    return dispatch => restHub.postForm(ApiUrls.switchboardSetting).then(({
            errorCode,
            errorMsg,
            jsonResult
        }) => {
            if (errorCode === 400105 || errorCode === 400106) {
                // dispatch(replace("/cloudboard/apply/apply"));
            } else if (!errorMsg) {
                dispatch(getSettingSuccess(jsonResult.data));
            } else {
                message.error("系统繁忙");
                // dispatch(CommonModalActions.setModalContent('系统繁忙'));
                // dispatch(CommonModalActions.togglePromptModal(true));
            }
        });
}

export function updateSettingType(payload) {
    return {
        type: SettingActionTypes.UPDATE_SETTING_TYPE,
        payload
    };
}

export function updateTypeOneNumber(payload) {
    return {
        type: SettingActionTypes.UPDATE_TYPE_ONE_NUMBER,
        payload
    };
}

export function updateTypeTwoNumber(payload) {
    return {
        type: SettingActionTypes.UPDATE_TYPE_TWO_NUMBER,
        payload
    };
}


//切换选择员工显示
export function toggleSelectEmployee(payload) {
    return {
        type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
        payload
    }
}
//设置轮转接听人员
export function setRoundAnswer(payload) {
    return (dispatch, getState) => {
        const { mode2Selected, settingId, mode2Info } = getState().switchboardSetting;
        //检测是否有相同的员工
        let index = mode2Info.employee.findIndex((item, index) => 
            item.f_uid == mode2Selected.id);
        if (index > -1) {
            message.error('队列中已经有该员工');
            return false;
        }
        return restHub
            .postForm(ApiUrls.setRoundAnswer, {
                body: {
                    id: settingId,
                    userid: mode2Selected.id,
                    username: mode2Selected.name,
                    number: mode2Selected.phone
                }
            })
            .then(({ errorCode, errorMsg }) => {
                if (errorCode === 400105) {
                   
                } else if (!errorMsg) {
                    message.success("提交成功");
                    if (mode2Info.employee && mode2Info.employee.length < 10) {
                        dispatch({
                            type: SettingActionTypes.ADD_ROUNDANSWER_EMPLOYEES,
                            payload: {
                                f_uid: mode2Selected.id,
                                f_uname: mode2Selected.name,
                                f_phone: mode2Selected.phone
                            }
                        })
                    } else {
                        message.error('回拨轮转类型的客服最多可设置10人');
                    }
                    
                    // dispatch(CommonModalActions.setModalContent('提交成功'));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                    //获取接听人员设置列表
                } else {
                    message.error(errorMsg);
                    // dispatch(CommonModalActions.setModalContent(errorMsg));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
                dispatch({
                    type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
                    payload: false  
                });
                dispatch({
                    type: SettingActionTypes.CLEAR_MODE2_SELECTEDINPUT
                })

            });
    };
}
//获取号码配置数据
export function getMobileAllocation(payload) {
    return (dispatch, getState) => {
        return restHub
            .postForm(ApiUrls.getMobileAllocation, {
                body: {
                    ...payload,
                }
            })
            .then(({ errorCode, errorMsg, jsonResult }) => {
                if (errorCode === 400105) {
                   
                } else if (!errorMsg) {
                    
                    dispatch({
                        type: SettingActionTypes.GET_MOBILE_ALLOCATION,
                        payload: jsonResult

                    })
                } else {
                    message.error(errorMsg);
                    // dispatch(CommonModalActions.setModalContent(errorMsg));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
                // dispatch({
                //     type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
                //     payload: false  
                // })   
            });
    };
}

//授权员工
export function setRightedEmployees (payload) {
    return {
        type: SettingActionTypes.RIGHTED_EMPLOYEES,
        payload
    }
}
export function getRightedEmployees (payload) {
    return (dispatch, getState) => {
        return restHub
            .postForm(ApiUrls.getAuthInfo, {
                body: {
                    id: payload
                }
            })
            .then(({ errorCode, errorMsg, jsonResult }) => {
                if (errorCode === 400105) {
                   
                } else if (!errorMsg) {
                    let employee = [];
                    employee = jsonResult.data.auth.map((item, index) => {
                        return {nodeId: item.f_uid, name: item.f_uname}
                    });
                    dispatch({
                        type: SettingActionTypes.GET_RIGHTED_EMPLOYEES,
                        payload: employee
                    })              
                } else {
                    message.error(errorMsg);
                    // dispatch(CommonModalActions.setModalContent(errorMsg));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
                // dispatch({
                //     type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
                //     payload: false  
                // })   
            });
    };
}
//号码授权是否显示
export function toggleRightedEmployee(payload) {
    return {
        type: SettingActionTypes.TOGGLE_RIGHTED_EMPLOYEE,
        payload
    }
}
//授权提交
export function sumbitRightedEmployees(payload) {
    return (dispatch, getState) => {
        const { rightedEmployees } = getState().switchboardSetting;
        return restHub
            .postForm(ApiUrls.setAuthInfo, {
                body: {
                    id: payload,
                    auth_id: rightedEmployees.map((item) => {
                        return item.nodeId
                    }).join(',')
                }
            })
            .then(({ errorCode, errorMsg, jsonResult }) => {
                if (errorCode === 400105) {
                   
                } else if (!errorMsg) {
                    //重新刷新号码列表
                    dispatch(getMobileAllocation({
                        page: 1,
                        per: 10
                    }));
                    message.success("提交成功"); 
                    dispatch({
                        type: SettingActionTypes.TOGGLE_RIGHTED_EMPLOYEE,
                        payload: ''
                    }) 
                   
                    // setTimeout(() => {
                    //     location.reload();
                    // }, 1000)             
                } else {
                    message.error(errorMsg);
                    // dispatch(CommonModalActions.setModalContent(errorMsg));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
                // dispatch({
                //     type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
                //     payload: false  
                // })   
            });
    };
}
//业务配置显示切换
export function toggleSetting(payload) {
    return {
        type: SettingActionTypes.TOGGLE_SETTING,
        payload
    }
}
//获取业务配置信息
export function getSettingInfo(payload) {
    return (dispatch, getState) => {
        const { rightedEmployees } = getState().switchboardSetting;
        return restHub
            .postForm(ApiUrls.getSettingInfo, {
                body: {
                    id: payload
                }
            })
            .then(({ errorCode, errorMsg, jsonResult }) => {
                if (errorCode === 400105) {
                   
                } else if (!errorMsg) {
                    // dispatch({
                    //     type: SettingActionTypes.SETTING_INFO,
                    //     payload: jsonResult.data
                    // })
                    //模式开关
                    dispatch({
                        type: SettingActionTypes.TOGGLE_MODE,
                        payload: (jsonResult.data.f_effect-0) > 2 ? 1 : 0
                    });
                    //设置模式一初始化数据
                    dispatch({
                        type: SettingActionTypes.SETMODE1INFO,
                        payload: jsonResult.data.confInfo
                    });
                    //设置模式二初始化数据
                    dispatch({
                        type: SettingActionTypes.SETMODE2INFO,
                        payload: jsonResult.data
                    });
                } else {
                    message.error(errorMsg);
                    // dispatch(CommonModalActions.setModalContent(errorMsg));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
                // dispatch({
                //     type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
                //     payload: false  
                // })   
            });
    };
}
//切换模式1，2
export function toggleMode (payload) {
    return {
        type: SettingActionTypes.TOGGLE_MODE,
        payload
    }
}
//模式1type切花
export function setMode1ActiveType (payload) {
    return {
        type: SettingActionTypes.SETMODE1ACTIVETYPE,
        payload
    }
}
//模式1输入号码
export function setMode1InfoPhone (payload) {
    return {
        type: SettingActionTypes.SETMODE1INFOPHONE,
        payload
    }
    
}
//模式1选择员工
export function setMode1InfoUser (payload) {
    return {
        type: SettingActionTypes.SETMODE1INFOUSER,
        payload
    }
}
//模式1重置选择员工
export function resetMode1InfoUser (payload) {
    return {
        type: SettingActionTypes.RESETMODE1INFOUSER,
        payload
    }
}
//移动轮转接听选择的员工
export function moveRoundAnswerEmployees (payload) {
    return {
        type: SettingActionTypes.MOVE_ROUNDANSWER_EMPLOYEES,
        payload
    }
}
//删除轮转接听选择的员工
export function delRoundAnswerEmployees (payload) {
    return {
        type: SettingActionTypes.DEL_ROUNDANSWER_EMPLOYEES,
        payload
    }
}
//设置轮转接听振铃时间
export function changeIntervalTime (payload) {
    return {
        type: SettingActionTypes.CHANGE_INTERVALTIME,
        payload
    }
}
//切换模式二接听模式设置
export function setMode2ActiveType (payload) {
    return {
        type: SettingActionTypes.SET_MODE2_ACTIVETYPE,
        payload
    }
}
//模式二轮转接听选择员工
export function setMode2Selected (payload) {
    return (dispatch, getState) => {
        return restHub
            .postForm(ApiUrls.getMode2SelectPhone, {
                body: {
                    uid: payload.id
                }
            })
            .then(({ errorCode, errorMsg, jsonResult }) => {
                if (errorCode === 400105) {
                   
                } else if (!errorMsg) {
                    
                   dispatch({
                        type: SettingActionTypes.SET_MODE2_SELECTED,
                        payload: {
                            ...payload,
                            phone: jsonResult.number || ''
                        }    
                   });
                } else {
                    message.error(errorMsg);
                    // dispatch(CommonModalActions.setModalContent(errorMsg));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
                // dispatch({
                //     type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
                //     payload: false  
                // })   
            });
        }

    // return {
    //     type: SettingActionTypes.SET_MODE2_SELECTED,
    //     payload
    // }
}
//模式二选择员工接听电话输入
export function setMode2SelectedInput (payload) {
    return {
        type: SettingActionTypes.SET_MODE2_SELECTEDINPUT,
        payload
    }
}
//取消配置
export function cancelSetting (payload) {
    return {
        type: SettingActionTypes.CANCELSETTING,
        payload
    }
}
//提交配置
export function submitSetting (payload) {
    return (dispatch, getState) => {
        const { mode1Info, mode2Info, mode, settingId} = getState().switchboardSetting;
        const submitData = handleSubmitData(mode1Info, mode2Info, mode, settingId);
        if (!submitData) {
            return false;
        }
        return restHub
            .postForm(ApiUrls.submitSetting, {
                body: submitData
            })
            .then(({ errorCode, errorMsg, jsonResult }) => {
                if (errorCode === 400105) {
                   
                } else if (!errorMsg) {
                    
                   dispatch({
                        type: SettingActionTypes.CANCELSETTING
                   });
                   message.success('配置成功');
                } else {
                    message.error(errorMsg);
                    // dispatch(CommonModalActions.setModalContent(errorMsg));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
                // dispatch({
                //     type: SettingActionTypes.TOGGLE_SELECTEMPLOYEE,
                //     payload: false  
                // })   
            });
    }
}

function handleSubmitData(mode1Info, mode2Info, mode, settingId) {
    let data = {};
    data.id = settingId;
    data.model1 = {};
    data.model2 = {};

    data.model1.type = mode1Info.activeType;
    data.model1.effect = mode ? 0 : 1;
    if (mode1Info.activeType - 0 === 1) {
        data.model1.number = mode1Info[1].f_phone;
        data.model1.userid = mode1Info[1].f_uid;
        // data.model1 = JSON.stringify(data.model1);
        // if (!mode1Info[1].f_uname && !mode1Info[1].f_phone) {
        //     delete (data.model1);
        // }
    } else if (mode1Info.activeType - 0 === 2) {
        data.model1.number = mode1Info[2].f_phone;
        data.model1.userid = mode1Info[2].f_uid;
        // data.model1 = JSON.stringify(data.model1);
        // if (!mode1Info[1].f_uname && !mode1Info[1].f_phone) {
        //     delete (data.model1);
        // }
    }
    if (data.model1.effect && !data.model1.number && !data.model1.userid) {
        message.error('请选择接听人员或输入接听号码');
        return false;
    }
    data.model1 = JSON.stringify(data.model1);

    data.model2.type = mode2Info.activeType;
    data.model2.effect = mode ? 1 : 0;
    
    data.model2.userid = mode2Info.employee.map((item) => {
        return item.f_uid
    }).join(',');
    // data.model2.interval = mode2Info.intervalTime; 
    if (data.model2.effect && !data.model2.userid) {
        message.error('请选择接听人员或输入接听号码');
        return false;
    }
    data.model2 = JSON.stringify(data.model2);
    // if (!mode2Info.employee.length) {
    //     delete (data.model2);
    // }
    return data;
}

const getSerializedObject = (object) => {
    let serializedString = '';
    Object.keys(object).forEach(key => {
        serializedString += serializedString ? `&${key}=${object[key]}` : `${key}=${object[key]}`;
    });
    return serializedString;
};





