import * as NumberListActionTypes from 'constants/NumberListActionTypes';

const initialState = {
  numbers: [],
  numberListPage: {
    curr: 1,
    per: 10,
    totalcount: 0,
    totalPage: 1,
  },
  numberListParams: {
    corp: '',
    agent: '',
    status: 0,
    curr: 1,
  },
  extra: {
    corpcount: 0,
    numbernum: 0,
  },
};

function numberList(state = initialState, action) {
  switch (action.type) {
    case NumberListActionTypes.GET_NUMBER_LIST_SUCCESS:
      return {
        ...state,
        numbers: action.payload.data || [],
        numberListPage: action.payload.page || initialState.numberListPage,
        extra: action.payload.extra || initialState.extra,
      };
    case NumberListActionTypes.UPDATE_LIST_PARAMS:
      return {
        ...state,
        numberListParams: {
          ...state.numberListParams,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

export default numberList;
