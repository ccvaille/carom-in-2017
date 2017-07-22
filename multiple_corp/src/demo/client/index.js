import ReactDOM from 'react-dom';
import React from 'react';

import {Provider} from 'react-redux';

import {Router, browserHistory} from 'react-router';

import configureStore from './store/configureStore';

import '../../comm/antd/dist/antd.less';

import routes from './routes';

const store = configureStore();

ReactDOM.render(
    <Provider store={ store }>
        <Router history={ browserHistory } routes={ routes }/>
    </Provider>,
    document.getElementById('react-content')
);