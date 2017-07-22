import React, { PropTypes } from "react";
import { Router } from "react-router";

const routes = {
    path: "/mobile/ecform/app",
    indexRoute: {
        onEnter: (nextState, replace, cb) => {
            replace("/mobile/ecform/app/index");
            cb();

        }
    },
    childRoutes: [
        {
            path: "index",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/Form").default);
                        },
                        "form"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: 'H5微营销'
                        }, (result, error) => {
                            if (result.code === 0) {
                                console.log('我要更新title了哟');
                            }
                        })
                    }

                }
            },
            childRoutes: [
                {
                    path: "data/:formId",
                    indexRoute: {
                        getComponent: (nextState, cb) => {
                            require.ensure(
                                [],
                                require => {
                                    cb(null, require("views/Data").default);
                                },
                                "data"
                            );
                        },
                        onEnter: () => {
                            if (window.__ec_bridge__ && window.__ec_native__) {
                                __ec_bridge__.setTitle({
                                    title: '数据列表'
                                }, (result, error) => {
                                    if (result.code === 0) {
                                        console.log('我要更新title了哟');
                                    }
                                })
                            }
                        }
                    },
                    childRoutes: [
                        {
                            path: 'detail/:dataId',
                            getComponent: (nextState, cb) => {
                                require.ensure(
                                    [],
                                    require => {
                                        cb(null, require("views/Detail").default);
                                    },
                                    "detail"
                                );
                            }
                        }
                    ]
                }
            ]
        }
    ]
};

const Routes = ({ history }) => <Router history={history} routes={routes} />;

Routes.propTypes = {
    history: PropTypes.object.isRequired
};

export default Routes;


