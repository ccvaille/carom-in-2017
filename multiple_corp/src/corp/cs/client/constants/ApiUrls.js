const urls = {
    corpstruct: 'https://api.workec.com/usercenter/usergroup/corpstruct',
    activePackage: 'https://corp.workec.com/visitbiz/cs/set/activation',
    simulateLogin: 'https://corp.workec.com/visitbiz/jumptobizv',
    addGroup: 'https://corp.workec.com/visitbiz/cs/csgroup/add',
    editGroup: 'https://corp.workec.com/visitbiz/cs/csgroup/edit',
    removeGroup: 'https://corp.workec.com/visitbiz/cs/csgroup/del',
    csGroups: 'https://corp.workec.com/visitbiz/cs/csgroup/getlist',
    sortGroup: 'https://corp.workec.com/visitbiz/cs/csgroup/resort',

    getCsInfo: 'https://corp.workec.com/visitbiz/cs/cs/getuserinfo',
    addCs: 'https://corp.workec.com/visitbiz/cs/cs/add',
    removeCs: 'https://corp.workec.com/visitbiz/cs/cs/delcs',
    removeCsManager: 'https://corp.workec.com/visitbiz/cs/cs/delmanager',
    csList: 'https://corp.workec.com/visitbiz/cs/cs/getlist',
    allCsList: 'https://corp.workec.com/visitbiz/cs/cs/getalllist',
    saveCs: 'https://corp.workec.com/visitbiz/cs/cs/save',

    entrySet: 'https://corp.workec.com/visitbiz/cs/set/getlist',
    saveEntrySet: 'https://corp.workec.com/visitbiz/cs/set/dolistset',
    inviteSet: 'https://corp.workec.com/visitbiz/cs/set/getbox',
    saveInviteSet: 'https://corp.workec.com/visitbiz/cs/set/doboxset',
    chatBoxSet: 'https://corp.workec.com/visitbiz/cs/set/gettalk',
    saveChatBoxSet: 'https://corp.workec.com/visitbiz/cs/set/dotalkset',

    getServices: 'https://corp.workec.com/visitbiz/cs/set/previewinit',
    uploadImage: 'https://corp.workec.com/visitbiz/cs/set/imgupload',

    // QQ授权
    // getQQCsStatus: '',

    // 微信接入
    wxIsOpen: 'https://corp.workec.com/visitbiz/cs/wx/isopen',
    wxOpen: 'https://corp.workec.com/visitbiz/cs/wx/open',
    wxClose: 'https://corp.workec.com/visitbiz/cs/wx/close',

    // 微信分配
    getCsListData: 'https://corp.workec.com/visitbiz/cs/cs/getuserlist',
    getSelectedCsList: 'https://corp.workec.com/visitbiz/cs/wx/getlist',
    saveSelectedCs: 'https://corp.workec.com/visitbiz/cs/wx/add',
    delWXCs: 'https://corp.workec.com/visitbiz/cs/wx/del',
    goWXAuthorize: 'https://corp.workec.com/public/index',
};

export default urls;
