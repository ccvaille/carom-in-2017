import message from "~comm/components/Message";
import restHub from "~comm/services/restHub";
import ApiUrls from "constants/ApiUrls";
import * as ApplyListActionTypes from "constants/ApplyListActionTypes";

export function toggleApplyPass(payload) {
    return {
        type: ApplyListActionTypes.TOGGLE_APPLY_PASS_VISIBLE,
        payload
    };
}

export function toggleApplyRefuse(payload) {
    return {
        type: ApplyListActionTypes.TOGGLE_APPLY_REFUSE_VISIBLE,
        payload
    };
}

export function toggleModifyPhone(payload) {
    return {
        type: ApplyListActionTypes.TOGGLE_MODIFY_PHONE_VISIBLE,
        payload
    };
}

export function getApplyListSuccess(payload) {
    return {
        type: ApplyListActionTypes.GET_APPLY_LIST_SUCCESS,
        payload
    };
}

export function getApplyList() {
    return (dispatch, getState) => {
        const params = getState().applyList.applyListParams;
        return restHub
            .postForm(ApiUrls.applyList, {
                body: params
            })
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch(getApplyListSuccess(jsonResult));
                } else {
                    message.error(errorMsg);
                }
            });
    };
}

export function removeApply(id) {
    return dispatch =>
        restHub
            .postForm(ApiUrls.removeApply, {
                body: {
                    id
                }
            })
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    message.success("删除成功");
                    dispatch(getApplyList());
                    return { errorMsg };
                }

                message.error(errorMsg);
                return { errorMsg };
            });
}

export function passApplyOne(payload) {
    return (dispatch, getState) => {
        const { currentPassId } = getState().applyList;
        return restHub
            .postForm(ApiUrls.passApplyOne, {
                body: {
                    id: currentPassId,
                    // 手机号和受理单类型
                    number: payload.number,
                    code: payload.acceptanceType
                }
            })
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    dispatch(getApplyList());
                    message.success("第一次审核通过");
                    dispatch(toggleApplyPass(false));
                } else {
                    message.error(errorMsg);
                }
            });
    };
}

export function passApplyTwo() {
    return (dispatch, getState) => {
        const { currentPassId } = getState().applyList;
        return restHub
            .postForm(ApiUrls.passApplyTwo, {
                body: {
                    id: currentPassId
                }
            })
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    dispatch(getApplyList());
                    message.success("审核通过");
                    return { errorMsg };
                }

                message.error(errorMsg);
                return { errorMsg };
            });
    };
}

export function refuseApply(payload) {
    return (dispatch, getState) => {
        const { currentRefuseId, currentPassType } = getState().applyList;
        let url = "";
        if (currentPassType === 1) {
            url = ApiUrls.refuseApplyOne;
        } else if (currentPassType === 2) {
            url = ApiUrls.refuseApplyTwo;
        }

        return restHub
            .postForm(url, {
                body: {
                    id: currentRefuseId,
                    cause: payload
                }
            })
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    dispatch(getApplyList());
                    message.success("审核已不通过");
                    dispatch(toggleApplyRefuse(false));
                } else {
                    message.error(errorMsg);
                }
            });
    };
}

export function modifyPhone(payload) {
    return (dispatch, getState) => {
        const { phoneList } = getState().applyList;
        return restHub
            .postForm(ApiUrls.modifyPhone, {
                body: {
                    id: phoneList[0].id,
                    data: JSON.stringify(phoneList.filter(element => {
                        return element.f_status !== "2"
                    }).map((item, index) => {
                        return { [`${item.f_id}`]: item.f_number }
                    }))
                }
            })
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    message.success("修改成功");
                    dispatch(toggleModifyPhone(false));
                } else {
                    message.error(errorMsg);
                }
            });
    };
}

