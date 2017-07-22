import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as messageTypes from 'constants/messageTypes';
import {message} from 'antd';
import Message from '~comm/components/Message';


export function setFormInfo(payload) {
    return {
        type: messageTypes.SET_FORM_INFO,
        payload
    }
}
export function switchIframeVisible(payload) {
    return {
        type: messageTypes.SWITCH_IFRAME_VISIBLE,
        payload
    }
}
//获取设置信息
export function getSetting() {
    return (dispatch, getState) => {

        return restHub.get(ApiUrls.getSetting)
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch({
                        type: messageTypes.GET_SETTING,
                        payload: jsonResult.data
                    });
                    dispatch({
                        type: messageTypes.GET_DEFAULT_TIME,
                        payload: jsonResult.data
                    })
                } else {

                }
            })
    }
}
//删除弹层是否显示
export function switchDeleteVisible(payload) {
    return {
        type: messageTypes.SWITCH_DELETE_VISIBLE,
        payload
    }
}
//删除推送设置
export function deleteForm(payload) {
    return (dispatch, getState) => {
        const { formInfo } = getState().messageReducers;
        let formInfoIds = [1, 2, 3].filter((item, index) => {
                            return payload <= item;
                        }).map((ele) => {
                            return formInfo[ele] && formInfo[ele].f_id;
                        });
        let hasId;
        formInfoIds.forEach((item, index) => {
            if (item) {
                hasId = true;
            }
        });
        if (!hasId) {
            dispatch(
                setFormInfoSave(
                    [false, false, false].map((item, index) => { 
                        return payload-1 > index ? true : false 
                    })
                )
            );
            dispatch({
                type: messageTypes.DELETE_FORM,
                payload
            });
            return;
        }
        if (payload === 2 || payload === 1) {
            dispatch(changeTime(['12:30', '12:30']));
        } else if (payload === 2) {
            dispatch(changeTime({
                index: 1,
                time: '12:30'
            }));
        }
        return restHub
            .postForm(ApiUrls.deleteForm, {
                    body: {
                        id: formInfoIds.filter(el => { return el }).join(',')
                    }
                })
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch({
                        type: messageTypes.DELETE_FORM,
                        payload
                    });
                    dispatch(
                        setFormInfoSave(
                            [false, false, false].map((item, index) => { 
                                return payload-1 > index ? true : false 
                            })
                        )
                    );
                    Message.success('删除成功');
                } else {
                    Message.error(errorMsg);
                }
            })
    }
}
//新增推送设置
export function addForm(payload, isAutoSave) {
    return (dispatch, getState) => {
        const { formInfo, settingInfo } = getState().messageReducers;

        return restHub
            .postForm(ApiUrls.addForm, {
                    body: {
                        appid: settingInfo.f_auth_appid,
                        no: payload,
                        title: formInfo[payload].f_title || '',
                        desc: formInfo[payload].f_desc || '',
                        content: formInfo[payload].f_content || '',
                        url: formInfo[payload].f_url || '',
                        picUrl: formInfo[payload].f_pic_url || '',
                        time: formInfo[payload].f_time ?
                        formInfo[payload].f_time : '12:30'
                    }
                })
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch(switchEditFormInfoSave(true));
                    Message.success('保存成功');
                    dispatch({
                        type: messageTypes.ADD_FORM,
                        payload: {
                            index: payload,
                            f_id: jsonResult.data.id
                        }
                    });
                    if (!isAutoSave) {
                        dispatch(
                            setFormInfoSave(
                                [false, false, false].map((item, index) => { 
                                    return payload > index ? true : false 
                                })
                            )
                        );
                    }
                   
                } else {
                    Message.error(errorMsg);
                }
            })
    }
}

