/*eslint-disable */
var env = process.env.NODE_ENV;
var host = 'http://static.workec.com:8080';
if (env === 'production') {
    // host = window.location.protocol + '//html.workec.com'
    host = window.location.protocol + '//html.ecqun.com'
}

var SESSION_STATUS = {
    MINIMIZED: 'MINIMIZED',
    MAXIMIZED: 'MAXIMIZED'
};

var SESSION_MSG_TYPES = {
    TIP_MSG: 'TIP_MSG',
    CS_TIP_MSG: 'CS_TIP_MSG',
    SESSION_MSG: 'SESSION_MSG'
};

var MSG_STATES = {
    SENDING: 'SENDING',
    SENT: 'SENT',
    UPLOAD_FAILED: 'FAILED_TO_UPLOAD',
    FAILED: 'FAILED_TO_SENT',
    RECEIVED: 'RECEIVED',
    NONE: 'NONE'
};

var HEARTBEAT_TYPES = {
    VIEWING: 0,
    CHATTING: 3
};

var ECIM_EVENTS = {
    SYS_MSG: 'SYS_MSG',
    LOGIN: 'LOGIN',
    QUITE: 'QUITE',
    UPDATED: 'UPDATED',
    SWITCH_CS: 'SWITCH_CS',
    ERROR: 'ECIM_ERROR',
    KICKED: 'KICKED',
    ALREADY_CHATTING: 'ALREADY_CHATTING',
    POLLING_STATUS: 'POLLING_STATUS'
};

var ECIM_STATUS = {
    VIEWING: 0,
    INVITING: 1,
    REJECTD: 2,
    CHATTING: 3,
    CLOSE: 4
};
// 用于接收客服和访客之间互相发送的状态相关的自定义消息 ext.cmd
var CMDS = {
    NEW_SESSION: 1,
    CLOSE_SESSION: 2,
    TIMEOUT: 3,
    SWITCH_CS: 10,
    CS_HAS_BEEN_SWITCHED: 11
};
// 用于发送其他自定义消息 ext.cmd
var FECMDS = {
    PREVIEW_MSG: 'PREVIEW_MSG',
    LEAVE_MSG_SUCCESS: 'LEAVE_MSG_SUCCESS'
};
// 用于接收系统发送的状态相关的自定义消息 msg.data中使用
var CUSTOM_SYS_CMDS = {
    LOCAL: 'locuscommand',
    VISITOR_CHANGE: 'visitorChange',
    CS_CHANGE: 'CustomerStatus',
    CS_HAS_BEEN_SWITCHED: 'CustomerSwitch'
};

var EVENT_TYPES = {
    ON_TXIM_READY: 'ON_TXIM_READY',
    // im
    ON_TXIM_LOGIN: 'ON_TXIM_LOGIN',
    ON_TXIM_LOGOUT: 'ON_TXIM_LOGOUT',
    // session
    ON_SHOW_SESSION: 'ON_SHOW_SESSION',
    ON_NEW_SESSION: 'ON_NEW_SESSION',
    ON_DEL_SESSION: 'ON_DEL_SESSION',
    // message
    ON_SYSTEM_MSGS: 'ON_SYSTEM_MSGS',
    ON_MESSAGES: 'ON_MESSAGES',
    ON_MESSAGE_SENT: 'ON_MESSAGE_SENT',
    ON_GET_UNREAD_NUMS: 'ON_GET_UNREAD_NUMS'
};

var WINDOW_MODES = {
    STANDARD: 0,
    SMALL: 2
};

var EC_NOTIE_TYPES = {
    NEW_SESSION: 1,
    NEW_MSG: 2,
    OFFLINE_MSG: 3
};

var CSLIST_CONT = {
    URL: host + '/kf/sdk/cslist.html'
};

var SESSION_CONF = {
    NAME: 'ec_cs_session',
    URL: host + '/kf/sdk/openwin.html',
    SETTINGS: 'resizable=yes,width=700,height=520,left=100,top=100,status=0,toolbar=0,location=0',
    QQURL: '//wpa.qq.com/msgrd?v=3&site=qq&menu=yes&uin=',
    QQURLSAMLL: 'tencent://message/?uin=',
    QQURLAndroid: 'mqqwpa://im/chat?chat_type=wpa&uin=',
    QQURLIOS: 'mqq://im/chat?chat_type=wpa&version=1&src_type=web&uin='
};

