import React, { PropTypes } from 'react';
import { Router } from 'react-router';
import { displayError } from '~comm/utils';

const getRoutes = (store) => ({
    path: "/my/public",
    indexRoute: {
        onEnter: (nextState, replace, cb) => {
            replace("/my/public/message");
            cb();

        }
    },
    childRoutes: [
        {
            path: "message",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/message").default);
                        },
                        "message"
                    );
                }
            }
        },{
            path: "transform",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/transform").default);
                        },
                        "transform"
                    );
                }
            }
        }
    ]
});

const Routes = ({ history, store }) => (<Router history={history} routes={getRoutes(store)} />);

Routes.propTypes = {
    history: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired,
};

export default Routes;
