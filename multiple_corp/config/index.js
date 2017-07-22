const config = {
    env: process.env.NODE_ENV || 'development',
    host: '127.0.0.1',
    vendors: [
        'react',
        'react-dom',
        'redux',
        'react-redux',
        'react-router',
        'redux-thunk',
        'react-router-redux',
        'isomorphic-fetch',
    ],
};

config.globals = {
    __DEV__: config.env === 'development',
    __PROD__: config.env === 'production',
    __TEST__: config.env === 'test',
};

config.adminSecurity = {
    port: 3001,
};

config.wwwSecurity = {
    port: 3002,
};

config.corpSwitchboard = {
    port: 3003,
};

config.adminSwitchboard = {
    port: 3004,
};

config.crmMessage = {
    port: 80,
};

config.bizRule = {
    port: 80,
};

config.bizCrmTag = {
    port: 80,
};

config.myPublic = {
  port: 80
}
config.csClient = {
    port: 80,
};

config.bizCs = {
    port: 80,
};

module.exports = config;
