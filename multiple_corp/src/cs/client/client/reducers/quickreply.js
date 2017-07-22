import * as QuickReplyActionTypes from 'constants/QuickReplyActionTypes';

const initialState = {
    myReplyGroups: [],
    commonReplyGroups: [],
    originMyReplyGroups: [],
    originCommonReplyGroups: [],
    replies: [],
    pagination: {
        current: 1,
        total: 0,
        pageSize: 10,
    },
    removeGroupModalVisible: false,
    editReplyModalVisible: false,
    removeReplyModalVisible: false,
};

function quickreply(state = initialState, action) {
    switch (action.type) {
        case QuickReplyActionTypes.GET_REPLY_GROUPS_SUCCESS: {
            const {
                commonGroup: commonReplyGroups,
                myGroup: myReplyGroups,
            } = action.payload.data || { commonGroup: [], myGroup: [] };

            return {
                ...state,
                commonReplyGroups,
                myReplyGroups,
                originCommonReplyGroups: commonReplyGroups,
                originMyReplyGroup: myReplyGroups,
            };
        }
        case QuickReplyActionTypes.UPDATE_GROUP_NAME: {
            const { id, name, type } = action.payload;

            switch (type) {
                case 'common':
                    return {
                        ...state,
                        commonReplyGroups: state.commonReplyGroups.map((group) => {
                            if (id === group.f_id) {
                                return {
                                    ...group,
                                    f_name: name,
                                };
                            }
                            return group;
                        }),
                    };
                case 'my':
                    return {
                        ...state,
                        myReplyGroups: state.myReplyGroups.map((group) => {
                            if (id === group.f_id) {
                                return {
                                    ...group,
                                    f_name: name,
                                };
                            }

                            return group;
                        }),
                    };
                default:
                    return state;
            }
        }
        case QuickReplyActionTypes.GET_QUICK_REPLIES_SUCCESS:
            return {
                ...state,
                replies: action.payload.data,
                pagination: action.payload.page || initialState.pagination,
            };
        case QuickReplyActionTypes.ADD_COMMON_GROUP_LOCAL:
            return {
                ...state,
                commonReplyGroups: [{
                    f_name: action.payload,
                }].concat(state.commonReplyGroups),
            };
        case QuickReplyActionTypes.ADD_MY_GROUP_LOCAL:
            return {
                ...state,
                myReplyGroups: [{
                    f_name: action.payload,
                }].concat(state.myReplyGroups),
            };
        case QuickReplyActionTypes.REMOVE_COMMON_GROUP_LOCAL:
            return {
                ...state,
                commonReplyGroups: state.commonReplyGroups.filter(g => g.f_id !== action.payload),
            };
        case QuickReplyActionTypes.REMOVE_MY_GROUP_LOCAL: {
            return {
                ...state,
                myReplyGroups: state.myReplyGroups.filter(g => g.f_id !== action.payload),
            };
        }

        case QuickReplyActionTypes.TOGGLE_REMOVE_GROUP_MODAL_VISIBLE:
            return {
                ...state,
                removeGroupModalVisible: action.payload,
            };
        case QuickReplyActionTypes.TOGGLE_EDIT_REPLY_MODAL_VISIBLE:
            return {
                ...state,
                editReplyModalVisible: action.payload,
            };
        case QuickReplyActionTypes.TOGGLE_REMOVE_REPLY_MODAL_VISIBLE:
            return {
                ...state,
                removeReplyModalVisible: action.payload,
            };
        default:
            return state;
    }
}

export default quickreply;
