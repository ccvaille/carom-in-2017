import Event from '../modules/Event';
import { EVENT_TYPES } from '../modules/const';

let webim;
const eccs = window.ec_cs;

export class TXIM extends Event {
    static instance;

    constructor(opts) {
        super();
        if (TXIM.instance) return TXIM.instance;
        this.init(opts);

        TXIM.instance = this;
        return this;
    }

    init(opts) {
        webim = opts.webim;
        window.webim = undefined;

        this.opts = opts;
    }
    bindEvents() {
        this.listeners = {
            onConnNotify: (re) => {
                switch (re.ErrorCode) {
                    case webim.CONNECTION_STATUS.ON:
                        webim.Log.warn(`建立连接成功${re.ErrorInfo}`);
                        break;
                    case webim.CONNECTION_STATUS.OFF:
                        webim.Log.warn(`连接已断开，无法收到新消息，请检查下你的网络是否正常: ${re.ErrorInfo}`);
                        break;
                    case webim.CONNECTION_STATUS.RECONNECT:
                        webim.Log.warn(`连接状态恢复正常: ${re.ErrorInfo}`);
                        break;
                    default:
                        break;
                }
            },
            jsonpCallback: (rspData) => {
                webim.setJsonpLastRspData(rspData);
            },
            onMsgNtify: (msgs) => {
                msgs.forEach(msg => eccs.emit(EVENT_TYPES.ON_MESSAGE, msg));
            },
        };
    }
    login() {
        webim.login(this.opts.loginInfo, this.listeners, {
            isLogOn: true,
        }, () => {
            eccs.emit(EVENT_TYPES.ON_TXIM_LOGIN);
        });
    }
    logout() {
        webim.logout();
        eccs.emit(EVENT_TYPES.ON_TXIM_LOGOUT);
    }
    getHistoryUnreadNums() {
        webim.syncMsgs((re) => {
            const unreadMsgs = {};
            re.forEach(msg => {
                const id = msg.getSession().id();
                if (!unreadMsgs[id]) unreadMsgs[id] = [];
                unreadMsgs[id].push(msg);
            });
            for (let id in unreadMsgs) {
                eccs.emit(EVENT_TYPES.ON_GET_UNREAD_NUMS, {
                    id,
                    unreadNum: unreadMsgs[id].length,
                });
            }
        });
    }
}
