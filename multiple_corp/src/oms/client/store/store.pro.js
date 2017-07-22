import { createStore, applyMiddleware,combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../reducers'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
    // createLogger()
)(createStore)

// export default function configureStore(initialState) {
//     const store = createStoreWithMiddleware(rootReducer/* 一个函数 */, initialState /* 对象 */)
//
//     if (module.hot) {
//         // Enable Webpack hot module replacement for reducers
//         module.hot.accept('../reducers', () => {
//             const nextRootReducer = require('../reducers')
//             store.replaceReducer(nextRootReducer)
//         })
//     }
//
//     return store
// }

const store = createStoreWithMiddleware(combineReducers({
    ...rootReducer
}), {});

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
        const reducers = require('../reducers').default;
        const combinedReducers = combineReducers({ ...reducers });
        store.replaceReducer(combinedReducers);
    })
}

export default store;