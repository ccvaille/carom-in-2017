import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import { browserHistory } from "react-router";
import { routerReducer as routing, routerMiddleware } from "react-router-redux";
import thunkMiddleware from "redux-thunk";
import reducers from "reducers/index";

const routeMiddleware = routerMiddleware(browserHistory);
const initialState = {};
let enhancer = null;

if (__DEV__) {
    enhancer = compose(
        applyMiddleware(thunkMiddleware, routeMiddleware),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    );
} else {
    enhancer = compose(
        applyMiddleware(thunkMiddleware, routeMiddleware)
    );
}

const store = createStore(
    combineReducers({
        ...reducers,
        routing
    }),
    initialState,
    enhancer
);

if (module.hot) {
    /* eslint-disable no-shadow, global-require */
    module.hot.accept("../reducers", () => {
        const reducers = require("../reducers").default;
        const combinedReducers = combineReducers({ ...reducers, routing });
        store.replaceReducer(combinedReducers);
    });
    /* eslint-enable no-shadow, global-require */
}

export default store;