export function editForm(payload, isAutoSave) {
    return (dispatch, getState) => {
        const { formInfo, settingInfo } = getState().messageReducers;

        return restHub
            .postForm(ApiUrls.editForm, {
                    body: {
                        id: formInfo[payload].f_id,
                        title: formInfo[payload].f_title || '',
                        desc: formInfo[payload].f_desc || '',
                        content: formInfo[payload].f_content || '',
                        url: formInfo[payload].f_url || '',
                        picUrl: formInfo[payload].f_pic_url || '',
                        time: formInfo[payload].f_time ?
                        formInfo[payload].f_time : '12:30'
                    }
                })
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch(switchEditFormInfoSave(true));
                    Message.success('保存成功');
                    if (!isAutoSave) {
                        dispatch(
                            setFormInfoSave(
                                [false, false, false].map((item, index) => { 
                                    return payload > index ? true : false 
                                })
                            )
                        );
                    }
                } else {
                    Message.error(errorMsg);
                }
            })
    }
}

//获取权限
export function getRole() {
    return (dispatch, getState) => {
        dispatch({
            type: messageTypes.IS_ROLELOADING,
            payload: true
        });
        return restHub.get(ApiUrls.getRole)
            .then(({ errorMsg, jsonResult }) => {
                dispatch({
                    type: messageTypes.IS_ROLELOADING,
                    payload: false
                });
                dispatch({
                    type: messageTypes.IS_ROLELOADED,
                    payload: true
                });

                if (!errorMsg) {

                    dispatch({
                        type: messageTypes.GET_ROLE,
                        payload: {
                            isAuthVisible: !!jsonResult.data.isAuth && jsonResult.data.isVerify,
                            hasAuthVisible: true,
                            isFirstVisible: !!jsonResult.data.remind.slide
                        }
                    });
                    dispatch({
                        type: messageTypes.SAVE_AUTH,
                        payload: {
                            isAuth: jsonResult.data.isAuth,
                            isVerify: jsonResult.data.isVerify
                        }
                    });
                } else {
                    Message.error(errorMsg);
                }
            })
    }
}

//modalVisible中的三个modal展示切换
export function switchModalVisible(payload) {
    return {
        type: messageTypes.SWITCH_MODAL_VISIBLE,
        payload
    }
}
//功能已提醒
export function cancelRemind() {
    return (dispatch, getState) => {
        return restHub
            .postForm(ApiUrls.remind, {
                    body: {
                        type: 'slide'
                    }
                })
            .then(({ errorMsg, jsonResult }) => {
                // if (!errorMsg) {
                //     Message.success('保存成功');
                // } else {
                //     Message.error(errorMsg);
                // }
            })
    }
}
//切换Tabpush  activeli
export function setTabpushLi(payload) {
    return {
        type: messageTypes.SET_TABPUSH_LI,
        payload
    }
}
//
export function setFormInfoSave(payload) {
    return {
        type: messageTypes.SET_FORMINFO_SAVE,
        payload
    }
}
export function changeTime(payload) {
    return {
        type: messageTypes.CHANGE_TIME,
        payload
    }
}
export function setFormInfoTime(payload) {
    return {
        type: messageTypes.SET_FORMINFOTIME,
        payload
    }
}
export function switchEditFormInfoSave(payload) {
    return {
        type: messageTypes.SWITCH_EDITFORMINFO_SAVE,
        payload
    }
}
export function switchGoToNextliModal(payload) {
    return {
        type: messageTypes.SWTICH_GOTONEXTLI_MODAL,
        payload
    }
}
export function setNextActiveLi(payload) {
    return {
        type: messageTypes.SET_NEXTACTIVELI,
        payload
    }
}
export function resetEditFormInfoSave() {
    return {
        type: messageTypes.RESET_EDITFORMINFOSAVE
    }
}

export function switchGoToTransform(payload) {
    return {
        type: messageTypes.SWITCH_GOTO_TRANSFORM,
        payload
    }
}
export function imageLoading(payload) {
    return {
        type: messageTypes.IMAGE_LOADING,
        payload
    }
}















