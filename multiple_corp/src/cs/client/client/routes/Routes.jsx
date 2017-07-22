import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import { displayError } from '~comm/utils';
import { initRequest, initSuccess } from 'actions/app';
import MainLayout from 'layouts/MainLayout';

let initCount = 0;

// eslint-disable-next-line consistent-return
const afterInit = (store, replace, callback, nextPath, { errorCode, errorMsg, jsonResult }) => {
    if (!errorMsg) {
        if (!jsonResult) {
            if (initCount < 3) {
                setTimeout(() => {
                    initRequest().then(afterInit.bind(null, store, replace, callback, nextPath));
                }, 300);
                initCount += 1;
            } else {
                displayError('初始化失败');
            }

            return false;
        }
        store.dispatch(initSuccess(jsonResult));
        if (nextPath === '/' || /^\/kf\/client(\/?)$/.test(nextPath)) {
            if (jsonResult.data.ismanager === 1) {
                replace('/kf/client/dashboard');
                return callback();
            }

            replace('/kf/client/chat');
            return callback();
        }

        if (
            jsonResult.data.iscs === 1 &&
            jsonResult.data.ismanager === 0 &&
            (nextPath.indexOf('dashboard') > -1 || nextPath.indexOf('statistics') > -1)
        ) {
            replace('/kf/client/chat');
            return callback();
        }

        if (
            jsonResult.data.ismanager === 1 &&
            jsonResult.data.iscs === 0 &&
            nextPath.indexOf('chat') > -1
        ) {
            replace('/kf/client/dashboard');
            return callback();
        }

        return callback();
    }

    if (errorCode === 401) {
        displayError('未登录');
        // window.location.href = 'https://www.workec.com/login';
    } else {
        displayError(errorMsg);
    }
};

const getRoutes = store => ({
    path: '/',
    indexRoute: {
        onEnter: (nextState, replace) => replace('/kf/client/'),
    },
    childRoutes: [{
        path: 'kf/client/blank',
        getComponent: (nextState, cb) => {
            require.ensure([], (require) => {
                cb(null, require('views/BlankPage').default);
            }, 'cs-blank');
        },
    }, {
        path: 'kf/client(/)',
        component: MainLayout,
        // onEnter: (nextState, replace, callback) => {
        //     const appState = store.getState().app;
        //     if (!appState.initialized) {
        //         store.dispatch(initSuccess({}));
        //         delay().then(() => {
        //             replace('/kf/client/dashboard');
        //             return callback();
        //         });
        //     } else {
        //         return callback();
        //     }
        // },
        onEnter: (nextState, replace, callback) => {
            const appState = store.getState().app;
            const { pathname: nextPath } = nextState.location;

            if (!appState.initialized) {
                if (!appState.userInfo.userid) {
                    initRequest().then(afterInit.bind(null, store, replace, callback, nextPath));
                }
                // return callback();
            }

            callback();
        },
        childRoutes: [{
            path: 'dashboard',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/Dashboard').default);
                }, 'dashboard');
            },
        }, {
            path: 'chat',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/Chat').default);
                }, 'chat');
            },
            childRoutes: [{
                path: ':id',
            }],
        }, {
            path: 'visitors',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/Visitors').default);
                }, 'visitors');
            },
        }, {
            path: 'history',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/History').default);
                }, 'history');
            },
        }, {
            path: 'quickreply',
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/QuickReply').default);
                }, 'quickreply');
            },
            childRoutes: [{
                path: ':id',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/QuickReplyDetail').default);
                    }, 'quickreply-detail');
                },
            }],
        }, {
            path: 'statistics',
            indexRoute: {
                onEnter: (nextState, replace) => replace('/kf/client/statistics/overview'),
            },
            getComponent: (nextState, cb) => {
                require.ensure([], (require) => {
                    cb(null, require('views/Statistics').default);
                }, 'statistics');
            },
            childRoutes: [{
                path: 'overview',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/OverviewStats').default);
                    }, 'statistics-overview');
                },
            }, {
                path: 'search',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/SearchEngineStats').default);
                    }, 'statistics-searchengine');
                },
            }, {
                path: 'keyword',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/KeywordStats').default);
                    }, 'statistics-keyword');
                },
            }, {
                path: 'externalurl',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/ExternalUrlStats').default);
                    }, 'statistics-external-url');
                },
            }, {
                path: 'district',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/DistrictStats').default);
                    }, 'statistics-district');
                },
            }, {
                path: 'browser',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/BrowserStats').default);
                    }, 'statistics-browser');
                },
            }, {
                path: 'device',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/DeviceStats').default);
                    }, 'statistics-device');
                },
            }, {
                path: 'link/visit',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/VisitLinkStats').default);
                    }, 'statistics-link-visit');
                },
            }, {
                path: 'link/from',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/FromLinkStats').default);
                    }, 'statistics-link-from');
                },
            }, {
                path: 'conversion',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/ConversionRateStats').default);
                    }, 'statistics-conversion-rate');
                },
            }, {
                path: 'efficiency',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/CsEfficiencyStats').default);
                    }, 'statistics-cs-efficiency');
                },
            }, {
                path: 'conversation/period',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/PeriodStats').default);
                    }, 'statistics-period');
                },
            }, {
                path: 'employee',
                getComponent: (nextState, cb) => {
                    require.ensure([], (require) => {
                        cb(null, require('views/EmployeeStats').default);
                    }, 'statistics-employee');
                },
            }],
        }],
    }],
});

const Routes = ({ history, store }) => (<Router history={history} routes={getRoutes(store)} />);

Routes.propTypes = {
    store: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
};

export default Routes;
