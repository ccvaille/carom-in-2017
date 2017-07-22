import * as ApplyListActionTypes from "constants/ApplyListActionTypes";

const initialState = {
    applyData: [],
    fileList: [],
    phoneList: [],
    totalPhoneList: '',
    applyListPage: {
        curr: 1,
        per: 10,
        totalcount: 0,
        totalpage: 1
    },
    extra: {
        corpcount: 0,
        sum_num: 0
    },
    applyListParams: {
        corp: "",
        agent: "",
        curr: 1,
        status: 0
    },
    applyPassVisible: false,
    applyRefuseVisible: false,
    modifyPhoneVisible: false,
    currentPassId: "",
    currentPassType: 0,
    currentPassNum: 0,
    currentRefuseId: "",
    modifyPhoneId: "",
    errorLabelsIndex: [],
    passPhoneList: ['']
};

function applyList(state = initialState, action) {
    switch (action.type) {
        case ApplyListActionTypes.GET_APPLY_LIST_SUCCESS: {
            const { page, extra } = action.payload;
            let { data } = action.payload;
            if (!data) {
                data = [];
            }

            const ajustData = data.map(d => {
                d.submitFiles = [];
                let firstResult = "";
                let secondResult = "";
                switch (d.first_status) {
                    case 1:
                        firstResult = "待审核";
                        break;
                    case 2:
                        firstResult = "通过";
                        break;
                    case 3:
                        firstResult = "不通过";
                        break;
                    default:
                        break;
                }

                switch (d.second_status) {
                    case 1:
                        secondResult = "待审核";
                        break;
                    case 2:
                        secondResult = "通过";
                        break;
                    case 3:
                        secondResult = "不通过";
                        break;
                    default:
                        break;
                }
                // if (d.f_is_pass === '0') {
                //   firstResult = '待审核';
                // } else if (d.f_is_pass === '1') {
                //   firstResult = '通过';
                //   secondResult = '待审核';
                // } else if (d.f_is_pass === '2') {
                //   firstResult = '不通过';
                // } else if (d.f_is_pass === '3') {
                //   firstResult = '通过';
                //   secondResult = '通过';
                // } else if (d.f_is_pass === '4') {
                //   firstResult = '通过';
                //   secondResult = '不通过';
                // }
                d.submitFiles.push({
                    title: "首次资料提交",
                    comment: d.f_first_cause,
                    time: d.f_first_mtime,
                    result: firstResult,
                    type: 1,
                    canOperate: true,
                    canPass: Number(d.f_is_pass) === 0 ||
                        Number(d.f_is_pass) === 2,
                    canRefuse: Number(d.f_is_pass) === 0 ||
                        Number(d.f_is_pass) === 2
                });

                d.submitFiles.push({
                    title: "二次资料提交",
                    comment: d.f_second_cause,
                    time: d.f_second_mtime,
                    result: secondResult,
                    type: 2,
                    canOperate: (Number(d.f_is_pass) === 1 ||
                        Number(d.f_is_pass) > 2) &&
                        d.f_second_mtime,
                    canPass: Number(d.f_is_pass) === 1 ||
                        Number(d.f_is_pass) === 4,
                    canRefuse: Number(d.f_is_pass) === 1 ||
                        Number(d.f_is_pass) === 4
                });

                return d;
            });
            return {
                ...state,
                applyData: ajustData,
                applyListPage: page || initialState.applyListPage,
                extra: extra || initialState.extra
            };
        }
        case ApplyListActionTypes.GET_FILES_SUCCESS: {
            const { fid, data } = action.payload;

            if (fid === 1) {
                const names = ["license", "photo", "handle", "register"];
                const firstData = [];
                names.forEach(name => {
                    firstData.push({
                        filename: data[`f_${name}_filename`],
                        downloadPath: data[`f_${name}_path`]
                    });
                });

                return {
                    ...state,
                    fileList: firstData
                };
            } else if (fid === 2) {
                const names = ["promise", "accept"];
                const secondData = [];
                names.forEach(name => {
                    secondData.push({
                        filename: data[`f_${name}_filename`],
                        downloadPath: data[`f_${name}_path`]
                    });
                });

                return {
                    ...state,
                    fileList: secondData
                };
            }

            return state;
        }
        case ApplyListActionTypes.RESET_FILE_LIST:
            return {
                ...state,
                fileList: []
            };
        case ApplyListActionTypes.GET_PHONE_LIST_SUCCESS:
            return {
                ...state,
                phoneList: action.payload.data,
                totalPhoneList: action.payload.page.total,
            };
        case ApplyListActionTypes.RESET_PHONE_LIST:
            return {
                ...state,
                phoneList: []
            };
        case ApplyListActionTypes.UPDATE_LIST_PARAMS:
            return {
                ...state,
                applyListParams: {
                    ...state.applyListParams,
                    ...action.payload
                }
            };
        case ApplyListActionTypes.TOGGLE_APPLY_PASS_VISIBLE:
            return {
                ...state,
                applyPassVisible: action.payload
            };
        case ApplyListActionTypes.TOGGLE_APPLY_REFUSE_VISIBLE:
            return {
                ...state,
                applyRefuseVisible: action.payload
            };
        case ApplyListActionTypes.TOGGLE_MODIFY_PHONE_VISIBLE:
            return {
                ...state,
                modifyPhoneVisible: action.payload
            };
        case ApplyListActionTypes.SET_CURRENT_PASS_ID:
            return {
                ...state,
                currentPassId: action.payload
            };
        case ApplyListActionTypes.SET_CURRENT_PASS_TYPE:
            return {
                ...state,
                currentPassType: action.payload
            };
        case ApplyListActionTypes.SET_CURRENT_PASS_NUM:
            return {
                ...state,
                currentPassNum: action.payload
            };
        case ApplyListActionTypes.SET_CURRENT_REFUSE_ID:
            return {
                ...state,
                currentRefuseId: action.payload
            };
        case ApplyListActionTypes.SET_MODDIFY_PHONE_ID:
            return {
                ...state,
                modifyPhoneId: action.payload
            };
        //
        case ApplyListActionTypes.SET_ERROR_LABELSINDEX:
            return {
                ...state,
                errorLabelsIndex: action.payload
            };
        case ApplyListActionTypes.EDIT_MODIFY_PHONE:
            let phoneList = state.phoneList;
            phoneList = phoneList.map((item, index) => {
                if (index === action.payload.index) {
                    return {
                        ...item,
                        f_number: action.payload.number
                    }
                }
                return item;
            });
            return {
                ...state,
                phoneList: phoneList
            };
        case ApplyListActionTypes.ADD_PASS_PHONELIST:
            
            return {
                ...state,
                passPhoneList: state.passPhoneList.concat(action.payload)
            }; 
        case ApplyListActionTypes.DEL_PASS_PHONELIST:
            let list = JSON.parse(JSON.stringify(state.passPhoneList));
            list.splice(action.payload, 1);
            if (!list.length) {
                list = [''];
            } 
            return {
                ...state,
                passPhoneList: list,
                errorLabelsIndex: []
            };
        case ApplyListActionTypes.EDIT_NEW_LABEL:
            let editList = JSON.parse(JSON.stringify(state.passPhoneList));
            editList[action.payload.index] = action.payload.number
            return {
                ...state,
                passPhoneList: editList

            };
        case ApplyListActionTypes.CLEAR_PHONE_LIST:
            return {
                ...state,
                passPhoneList: ['']
            };
        case ApplyListActionTypes.SET_ERROR_LABELSINDEXCHECK:
            return {
                ...state,
                errorLabelsIndex: action.payload
            };
        default:
            return state;
    }
}

export default applyList;
