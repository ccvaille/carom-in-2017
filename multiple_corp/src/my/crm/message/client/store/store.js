import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import reducers from '../reducer/reducer';

const initialState = {};
const enhancer = compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(combineReducers({
    datas: reducers,
}), initialState, enhancer);


if (module.hot) {
    /* eslint-disable no-shadow, global-require */
    module.hot.accept('../reducer/reducer', () => {
        const reducers = require('../reducer/reducer').default;
        const combinedReducers = combineReducers({ ...reducers });
        store.replaceReducer(combinedReducers);
    });
    /* eslint-enable no-shadow, global-require */
}

export default store;