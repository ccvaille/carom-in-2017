const urls = process.env.NODE_ENV === "production"
        ? {
               applyStatus: "/cloudboard/applyconf/getapplystatus",
              firstStatus: "/cloudboard/applyconf/getfirstfile",
              secondStatus: "/cloudboard/applyconf/getsecondfile",
              uploadSignature: "/cloudboard/applyconf/getuploadurl",
              applyFirst: "/cloudboard/applyconf/applyfirst",
              applySecond: "/cloudboard/applyconf/applysecond",
              applyFirstEdit: "/cloudboard/applyconf/applyfirstedit",
              applyNumbers: "/cloudboard/applyconf/getapplynumber",
              firstFiles: "/cloudboard/applyconf/getfirstfile",
              secondFiles: "/cloudboard/applyconf/getsecondfile",
              switchboardSetting: "/cloudboard/applyconf/configure",
              addSetting: "/cloudborad/applyconf/configureedit",
              setRoundAnswer: "/cloudboard/applyconf/addbusinessconf",
              getMobileAllocation: "/cloudboard/applyconf/getnumlist",
              setAuthInfo: "/cloudboard/applyconf/setauthinfo", //设置授权
              getAuthInfo: '/cloudboard/applyconf/getauthinfo',//获取授权信息
              getSettingInfo: "/cloudboard/applyconf/getconf", //获取配置信息
              getMode2SelectPhone: "/cloudboard/applyconf/getphonenumber",//获取关联手机号
              submitSetting: "/cloudboard/applyconf/setconf"
          }
        : {
              applyStatus: "/corp/cloudboard/applyconf/getapplystatus",
              firstStatus: "/corp/cloudboard/applyconf/getfirstfile",
              secondStatus: "/corp/cloudboard/applyconf/getsecondfile",
              uploadSignature: "/corp/cloudboard/applyconf/getuploadurl",
              applyFirst: "/corp/cloudboard/applyconf/applyfirst",
              applySecond: "/corp/cloudboard/applyconf/applysecond",
              applyFirstEdit: "/corp/cloudboard/applyconf/applyfirstedit",
              applyNumbers: "/corp/cloudboard/applyconf/getapplynumber",
              firstFiles: "/corp/cloudboard/applyconf/getfirstfile",
              secondFiles: "/corp/cloudboard/applyconf/getsecondfile",
              switchboardSetting: "/corp/cloudboard/applyconf/configure",
              addSetting: "/corp/cloudborad/applyconf/configureedit",
              setRoundAnswer: "/corp/cloudboard/applyconf/addbusinessconf",
              getMobileAllocation: "/corp/cloudboard/applyconf/getnumlist",
              setAuthInfo: "/corp/cloudboard/applyconf/setauthinfo", //设置授权
              getAuthInfo: '/corp/cloudboard/applyconf/getauthinfo', //获取授权信息
              getSettingInfo: "/corp/cloudboard/applyconf/getconf", //获取配置信息
              getMode2SelectPhone: "/corp/cloudboard/applyconf/getphonenumber",//获取关联手机号
              submitSetting: "/corp/cloudboard/applyconf/setconf"
          };

export default urls;

// export default {
//   managePasswordLogin: `${corpDomain}/security/managelogin`,
//   setManagePassword: `${corpDomain}/security/savemanagepwd`,
//   findManagePassword: `${corpDomain}/security/retrievemanagepwd`,
//   getCurrentPhone: `${wwwDomain}/manage/password/currentmobile`,
// };
