import message from '~comm/components/Message';
import restHub from '~comm/services/restHub';
import ApiUrls from 'constants/ApiUrls';
import * as ApplyActionTypes from 'constants/ApplyActionTypes';

function isImageType(type) {
    const imageTypes = ['jpg', 'jpeg', 'png'];
    return imageTypes.indexOf(type) > -1 || type.indexOf('image') > -1;
}

export function updateApplyStatus(payload) {
    // payload.applyStatus = !payload.applyStatus ? 0 : payload.applyStatus;
    return {
        type: ApplyActionTypes.UPDATE_APPLY_STATUS,
        payload,
    };
}

export function updateUploadField(key, data) {
    return {
        type: ApplyActionTypes.UPDATE_UPLOAD_FIELD,
        payload: {
            key,
            data,
        },
    };
}

export function updateUploadFields(payload) {
    return {
        type: ApplyActionTypes.UPDATE_UPLOAD_FIELDS,
        payload,
    };
}

export function toggleSubmitModal(payload) {
    return {
        type: ApplyActionTypes.TOGGLE_SUBMIT_MODAL_VISIBLE,
        payload,
    };
}

export function getApplyStatusTwo() {
    return (dispatch, getState) => {
        return restHub.postForm(ApiUrls.secondStatus)
            .then(({
                errorMsg,
                jsonResult
            }) => {
                if (!errorMsg) {
                    let {
                        data
                    } = jsonResult;
                    data = {
                        f_promise_path: data.f_promise_path || '',
                        f_promise_filename: data.f_promise_filename || '',
                        f_promise_filetype: data.f_promise_filetype || '',
                        f_promise_show: data.f_promise_show || '',

                        f_accept_path: data.f_accept_path || '',
                        f_accept_filename: data.f_accept_filename || '',
                        f_accept_filetype: data.f_accept_filetype || '',
                        f_accept_show: data.f_accept_show || '',

                        is_edit: data.is_edit || 0,
                        is_pass: data.is_pass || 2,
                        is_first: data.is_first,
                        f_num: data.f_num,
                        f_second_cause: data.f_second_cause || '',
                        f_is_mail: data.f_is_mail || '0',
                        f_accept_code: data.f_accept_code || 0,
                    };
                    const files = {
                        promiseForm: {
                            originFilename: data.f_promise_filename,
                            filePath: data.f_promise_path,
                            uploadedFilePath: data.f_promise_show,
                            isImage: isImageType(data.f_promise_filetype),
                            fileType: data.f_promise_filetype,
                            isUploaded: data.f_promise_path !== '',
                        },
                        acceptanceForm: {
                            originFilename: data.f_accept_filename,
                            filePath: data.f_accept_path,
                            uploadedFilePath: data.f_accept_show,
                            isImage: isImageType(data.f_accept_filetype),
                            fileType: data.f_accept_filetype,
                            isUploaded: data.f_accept_path !== '',
                        },
                    };
                    dispatch(updateUploadFields(files));
                    dispatch(updateApplyStatus({
                        applyCount: data.f_num,
                        isFirst: data.is_first,
                        applyStatus: data.is_pass,
                        applyEdit: data.is_edit === 1,
                        applyFailCause: data.f_second_cause,
                        acceptCode: data.f_accept_code,
                        isMaterialMailed: data.f_is_mail === '1',
                        canSubmitSecond: !!data.f_promise_path &&
                            !!data.f_accept_path &&
                            data.f_is_mail === '1',
                    }));
                } else {
                    message.error('系统繁忙');
                    // dispatch(CommonModalActions.setModalContent('系统繁忙'));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
            });
    };
}

export function getApplyStatusOne() {
    return (dispatch, getState) => {
        const {
            applyCount
        } = getState().applySwitchboard;
        return restHub.postForm(ApiUrls.firstStatus)
            .then(({
                errorMsg,
                jsonResult
            }) => {
                if (!errorMsg) {
                    if (
                        jsonResult.data && (jsonResult.data.is_pass === 1 || jsonResult.data.is_pass === 4)
                    ) {
                        dispatch(getApplyStatusTwo());
                    } else {
                        let {
                            data
                        } = jsonResult;
                        data = {
                            f_license_path: data.f_license_path || '',
                            f_license_filename: data.f_license_filename || '',
                            f_license_filetype: data.f_license_filetype || '',
                            f_license_show: data.f_license_show || '',

                            f_photo_path: data.f_photo_path || '',
                            f_photo_filename: data.f_photo_filename || '',
                            f_photo_filetype: data.f_photo_filetype || '',
                            f_photo_show: data.f_photo_show || '',

                            f_handle_path: data.f_handle_path || '',
                            f_handle_filename: data.f_handle_filename || '',
                            f_handle_filetype: data.f_handle_filetype || '',
                            f_handle_show: data.f_handle_show || '',

                            f_register_path: data.f_register_path || '',
                            f_register_filename: data.f_register_filename || '',
                            f_register_filetype: data.f_register_filetype || '',
                            f_register_show: data.f_register_show || '',

                            is_edit: data.is_edit || 0,
                            is_pass: data.is_pass || 0,
                            is_first: data.is_first,
                            f_num: data.f_num,
                            f_first_cause: data.f_first_cause || '',
                        };
                        const files = {
                            license: {
                                originFilename: data.f_license_filename,
                                filePath: data.f_license_path,
                                uploadedFilePath: data.f_license_show,
                                isImage: isImageType(data.f_license_filetype),
                                fileType: data.f_license_filetype,
                                isUploaded: data.f_license_path !== '',
                            },
                            legalPhoto: {
                                originFilename: data.f_photo_filename,
                                filePath: data.f_photo_path,
                                uploadedFilePath: data.f_photo_show,
                                isImage: isImageType(data.f_photo_filetype),
                                fileType: data.f_photo_filetype,
                                isUploaded: data.f_photo_path !== '',
                            },
                            handlePhoto: {
                                originFilename: data.f_handle_filename,
                                filePath: data.f_handle_path,
                                uploadedFilePath: data.f_handle_show,
                                isImage: isImageType(data.f_handle_filetype),
                                fileType: data.f_handle_filetype,
                                isUploaded: data.f_handle_path !== '',
                            },
                            registerForm: {
                                originFilename: data.f_register_filename,
                                filePath: data.f_register_path,
                                uploadedFilePath: data.f_register_show,
                                isImage: isImageType(data.f_register_filetype),
                                fileType: data.f_register_filetype,
                                isUploaded: data.f_register_path !== '',
                            },
                        };

                        dispatch(updateUploadFields(files));
                        dispatch(updateApplyStatus({
                            applyCount: data.f_num,
                            isFirst: data.is_first,
                            applyStatus: data.is_pass,
                            applyEdit: data.is_edit === 1,
                            applyFailCause: data.f_first_cause,
                            canSubmitFirst: (!data.is_first && data.f_num > 0) || (!!data.f_license_path &&
                                !!data.f_photo_path &&
                                !!data.f_handle_path &&
                                !!data.f_register_path &&
                                data.f_num > 0),
                        }));
                    }
                } else {
                    message.error('系统繁忙');
                    // dispatch(CommonModalActions.setModalContent('系统繁忙'));
                    // dispatch(CommonModalActions.togglePromptModal(true));
                }
            });
    };
}

export function firstApply() {
    return (dispatch, getState) => {
        const applyState = getState().applySwitchboard;
        const {
            filePath: licensePath,
            fileType: licenseType,
            originFilename: licenseFilename,
        } = applyState.license;
        const {
            filePath: photoPath,
            fileType: photoType,
            originFilename: photoFilename,
        } = applyState.legalPhoto;
        const {
            filePath: handlePath,
            fileType: handleType,
            originFilename: handleFilename,
        } = applyState.handlePhoto;
        const {
            filePath: registerPath,
            fileType: registerType,
            originFilename: registerFilename,
        } = applyState.registerForm;

        if (isNaN(Number(applyState.applyCount))) {
            message.error('申请号码数量请填写数字');
            // dispatch(CommonModalActions.setModalContent('申请号码数量请填写数字'));
            // dispatch(CommonModalActions.togglePromptModal(true));
            return false;
        }
        
        let url = ApiUrls.applyFirst;
        const data = applyState.isFirst ? {
            license_path: licensePath,
            license_filetype: licenseType,
            license_filename: licenseFilename,
            photo_path: photoPath,
            photo_filetype: photoType,
            photo_filename: photoFilename,
            handle_path: handlePath,
            handle_filetype: handleType,
            handle_filename: handleFilename,
            register_path: registerPath,
            register_filetype: registerType,
            register_filename: registerFilename,
            num: applyState.applyCount,
        } : {
            num: applyState.applyCount,
        };

        if (applyState.applyEdit) {
            url = ApiUrls.applyFirstEdit;
        }

        return restHub.postForm(url, {
            body: data,
        }).then(({
            errorMsg
        }) => {
            if (!errorMsg) {
                dispatch(toggleSubmitModal(false));
                message.success('资料提交成功');
                // dispatch(CommonModalActions.setModalContent('资料提交成功'));
                // dispatch(CommonModalActions.togglePromptModal(true));
                dispatch(updateApplyStatus({
                    applyEdit: true,
                }));
            } else {
                dispatch(toggleSubmitModal(false));
                message.error(errorMsg);
                // dispatch(CommonModalActions.setModalContent(errorMsg));
                // dispatch(CommonModalActions.togglePromptModal(true));
            }
        });
    };
}

export function secondApply() {
    return (dispatch, getState) => {
        const applyState = getState().applySwitchboard;
        const {
            filePath: promisePath,
            fileType: promiseType,
            originFilename: promiseFilename,
        } = applyState.promiseForm;
        const {
            filePath: acceptPath,
            fileType: acceptType,
            originFilename: acceptFilename,
        } = applyState.acceptanceForm;

        const url = ApiUrls.applySecond;
        const data = {
            promise_path: promisePath,
            promise_filetype: promiseType,
            promise_filename: promiseFilename,
            accept_path: acceptPath,
            accept_filetype: acceptType,
            accept_filename: acceptFilename,
            is_mail: applyState.isMaterialMailed ? 1 : 0,
        };

        return restHub.postForm(url, {
            body: data,
        }).then(({
            errorMsg
        }) => {
            if (!errorMsg) {
                dispatch(toggleSubmitModal(false));
                message.success('资料提交成功');
                // dispatch(CommonModalActions.setModalContent('资料提交成功'));
                // dispatch(CommonModalActions.togglePromptModal(true));
                dispatch(updateApplyStatus({
                    applyEdit: true,
                }));
            } else {
                dispatch(toggleSubmitModal(false));
                message.error(errorMsg);
                // dispatch(CommonModalActions.setModalContent(errorMsg));
                // dispatch(CommonModalActions.togglePromptModal(true));
            }
        });
    };
}

export function toggleMailed(payload) {
    return {
        type: ApplyActionTypes.TOGGLE_MAILED,
        payload,
    };
}

export function beforeUploadToOss(payload) {
    return {
        type: ApplyActionTypes.BEFORE_OSS_UPLOAD,
        payload,
    };
}

export function afterUploadToOss(payload) {
    return {
        type: ApplyActionTypes.AFTER_OSS_UPLOAD,
        payload,
    };
}

export function uploadToOss(payload) {
    return (dispatch) => {
        const {
            url,
            data,
            uploadType
        } = payload;
        return restHub.uploadFile(url, {
            body: data,
        }).then(() => {
            dispatch(afterUploadToOss({
                key: uploadType
            }));
        }).catch(() => {
            message.error('上传失败');
            // dispatch(CommonModalActions.setModalContent('上传失败'));
            // dispatch(CommonModalActions.togglePromptModal(true));
        });
    };
}

export function getUploadSignatureSuccess(key, data) {
    return {
        type: ApplyActionTypes.GET_UPLOAD_SIGNATURE_SUCCESS,
        payload: {
            key,
            data,
        },
    };
}

export function getUploadSignature(payload) {
    return (dispatch) => {
        const {
            params,
            file,
            uploadType
        } = payload;
        return restHub.postForm(ApiUrls.uploadSignature, {
            body: params,
        }).then(({
            errorMsg,
            jsonResult
        }) => {
            if (!errorMsg) {
                const {
                    url,
                    sign,
                    objectName,
                    filepath
                } = jsonResult.data;
                const data = {
                    key: objectName,
                    policy: sign.policy,
                    OSSAccessKeyId: sign.accessid,
                    success_action_status: '200',
                    signature: sign.signature,
                    file,
                };
                dispatch(getUploadSignatureSuccess(uploadType, {
                    originFilename: params.name,
                    uploadedFilePath: filepath,
                    filePath: objectName,
                    isImage: isImageType(params.type),
                    fileType: params.type,
                }));
                dispatch(uploadToOss({
                    url,
                    data,
                    uploadType
                }));
            } else {
                message.error(errorMsg);
                // dispatch(CommonModalActions.setModalContent(errorMsg));
                // dispatch(CommonModalActions.togglePromptModal(true));
                // 重置上传组件状态
                dispatch(updateUploadField(uploadType, {
                    isUploading: false,
                    uploadText: '点击上传',
                }));
            }
        });
    };
}

export function toggleResultModalVisible(payload) {
    return {
        type: ApplyActionTypes.TOGGLE_RESULT_MODAL_VISIBLE,
        payload,
    };
}

export function getApplyNumbersSuccess(payload) {
    return {
        type: ApplyActionTypes.GET_APPLY_NUMBERS_SUCCESS,
        payload,
    };
}

export function getApplyNumbers(payload) {
    return (dispatch) => restHub
        .postForm(ApiUrls.applyNumbers, {
            body: payload   
        })
        .then(({
            errorMsg,
            jsonResult
        }) => {
            if (!errorMsg) {
                dispatch(getApplyNumbersSuccess(jsonResult));
            } else {
                message.error(errorMsg);
                // dispatch(CommonModalActions.setModalContent(errorMsg));
                // dispatch(CommonModalActions.togglePromptModal(true));
            }
        });
}

export function setOriginalImageUrl(payload) {
    return {
        type: ApplyActionTypes.SET_ORIGINAL_IMAGE_URL,
        payload,
    };
}

export function toggleFullImageViewer(payload) {
    return {
        type: ApplyActionTypes.TOGGLE_FULL_IMAGE_VIEWER,
        payload,
    };
}

export function setApplyCount(payload) {
    return {
        type: ApplyActionTypes.SET_APPLY_COUNT,
        payload,
    };
}