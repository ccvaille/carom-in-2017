import * as H5FormTypes from 'constants/H5FormTypes';

const initialState = {
	forms: [],
	activeTab: "4", //tab初始化active 4是无选中，1，2, 3是选中的
	activeTabGroupMenu: localStorage ?
        (localStorage.getItem('activeTabGroupMenu')-0 || 1) : 1,
	activeTabTimeMenu: localStorage ? (localStorage.getItem('activeTabGroupMenu') == 4 ?
        1 : (localStorage.getItem('activeTabTimeMenu')-0 || 1)) : 1,
	menuSelectedFilterData: [],
	formList: {
		totalpage: 1,
		curr: 1,
		data: []
	},
	isFormLoading: false,
	isRefreshing: false,
	activeTagIds: {},
    sureActiveTagIds: {},
    isDeptRead: localStorage ? (localStorage.getItem('isDeptRead')-0 ? true : false) : false
};

function H5FormReducers(state = initialState, action) {
	switch(action.type) {
		case H5FormTypes.EXAMPLE:
			return {
				...state,
				forms: action.payload
			}
		case H5FormTypes.ACTIVE_TAB:
			return {
				...state,
				activeTab: action.payload
			}
		case H5FormTypes.ACTIVE_TAB_GROUP_MENU:
			return {
				...state,
				activeTabGroupMenu: action.payload
			}
		case H5FormTypes.ACTIVE_TAB_TIME_MENU:
			return {
				...state,
				activeTabTimeMenu: action.payload
			}
		case H5FormTypes.CLASS_LIST:
			return {
				...state,
				menuFilterData: action.payload
			}
		case H5FormTypes.ADD_FORM_LIST:
			const {
				formList
			} = state;
			return {
				...state,
				formList: {
					totalpage: action.payload.totalpage,
					curr: action.payload.curr,
					data: action.payload.data ?
						formList.data.concat(action.payload.data) : formList.data
				}
			}
		case H5FormTypes.INIT_FORM_LIST:
			return {
				...state,
				formList: {
					totalpage: action.payload.totalpage,
					curr: action.payload.curr,
					data: action.payload.data
				}
			}
		case H5FormTypes.IS_FORM_LOADING:
			return {
				...state,
				isFormLoading: action.payload
			}
		case H5FormTypes.IS_REFRESHING:
			return {
				...state,
				isRefreshing: action.payload
			}
		case H5FormTypes.SAVE_ACTIVE_TAGID:
                let saveTagId = JSON.parse(JSON.stringify(state.activeTagIds));
				saveTagId[action.payload[0]] = action.payload[1];
			return {
				...state,
				activeTagIds: saveTagId
			}
		case H5FormTypes.CANCEL_ACTIVE_TAGID:
			return {
				...state,
				activeTagIds: {},
                sureActiveTagIds: {}
			}
        case H5FormTypes.CLEAR_FORM_LIST:
            return {
                ...state,
                formList: {
                    totalpage: 1,
                    curr: 1,
                    data: []
                },
            }
        case H5FormTypes.GET_ROLE:
            return {
                ...state,
                isDeptRead: action.payload
            }
        case H5FormTypes.SURE_SET_ACTIVE:
            let sureTagId = JSON.parse(JSON.stringify(state.activeTagIds));
            return {
                ...state,
                sureActiveTagIds: sureTagId
            }
        case H5FormTypes.RESET_ACTIVE_TAGID:
            let resetTagId = JSON.parse(JSON.stringify(state.sureActiveTagIds));
            return {
                ...state,
                activeTagIds: resetTagId
            }
		default:
			return state
	}
}

export default H5FormReducers;
