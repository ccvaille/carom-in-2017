const corpDomain = 'https://corp.workec.com';
const wwwDomain = 'https://www.workec.com';
const apiDomain = 'https://api.workec.com';

// 后端跨域设置好后使用下面注释掉的 url
const urls = process.env.NODE_ENV === 'production' ? {
  managePasswordLogin: '/visitapi/security/managelogin',
  setManagePassword: '/visitapi/security/savemanagepwd',
  findManagePassword: '/visitapi/security/retrievemanagepwd',
  getCurrentPhone: '/manage/password/currentmobile',
  sendSms: '/visitapi/security/sendsms',
  checkOldManagePwd: '/visitapi/security/checkmanagepwd',
} : {
  managePasswordLogin: '/api/security/managelogin',
  setManagePassword: '/api/security/savemanagepwd',
  findManagePassword: '/api/security/retrievemanagepwd',
  getCurrentPhone: '/www/manage/password/currentmobile',
  sendSms: '/api/security/sendsms',
  checkOldManagePwd: '/api/security/checkmanagepwd',
};

export default urls;

// export default {
//   managePasswordLogin: `${corpDomain}/security/managelogin`,
//   setManagePassword: `${corpDomain}/security/savemanagepwd`,
//   findManagePassword: `${corpDomain}/security/retrievemanagepwd`,
//   getCurrentPhone: `${wwwDomain}/manage/password/currentmobile`,
// };
