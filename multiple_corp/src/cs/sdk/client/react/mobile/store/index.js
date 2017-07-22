var redux = require('redux');
var createStore = redux.createStore;
var applyMiddleware = redux.applyMiddleware;
var compose = redux.compose;
var combineReducers = redux.combineReducers;

var thunkMiddleware = require('redux-thunk')['default'];
var rootReducer = require('../reducers');

var enhancer = compose(
    applyMiddleware(thunkMiddleware),
    window.devToolsExtension ? window.devToolsExtension() : function (f) { return f; }
);

var store = createStore(combineReducers(rootReducer), {}, enhancer);

if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', function () {
        var nextRootReducer = combineReducers(rootReducer);
        store.replaceReducer(nextRootReducer);
    });
}

module.exports = store;
