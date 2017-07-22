var React = require('react'),
    ReactDOM = require('react-dom');

var Provider = require('react-redux').Provider,
    configureStore = require('./react/store/configureStore');

var store = configureStore();

var Session = require('./react/views/Session');
require('./less/session.less');
require('../../../../src/comm/public/styles/iconfont.less');

ReactDOM.render(
    <Provider store={ store }>
        <Session />
    </Provider>,
    document.getElementById('ec--cs-root')
);
