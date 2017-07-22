import React, { PropTypes } from 'react';
import { Router } from 'react-router';


const routes = {
    path: '/',
    name: '消息助手',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('views/App').default);
        }, 'app');
    },
    childRoutes: [{
        path: '/crm/msg/box/shareRequestList',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/ShareRequestList').default);
            }, 'sharerequestlist');
        },
    }, {
        path: '/crm/msg/box/warnInfoList',
        name: '预警消息列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/WarnInfoList').default);
            }, 'warninfolist');
        },
    }, {
        path: '/crm/msg/box/customerBackDetail',
        name: '客户退回详情',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CustomerBackDetail').default);
            }, 'customerbackdetail');
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
