import { Fetch_Lists, Clear_Prev_State } from '../actions'

const initialState = {
    helpinfo: [],
    flag: false,
    page: {}
};

function helpListReducer(state = initialState, action) {
  switch (action.type) {
    case Fetch_Lists:
      return {
        helpinfo: action.helpList.helpinfo,
        flag: action.flag,
        page: action.page
      } 
    case Clear_Prev_State:
      return initialState
    default:
      return state
  }
}

export default helpListReducer