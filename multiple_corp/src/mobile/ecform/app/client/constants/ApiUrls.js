const urls = process.env.NODE_ENV === 'production' ? {
	getClass: '//ecform.workec.com/index/class/get',
	getFormListNoMe: '//ecform.workec.com/index/list/get',
	getFormListMe: '//ecform.workec.com/index/list/tome',
	getDataList: '//ecform.workec.com/detail/list/get',
	getDataDetail: '//ecform.workec.com/detail/data/get',
    getRole: '//ecform.workec.com/index/form/role'

} : {
	getClass: '//ecform.workec.com/index/class/get',
	getFormListNoMe: '//ecform.workec.com/index/list/get',
	getFormListMe: '//ecform.workec.com/index/list/tome',
	getDataList: '//ecform.workec.com/detail/list/get',
	getDataDetail: '//ecform.workec.com/detail/data/get',
    getRole: '//ecform.workec.com/index/form/role'
};

export default urls;
