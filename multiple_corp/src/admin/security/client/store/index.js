import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import thunkMiddleware from 'redux-thunk';
import reducers from 'reducers/index';

const initialState = {};
const enhancer = compose(
  applyMiddleware(thunkMiddleware),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

const store = createStore(combineReducers({
  ...reducers, routing,
}), initialState, enhancer);


if (module.hot) {
  /* eslint-disable no-shadow, global-require */
  module.hot.accept('../reducers', () => {
    const reducers = require('../reducers').default;
    const combinedReducers = combineReducers({ ...reducers, routing });
    store.replaceReducer(combinedReducers);
  });
  /* eslint-enable no-shadow, global-require */
}

export default store;