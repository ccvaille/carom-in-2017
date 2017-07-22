import * as H5FormDataTypes from 'constants/H5FormDataTypes';

const initialState = {
	isDataLoading: false,
	dataList: {
		totalpage: 0,
		curr: 1,
		head: {
			'title': '',
			'allMoney': 0
		},
		data: []
	},
	dataRefreshing: false,
	formId: ''
};

function H5FormDataReducers(state = initialState, action) {
	switch(action.type) {
		case H5FormDataTypes.INIT_DATA_LIST:
			return {
				...state,
				dataList: {
					totalpage: action.payload.totalpage,
					curr: action.payload.curr,
					data: action.payload.data,
					head: action.payload.head
				}
			}
		case H5FormDataTypes.ADD_DATA_LIST:
			const {
				dataList
			} = state;
			return {
				...state,
				dataList: {
					totalpage: action.payload.totalpage,
					curr: action.payload.curr,
					data: dataList.data.concat(action.payload.data),
					head: action.payload.head
				}
			}
		case H5FormDataTypes.IS_DATA_LOADING:
			return {
				...state,
				isDataLoading: action.payload
			}
		case H5FormDataTypes.SET_FORM_ID:
			return {
				...state,
				formId: action.payload
			}
		case H5FormDataTypes.DATA_REFRESHING:
			return {
				...state,
				dataRefreshing: action.payload
			}
        case H5FormDataTypes.CLEAR_DATA_LIST:
            return {
                ...state,
                dataList: {
                    totalpage: 0,
                    curr: 1,
                    head: {
                        'title': state.dataList.head.title || '',
                        'allMoney': state.dataList.head.allMoney || 0
                    },
                    data: []
                },
            }
		default:
			return state
	}
}

export default H5FormDataReducers;
