import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import PlainContainer from 'layouts/PlainContainer';

const routes = {
    path: '/',
    component: PlainContainer,
    indexRoute: {
        onEnter: (nextState, replace) => replace('/kf/index'),
    },
    childRoutes: [{
        path: 'kf/index/notactive',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('views/NotActivePage').default);
            }, 'not-active-page');
        }
    }, {
        path: 'kf/index/float',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('views/AccessSetting').default);
            }, 'access-setting');
        },
    }, {
        path: '/kf/index/dis',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('views/CsAssign').default);
            }, 'cs-assign');
        },
    }, {
        path: 'kf/index',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('views/PermissionSetting').default);
            }, 'permission-setting');
        },
    }],
};

const Routes = ({ history }) => (<Router history={history} routes={routes} />);

Routes.propTypes = {
    history: PropTypes.object.isRequired,
};

export default Routes;
