import React, { PropTypes } from 'react';
import { Router } from 'react-router';

const routes = {
  path: '/',
  indexRoute: {
    onEnter: (nextState, replace, cb) => {
      replace('/switchboard/applies');
      cb();
    },
  },
  childRoutes: [{
    path: '/cloudboard',
    childRoutes: [{
      path: 'handle/apply',
      getComponent: (nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('views/ApplyList').default);
        }, 'applyList');
      },
    }, {
      path: 'handle/numbers',
      getComponent: (nextState, cb) => {
        require.ensure([], require => {
          cb(null, require('views/NumberList').default);
        }, 'numberList');
      },
    }],
  }, {
    path: '*',
    name: '页面未找到',
    getComponent: (nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('~comm/components/NotFound').default);
      }, 'notFound');
    },
  }],
};

const Routes = ({ history }) => (
  <Router history={history} routes={routes} />
);

Routes.propTypes = {
  history: PropTypes.object.isRequired,
};

export default Routes;
