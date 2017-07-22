import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';
import store from './store';

import 'antd/dist/antd.less';
import '~comm/ec-antd/dist/antd.less';
import 'styles/main.less';

const history = syncHistoryWithStore(browserHistory, store);

const render = () => {
  // eslint-disable-next-line global-require
  const Routes = require('./routes').default;
  ReactDOM.render(
    <Provider store={store}>
      <Routes history={history} />
    </Provider>
    , document.getElementById('root')
  );
};

if (module.hot) {
  module.hot.accept('./routes', () => {
    render();
  });
}

render();
