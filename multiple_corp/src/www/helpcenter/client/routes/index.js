import App from '../containers/App';
import HelpListContainer from '../containers/HelpListContainer';
import HelpDetailContainer from '../containers/HelpDetailContainer';
import store from '../store/configureStore';
import { clearPrevState } from '../actions'

const routeConfig = {
    path: '/',
    component: App,
    indexRoute: { 
        onEnter: (nextState, replace) => replace('/tech/help')
    },
	childRoutes: [{
        path: 'tech',
        childRoutes: [{
            path: 'help',
            getComponent: (nextState, cb) => {
                require.ensure([], require => {
                    cb(null, require('../containers/HelpListContainer').default)
                })
            },
            onLeave: (prevState) => {
                store.dispatch(clearPrevState());
            }
        }, {
            path: 'helpinfo',
            getComponent: (nextState, cb) => {
                require.ensure([], require => {
                    cb(null, require('../containers/HelpDetailContainer').default)
                })
            },
            onLeave: (prevState) => {
                store.dispatch(clearPrevState());
            }
        }]
    }]
};

export default routeConfig