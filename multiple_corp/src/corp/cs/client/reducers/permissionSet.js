import * as PermissionSetActionTypes from 'constants/PermissionSetActionTypes';

const initialState = {
    addGroupModalVisible: false,
    editCsModalVisible: false,
    csGroups: [],
    csList: [],
    csPagination: {
        current: 1,
        total: 0,
        pageSize: 10,
    },
    currentEditCs: {
        csId: '',
        name: '',
        contact: '', // 职位，不想改名了
        email: '',
        mobile: '',
        tel: '',
        isManager: 0,
        isCs: 0,
        groupId: '',
        showQQ: 0, // 0: QQ客服关闭， 1：开启
        qqNumber: '12121312', // 授权的QQ号
        isQQFirst: 0, // 是否优先使用QQ接待
    },
    csModalVisible: false,
    csRemoveModalVisible: false,
    activeGroupId: '',
    csFormErrorMsg: '',
    // qqCsStatus: 0,  // 是否授权QQ客服
};

function permissionSet(state = initialState, action) {
    switch (action.type) {
        case PermissionSetActionTypes.UPDATE_CS_FORM_ERROR_MSG:
            return {
                ...state,
                csFormErrorMsg: action.payload,
            };
        case PermissionSetActionTypes.UPDATE_ACTIVE_CS_GROUP:
            return {
                ...state,
                activeGroupId: action.payload,
            };
        case PermissionSetActionTypes.GET_CS_GROUPS_SUCCESS:
            return {
                ...state,
                csGroups: action.payload.data || [],
            };
        case PermissionSetActionTypes.GET_CS_LIST_SUCCESS: {
            const { jsonResult, groupId } = action.payload;
            const { data } = jsonResult;

            if (groupId === 'all' || groupId === '' || groupId === '0') {
                const { manager, cs } = data;

                if (!manager || !cs) {
                    return state;
                }

                // const managerLength = manager.length - 1;

                /* eslint-disable no-param-reassign */
                manager.forEach((m) => {
                    // m[index] = index;
                    m.type = 'manager';
                });

                cs.forEach((csInfo) => {
                    // csInfo[index] = index + managerLength;
                    csInfo.type = 'cs';
                });

                return {
                    ...state,
                    csList: manager.concat(cs),
                };
            }

            data.forEach((csInfo, index) => {
                csInfo[index] = index;
                csInfo.type = 'cs';
            });
            /* eslint-enable no-param-reassign */

            return {
                ...state,
                csList: data,
            };
        }
        case PermissionSetActionTypes.UPDATE_CURRENT_EDIT_CS_INFO:
            /* eslint-disable eqeqeq */
            return {
                ...state,
                currentEditCs: {
                    ...action.payload,
                    groupId: action.payload.groupId == 0 ? '' : action.payload.groupId,
                    showQQ: action.payload.showQQ || 0,
                } || {
                    ...initialState.currentEditCs,
                    groupId: state.activeGroupId || '',
                },
            };
            /* eslint-enable eqeqeq */
        case PermissionSetActionTypes.TOGGLE_CS_MODAL_VISIBLE:
            return {
                ...state,
                csModalVisible: action.payload,
            };
        case PermissionSetActionTypes.TOGGLE_CS_REMOVE_MODAL_VISIBLE:
            return {
                ...state,
                csRemoveModalVisible: action.payload,
            };
        case PermissionSetActionTypes.GET_CS_INFO_SUCCESS:
            return {
                ...state,
                currentEditCs: {
                    ...action.payload,
                    isManager: state.currentEditCs.isManager || 0,
                    isCs: state.currentEditCs.isCs || 0,
                    groupId: state.currentEditCs.groupId !== '' ? state.currentEditCs.groupId : state.activeGroupId,
                    showQQ: state.currentEditCs.showQQ,
                },
            };
        case PermissionSetActionTypes.UPDATE_CS_INFO_FIELDS: {
            const { fields } = action.payload;
            const key = Object.keys(fields)[0];
            let value = fields[key].value;
            let extra = {};
            let formError = state.csFormErrorMsg;

            if (key === 'isManager' || key === 'isCs' || key === 'isQQFirst') {
                value = value ? 1 : 0;
            }

            if (
                (key === 'isManager' && value === 1 && state.currentEditCs.isCs !== 1) ||
                (key === 'isCs' && value === 0 && state.currentEditCs.isManager === 1)
            ) {
                extra = {
                    groupId: '',
                };
            }
            /* eslint-disable eqeqeq */
            if (
                key === 'groupId'
                && value != 0
                && formError.indexOf('选择分组') > -1
            ) {
                formError = '';
            }
            /* eslint-enable eqeqeq */
            if (
                (key === 'isCs' || key === 'isManager')
                && value === 1
                && formError.indexOf('选择角色') > -1
            ) {
                formError = '';
            }

            return {
                ...state,
                currentEditCs: {
                    ...state.currentEditCs,
                    [key]: value,
                    ...extra,
                },
                csFormErrorMsg: formError,
            };
        }

        // 是否授权QQ客服
        // case PermissionSetActionTypes.GET_QQ_CS_STATUS_SUCCESS:
        //     return {
        //         ...state,
        //         qqCsStatus: action.payload,
        //     };
        default:
            return state;
    }
}

export default permissionSet;
