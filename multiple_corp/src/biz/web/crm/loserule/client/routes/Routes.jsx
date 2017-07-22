import React, { PropTypes } from 'react';
import { Router } from 'react-router';


const routes = {
    path: '/',
    name: '客户库规则',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('views/App').default);
        }, 'app');
    },
    childRoutes: [{
        path: '/web/crm/rule/lose',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CustomRule').default);
            }, 'customrule');
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
