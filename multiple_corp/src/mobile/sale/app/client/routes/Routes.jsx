import React, { PropTypes } from "react";
import { Router } from "react-router";

const routes = {
    path: "/mobile/sale/app",
    indexRoute: {
        onEnter: (nextState, replace, cb) => {
            replace("/mobile/sale/app/index");
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
                            cb(null, require("views/index").default);
                        },
                        "sale"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: '金额分析'
                        }, (result, error) => {
                            if (result.code === 0) {
                                console.log('我要更新title了哟');
                            }
                        })
                    }
                }
            }
        },
        {
            path: "goal",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/Goal").default);
                        },
                        "goal"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: '销售目标'
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
                    path: "dept/:id",
                    indexRoute: {
                        getComponent: (nextState, cb) => {
                            require.ensure(
                                [],
                                require => {
                                    cb(null, require("views/GoalDept").default);
                                },
                                "GoalDept"
                            );
                        },
                        onEnter: () => {
                            if (window.__ec_bridge__ && window.__ec_native__) {
                                __ec_bridge__.setTitle({
                                    title: '销售目标'
                                }, (result, error) => {
                                    if (result.code === 0) {
                                        console.log('我要更新title了哟');
                                    }
                                })
                            }
                        }
                    }
                },
                {
                    path: "detail/:id",
                    indexRoute: {
                        getComponent: (nextState, cb) => {
                            require.ensure(
                                [],
                                require => {
                                    cb(null, require("views/GoalDetail").default);
                                },
                                "GoalDetail"
                            );
                        },
                        onEnter: () => {
                            if (window.__ec_bridge__ && window.__ec_native__) {
                                __ec_bridge__.setTitle({
                                    title: '完成情况分析'
                                }, (result, error) => {
                                    if (result.code === 0) {
                                        console.log('我要更新title了哟');
                                    }
                                })
                            }
                        }
                    }
                }
            ]
        },
        {
            path: "goalAll",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/GoalAll").default);
                        },
                        "goalAll"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: '销售目标'
                        }, (result, error) => {
                            if (result.code === 0) {
                                console.log('我要更新title了哟');
                            }
                        })
                    }

                }
            }
        },
        {
            path: "rank",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/Rank").default);
                        },
                        "Rank"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: '排行'
                        }, (result, error) => {
                            if (result.code === 0) {
                                console.log('我要更新title了哟');
                            }
                        })
                    }
                }
            }
        },
        {
            path: "rankAll",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/RankAll").default);
                        },
                        "RankAll"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: '排行'
                        }, (result, error) => {
                            if (result.code === 0) {
                                console.log('我要更新title了哟');
                            }
                        })
                    }
                }
            }
        },
        {
            path: "funnelAll",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/FunnelAll").default);
                        },
                        "FunnelAll"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: '销售漏斗'
                        }, (result, error) => {
                            if (result.code === 0) {
                                console.log('我要更新title了哟');
                            }
                        })
                    }
                }
            }
        },
        {
            path: "funnel",
            indexRoute: {
                getComponent: (nextState, cb) => {
                    require.ensure(
                        [],
                        require => {
                            cb(null, require("views/Funnel").default);
                        },
                        "Funnel"
                    );
                },
                onEnter: () => {
                    if (window.__ec_bridge__ && window.__ec_native__) {
                        __ec_bridge__.setTitle({
                            title: '销售漏斗'
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
                    path: "stage/:id",
                    indexRoute: {
                        getComponent: (nextState, cb) => {
                            require.ensure(
                                [],
                                require => {
                                    cb(null, require("views/Stage").default);
                                },
                                "Stage"
                            );
                        },
                        onEnter: () => {
                            if (window.__ec_bridge__ && window.__ec_native__) {
                                __ec_bridge__.setTitle({
                                    title: '漏斗阶段'
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
                            path: "bill/:id",
                            indexRoute: {
                                getComponent: (nextState, cb) => {
                                    require.ensure(
                                        [],
                                        require => {
                                            cb(null, require("views/BillDetail").default);
                                        },
                                        "BillDetail"
                                    );
                                },
                                onEnter: () => {
                                    if (window.__ec_bridge__ && window.__ec_native__) {
                                        __ec_bridge__.setTitle({
                                            title: '销售金额详情'
                                        }, (result, error) => {
                                            if (result.code === 0) {
                                                console.log('我要更新title了哟');
                                            }
                                        })
                                    }
                                }
                            }
                        }
                    ]
                }
            ]
        },
    ]
};

const Routes = ({ history }) => <Router history={history} routes={routes} />;

Routes.propTypes = {
    history: PropTypes.object.isRequired
};

export default Routes;


