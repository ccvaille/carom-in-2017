/*eslint-disable */
var ajax = require('../../utils/ajax');
require('../../utils/trim');
var customMsgActs = require('./customMsg');
var consts = require('../../modules/const'),
    POST_MSG_TYPES = consts.POST_MSG_TYPES,
    WINDOW_MODES = consts.WINDOW_MODES;

var actTypes = {
    SHOW_LEAVE_MSG_BOARD: 'SHOW_LEAVE_MSG_BOARD',
    SET_MSG_INPUT_VALUE: 'SET_MSG_INPUT_VALUE',
    SET_MSG_INPUT_VALIDATE_RESULT: 'SET_MSG_INPUT_VALIDATE_RESULT',
    SET_MSG_FORM_VALIDATE_RESULT: 'SET_MSG_FORM_VALIDATE_RESULT',
    SET_MSG_INPUT_TIP: 'SET_MSG_INPUT_TIP',
    SET_MSG_INPUT_TIP_TIMER: 'SET_MSG_INPUT_TIP_TIMER',
    SET_SUBMITTING: 'SET_SUBMITTING',
    SET_SUBMITED: 'SET_SUBMITED',
    SET_CODE_RANDOM: 'SET_CODE_RANDOM',
    UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
    RESETSET_MSG_INPUT_VALUE: 'RESETSET_MSG_INPUT_VALUE',
};
var topWindow = window.opener ? window.opener.top : window.top;