var POST_MSG_TYPES = {
    SELECT_CS: 'SELECT_CS',
    UPDATE_UNREAD_NUMS: 'UPDATE_UNREAD_NUMS',
    SET_SESSION_STATUS: 'SET_SESSION_STATUS',
    SESSION_INITED: 'SESSION_INITED',
    SESSION_KICKED: 'SESSION_KICKED',
    RESIZE_CS_LIST: 'RESIZE_CS_LIST',
    REMOVE_SESSION: 'REMOVE_SESSION',
    RESET_CS_ID: 'RESET_CS_ID',
    HIDE_SAMLL_SESSION: 'HIDE_SAMLL_SESSION'
};

var SAFE_ORIGIN = {
    'http://html.workec.com': '1',
    'https://html.workec.com': '1',
    'http://html.ecqun.com': '1',
    'https://html.ecqun.com': '1',
    'http://static.workec.com:8080': '1',
    'http://kf.ecqun.com': '1',
    'https://kf.ecqun.com': '1'
};

// var RANDOM_CS_TYPES = {
//     GET_RANDOM_CS_ID: 'GET_RANDOM_CS_ID' // 废弃
// };

var COOKIE = {
    LOCAL_STATUS_UPDATED: 'LOCAL_STATUS_UPDATED',
    NAME: 'ec_im_local_status',
    TAB_NUM: 'ec_im_tab_num',
};

// 客服列表模式
var CS_LIST_STYLE = {
    LIST_STYLE: 0,
    BUTTON_STYLE: 1
}

var INIT_CONFIG = {
    listsetpc: {
        autohide: 0,
        bcolor: "#2580e6",
        bmodestyle: 1,
        bpic1: '',
        bpic2: "",
        bpic3: "",
        btncolor: "",
        btntxt: "",
        fixed: 0,
        float: 1,
        fmargin: 0,
        ftop: 50,
        language: 0,
        listrand: 0,
        offhide: 0,
        showstyle: 0,
        theme: 1
    },
    listsetmobile: {
        autohide: 0,
        bcolor: "#2580e6",
        bmodestyle: 3,
        bpic1: '',
        bpic2: "",
        bpic3: "",
        btncolor: "",
        btntxt: "",
        fixed: 0,
        float: 1,
        fmargin: 0,
        ftop: 50,
        language: 0,
        listrand: 0,
        offhide: 0,
        showstyle: 1,
        theme: -1
    },
    talkset: {
        color:"#2580e6",
        mode: 2,
        notice: "",
        noticemsg:"",
        onlinemsg: "您好，请问有什么可以帮到您",
        timeout: 240,
        title: ""
    },
    boxset: {
        show: 1,
        content: '',
        theme: 0,
        defer: 30,
        inviteAgain: 1,
        inviteInter: 30,
        inviteActive: 1,
        activeinviteAgain: 1,
        activeinviteInter: 10,
        delay: 60,
        float: 0,
    }
}

module.exports = {
    host: host,
    SESSION_STATUS: SESSION_STATUS,
    SESSION_MSG_TYPES: SESSION_MSG_TYPES,
    MSG_STATES: MSG_STATES,
    HEARTBEAT_TYPES: HEARTBEAT_TYPES,
    ECIM_STATUS: ECIM_STATUS,
    ECIM_EVENTS: ECIM_EVENTS,
    CMDS: CMDS,
    FECMDS: FECMDS,
    CUSTOM_SYS_CMDS: CUSTOM_SYS_CMDS,
    EVENT_TYPES: EVENT_TYPES,
    WINDOW_MODES: WINDOW_MODES,
    EC_NOTIE_TYPES: EC_NOTIE_TYPES,
    CSLIST_CONT: CSLIST_CONT,
    SESSION_CONF: SESSION_CONF,
    POST_MSG_TYPES: POST_MSG_TYPES,
    SAFE_ORIGIN: SAFE_ORIGIN,
    COOKIE: COOKIE,
    CS_LIST_STYLE: CS_LIST_STYLE,
    INIT_CONFIG: INIT_CONFIG
};
