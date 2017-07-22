import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducers';

const initialState = {};
const enhancer = compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(combineReducers({
    ...reducers
}), initialState, enhancer);


if (module.hot) {
    /* eslint-disable no-shadow, global-require */
    module.hot.accept('../reducers', () => {
        const reducers = require('../reducers').default;
        const combinedReducers = combineReducers({ ...reducers });
        store.replaceReducer(combinedReducers);
    });
    /* eslint-enable no-shadow, global-require */
}

export default store;