import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import { UPDATE_ERROR_TEXT } from 'constants/ManagePasswordActionTypes';
import ManagePassword from 'views/ManagePassword';
import ConfirmPassword from 'views/ConfirmPassword';
import store from '../store';


const routes = {
    path: '/',
    indexRoute: {
        onEnter: (nextState, replace, cb) => {
            replace('/manage/password');
            cb();
        },
    },
    childRoutes: [{
        path: '/manage',
        name: '安全',
        component: ManagePassword,
        childRoutes: [{
            path: 'password',
            name: '管理密码',
            component: ConfirmPassword,
            onEnter: (nextState, replace, cb) => {
                store.dispatch({
                    type: UPDATE_ERROR_TEXT,
                    payload: '',
                });
                cb();
            },
        }, {
            path: 'password/setting',
            name: '设置管理密码',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/SetPassword').default);
                }, 'passwordSetting');
            },
        }, {
            path: 'password/modify',
            name: '修改管理密码',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/ModifyPassword').default);
                }, 'modifyPassword');
            },
            onEnter: (nextState, replace, cb) => {
                store.dispatch({
                    type: UPDATE_ERROR_TEXT,
                    payload: '',
                });
                cb();
            },
        }, {
            path: 'password/find',
            name: '找回管理密码',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/FindManagePassword').default);
                }, 'findPassword');
            },
            onEnter: (nextState, replace, cb) => {
                store.dispatch({
                    type: UPDATE_ERROR_TEXT,
                    payload: '',
                });
                cb();
            },
        }],
    }, {
        path: '*',
        name: '页面未找到',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
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
