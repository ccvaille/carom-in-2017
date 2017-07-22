import React, { PropTypes } from 'react';
import store from 'store'
import { Router } from 'react-router';
import { clearState } from 'actions/comm'


const routes = {
    path: '/',
    name: '客户库规则',
    getComponent: (nextState, cb) => {
        require.ensure([], require => {
            cb(null, require('views/App').default);
        }, 'app');
    },
    childRoutes: [{
        path: '/biz/web/crm/rule/lose',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmRecall/CustomRule').default);
            });
        },
    },{
        path: '/biz/web/crm/rule/lose.html',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmRecall/CustomRule').default);
            });
        },
    },{
        path: '/biz/web/crm/rule/stage',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmStage').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    },{
        path: '/biz/web/crm/rule/stage.html',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmStage').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    },{
        path: '/biz/web/crm/rule/limit',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmTop').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    },{
        path: '/biz/web/crm/rule/limit.html',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmTop').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    },{
        path: '/biz/web/crm/rule/hit',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/HitRule').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    },{
        path: '/biz/web/crm/rule/hit.html',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/HitRule').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    },{
        path: '/biz/web/crm/rule/protect',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmInfoProtect').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    },{
        path: '/biz/web/crm/rule/protect.html',
        name: '共享请求列表',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('views/CrmInfoProtect').default);
            });
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    }, {
        path: '*',
        name: '页面未找到',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('~comm/components/NotFound').default);
            }, 'notFound');
        },
        onLeave: (prevState) => {
            store.dispatch(clearState());
        }
    }],
};

const Routes = ({ history }) => (
    <Router history={history} routes={routes} />
);
Routes.propTypes = {
    history: PropTypes.object.isRequired,
};

export default Routes;
