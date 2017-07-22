import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from '../reducers'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore);

function configureStore(initialState) {
    const store = createStoreWithMiddleware(combineReducers({
        ...reducers,
    }), initialState)

    if (module.hot) {
        // Enable Webpack hot module replacement for reducers
        module.hot.accept('../reducers', () => {
            const nextRootReducer = require('../reducers')
            store.replaceReducer(nextRootReducer)
        })
    }

    return store
}

export default configureStore()