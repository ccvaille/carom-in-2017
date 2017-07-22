/*eslint-disable */
var isIE = !!window.ActiveXObject || 'ActiveXObject' in window;
window.name = 'cslist';
if (isIE) {
    require('./polyfill');
}
require('./methodPolyfill');
var React = require('react'),
    ReactDOM = require('react-dom');

var Provider = require('react-redux').Provider,
    configureStore = require('./react/store/cslistStore');

var store = configureStore();

var CsList = require('./react/views/CsList');
require('./less/cs.less');

ReactDOM.render(
    <Provider store={ store }>
        <CsList />
    </Provider>,
    document.getElementById('ec--cs-root')
);
