var React = require('react');
var ReactDOM = require('react-dom');
var Provider = require('react-redux').Provider;
var configureStore = require('../store/configureStore');

var store = configureStore();

var Session = require('./views/MobileSession');
require('normalize.css');
require('~static/styles/iconfont.less');
require('./styles/mobile-main.less');

ReactDOM.render(
    <Provider store={store}>
        <Session />
    </Provider>,
    document.getElementById('ec--cs-root')
);