var msgBoardActs = {
    actTypes: actTypes,
    leaveingMsgBoard: function (isLeavingMsg) {
        return {
            type: actTypes.SHOW_LEAVE_MSG_BOARD,
            payload: {
                isLeavingMsg: isLeavingMsg
            }
        };
    },
    setInputValue: function (name, value) {
        switch (name) {
            case 'title':
                value = value.substr(0, 10);
                break;
            case 'name':
                value = value.substr(0, 20);
                break;
            case 'tel':
                value = value.substr(0, 20);
                break;
            case 'qq':
                value = value.substr(0, 12);
                break;
            case 'email':
                value = value.substr(0, 100);
                break;
            case 'note':
                value = value.substr(0, 200);
                break;
            default:
                break;
        }
        return {
            type: actTypes.SET_MSG_INPUT_VALUE,
            payload: {
                name: name,
                value: value
            }
        };
    },
    resetSetInputValue: function (values) {
        return {
            type: actTypes.RESETSET_MSG_INPUT_VALUE,
            payload: {
                values: values,
            }
        }
    },
    setInputTip: function (index, tip) {
        return {
            type: actTypes.SET_MSG_INPUT_TIP,
            payload: {
                index: index,
                tip: tip
            }
        };
    },
    setTimeTimer: function (index, tipTimer) {
        return {
            type: actTypes.SET_MSG_INPUT_TIP_TIMER,
            payload: {
                index: index,
                tipTimer: tipTimer
            }
        };
    },
    changeCode: function () {
        return {
            type: actTypes.SET_CODE_RANDOM
        };
    },
    validateInput: function (name, index) {
        return function (dispatch, getState) {
            var msgBoardState = getState().msgBoard,
                isMobile = getState().app.isMobile,
                validateConfig = msgBoardState.msgBoardForm.eles[index].validateConfig,
                values = msgBoardState.values,
                val = values[name].trim(),
                result = true,
                tip = '';

            if (validateConfig.isRequired && !val) {
                result = false;
                tip = validateConfig.errorTip.isRequired;

                // if (isMobile && name === 'code') {
                //     result = true;
                //     tip = '';
                // }
            }
            if (val && validateConfig.regExp && !validateConfig.regExp.test(val)) {
                result = false;
                tip = validateConfig.errorTip.regExp;
            }
            if (val && validateConfig.maxLength && values.length > validateConfig.maxLength) {
                result = false;
                tip = validateConfig.errorTip.maxLength;
            }
            dispatch(msgBoardActs.setInputValidateResult(result, tip, index));
        };
    },
    validateForm: function () {
        return function (dispatch, getState) {
            var msgBoardState = getState().msgBoard,
                formEles = msgBoardState.msgBoardForm.eles,
                values = msgBoardState.values;

            dispatch(msgBoardActs.setFormValidateResult(true));
            formEles.forEach(function (item, index) {
                dispatch(msgBoardActs.validateInput(item.name, index));
            });
            if (getState().msgBoard.msgBoardForm.validateResult) {
                dispatch(msgBoardActs.submit());
            }
        };
    },
    setInputValidateResult: function (result, tip, index) {
        return function (dispatch, getState) {
            var tipTimer = getState().msgBoard.msgBoardForm.eles[index].tipTimer;

            dispatch({
                type: actTypes.SET_MSG_INPUT_VALIDATE_RESULT,
                payload: {
                    inputIndex: index,
                    pass: result,
                    tip: tip
                }
            });
            if (!result && tip) {
                if (tipTimer) {
                    clearTimeout(tipTimer);
                    tipTimer = undefined;
                }
                tipTimer = setTimeout(function () {
                    dispatch(msgBoardActs.setInputTip(index, ''));
                }, 3000);
            }
            dispatch(msgBoardActs.setTimeTimer(index, tipTimer));
            !result && dispatch(msgBoardActs.setFormValidateResult(false));
        };
    },
    setFormValidateResult: function (pass) {
        return {
            type: actTypes.SET_MSG_FORM_VALIDATE_RESULT,
            payload: {
                pass: pass
            }
        };
    },
    setFormSubmitting: function (isSubmitting) {
        return {
            type: actTypes.SET_SUBMITTING,
            payload: {
                isSubmitting: isSubmitting
            }
        };
    },
    setFormSubmited: function (isSubmited) {
        return {
            type: actTypes.SET_SUBMITED,
            payload: {
                isSubmited: isSubmited
            }
        }
    },
    removeSessionToTop: function () {
        topWindow.postMessage(JSON.stringify({
            event: POST_MSG_TYPES.REMOVE_SESSION
        }), '*');
    },
    submit: function () {
        return function (dispatch, getState) {
            var msgBoardState = getState().msgBoard;
                appState = getState().app,
                isSubmitting = msgBoardState.isSubmitting,
                values = msgBoardState.values,
                corpid = appState.corpid,
                guid = appState.guid,
                csid = appState.csid,
                isMobile = appState.isMobile,
                windowMode = appState.windowMode;

            if (isSubmitting) {
                return;
            }

            dispatch(msgBoardActs.setFormSubmitting(true));

            ajax.getJSON('//kf.ecqun.com/index/message/leavemessage', {
                corpid: corpid,
                userid: csid,
                guid: guid,
                title: values.title.trim(),
                name: values.name.trim(),
                phone: values.tel.trim(),
                qq: values.qq.trim(),
                email: values.email.trim(),
                content: values.note.trim(),
                code: values.code.trim(),
                cskey: window.ec_cskey
            }, function (re) {
                dispatch(msgBoardActs.setFormSubmitting(false));
                dispatch(msgBoardActs.changeCode());
                if (re.code === 40010) {
                    // 验证码错误
                    dispatch(msgBoardActs.setInputValidateResult(false, '请输入正确的验证码', 6));
                    return false;
                }
                if (re.code !== 200) {
                    alert(re.msg);
                    return;
                }
                dispatch(msgBoardActs.setFormSubmited(true));
                // dispatch(customMsgActs.leaveMsgSuccess());
                // alert(re.msg);

                // if (isMobile || windowMode === WINDOW_MODES.STANDARD) {
                //     window.close();
                // } else {
                //     msgBoardActs.removeSessionToTop();
                // }
            });
        };
    }
};

module.exports = msgBoardActs;
