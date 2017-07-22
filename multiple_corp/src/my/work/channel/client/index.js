import ReactDOM from 'react-dom';
import React from 'react';

import {Provider} from 'react-redux';

import {Router, browserHistory} from 'react-router';

import configureStore from './store/configureStore';

import 'antd/dist/antd.less';

import '../../../../comm/ec-antd/dist/antd.less';

import routes from './routes/index';

const store = configureStore({
    // userInfo: {
    //     isPerson: window.ISPERSON
    // }
});

ReactDOM.render(
    <Provider store={ store }>
        <Router history={ browserHistory } routes={ routes }/>
    </Provider>,
    document.getElementById('root')
);
