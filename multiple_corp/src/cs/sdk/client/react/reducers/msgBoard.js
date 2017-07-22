/*eslint-disable */
var actTypes = require('../actions/msgBoard').actTypes;
var getLanguagePackage = require('../../utils/locale');
var localeKey = getLanguagePackage(window.sessionData ? window.sessionData.language : 0);
var initialState = {
    isLeavingMsg: false,
    isSubmitting: false,
    isSubmited: false,
    values: {
        title: '',
        name: '',
        tel: '',
        qq: '',
        email: '',
        note: '',
        code: ''
    },
    codeRandomParam: Math.random(),
    msgBoardForm: {
        validateResult: false,
        eles: [
            {
                name: 'title',
                label: localeKey.leaveMsgTitle,
                placeholder: '',
                type: 'text',
                validateConfig: {
                    // isRequired: true,
                    errorTip: {
                        isRequired: localeKey.title_Required
                    }
                },
                pass: true,
                tip: ''
            }, {
                name: 'name',
                label: localeKey.name,
                placeholder: '',
                type: 'text',
                validateConfig: {
                    isRequired: true,
                    errorTip: {
                        isRequired: localeKey.name_Required
                    }
                },
                pass: true,
                tip: ''
            }, {
                name: 'tel',
                label: localeKey.tel,
                placeholder: '',
                type: 'text',
                validateConfig: {
                    isRequired: true,
                    regExp: /^\+?[\d](\-?\d)*$/,
                    maxLength: 20,
                    errorTip: {
                        isRequired: localeKey.tel_Required,
                        regExp: localeKey.tel_regExp,
                        maxLength: localeKey.tel_regExp
                    }
                },
                pass: true,
                tip: ''
            }, {
                name: 'qq',
                label: localeKey.qq,
                placeholder: '',
                type: 'text',
                validateConfig: {
                    regExp: /^[1-9]\d{4,14}$/,
                    errorTip: {
                        regExp: localeKey.qq_regExp
                    }
                },
                pass: true,
                tip: ''
            }, {
                name: 'email',
                label: localeKey.email,
                placeholder: '',
                type: 'text',
                validateConfig: {
                    regExp: /^\w+([\.-]\w+)*@\w+([\.-]\w+)*\.\w+([-\.]\w+)*$/,
                    errorTip: {
                        regExp: localeKey.email_regExp
                    }
                },
                pass: true,
                tip: ''
            }, {
                name: 'note',
                label: localeKey.content,
                placeholder: '',
                type: 'textarea',
                validateConfig: {
                    isRequired: true,
                    errorTip: {
                        isRequired: localeKey.content_Required
                    }
                },
                pass: true,
                tip: ''
            }, {
                name: 'code',
                label: localeKey.identifyCode,
                type: 'text',
                // placeholder: 'Identifying Code',
                validateConfig: {
                    isRequired: true,
                    errorTip: {
                        isRequired: localeKey.code_Required,
                        error: localeKey.code_regExp
                    }
                },
                pass: true,
                tip: ''
            }
        ]
    },
    language: 0
};

module.exports = function (state, action) {
    state = state || initialState;

    var newState = Object.assign({}, state);

    switch (action.type) {
        case actTypes.SHOW_LEAVE_MSG_BOARD:
            newState.isLeavingMsg = action.payload.isLeavingMsg;
            return newState;
        case actTypes.SET_MSG_INPUT_VALUE:
            newState.values[action.payload.name] = action.payload.value;
            return newState;
        case actTypes.RESETSET_MSG_INPUT_VALUE:
            newState.values = action.payload.values;
            return newState;
        case actTypes.SET_MSG_INPUT_VALIDATE_RESULT:
            newState.msgBoardForm.eles[action.payload.inputIndex].pass = action.payload.pass;
            newState.msgBoardForm.eles[action.payload.inputIndex].tip = action.payload.tip;
            return newState;
        case actTypes.SET_MSG_FORM_VALIDATE_RESULT:
            newState.msgBoardForm.validateResult = action.payload.pass;
            return newState;
        case actTypes.SET_MSG_INPUT_TIP:
            newState.msgBoardForm.eles[action.payload.index].tip = action.payload.tip;
            return newState;
        case actTypes.SET_MSG_INPUT_TIP_TIMER:
            newState.msgBoardForm.eles[action.payload.index].tipTimer = action.payload.tipTimer;
            return newState;
        case actTypes.SET_SUBMITTING:
            newState.isSubmitting = action.payload.isSubmitting;
            return newState;
        case actTypes.SET_SUBMITED:
            newState.isSubmited = action.payload.isSubmited;
            return newState;
        case actTypes.SET_CODE_RANDOM:
            newState.codeRandomParam = Math.random();
            return newState;
        default:
            return newState;
    }
};
