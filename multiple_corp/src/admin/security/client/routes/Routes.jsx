import React, { PropTypes } from 'react';
import { Router } from 'react-router';

const routes = {
  path: '/',
  childRoutes: [{
    path: '/whitelist',
    name: '白名单管理',
    getComponent: (nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('views/Whitelist').default);
      }, 'whitelist');
    },
  }, {
    path: '/appeal/manage',
    name: '帐号申诉管理',
    getComponent: (nextState, cb) => {
      require.ensure([], require => {
        cb(null, require('views/AppealManage').default);
      }, 'appealManage');
    },
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
