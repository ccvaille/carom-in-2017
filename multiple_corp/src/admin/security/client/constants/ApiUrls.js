// const adminDomain = 'https://admin.workec.com';

export default process.env.NODE_ENV === 'production' ? {
  whitelist: '/security/getwhitelist',
  whitelistCorpsRemove: '/security/removewhitecorp',
  whitelistCorpsAdd: '/security/addwhitecorp',
  appealList: '/security/appealmobilelist',
  handleAppeal: '/security/handelappeal',
  releaseCheck: '/security/releasecheck',
  sendSms: '/security/sendsms',
  asyncExport: '/default/index/asyncexport',
  withdrawAppeal: '/visitapi/security/unsetappeal',
} : {
  whitelist: '/admin/security/getwhitelist',
  whitelistCorpsRemove: '/admin/security/removewhitecorp',
  whitelistCorpsAdd: '/admin/security/addwhitecorp',
  appealList: '/admin/security/appealmobilelist',
  handleAppeal: '/admin/security/handelappeal',
  releaseCheck: '/admin/security/releasecheck',
  sendSms: '/admin/security/sendsms',
  asyncExport: '/admin/default/index/asyncexport',
  withdrawAppeal: '/admin/visitapi/security/unsetappeal',
};

// export default {
//   whitelist: `${adminDomain}/security/getwhitelist`,
//   whitelistCorpsRemove: `${adminDomain}/security/removewhitecorp`,
//   whitelistCorpsAdd: `${adminDomain}/security/addwhitecorp`,
//   appealList: `${adminDomain}/security/appealmobilelist`,
//   handleAppeal: `${adminDomain}/security/handelappeal`,
//   releaseCheck: `${adminDomain}/security/releasecheck`,
//   sendSms: `${adminDomain}/security/sendsms`,
//   asyncExport: `${adminDomain}/default/index/asyncexport`,
// }
