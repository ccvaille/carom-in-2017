import * as VisitorDetailsActionTypes from 'constants/VisitorDetailsActionTypes';

const initialState = {
    isShowDetail: true,
    isClientStored: false,
    duplicateModalVisible: false,
    duplicateModalContent: '',
    duplicateCrmId: 0,
    crmInfos: {},
    activeInfoTab: '0',
    isInfoSaved: 0,
    currentCrmInfo: {
        crmid: 0,
        name: '',
        sex: '0',
        mobile: '',
        phone: '',
        email: '',
        qq: '',
        memo: '',
        url: '',
        company: '',
        address: '',
        act: '0',
        username: '',
    },
    originCrmInfo: {
        crmid: 0,
        name: '',
        sex: '0',
        mobile: '',
        phone: '',
        email: '',
        qq: '',
        memo: '',
        url: '',
        company: '',
        address: '',
    },
    errorKeys: {
        name: {
            show: false,
            isTip: false,
            content: '',
        },
        mobile: {
            show: false,
            isTip: false,
            content: '',
        },
        email: {
            show: false,
            isTip: false,
            content: '',
        },
        qq: {
            show: false,
            isTip: false,
            content: '',
        },
        memo: {
            show: false,
            isTip: false,
            content: '',
        },
        url: {
            show: false,
            isTip: false,
            content: '',
        },
        company: {
            show: false,
            isTip: false,
            content: '',
        },
        address: {
            show: false,
            isTip: false,
            content: '',
        },
    },
};

function visitorDetail(state = initialState, action) {
    switch (action.type) {
        case VisitorDetailsActionTypes.UPDATE_INFO_SAVED_STATUS:
            return {
                ...state,
                isInfoSaved: action.payload,
            };
        case VisitorDetailsActionTypes.TOGGLE_VISITOR_DETAIL_SHOW:
            return {
                ...state,
                isShowDetail: action.payload,
            };
        case VisitorDetailsActionTypes.GET_CRM_INFO_SUCCESS:
            return {
                ...state,
                currentCrmInfo: action.payload,
                originCrmInfo: action.payload,
                crmInfos: {
                    ...state.crmInfos,
                    [action.payload.crmid]: action.payload,
                },
            };
        case VisitorDetailsActionTypes.RESET_CRM_INFO:
            return {
                ...state,
                currentCrmInfo: initialState.currentCrmInfo,
            };
        case VisitorDetailsActionTypes.RESET_CRM_INFO_ERROR:
            return {
                ...state,
                errorKeys: initialState.errorKeys,
            };
        case VisitorDetailsActionTypes.UPDATE_CRM_INFO_FIELDS: {
            const { fields } = action.payload;
            const key = Object.keys(fields)[0];
            const value = fields[key].value;
            const currentCrmId = state.currentCrmInfo.crmid;

            if (currentCrmId) {
                return {
                    ...state,
                    currentCrmInfo: {
                        ...state.currentCrmInfo,
                        [key]: value,
                    },
                    crmInfos: {
                        ...state.crmInfos,
                        [currentCrmId]: {
                            ...state.crmInfos[currentCrmId],
                            [key]: value,
                        },
                    },
                };
            }

            return {
                ...state,
                currentCrmInfo: {
                    ...state.currentCrmInfo,
                    [key]: value,
                },
            };
        }
        case VisitorDetailsActionTypes.SYNC_TO_ORIGINAL_INFO: {
            return {
                ...state,
                originCrmInfo: state.currentCrmInfo,
            };
        }
        case VisitorDetailsActionTypes.UPDATE_CRM_INFO_ERROR: {
            const { key, update } = action.payload;
            return {
                ...state,
                errorKeys: {
                    ...state.errorKeys,
                    [key]: {
                        ...state.errorKeys[key],
                        ...update,
                    },
                },
            };
        }
        case VisitorDetailsActionTypes.RESTORE_FORM_FIELD_VALUE: {
            const key = action.payload;
            const currentCrmId = state.currentCrmInfo.crmid;

            if (key === 'all') {
                if (currentCrmId) {
                    return {
                        ...state,
                        currentCrmInfo: state.originCrmInfo,
                        crmInfos: {
                            [currentCrmId]: state.originCrmInfo,
                        },
                    };
                }

                return {
                    ...state,
                    currentCrmInfo: state.originCrmInfo,
                };
            }

            if (currentCrmId) {
                return {
                    ...state,
                    currentCrmInfo: {
                        ...state.currentCrmInfo,
                        [key]: state.originCrmInfo[key],
                    },
                    crmInfos: {
                        ...state.crmInfos,
                        [currentCrmId]: {
                            ...state.crmInfos[currentCrmId],
                            [key]: state.originCrmInfo[key],
                        },
                    },
                };
            }

            return {
                ...state,
                currentCrmInfo: {
                    ...state.currentCrmInfo,
                    [key]: state.originCrmInfo[key],
                },
            };
        }
        case VisitorDetailsActionTypes.UPDATE_CLIENT_STORED:
            return {
                ...state,
                isClientStored: action.payload,
            };
        case VisitorDetailsActionTypes.CRM_DUPLICATE_MODAL_TOGGLE:
            return {
                ...state,
                duplicateModalVisible: action.payload.visible,
                duplicateModalContent: action.payload.content,
            };
        case VisitorDetailsActionTypes.UPDATE_DUPLICATE_CRM_ID:
            return {
                ...state,
                duplicateCrmId: action.payload,
            };
        case VisitorDetailsActionTypes.UPDATE_INFO_ACTIVE_TAB_KEY:
            return {
                ...state,
                activeInfoTab: action.payload,
            };
        default:
            return state;
    }
}

export default visitorDetail;
