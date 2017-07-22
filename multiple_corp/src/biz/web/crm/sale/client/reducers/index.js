import { combineReducers } from 'redux';
import { message } from 'antd';
import Message from '../components/Message'
import {
  GET_SALEMONEY_INDEX,
  GET_SALEMONEY_INDEX_REQUEST,
  GET_SALEMONEY_INDEX_SUCCESS,
  GET_SALEMONEY_INDEX_FAILURE,

  SHOWPARAMS,
  SHOWPARAMS_REQUEST,
  SHOWPARAMS_SUCCESS,
  SHOWPARAMS_FAILURE,

  ADDGROUP,
  ADDGROUP_REQUEST,
  ADDGROUP_SUCCESS,
  ADDGROUP_FAILUER,

  EDITGROUP,
  EDITGROUP_REQUEST,
  EDITGROUP_SUCCESS,
  EDITGROUP_FAILURE,

  HANDLEFIELD,
  HANDLEFIELD_REQUEST,
  HANDLEFIELD_SUCCESS,
  HANDLEFIELD_FAILURE,

  DELGROUP,
  DELGROUP_REQUEST,
  DELGROUP_SUCCESS,
  DELGROUP_FAILURE,

  MOVEGROUP,
  MOVEGROUP_REQUEST,
  MOVEGROUP_SUCCESS,
  MOVEGROUP_FAILUER,

  DELFIELD,
  DELFIELD_REQUEST,
  DELFIELD_SUCCESS,
  DELFIELD_FAILURE,

  MOVEFIELD,
  MOVEFIELD_REQUEST,
  MOVEFIELD_SUCCESS,
  MOVEFIELD_FAILURE,

  UPDATE_FIELD,
  SELECT_TYPE,

  REPEATING_FIELD,
  MODAL_VISIBLE,

  POST_SUCCESS,

  NAME_VALID,
  NAME_UNVALID,
  SHOW_GUIDE_CHANGE

} from '../actions/types'

const initialState = {
  corpData: {
    step: 0,
    type: ''
  },
  groupList: [],
  saveStatus: 200,
  currentLabels: [],//当前需要显示的b
  isPosting: false,//请求是否在发送中
  isColorVisible: false, //颜色弹窗是否显示
  leftWarn: {},
  loadComponent: false,
  isWelcome: false,
  isManageModal: false,
  manageModalLabels: []
}


function postsByReddit(state = {}, action) {
  const newState = Object.assign({}, initialState, state);
  return newState;
}


// 1 get salemoney index
const initStateSalemoneyIndex = {}
function salemoneyIndex(state = {}, action) {
  switch (action.type) {
    case GET_SALEMONEY_INDEX_SUCCESS:
      const newState = Object.assign({}, initStateSalemoneyIndex, state, action.data)
      return newState
    default:
      return state
  }
}

// 2 get showparams
const initStateShowparams = {}
function showparams(state = {}, action) {
  switch (action.type) {
    case SHOWPARAMS_SUCCESS:
      const newState = Object.assign({}, initStateShowparams, state, action.data)
      return newState
    default:
      return state
  }
}

// 3 post addgroup
const initStateAddgroup = {}
function addgroup(state = {}, action) {
  switch (action.type) {
    case ADDGROUP_SUCCESS:
      const newState = Object.assign({}, initStateAddgroup, state, action.data)
      return newState
    default:
      return state
  }
}

// 4 post editgroup
const initStateEditgroup = {}
function editgroup(state = {}, action) {
  switch (action.type) {
    case EDITGROUP_SUCCESS:
      const newState = Object.assign({}, initStateEditgroup, state, action.data)
      return newState
    default:
      return state
  }
}

// 5 post handlefield
const initStateHandlefield = {}
function handlefield(state = {}, action) {
  switch (action.type) {
    case HANDLEFIELD_SUCCESS:
      const newState = Object.assign({}, initStateHandlefield, state, action.data)
      return newState
    default:
      return state
  }
}

// 6 post delgroup
const initStateDelgroup = {}
function delgroup(state = {}, action) {
  switch (action.type) {
    case DELGROUP_SUCCESS:
      const newState = Object.assign({}, initStateDelgroup, state, action.data)
      return newState
    default:
      return state
  }
}

// 7 post movegroup
const initStateMovegroup = {}
function movegroup(state = {}, action) {
  switch (action.type) {
    case MOVEGROUP_SUCCESS:
      const newState = Object.assign({}, initStateMovegroup, state, action.data)
      return newState
    default:
      return state
  }
}

// 8 post delfield
const initStateDelfield = {}
function delfield(state = {}, action) {
  switch (action.type) {
    case DELFIELD_SUCCESS:
      const newState = Object.assign({}, initStateDelfield, state, action.data)
      return newState
    default:
      return state
  }
}


// 9 post movefield
const initStateMovefield = {}
function movefield(state = {}, action) {
  switch (action.type) {
    case GET_SALEMONEY_INDEX_SUCCESS:
      const newState = Object.assign({}, initStateMovefield, state, action.data)
      return newState
    default:
      return state
  }
}

// 10 ui updatefield
const initUpdatedField = {isUpdata:false}
function updatedField(state = {}, action) {
  switch (action.type) {
    case UPDATE_FIELD:
      const newState = Object.assign({}, state, action.data)
      return newState
    default:
      return state
  }
}

// 11 select type
function fieldType(state = {}, action) {
  switch (action.type) {
    case SELECT_TYPE:
      const newState = Object.assign({}, state, action.data)
      return newState
    default:
      return state
  }
}

// 12 repeating field
function isRepeatingField(state = {}, action) {
  switch (action.type) {
    case REPEATING_FIELD:
      const newState = action.data
      return newState
    default:
      return state
  }
}

// 13 modal visible
function modalIsVisible(state = {}, action) {
  switch (action.type) {
    case MODAL_VISIBLE:
      const newState = Object.assign({}, state, action.data)
      return newState
    default:
      return state
  }
}


// 14 success message
function showSuccessMessage(state = {}, action) {
  switch (action.type) {
    case POST_SUCCESS:
      const newState = Object.assign({}, state, action.data)
      return newState
    default:
      return state
  }
}

// 15
function isNameValid(state = {isNameValid:false}, action) {
  switch (action.type) {
    case NAME_VALID:
      return Object.assign({}, state, { isNameValid: action.data });
    case NAME_UNVALID:
      return Object.assign({}, state, { isNameValid: action.data });
    default:
      return state
  }
}

// 16
function isShowGuide(state = {isShowGuide:false}, action) {
  switch (action.type) {
    case SHOW_GUIDE_CHANGE:
      return Object.assign({}, state, { isShowGuide: action.data });
    default:
      return state
  }
}





export default {
  postsByReddit,
  salemoneyIndex, // 1
  showparams, // 2
  addgroup, // 3
  editgroup, // 4
  handlefield, // 5
  delgroup, // 6
  movegroup, // 7
  delfield, // 8
  movefield, // 9
  updatedField, // 10
  fieldType, // 11
  isRepeatingField, // 12
  modalIsVisible, // 13
  showSuccessMessage, // 14
  isNameValid, //15
  isShowGuide
}
