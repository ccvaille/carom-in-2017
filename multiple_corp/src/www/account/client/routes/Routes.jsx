import React, { PropTypes } from 'react';
import { Router } from 'mods/react-router';
import MainLayout from 'layouts/MainLayout';

const getRoutes = (store) => ({
    path: '/',
    component: MainLayout,
    // indexRoute: {
    //     onEnter: (nextState, replace) => replace('/www/account/'),
    // },
    childRoutes: [{
        path: 'www/account/login',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('views/Login'));
            }, 'login');
        },
    }, {
        path: 'www/account(/)',
        childRoutes: [{
            path: 'register',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/Register'));
                }, 'register');
            },
        }, {
            path: 'password/find',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/FindPassword'));
                }, 'findpassword');
            },
        }, {
            path: 'sys/choose',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/ChooseSys'));
                }, 'sys-choose');
            },
        }, {
            path: 'corp/choose',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/ChooseCorp'));
                }, 'corp-choose');
            },
        }],
    }],
});

const Routes = ({ history, store }) => (<Router history={history} routes={getRoutes(store)} />);

Routes.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

module.exports = Routes;