export function asyncExport() {
    return (dispatch, getState) => {
        const filterParams = getState().applyList.applyListParams;
        let params = "";
        const keys = Object.keys(filterParams);
        keys.forEach(k => {
            if (k !== "curr") {
                const value = filterParams[k];
                params += params ? `&${k}=${value}` : `${k}=${value}`;
            }
        });
        return restHub
            .postForm(ApiUrls.asyncExport, {
                body: {
                    from: 10,
                    query_string: encodeURIComponent(params)
                }
            })
            .then(({ errorMsg }) => {
                if (!errorMsg) {
                    message.success("导出成功");
                    return { errorMsg };
                }

                message.error(errorMsg);
                return { errorMsg };
            });
    };
}

export function getFilesSuccess(data, fid) {
    return {
        type: ApplyListActionTypes.GET_FILES_SUCCESS,
        payload: {
            data,
            fid
        }
    };
}

export function getFiles(payload) {
    return dispatch => {
        return restHub
            .postForm(ApiUrls.getFiles, {
                body: payload
            })
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {
                    dispatch(getFilesSuccess(jsonResult.data, payload.fid));
                } else {
                    message.error(errorMsg);
                }
            });
    };
}

export function resetFileList() {
    return {
        type: ApplyListActionTypes.RESET_FILE_LIST
    };
}

export function getPhoneListSuccess(payload) {
    return {
        type: ApplyListActionTypes.GET_PHONE_LIST_SUCCESS,
        payload
    };
}

export function getPhoneList(payload) {
    return dispatch => {
        return restHub
            .postForm(ApiUrls.getPhoneList, {
                body: payload
            })
            .then(({ errorMsg, jsonResult }) => {
                if (!errorMsg) {

                    dispatch(getPhoneListSuccess(jsonResult));
                } else {
                    message.error(errorMsg);
                }
            });
    };
}

export function resetPhoneList() {
    return {
        type: ApplyListActionTypes.RESET_PHONE_LIST
    };
}

export function updateListParams(payload) {
    return {
        type: ApplyListActionTypes.UPDATE_LIST_PARAMS,
        payload
    };
}

export function setCurrentPassId(payload) {
    return {
        type: ApplyListActionTypes.SET_CURRENT_PASS_ID,
        payload
    };
}

export function setCurrentPassType(payload) {
    return {
        type: ApplyListActionTypes.SET_CURRENT_PASS_TYPE,
        payload
    };
}
export function setCurrentPassNum(payload) {
    return {
        type: ApplyListActionTypes.SET_CURRENT_PASS_NUM,
        payload
    };
}

export function setCurrentRefuseId(payload) {
    return {
        type: ApplyListActionTypes.SET_CURRENT_REFUSE_ID,
        payload
    };
}

export function setModfiyPhoneId(payload) {
    return {
        type: ApplyListActionTypes.SET_MODDIFY_PHONE_ID,
        payload
    };
}
//编辑错误的号码
export function setErrorLabelsIndex(payload, type) {
    if (type) {
        return {
            type: ApplyListActionTypes.SET_ERROR_LABELSINDEX,
            payload
        };
    } else {
        return {
            type: ApplyListActionTypes.SET_ERROR_LABELSINDEXCHECK,
            payload
        };
    }
    
}
//修改号码
export function editModifyPhone(payload) {
    return {
        type: ApplyListActionTypes.EDIT_MODIFY_PHONE,
        payload
    };
}
//第一次审核填写的号码
export function addPassPhoneList(payload) {
    // return {
    //     type: ApplyListActionTypes.ADD_PASS_PHONELIST,
    //     payload
    // }
    return (dispatch, getState) => {
        const {currentPassNum, passPhoneList} = getState().applyList;
        if ( currentPassNum-0 === passPhoneList.length) {
            message.error('已达到申请号码个数上限');
            return false;
        } else {
            dispatch({
                type: ApplyListActionTypes.ADD_PASS_PHONELIST,
                payload
            })
        }
    };
}
//第一次审核填写的号码
export function delPassPhoneList(payload) {
    return {
        type: ApplyListActionTypes.DEL_PASS_PHONELIST,
        payload
    }
}
//编辑审核新增的label
export function editNewLabel(payload) {
    return {
        type: ApplyListActionTypes.EDIT_NEW_LABEL,
        payload
    };
}
export function clearPhoneList() {
    return {
        type: ApplyListActionTypes.CLEAR_PHONE_LIST
    };
}

