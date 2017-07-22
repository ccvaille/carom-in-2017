import { Fetch_Help_Detail, Clear_Prev_State } from '../actions'

const initialState = {
    about: [],
    flag: false
};

function helpDetailReducer(state = initialState, action) {
  switch (action.type) {
    case Fetch_Help_Detail:
      return {
        ...action.helpDetail,
        flag: action.flag
      } 
    case Clear_Prev_State:
      return initialState;
    default:
      return state
  }
}

export default helpDetailReducer