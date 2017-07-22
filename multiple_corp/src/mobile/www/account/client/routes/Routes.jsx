import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import MainLayout from 'layouts/MainLayout';

const getRoutes = (store) => ({
    path: '/',
    component: MainLayout,
    childRoutes: [{
        path: 'mobile/www/account(/)',
        childRoutes: [{
            path: 'startreg',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/StartRegister').default);
                }, 'reg-start');
            },
        }, {
            path: 'reg',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/RegisterWrapper').default);
                }, 'reg-wrapper');
            },
            childRoutes: [{
                path: 'step1',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/RegisterVerify').default);
                    }, 'reg-1');
                },
            }, {
                path: 'step2',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/RegVerifyCode').default);
                    }, 'reg-2');
                },
            }, {
                path: 'regwarning',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/RegisteredWarning').default);
                    }, 'regwarning');
                },
            }, {
                path: 'excesswarning',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/ExcessQuotaWarning').default);
                    }, 'excesswarning');
                },
            }, {
                path: 'step3',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/PasswordSet').default);
                    }, 'reg-3');
                },
            }, {
                path: 'step4',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/CompleteProfile').default);
                    }, 'reg-4');
                },
            }, {
                path: 'step5',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/OtherProfile').default);
                    }, 'reg-5');
                },
            }],
        }, {
            path: 'password/reset',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/ResetWrapper').default);
                }, 'reset-password');
            },
            childRoutes: [{
                path: 'step1',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/ResetVerify').default);
                    }, 'reset-1');
                },
            }, {
                path: 'step2',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/ResetVerifyCode').default);
                    }, 'reset-2');
                },
            }, {
                path: 'step3',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/PasswordReset').default);
                    }, 'reset-3');
                },
            }, {
                path: 'success',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/ResetSuccess').default);
                    }, 'reset-success');
                },
            }]
        }],
    }],
});

const Routes = ({ history, store }) => (<Router history={history} routes={getRoutes(store)} />);

Routes.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default Routes;
