import App from '../views/App'
import store from '../store/configureStore';
import { clearEditorState } from '../actions'

const routeConfig = {
    path: '/',
    component: App,
    indexRoute: {
        onEnter: (nextState, replace) => replace('/mzone/broadcast')
    },
    childRoutes: [{
        path: '/mzone/broadcast(/)',
        indexRoute: {
            onEnter: (nextState, replace) => replace('/mzone/broadcast/list.html')
        },
    }, {
        path: '/mzone/broadcast/list.html',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('../views/BroadcastList').default)
            })
        },
    }, {
        path: '/mzone/broadcast/editor.html',
        getComponent: (nextState, cb) => {
            require.ensure([], require => {
                cb(null, require('../views/BroadcastEditor').default)
            })
        },
        onLeave: (prevState) => {
            store.dispatch(clearEditorState());
        }
    }, ]
};

export default routeConfig