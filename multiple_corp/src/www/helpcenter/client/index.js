import ReactDOM from 'react-dom';
import React from 'react';

import {Provider} from 'react-redux';

import {Router, browserHistory} from 'react-router';

import store from './store/configureStore';

import routes from './routes/index';

import 'antd/dist/antd.less';
import '../../../comm/ec-antd/dist/antd.less'


ReactDOM.render(
    <Provider store={store}>
        <Router history={ browserHistory } routes={ routes }/>
    </Provider>,
    document.getElementById('support')
);
