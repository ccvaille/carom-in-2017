const urls = {
    initApp: 'https://kf.workec.com/cs/index/init',

    keepPvAlive: 'https://kf.workec.com/cs/index/keepalive',

    dashboardOverview: 'https://kf.workec.com/cs/general/index',
    dashboardCsStats: 'http://localhost:3000/dashboardcsstats',
    visitors: 'https://kf.workec.com/cs/index/getonlines',

    // 接待记录
    historyWeb: 'https://kf.workec.com/cs/receive/gettalks',
    kfList: 'https://kf.workec.com/cs/index/getcslist',
    historyLeftMsg: 'https://kf.workec.com/cs/receive/getmessages',
    historyWXList: 'https://kf.workec.com/cs/receivewx/dialoglist',
    historyQQList: 'https://kf.workec.com/cs/receive/getqqtalks',
    exportLeftMsgHistoryList: 'https://kf.workec.com/cs/receive/exportmessage',
    exportWebHistoryList: 'https://kf.workec.com/cs/receive/exportweb',
    exportWXHistoryList: 'https://kf.workec.com/cs/receivewx/export',
    exportQQHistoryList: 'https://kf.workec.com/cs/receive/exportqq',
    trackList: 'https://kf.workec.com/cs/vlog/getorbit',
    chatList: 'https://kf.workec.com/cs/receive/getmsgs',
    chatWXList: 'https://kf.workec.com/cs/receivewx/getmsgs',
    chatQQList: 'https://kf.workec.com/cs/receive/getqqmsgs',
    getLeftMsgDetail: 'https://kf.workec.com/cs/message/getdetail',
    editLeftMsgDetail: 'https://kf.workec.com/cs/message/edit',

    // 快捷回复
    replyGroups: 'https://kf.workec.com/cs/quickreply/group',
    addReplyGroup: 'https://kf.workec.com/cs/quickreply/addgroup',
    editReplyGroup: 'https://kf.workec.com/cs/quickreply/editgroup',
    removeReplyGroup: 'https://kf.workec.com/cs/quickreply/deletegroup',
    quickReply: 'https://kf.workec.com/cs/quickreply/replylist',
    addQuickReply: 'https://kf.workec.com/cs/quickreply/add',
    editQuickReply: 'https://kf.workec.com/cs/quickreply/edit',
    removeQuickReply: 'https://kf.workec.com/cs/quickreply/delete',

    // 邀请设置
    inviteSetting: 'https://kf.workec.com/cs/talk/getset',

    // 所有在线客服列表
    services: 'https://kf.workec.com/cs/index/getonlinecs',
    wxServices: 'https://kf.workec.com/cs/index/getonlinewxcs',

    // 统计概况
    statsOverview: 'https://kf.workec.com/analytics/index',

    // 来源分析部分
    statsSearch: 'https://kf.workec.com/analytics/search',
    statsSearchExport: 'https://kf.workec.com/analytics/search/export',
    statsKeyword: 'https://kf.workec.com/analytics/search/keyword',
    statsKeywordExport: 'https://kf.workec.com/analytics/search/kwdexport',
    statsExternalUrl: 'https://kf.workec.com/analytics/refer',
    statsExternalUrlExport: 'https://kf.workec.com/analytics/refer/export',

    // 访客分析部分
    statsDistrict: 'https://kf.workec.com/analytics/area',
    statsDistrictExport: 'https://kf.workec.com/analytics/area/export',
    statsBrowser: 'https://kf.workec.com/analytics/browser',
    statsBrowserExport: 'https://kf.workec.com/analytics/browser/export',
    statsDevice: 'https://kf.workec.com/analytics/terminal',
    statsDeviceExport: 'https://kf.workec.com/analytics/terminal/export',

    // 客服对话部分
    statsCsEfficiency: 'https://kf.workec.com/analytics/staff/efficiency',
    // statsCsEfficiencyExport: 'https://kf.workec.com/analytics/efficiency/export',
    statsConversionRate: 'https://kf.workec.com/analytics/staff/conversion',
    // statsConversionRateExport: 'https://kf.workec.com/analytics/conversion/export',
    statsTimePeriod: 'https://kf.workec.com/analytics/staff/time',
    // statsTimePeriodExport: 'https://kf.workec.com/analytics/time/export',

    // 页面分析部分
    statsVisitLink: 'https://kf.workec.com/analytics/url',
    // statsVisitLinkExport: 'https://kf.workec.com/analytics/url/export',
    statsFromLink: 'https://kf.workec.com/analytics/url/referer',
    // statsFromLinkExport: '',

    // 员工动态
    statsEmployee: 'https://kf.workec.com/analytics/staff',

    // 访客资料
    crmInfo: 'https://my.workec.com/cs/crm/detail',
    crmSave: 'https://my.workec.com/cs/crm/save',
    // crmInfo: '/visitmy/cs/crm/detail',
    // crmSave: '/visitmy/cs/crm/save',

    // 快捷发送方式
    shortCutKey: 'https://kf.workec.com/cs/index/shortcut',
};

export default urls;
