import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import reducers from '../reducers'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware,
    createLogger()
)(createStore)

const store = createStoreWithMiddleware(combineReducers({
    ...reducers
}), {})

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
        const reducers = require('../reducers').default;
        const combinedReducers = combineReducers({ ...reducers });
        store.replaceReducer(combinedReducers);
    })
}

export default store;
