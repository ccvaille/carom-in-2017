import * as AppActionTypes from '../constants/AppActionTypes';
import {
    OFFLINE_TYPE,
    ADD_CS_PERMISSION,
    ADD_CS_MANAGER_PERMISSION,
    REMOVE_CS_PERMISSION,
    REMOVE_CS_MANAGER_PERMISSION,
} from '../constants/shared';

const dashboardMenu = {
    title: '综合数据',
    icon: 'pie-chart',
    link: '/kf/client/dashboard',
};

const chatMenu = {
    title: '访客接待',
    icon: 'message',
    link: '/kf/client/chat',
};

const visitorMenu = {
    title: '访客列表',
    icon: 'solution',
    link: '/kf/client/visitors',
};

const historyMenu = {
    title: '接待记录',
    icon: 'clock-circle',
    link: '/kf/client/history',
};

const quickReplyMenu = {
    title: '快捷回复',
    icon: 'fast-reply',
    link: '/kf/client/quickreply',
};

const statsMenu = {
    title: '数据统计',
    icon: 'bar-chart',
    link: '/kf/client/statistics',
};

const initialState = {
    initialized: false,
    corpid: '',
    userInfo: {
        corpid: '',
        userid: '',
        iscs: 0,
        ismanager: 1,
        isoldmanager: 0,
        name: '',
        key: '',
    },
    menus: [],
    offlineModalVisible: false,
    offlineType: OFFLINE_TYPE.EC_OFFLINE,
    activeMenu: -1,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case AppActionTypes.INIT_APP: {
            const data = action.payload;
            let menus = [];

            if (data.ismanager === 1) {
                if (data.iscs === 1) {
                    menus = [
                        dashboardMenu,
                        chatMenu,
                        visitorMenu,
                        historyMenu,
                        quickReplyMenu,
                        statsMenu,
                    ];
                } else {
                    menus = [dashboardMenu, visitorMenu, historyMenu, quickReplyMenu, statsMenu];
                }
            } else if (data.iscs === 1) {
                menus = [chatMenu, visitorMenu, historyMenu, quickReplyMenu];
            }

            return {
                ...state,
                corpid: data.corpid,
                userInfo: data,
                menus,
                initialized: true,
            };
        }
        case AppActionTypes.TOGGLE_OFFLINE_MODAL:
            return {
                ...state,
                offlineModalVisible: action.payload,
            };
        case AppActionTypes.UPDATE_OFFLINE_TYPE:
            return {
                ...state,
                offlineType: action.payload,
            };
        case AppActionTypes.UPDATE_ACTIVE_MENU:
            return {
                ...state,
                activeMenu: action.payload,
            };
        case AppActionTypes.UPDATE_APP_MENUS: {
            const menuCopy = JSON.parse(JSON.stringify(state.menus));
            switch (action.payload) {
                case ADD_CS_PERMISSION:
                    menuCopy.splice(1, 0, chatMenu);
                    return {
                        ...state,
                        menus: menuCopy,
                    };
                case ADD_CS_MANAGER_PERMISSION:
                    return {
                        ...state,
                        menus: [
                            dashboardMenu,
                            ...state.menus,
                            statsMenu,
                        ],
                    };
                case REMOVE_CS_PERMISSION:
                    return {
                        ...state,
                        menus: state.menus.filter(menu => menu.link !== '/kf/client/chat'),
                    };
                case REMOVE_CS_MANAGER_PERMISSION:
                    return {
                        ...state,
                        menus: state.menus.filter(menu => (menu.link !== '/kf/client/dashboard' && menu.link !== '/kf/client/statistics')),
                    };
                default:
                    break;
            }
            return state;
        }
        case AppActionTypes.UPDATE_USER_INFO:
            return {
                ...state,
                userInfo: {
                    ...state.userInfo,
                    ...action.payload,
                },
            };
        default:
            return state;
    }
};
