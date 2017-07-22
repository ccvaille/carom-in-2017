const urls = process.env.NODE_ENV === 'production' ? {
    deleteForm: 'https://my.workec.com/public/set/delete',
    getSetting: 'https://my.workec.com/public/set/index',
    editForm: 'https://my.workec.com/public/set/update',
    addForm: 'https://my.workec.com/public/set/add',
    getRole: 'https://my.workec.com/public/role',
    remind: 'https://my.workec.com/public/role/remind',
    getAnalysis: 'https://my.workec.com/public/statistics/trend',
    getKeyData: 'https://my.workec.com/public/statistics/summary'
} : {
    deleteForm: 'https://my.workec.com/public/set/delete',
    getSetting: 'https://my.workec.com/public/set/index',
    editForm: 'https://my.workec.com/public/set/update',
    addForm: 'https://my.workec.com/public/set/add',
    getRole: 'https://my.workec.com/public/role',
    remind: 'https://my.workec.com/public/role/remind',
    getAnalysis: 'https://my.workec.com/public/statistics/trend',
    getKeyData: 'https://my.workec.com/public/statistics/summary'
};

export default urls;
