import moment from 'moment';

export const headerHeight = 40;
export const contentPadding = 20;
export const tableHeaderHeight = 40;
export const tablePaginationHeight = 60;
export const baseTableScrollDelta = headerHeight + contentPadding + tableHeaderHeight + tablePaginationHeight + 20;
export const dateFormat = 'YYYY-MM-DD';
export const baseStatsTableScrollDelta = baseTableScrollDelta + 53;

export const datePickerHeight = 50;
export const today = moment().format(dateFormat);

export const OFFLINE_TYPE = {
    TIM_KICKED: 'TIM_KICKED',
    EC_OFFLINE: 'EC_OFFLINE',
};

export const CLICK_FLOAT_NATIVE_TYPE = {
    NEW_SESSION_CLICKED: '1',
    NEW_MSG_CLICKED: '2',
    LEAVE_MSG_CLICKED: '3',
};

export const ADD_CS_PERMISSION = 1;
export const ADD_CS_MANAGER_PERMISSION = 2;
// const ADD_WECHAT_CS_PERMISSION = 3;
export const REMOVE_CS_PERMISSION = -ADD_CS_PERMISSION
export const REMOVE_CS_MANAGER_PERMISSION = -ADD_CS_MANAGER_PERMISSION;
// const REMOVE_WECHAT_CS_PERMISSION = -ADD_WECHAT_CS_PERMISSION;

export const COMMON_CS_TYPE = '0';
export const CS_MANAGER_TYPE = '1';
export const WECHAT_CS_TYPE = '2';
export const PERMISSION_TURN_OFF = '0';
export const PERMISSION_TURN_ON = '1';
