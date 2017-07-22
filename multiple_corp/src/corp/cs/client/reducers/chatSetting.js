import * as ChatSettingActionTypes from 'constants/ChatSettingActionTypes';

const hasLimitKey = ['title', 'welcomeMessage', 'notice'];
const initialState = {
    pc: {
        themeColor: '', // color 皮肤颜色
        title: '',
        notice: '', // 公告
        leaveMsgnotice: '您好，我暂时不在线，您可以给我发送短信或者留言。', // 留言板公告
        mode: 0, // 模式 0: 标准；2: 飘窗
        timeout: 240, // 超时时间
        welcomeMessage: '', // onlinemsg 欢迎语
    },
    mobile: {
        themeColor: '', // color 皮肤颜色
        title: '',
        notice: '', // 公告
        leaveMsgnotice: '您好，我暂时不在线，您可以给我发送短信或者留言。', // 留言板公告
        mode: 0, // 模式 0: 标准；2: 飘窗
        timeout: 240, // 超时时间
        welcomeMessage: '', // onlinemsg 欢迎语
    },
};

function chatSetting(state = initialState, action) {
    switch (action.type) {
        case ChatSettingActionTypes.GET_CHAT_SETTING_SUCCESS: {
            const { jsonResult, type } = action.payload;
            let haveData = false;
            if (!Array.isArray(jsonResult) && Object.keys(jsonResult).length > 0) {
                haveData = true;
            }
            return {
                ...state,
                [type]: haveData ? {
                    themeColor: jsonResult.color || '#2580e6',
                    title: jsonResult.title,
                    notice: jsonResult.notice,
                    leaveMsgnotice: jsonResult.noticemsg,
                    mode: jsonResult.mode,
                    timeout: jsonResult.timeout,
                    welcomeMessage: jsonResult.onlinemsg,
                } : {
                    ...initialState[type],
                    themeColor: '#2580e6',
                },
            };
        }
        case ChatSettingActionTypes.UPDATE_CHAT_SETTING_FIELDS: {
            const { fields, type } = action.payload;
            const key = Object.keys(fields)[0];
            let value = fields[key].value;

            if (hasLimitKey.indexOf(key) > -1) {
                switch (key) {
                    case 'title':
                        value = value.substring(0, 20);
                        break;
                    case 'welcomeMessage':
                        value = value.substring(0, 100);
                        break;
                    case 'notice':
                        value = value.substring(0, 100);
                        break;
                    case 'leaveMsgnotice':
                        value = value.substring(0, 100);
                        break;
                    default:
                        break;
                }
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

export default chatSetting;
