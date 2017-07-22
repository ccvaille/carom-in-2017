import * as actionTypes from 'constants/loseruleTypes';
import moment from 'moment';

function getDate() {
    const today = moment();
    const maxDay = moment();
    maxDay.add(30, 'd');
    return {
        today,
        maxDay,
    };
}

const defaultState = {
    ...getDate(),
    theRuleIsOpen: false, //收回策略是否为打开状态
    autoChange:false,//是否为系统自动修改的回写时间
    fromCloseToOpen:false,//掉单是否从关闭状态到打开状态
    backRuleNothing: true, //没有任何数据

    isCheckCondition1: false, //强制收回条件1
    conditionText1: '', //收回条件1值
    isCheckCondition2: false, //强制收回条件2
    conditionText2: '', //收回条件2值
    isCheckCondition3: false, //强制收回条件3
    conditionText3: '', //收回条件3值

    contactWays: [{
            label: 'QQ联系',
            value: '1'
        },
        {
            label: '接拨电话',
            value: '2'
        },
        {
            label: '收发邮件',
            value: '3'
        },
        {
            label: '发送短信',
            value: '4'
        },
        {
            label: '添加跟进记录',
            value: '5'
        },
        {
            label: '拜访客户',
            value: '6'
        },
        {
            label: 'EC联系',
            value: '7'
        },
    ], //联系方式选项数据
    checkedContactWays: [], //已选联系方式选项

    isCheckNoSign: false, //客户不具备任何标签
    isCheckCustomSign: false, //客户具备以下标签
    checkedSigns: [], //已选标签数据
    allSignTabList: [], //所有标签数据
    signTabListLoading: false, //标签loading

    isProtocolShow: false, //收回协议是否显示
    isCheckAgreeProtcol: false, //是否同意客户回收协议

    isAlreadyEdit: false, //是否已经修改过回收策略一次

    defaultDate: '', //默认时间
    checkedDate: null, //选择的时间
    resetDate: null, //要回写的日期

    isEarlyWarnShow: false, //是否显示上限预警弹窗
    earlyWarnSendLoading: false, //上限预警loading
    isEarlyWarnEmpty: true, //上限预警数据为空
    checkedEarlyWarnUsers: [], //上限预警名单
    earlyWarnUserNum: '', //上限预警人数阈值
    allUserData: [], //所有员工名单


    isSaveConfirmShow: false, //是否显示保存confirm

    showGuide: false,

    serverData: { //服务器传来数据
        no_contact: '',
        no_connection: '',
        no_update: '',
        contact_type: '',
        tag_set: '',
        status: '',
        effective_time: '',
    },

    backRuleDataLoading: false, //设置掉单规则loading
    backRuleCloseLoading: false, //关闭掉单规则loading

    stage: {
        status: 0,
        names: ['初步沟通', '立项分析', '方案制定', '合同签订']
    },   //客户阶段信息
    tipShow: false
};


function isEmpty(text) {
    if (parseInt(text) > 0) return false;
    return text === null || text == undefined || text == '' || text.trim().length <= 0;
}

function fomatTagSets(array) {
    let value = {
        checkedSigns: []
    };
    for (let i = 0, length = array.length; i < length; i++) {
        let item = array[i];
        if (item.id === 0) {
            value.isCheckNoSign = true;
        } else {
            value.checkedSigns.push(item);
        }
    };
    if (value.checkedSigns.length > 0) {
        value.isCheckCustomSign = true
    };
    return value;
}

function calculateDefaultDate(text) {
    let t = new Date(),
        today = moment({
            y: t.getFullYear(),
            M: t.getMonth(),
            d: t.getDate()
        });
    if (isEmpty(text)) return today.add(2, 'days');
    else {
        let day = moment(text);
        if (day.isBefore(today, 'day') || day.isSame(today, 'day')) {
            return today.add(2, 'days');
        } else {
            return day;
        }
    }
}

function getMoment(text){
    if(isEmpty(text)) return null;
    return moment(text);
}




