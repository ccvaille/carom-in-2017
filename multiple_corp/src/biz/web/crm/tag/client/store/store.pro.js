import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunkMiddleware from 'redux-thunk'
import reducers from '../reducers'

const createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)

const store = createStoreWithMiddleware(combineReducers({
    ...reducers
}), {})

export default store;

// export default function configureStore(initialState) {
//     const store = createStoreWithMiddleware(rootReducer, initialState)

//     if (module.hot) {
//         // Enable Webpack hot module replacement for reducers
//         module.hot.accept('../reducers', () => {
//             const nextRootReducer = require('../reducers').default
//             store.replaceReducer(nextRootReducer)
//         })
//     }

//     return store
// }