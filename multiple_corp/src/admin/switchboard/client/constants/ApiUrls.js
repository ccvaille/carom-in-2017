const urls = process.env.NODE_ENV === 'production' ? {
  applyList: '/cloudboard/handle/getapplylist',
  numberList: '/cloudboard/number/getnumberlist',
  removeApply: '/cloudboard/handle/deletecorp',
  passApplyOne: '/cloudboard/handle/audit',
  passApplyTwo: '/cloudboard/handle/auditsecond',
  refuseApplyOne: '/cloudboard/handle/setfirstcause',
  refuseApplyTwo: '/cloudboard/handle/setsecondcause',
  modifyPhone: '/cloudboard/handle/numberedit',
  asyncExport: '/default/index/asyncexport',
  getFiles: '/cloudboard/handle/getfilelist',
  getPhoneList: '/cloudboard/handle/getapplynumber',
} : {
  applyList: '/admin/cloudboard/handle/getapplylist',
  numberList: '/admin/cloudboard/number/getnumberlist',
  removeApply: '/admin/cloudboard/handle/deletecorp',
  passApplyOne: '/admin/cloudboard/handle/audit',
  passApplyTwo: '/admin/cloudboard/handle/auditsecond',
  refuseApplyOne: '/admin/cloudboard/handle/setfirstcause',
  refuseApplyTwo: '/admin/cloudboard/handle/setsecondcause',
  modifyPhone: '/admin/cloudboard/handle/numberedit',
  asyncExport: '/admin/default/index/asyncexport',
  getFiles: '/admin/cloudboard/handle/getfilelist',
  getPhoneList: '/admin/cloudboard/handle/getapplynumber',
};

export default urls;