function backRuleReducers(state = defaultState, action) {
    switch (action.type) {
        case actionTypes.CHANGE_CONDITION1:
            {
                let value = {
                    ...state,
                    isCheckCondition1: action.isCheck,
                };
                if (!(action.isCheck || state.isCheckCondition2 || state.isCheckCondition3)) {
                    value.isCheckCustomSign = false;
                    value.isCheckNoSign = false;
                    value.checkedSigns.length = 0;
                }
                if (!(action.isCheck || state.isCheckCondition2)) {
                    value.checkedContactWays = [];
                }
                if (!action.isCheck && !isEmpty(state.conditionText1)) {
                    value.conditionText1 = '';
                }
                return value;
            }
        case actionTypes.CHANGE_CONDITION2:
            {
                let value = {
                    ...state,
                    isCheckCondition2: action.isCheck,
                };
                if (!(action.isCheck || state.isCheckCondition1 || state.isCheckCondition3)) {
                    value.isCheckCustomSign = false;
                    value.isCheckNoSign = false;
                }
                if (!(action.isCheck || state.isCheckCondition1)) {
                    value.checkedContactWays = [];
                }
                if (!action.isCheck && !isEmpty(state.conditionText2)) {
                    value.conditionText2 = '';
                }
                return value;
            }
        case actionTypes.CHANGE_CONDITION3:
            {
                let value = {
                    ...state,
                    isCheckCondition3: action.isCheck,
                };
                if (!(action.isCheck || state.isCheckCondition1 || state.isCheckCondition2)) {
                    value.isCheckCustomSign = false;
                    value.isCheckNoSign = false;
                }
                if (!action.isCheck && !isEmpty(state.conditionText3)) {
                    value.conditionText3 = '';
                }
                return value;
            }
        case actionTypes.CHANGE_CHECKED_CONTACTWAYS:
            return {
                ...state,
                checkedContactWays: action.checkValue,
            }
        case actionTypes.CHANGE_SIGNS:
            {
                let value = {
                    ...state,
                    isCheckCustomSign: action.isCheck,
                };
                if (!action.isCheck) value.checkedSigns.length = 0;
                return value;
            }
        case actionTypes.CHANGE_AGREE_PROTCOL:
            return {
                ...state,
                isCheckAgreeProtcol: action.isCheck,
            };
        case actionTypes.CHANGE_PROTCOL_SHOW:
            return {
                ...state,
                isProtocolShow: action.isShow
            };
        case actionTypes.CHANGE_AGREE_PROTCOL:
            return {
                ...state,
                checkedContactWays: action.checkValues
            };
        case actionTypes.CHANGE_CON1_TEXT:
            return {
                ...state,
                conditionText1: action.value,
            };
        case actionTypes.CHANGE_CON2_TEXT:
            return {
                ...state,
                conditionText2: action.value,
            };
        case actionTypes.CHANGE_CON3_TEXT:
            return {
                ...state,
                conditionText3: action.value,
            };
        case actionTypes.CHANGE_NOSIGTNS:
            return {
                ...state,
                isCheckNoSign: action.isCheck,
            }
        case actionTypes.CHANGE_EARLYWARN_SHOW:
            return {
                ...state,
                isEarlyWarnShow: action.isShow,
            };
        case actionTypes.GET_RULE_DATA:
            if (action.data.status == undefined) return {
                ...state,
                resetDate: calculateDefaultDate(''),
                backRuleNothing: false,
                showGuide: action.data.show_guide,
                fromCloseToOpen:false,
                stage: action.data.stage
            };
            return {
                ...state,
                theRuleIsOpen: action.data.status === 1,
                isCheckCondition1: !isEmpty(action.data.no_contact),
                conditionText1: action.data.no_contact,
                isCheckCondition2: !isEmpty(action.data.no_connection),
                conditionText2: action.data.no_connection,
                isCheckCondition3: !isEmpty(action.data.no_update),
                conditionText3: action.data.no_update,
                checkedContactWays: action.data.contact_type,
                ...fomatTagSets(action.data.tag_set),
                defaultDate: action.data.effective_time,
                checkedDate: getMoment(action.data.effective_time),
                resetDate: calculateDefaultDate(action.data.effective_time),
                isAlreadyEdit: !action.data.is_editable,
                serverData: action.data,
                showGuide: action.data.show_guide,
                backRuleNothing: false,
                fromCloseToOpen:false,
                stage: action.data.stage
            };
        case actionTypes.CHANGE_BACK_DATE_VALUE:
            return {
                ...state,
                checkedDate: action.date,
            };
        case actionTypes.SHOW_SAVE_CONFIRM:
            return {
                ...state,
                isSaveConfirmShow: action.isShow,
            }
        case actionTypes.LOAD_ALL_USERS:
            if (action.data == undefined) return state;
            return {
                ...state,
                allUserData: action.data,
            }
        case actionTypes.CHANGE_NOTICUSER_ITEM:
            return {
                ...state,
                checkedEarlyWarnUsers: action.array,
            }
        case actionTypes.CHANGE_NOTIC_NUMBER:
            return {
                ...state,
                earlyWarnUserNum: action.number,
            }
        case actionTypes.LOAD_EARLYWARN_DATA:
            {
                if (action.data == undefined) return {
                    ...state,
                    isEarlyWarnEmpty: false,
                };
                let array = action.data.users.map(function (item) {
                    return {
                        id: item.f_user_id,
                        name: item.f_name
                    };
                });
                return {
                    ...state,
                    checkedEarlyWarnUsers: array, //上限预警名单
                    earlyWarnUserNum: action.data.number, //上限预警人数阈值
                    isEarlyWarnEmpty: false,
                }
            }
        case actionTypes.LOAD_SIGNTAB_LIST:
            if (action.data == undefined) return state;
            return {
                ...state,
                allSignTabList: action.data,
            }
        case actionTypes.CHANGE_SIGNLIST_ITEM:
            return {
                ...state,
                checkedSigns: action.array,
            }
        case actionTypes.CHANGE_BACK_RULE_STATE:
            let value=(action.status===1&&state.theRuleIsOpen==false);//从关闭状态到打开状态
            return {
                ...state,
                theRuleIsOpen: action.status === 1,
                fromCloseToOpen:value,
            }
        case actionTypes.CHANGE_SIGNTAB_LIST_LOADING:
            return {
                ...state,
                signTabListLoading: action.isShow,
            }
        case actionTypes.CLOSE_GUIDE:
            return {
                ...state,
                showGuide: false,
            }
            //处理各种loading
        case actionTypes.SEND_EARLYWARN_LOADING:
            return {
                ...state,
                earlyWarnSendLoading: action.isShow,
            }
        case actionTypes.SEND_RULE_DATA_LOADING:
            return {
                ...state,
                backRuleDataLoading: action.isShow,
            }
        case actionTypes.CLOSE_BACK_RULE_LOADING:
            return {
                ...state,
                backRuleCloseLoading: action.isShow,
            }
        case actionTypes.GET_TIP_STATE:
            return {
                ...state,
                tipShow: action.data.num == 0
            }
        case actionTypes.SET_TIP_STATE:
            return {
                ...state,
                tipShow: false
            }
        default:
            return state;
    }
}

export default backRuleReducers;
