import React, {
    PropTypes
} from "react";
import {
    Router
} from "react-router";

const routes = {
    path: "/",
    indexRoute: {
        onEnter: (nextState, replace, cb) => {
            replace("/cloudboard/apply/apply");
            cb();
        }
    },
    childRoutes: [{
        path: "/cloudboard",
        childRoutes: [{
            path: "apply/apply",
            getComponent: (nextState, cb) => {
                require.ensure(
                    [],
                    require => {
                        cb(null, require("views/Apply").default);
                    },
                    "applyPage"
                );
            }
        }, {
            path: "apply/setting",
            getComponent: (nextState, cb) => {
                require.ensure(
                    [],
                    require => {
                        cb(null, require("views/Setting").setting);
                    },
                    "setting"
                );
            }
        }, {
            path: "*",
            name: "页面未找到",
            getComponent: (nextState, cb) => {
                require.ensure(
                    [],
                    require => {
                        cb(
                            null,
                            require("~comm/components/NotFound").default
                        );
                    },
                    "notFound"
                );
            }
        }]
    }]
};

const Routes = ({
    history
}) => < Router history = {
    history
}
routes = {
    routes
}/>;

Routes.propTypes = {
    history: PropTypes.object.isRequired
};

export default Routes;