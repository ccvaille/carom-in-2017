import * as InviteSettingActionTypes from 'constants/InviteSettingActionTypes';

const initialState = {
    pc: {
        theme: 0, // 0: 信封模式；1: 便签模式
        content: '', // 邀请内容
        allowAutoInvite: 1, // show 主动邀请 0: 不显示； 1: 显示
        allowAutoInviteAgain: 1, // inviteAgain 访客关闭邀请框后，是否可以再次邀请 0: 不允许； 1: 允许
        autoInviteInterval: 30, // inviteInter 主动邀请间隔
        defer: 30, // 页面加载 xx 秒后，显示邀请框
        closeDelay: 60, // delay, xx 秒后自动关闭邀请框
        allowManualInvite: 1, // inviteActive 是否允许手动邀请 0: 不允许； 1: 允许
        allowManualInviteAgain: 1, // activeinviteAgain 是否允许手动再次邀请 0: 不允许； 1: 允许
        manualInviteInterval: 10, // activeinviteInter 手动邀请间隔
        floatPosition: 0, // float 位置: 0居中, 1右下角, 2左下角, 3底部
    },
    mobile: {
        theme: 0, // 0: 信封模式；1: 便签模式
        content: '', // 邀请内容
        allowAutoInvite: 1, // show 主动邀请 0: 不显示； 1: 显示
        allowAutoInviteAgain: 1, // inviteAgain 访客关闭邀请框后，是否可以再次邀请 0: 不允许； 1: 允许
        autoInviteInterval: 30, // inviteInter 主动邀请间隔
        defer: 30, // 显示邀请框延迟时间
        closeDelay: 60, // delay, xx 秒后自动关闭邀请框
        allowManualInvite: 1, // inviteActive 是否允许手动邀请 0: 不允许； 1: 允许
        allowManualInviteAgain: 1, // activeinviteAgain 是否允许手动再次邀请 0: 不允许； 1: 允许
        manualInviteInterval: 10, // activeinviteInter 手动邀请间隔
        floatPosition: 0, // float 位置: 0居中, 1右下角, 2左下角, 3底部
    },
};

const minSecond = 1;
const maxSecond = 9999;
const hasLimitKey = ['autoInviteInterval', 'defer', 'closeDelay', 'manualInviteInterval'];

function inviteSetting(state = initialState, action) {
    switch (action.type) {
        case InviteSettingActionTypes.GET_INVITE_SETTING_SUCCESS: {
            const { jsonResult, type } = action.payload;
            let haveData = false;
            if (!Array.isArray(jsonResult) && Object.keys(jsonResult).length > 0) {
                haveData = true;
            }

            if (jsonResult.defer === 0) {
                jsonResult.defer = 30;
            }

            if (jsonResult.inviteInter === 0 || !jsonResult.inviteInter) {
                jsonResult.inviteInter = 30;
            }

            if (jsonResult.activeinviteInter === 0) {
                jsonResult.activeinviteInter = 10;
            }

            if (jsonResult.delay === 0) {
                jsonResult.delay = 60;
            }

            return {
                ...state,
                [type]: haveData ? {
                    theme: jsonResult.theme,
                    content: jsonResult.content,
                    allowAutoInvite: jsonResult.show,
                    allowAutoInviteAgain: jsonResult.inviteAgain,
                    autoInviteInterval: jsonResult.inviteInter,
                    defer: jsonResult.defer,
                    closeDelay: jsonResult.delay,
                    allowManualInvite: jsonResult.inviteActive,
                    allowManualInviteAgain: jsonResult.activeinviteAgain,
                    manualInviteInterval: jsonResult.activeinviteInter,
                    floatPosition: jsonResult.float,
                } : initialState[type],
            };
        }
        case InviteSettingActionTypes.UPDATE_INVITE_SETTING_FIELDS: {
            const { fields, type } = action.payload;
            const key = Object.keys(fields)[0];
            let value = fields[key].value;
            if (key === 'allowManualInviteAgain') {
                value = value ? 1 : 0;
            }

            if (hasLimitKey.indexOf(key) > -1) {
                if (value === 0) {
                    value = minSecond;
                } else if (!value) {
                    value = '';
                } else if (value < minSecond) {
                    value = minSecond;
                } else if (value > maxSecond) {
                    value = maxSecond;
                } else if (isNaN(value)) {
                    value = minSecond;
                }
            }

            if (key === 'content') {
                value = value.substring(0, 50);
            }

            return {
                ...state,
                [type]: {
                    ...state[type],
                    [key]: value,
                },
            };
        }
        default:
            return state;
    }
}

export default inviteSetting;
