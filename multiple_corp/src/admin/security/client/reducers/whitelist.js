import * as WhitelistActionTypes from 'constants/WhitelistActionTypes';

const initialState = {
  whitelists: [],
  whitelistsPage: {
    curr: 1,
    per: 15,
    totalcount: 0,
    totalPage: 1,
  },
  corpIdsToRemove: [],
  addCorps: ['', '', '', '', ''],
  addModalVisible: false,
  searchKeyword: '',
  whitelistParams: {
    word: '',
    page: 1,
  },
  removeConfirmVisible: false,
};

function whitelist(state = initialState, action) {
  switch (action.type) {
    case WhitelistActionTypes.GET_WHITELIST_SUCCESS: {
      // const mockData = [];
      // for (let i = 0; i < 20; i++) {
      //   mockData.push(action.payload.data[0]);
      // }
      return {
        ...state,
        whitelists: action.payload.data || [],
        whitelistsPage: action.payload.page || initialState.whitelistsPage,
      };
    }
    case WhitelistActionTypes.TOGGLE_ADD_MODAL:
      return {
        ...state,
        addModalVisible: action.payload,
      };
    case WhitelistActionTypes.TOGGLE_REMOVE_VISIBLE:
      return {
        ...state,
        removeConfirmVisible: action.payload,
      };
    case WhitelistActionTypes.ADD_CORPS_TO_REMOVE:
      return {
        ...state,
        corpIdsToRemove: action.payload,
      };
    case WhitelistActionTypes.ADD_CORPS_CHANGE: {
      const addCorpsCopy = [...state.addCorps];
      const { num, value } = action.payload;
      addCorpsCopy[num] = value;
      return {
        ...state,
        addCorps: addCorpsCopy,
      };
    }
    case WhitelistActionTypes.RESET_ADD_CORPS:
      return {
        ...state,
        addCorps: ['', '', '', '', ''],
      };
    case WhitelistActionTypes.UPDATE_SEARCH_KEYWORD:
      return {
        ...state,
        searchKeyword: action.payload,
      };
    case WhitelistActionTypes.UPDATE_WHITELIST_PARAMS:
      return {
        ...state,
        whitelistParams: {
          ...state.whitelistParams,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

export default whitelist;
