import * as CsGroupsActionTypes from 'constants/CsGroupsActionTypes';

const initialState = {
    addGroupModalVisible: false,
    csGroups: [],
    totalCsNum: 0,
};

function csGroups(state = initialState, action) {
    switch (action.type) {
        case CsGroupsActionTypes.UPDATE_GROUP_ERROR_MSG:
            return {
                ...state,
                groupErrorMsg: action.payload,
            };
        case CsGroupsActionTypes.GET_CS_GROUPS_SUCCESS: {
            const groups = action.payload.data && (action.payload.data.list || []);
            const managerNum = action.payload.data && (action.payload.data.mangers || 0);
            let total = 0;
            if (groups.length) {
                groups.forEach((group) => {
                    total += group.totalcs;
                });
            }
            return {
                ...state,
                csGroups: groups,
                totalCsNum: total + managerNum,
            };
        }
        case CsGroupsActionTypes.UP_GROUP_ORDER: {
            const index = action.payload;
            const groups = JSON.parse(JSON.stringify(state.csGroups));

            if (index <= 0) {
                return state;
            } else if (index >= groups.length) {
                return state;
            }

            const prevIndex = index - 1;
            [groups[prevIndex], groups[index]] = [groups[index], groups[prevIndex]];

            return {
                ...state,
                csGroups: groups,
            };
        }
        case CsGroupsActionTypes.DOWN_GROUP_ORDER: {
            const index = action.payload;
            const groups = JSON.parse(JSON.stringify(state.csGroups));

            if (index < 0) {
                return state;
            } else if (index >= groups.length - 1) {
                return state;
            }

            const nextIndex = index + 1;
            [groups[index], groups[nextIndex]] = [groups[nextIndex], groups[index]];

            return {
                ...state,
                csGroups: groups,
            };
        }
        case CsGroupsActionTypes.ADD_OR_EDIT_GROUP_LOCAL: {
            const { id, name } = action.payload;
            if (id) {
                return {
                    ...state,
                    csGroups: state.csGroups.map((group) => {
                        if (group.f_id === id) {
                            return {
                                ...group,
                                f_group_name: name,
                            };
                        }

                        return group;
                    }),
                };
            }

            return {
                ...state,
                csGroups: state.csGroups.concat([{
                    f_group_name: action.payload.name,
                }]),
            };
        }
        case CsGroupsActionTypes.REMOVE_GROUP_LOCAL: {
            const groups = state.csGroups.filter(group => group.f_id !== action.payload);

            return {
                ...state,
                csGroups: groups,
            };
        }
        default:
            return state;
    }
}

export default csGroups;
