import { Fetch_Category, Switch_Category } from '../actions'

const initialState = {
    categorys: [],
    index: -1,
};

function categoryReducer(state = initialState, action) {
  switch (action.type) {
    case Fetch_Category: {
    	return {
            ...state,
            categorys: action.categorys
        }
    }
    case Switch_Category: {
        return {
            ...state,
            index: action.index
        }
    }
    default:
      return state
  }
}

export default categoryReducer