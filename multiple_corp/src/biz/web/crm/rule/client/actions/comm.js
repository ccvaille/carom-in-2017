export const CLEAR_STATE = 'CLEAR_STATE';
export const DATA_LOADING = 'DATA_LOADING';


export function clearState() {
    return (dispatch) => {
        dispatch({
            type: CLEAR_STATE
        })
    }
}

export function dataLoading() {
    return (dispatch) => {
        dispatch({
            type: DATA_LOADING
        })
    }
}