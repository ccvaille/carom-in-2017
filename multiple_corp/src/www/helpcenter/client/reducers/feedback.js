import { Post_Feedback, Clear_Prev_State } from '../actions'

const initialState = {
    submit: false
};

function feedbackReducer(state = initialState, action) {
    switch (action.type) {
        case Post_Feedback:
            return {
                ...state,
                submit: action.submit
            }
        case Clear_Prev_State:
            return initialState
        default:
            return state
    }
}

export default feedbackReducer
