import * as SettingActionTypes from "constants/SettingActionTypes";

const initialState = {
    configureType: 0,
    typeOneNumber: "",
    typeTwoNumber: "",
    firstNumber: "",
    isSelectEmployee: false,
    rightedEmployeeId: '',
    settingInfo: [], //后端返回业务配置
    mobileSource: [], //号码配置数据列表
    totalMobileSource: 0,
    rightedEmployees: [],
    settingId: '', //给哪个号码进行业务配置
    mode2Selected: {},//模式二选择的员工
    mode1Info: { //前端处理业务配置信息
        activeType: 1,
        '1': {
            f_uid: '',
            f_uname: '',
            f_phone: ''
        },
        '2': {
            f_uid: '',
            f_uname: '',
            f_phone: ''
        }
    },
    mode2Info: {
        activeType: 3,
        intervalTime: 30,
        employee: [
        ]
    },
    mode: 0 //模式开关
    
};

function switchboardSetting(state = initialState, action) {
    switch (action.type) {
        case SettingActionTypes.GET_SETTING_SUCCESS: {
            const {
                f_conf_type: configure,
                f_contact_num: first_number
            } = action.payload;

            let key = "";
            if (configure === "1") {
                key = "typeOneNumber";
            } else if (configure === "2") {
                key = "typeTwoNumber";
            }

            return {
                ...state,
                configureType: Number(configure),
                firstNumber: first_number,
                [key]: first_number
            };
        }
        case SettingActionTypes.UPDATE_SETTING_TYPE:
            return {
                ...state,
                configureType: action.payload
            };
        case SettingActionTypes.UPDATE_TYPE_ONE_NUMBER:
            return {
                ...state,
                typeOneNumber: action.payload
            };
        case SettingActionTypes.UPDATE_TYPE_TWO_NUMBER:
            return {
                ...state,
                typeTwoNumber: action.payload
            };
        case SettingActionTypes.TOGGLE_SELECTEMPLOYEE:
            return {
                ...state,
                isSelectEmployee: action.payload
            }
        //获取轮转接听
        case SettingActionTypes.GET_ROUND_ANSWER:
            return {
                ...state,
                groundAnswer: action.payload
            }
        //获取号码配置
        case SettingActionTypes.GET_MOBILE_ALLOCATION:
            return {
                ...state,
                mobileSource: action.payload.data,
                totalMobileSource: action.payload.page.total || 0
            }
        //授权员工
        case SettingActionTypes.GET_RIGHTED_EMPLOYEES:
            return {
                ...state,
                rightedEmployees: action.payload
            }
        case SettingActionTypes.RIGHTED_EMPLOYEES:
            let rightedEmployees = state.rightedEmployees;
            if (action.payload.operateType === 'add') {
                rightedEmployees.push({
                    nodeId: action.payload.nodeId,
                    name: action.payload.name,
                    type: action.payload.type
                });
            } else if (action.payload.operateType === 'reduce') {
                rightedEmployees.forEach((item, index, arr) => {
                    if (item.nodeId === action.payload.nodeId) {
                        arr.splice(index, 1);
                    } 
                })
            } else if (action.payload.operateType === 'clear') {
                rightedEmployees = [];
            }
            return {
                ...state,
                rightedEmployees: rightedEmployees
            }
        case SettingActionTypes.TOGGLE_RIGHTED_EMPLOYEE:
            return {
                ...state,
                rightedEmployeeId: action.payload
            }
        case SettingActionTypes.TOGGLE_SETTING:
            return {
                ...state,
                settingId: action.payload
            }
        case SettingActionTypes.SETTING_INFO:
            return {
                ...state,
                settingInfo: action.payload
            }
        case SettingActionTypes.TOGGLE_MODE:
            return {
                ...state,
                mode: action.payload
            }
        //设置mode1配置信息
        case SettingActionTypes.SETMODE1INFO:
            let mode1Info = JSON.parse(JSON.stringify(state.mode1Info));
            action.payload.map((item, index) => {
                if (item.f_conf_type >> 0 === 1) {
                    mode1Info.activeType = 1;
                    mode1Info[1].f_uid = item.f_uid;
                    mode1Info[1].f_uname = item.f_uname;
                    mode1Info[1].f_phone = item.f_uname ? '' : item.f_phone;
                } else if (item.f_conf_type >> 0 === 2) {
                    mode1Info[1].f_uid = item.f_uid;
                    mode1Info.activeType = 2;
                    mode1Info[2].f_uname = item.f_uname;
                    mode1Info[2].f_phone = item.f_uname ? '' : item.f_phone;
                }
            })
            return {
                ...state,
                mode1Info
            }
        //设置mode2配置信息
        case SettingActionTypes.SETMODE2INFO:
            let mode2Info = JSON.parse(JSON.stringify(state.mode2Info));
            let mode2ConfInfo = action.payload.confInfo;
            if (mode2ConfInfo[0]) {
                mode2Info.activeType = mode2ConfInfo[mode2ConfInfo.length-1].f_conf_type >> 0 > 2 ?
                   mode2ConfInfo[mode2ConfInfo.length-1].f_conf_type >> 0 : 3;
            }
            mode2Info.employee = mode2ConfInfo.filter((item, index) => {
                if (item.f_conf_type-0 > 2) {
                    return {f_uid: item.f_uid, f_phone: item.f_phone}
                }
            });
            mode2Info.intervalTime = !(action.payload.f_intval_time >> 0) ? 
                30 : action.payload.f_intval_time >> 0;
                console.log(mode2Info);
            return {
                ...state,
                mode2Info
            }
        case SettingActionTypes.SETMODE1ACTIVETYPE:
            let mode1InfoSetType = JSON.parse(JSON.stringify(state.mode1Info));
            mode1InfoSetType.activeType = action.payload;
            console.log(mode1InfoSetType);
            return {
                ...state,
                mode1Info: mode1InfoSetType
            }
        case SettingActionTypes.SETMODE1INFOPHONE:
            let mode1InfoSetPhone = JSON.parse(JSON.stringify(state.mode1Info));
            mode1InfoSetPhone[action.payload.type].f_phone = action.payload.phone;
            return {
                ...state,
                mode1Info: mode1InfoSetPhone
            }
        case SettingActionTypes.SETMODE1INFOUSER:
            let mode1InfoSetUser = JSON.parse(JSON.stringify(state.mode1Info));
            mode1InfoSetUser[action.payload.type].f_uname = action.payload.userName;
            mode1InfoSetUser[action.payload.type].f_phone = '';
            mode1InfoSetUser[action.payload.type].f_uid = action.payload.userId;
            return {
                ...state,
                mode1Info: mode1InfoSetUser
            }
        case SettingActionTypes.RESETMODE1INFOUSER:
            let resetMode1InfoUser = JSON.parse(JSON.stringify(state.mode1Info));
            resetMode1InfoUser[action.payload].f_uname = '';
            resetMode1InfoUser[action.payload].f_uid = '';
            return {
                ...state,
                mode1Info: resetMode1InfoUser
            }
        //移动轮转员工列表
        case SettingActionTypes.MOVE_ROUNDANSWER_EMPLOYEES:
            let moveMode2Info = JSON.parse(JSON.stringify(state.mode2Info));
            let moveType = action.payload.operateType;
            let moveIndex = action.payload.index;
            if (moveType === 'up') {
                moveMode2Info.employee[moveIndex - 1] = moveMode2Info.employee.
                    splice(moveIndex, 1, moveMode2Info.employee[moveIndex - 1])[0];
            } else if (moveType === 'down') {
                moveMode2Info.employee[moveIndex + 1] = moveMode2Info.employee.
                    splice(moveIndex, 1, moveMode2Info.employee[moveIndex + 1])[0];
            }
            return {
                ...state,
                mode2Info: moveMode2Info
            }
        //删除轮转指定员工
        case SettingActionTypes.DEL_ROUNDANSWER_EMPLOYEES:
            let delMode2Info = JSON.parse(JSON.stringify(state.mode2Info));
            delMode2Info.employee.splice(action.payload.index, 1);
            return {
                ...state,
                mode2Info: delMode2Info
            }
        //添加
        case SettingActionTypes.ADD_ROUNDANSWER_EMPLOYEES:
            let addMode2Info = JSON.parse(JSON.stringify(state.mode2Info)); 
            addMode2Info.employee.push(action.payload);
            return {
                ...state,
                mode2Info: addMode2Info
            }
        case SettingActionTypes.CHANGE_INTERVALTIME:
            let timeMode2Info = JSON.parse(JSON.stringify(state.mode2Info));
            timeMode2Info.intervalTime = action.payload.time;
            return {
                ...state,
                mode2Info: timeMode2Info
            }
        case SettingActionTypes.SET_MODE2_ACTIVETYPE:
            let typeMode2Info = JSON.parse(JSON.stringify(state.mode2Info));
            typeMode2Info.activeType = action.payload;
            return {
                ...state,
                mode2Info: typeMode2Info
            }
        case SettingActionTypes.SET_MODE2_SELECTED:
            return {
                ...state,
                mode2Selected: action.payload
            }
        case SettingActionTypes.SET_MODE2_SELECTEDINPUT:
            let inputMode2Selected = JSON.parse(JSON.stringify(state.mode2Selected));
            inputMode2Selected.phone = action.payload;
            return {
                ...state,
                mode2Selected: inputMode2Selected
            }
        case SettingActionTypes.CLEAR_MODE2_SELECTEDINPUT:
            return {
                ...state,
                mode2Selected: {}
            }

        case SettingActionTypes.CANCELSETTING:
            return {
                ...state,
                settingInfo: [], //后端返回业务配置
                mobileSource: [], //号码配置数据列表
                totalMobileSource: 0,
                rightedEmployees: [],
                settingId: '', //给哪个号码进行业务配置
                mode2Selected: {},
                mode1Info: { //前端处理业务配置信息
                    activeType: 1,
                    '1': {
                        f_uname: '',
                        f_phone: '',
                        f_uid: ''
                    },
                    '2': {
                        f_uname: '',
                        f_phone: '',
                        f_uid: ''
                    }
                },
                mode2Info: {
                    activeType: 3,
                    intervalTime: 30,
                    employee: [
                    ]
                },
                mode: 0 //模式开关
            }
        default:
            return state;
    }
}

export default switchboardSetting;
