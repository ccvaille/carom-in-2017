import * as AppealActionTypes from 'constants/AppealManageActionTypes';

const initialState = {
  appealList: [],
  appealListPage: {
    curr: 1,
    per: 15,
    totalcount: 0,
    totalPage: 1,
  },
  appealParams: {
    status: -1,
    user_id_or_name: '',
    appealMobile: '',
    page: 1,
  },
  searchUser: '',
  searchPhone: '',
  releaseSuccssVisible: false,
  releaseFailVisible: false,
  handleModalVisible: false,
  releaseResultType: 0,
  currentReleaseId: '',
  appealHandleVisible: false,
};

function apealManage(state = initialState, action) {
  switch (action.type) {
    case AppealActionTypes.GET_APPEAL_LIST_SUCCESS: {
      // const mockData = action.payload.data.map(m => {
      //   m.f_status = '1';
      //   return m;
      // });
      return {
        ...state,
        appealList: action.payload.data || [],
        // appealList: mockData,
        appealListPage: action.payload.page || initialState.appealListPage,
      };
    }
    case AppealActionTypes.UPDATE_SEARCH_USER:
      return {
        ...state,
        searchUser: action.payload,
      };
    case AppealActionTypes.UPDATE_SEARCH_PHONE:
      return {
        ...state,
        searchPhone: action.payload,
      };
    case AppealActionTypes.UPDATE_APPEAL_PARAMS:
      return {
        ...state,
        appealParams: {
          ...state.appealParams,
          ...action.payload,
        },
      };
    case AppealActionTypes.APPEAL_HANDLE_VISIBLE_TOGGLE:
      return {
        ...state,
        [`appealHandleVisible${action.payload.id}`]: action.payload.open,
      };
    case AppealActionTypes.RELEASE_MODAL_VISIBLE_TOGGLE:
      return {
        ...state,
        releaseSuccssVisible: action.payload,
      };
    case AppealActionTypes.RELEASE_FAIL_MODAL_VISIBLE_TOGGLE:
      return {
        ...state,
        releaseFailVisible: action.payload,
      };
    case AppealActionTypes.HANDLE_MODAL_VISIBLE_TOGGLE:
      return {
        ...state,
        handleModalVisible: action.payload,
      };
    case AppealActionTypes.SET_RELEASE_RESULT_TYPE:
      return {
        ...state,
        releaseResultType: action.payload,
      };
    case AppealActionTypes.SET_CURRENT_RELEASE_ID:
      return {
        ...state,
        currentReleaseId: action.payload,
      };
    default:
      return state;
  }
}

export default apealManage;
