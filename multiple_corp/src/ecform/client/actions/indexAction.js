import ApiUrls from '../constants/ApiUrls'
import restHub from '../utils/restHub'
import {SEARCH_TYPE_CHANGE,FETCH_FAILURE,FETCHING,SORT_CHANGE,SEARCH_TEXT_CHANGE,FILTER_CHANGE,FETCH_FORM_LIST_SUCCESS,FETCH_ROLE_SUCCESS,ROUTER_CHANGE,PAGE_CHANGE,FETCH_GET_CLASS_SUCCESS,FETCH_DELETE_FORM_SUCCESS,FETCH_SET_CLASS_SUCCESS,MIGRATION_TO_PUBLIC_SUCCESS} from '../constants/ActionTypes'
import Message from '../components/Message';

//排序改变了
export const sortChange = (payload)=>({
    type: SORT_CHANGE,
    payload
});


export const fetching = ()=>({
    type: FETCHING
});

//搜索文本改变了
export const searchTextChange = (payload)=>({
    type: SEARCH_TEXT_CHANGE,
    payload
});

//筛选标签改变了
export const filterChange = (payload)=>({
    type:FILTER_CHANGE,
    payload
});
//搜索类型改变了
export const searchTypeChange = (payload)=>({
    type:SEARCH_TYPE_CHANGE,
    payload
});

//获取role成功
export const fetchRoleSuccess = (payload)=>({
    type:FETCH_ROLE_SUCCESS,
    payload
});

//获取formlist成功
export const fetchFormListSuccess = (payload)=>({
    type:FETCH_FORM_LIST_SUCCESS,
    payload
});
//获取分类成功
export const fetchGetClassSuccess = (payload)=>({
    type:FETCH_GET_CLASS_SUCCESS,
    payload
});

export const fetchSetClassSuccess = (payload)=>({
    type:FETCH_SET_CLASS_SUCCESS,
    payload
});

//删除表单成功
export const deleteFormSuccess = (payload)=>({
    type:FETCH_DELETE_FORM_SUCCESS,
    payload
});

//移入公共成功
export const migrationToPublicSuccess = (payload)=>({
    type:MIGRATION_TO_PUBLIC_SUCCESS,
    payload
});

//路由改变
export const routerChange = (payload)=>({
    type:ROUTER_CHANGE,
    payload
});

//分页改变
export const pageChange = (payload)=>({
    type:PAGE_CHANGE,
    payload
});

//表单权限接口
export const fetchRole = dispatch => {
    return (dispatch) => {
        return restHub.get(ApiUrls.getRole).then((res) => {
            if(res.code==200){
                if(res.data){
                    /**** growingio 统计代码 begin****/
                    var gAppendScript = function(url) {
                        var s = document.createElement('script');
                        s.type = 'text/javascript';
                        s.async = true;
                        s.src = url;
                        var head = document.getElementsByTagName('head')[0];
                        head.appendChild(s);
                    };
                    var _vds = _vds || [];
                    window._vds = _vds;

                    _vds.push(['setAccountId', 'a4206e92c3a477e4']);
                    _vds.push(['setCS1', 'ecgrow_userid', res.data.userId]);
                    _vds.push(['setCS2', 'ecgrow_corpid', res.data.corpId]);
                    _vds.push(['setImp', false]);//禁止内容采集
                    gAppendScript('//dn-growing.qbox.me/vds.js');
                    /**** growingio 统计代码 end****/

                    /** node report */
                    gAppendScript('//www.staticec.com/api/scripts/nreport.js');
                    /** node report */

                    dispatch(fetchRoleSuccess(res.data));
                }
            }
            else if(res.code==401){
                location.href = '//my.workec.com/form';
            }
            else{
                Message.error(res.msg);
            }
        })
    }
};

//获取分类列表接口
export const fetchGetClass = dispatch => {
    return (dispatch) => {
        return restHub.get(ApiUrls.getClass).then((res) => {
            if(res.code==200){
                dispatch(fetchGetClassSuccess(res.data||[]));
            }
            else if(res.code==401){
                location.href = '//my.workec.com/form';
            }
            else{
                Message.error(res.msg);
            }
        })
    }
};

//设置分类接口
export const fetchSetClass = (params={}) => dispatch => {
    return restHub.post(ApiUrls.setClass,{
        body:params
    }).then((res) => {
        if(res.code==200){
            dispatch(fetchSetClassSuccess());
            Message.success('设置成功');
        }
        else if(res.code==401){
            location.href = '//my.workec.com/form';
        }
        else{
            Message.error(res.msg);
        }
    })
};

//获取列表接口
export const fetchFormList =  (params={}) => dispatch => {
    dispatch(fetching());
    return restHub.get(ApiUrls.getFormList,{
        params:params
    }).then((res) => {
        if(res.code==200){
            dispatch(fetchFormListSuccess({
                data:res.data||[],
                page:res.page,
                params:params
            }));
        }
        else if(res.code==401){
            location.href = '//my.workec.com/form';
        }
        else{
            Message.error(res.msg);
        }
    })
};

//删除表单接口
export const deleteForm =  (formId) => dispatch => {
    return restHub.post(ApiUrls.deleteForm,{
        body:{
            formId:formId
        }
    }).then((res) => {
        if(res.code==200){
            dispatch(deleteFormSuccess());
        }
        else if(res.code==401){
            location.href = '//my.workec.com/form';
        }
        else{
            Message.error(res.msg);
        }
    })
};

//迁移到公共
export const migrationToPublic =  (formId) => dispatch => {
    return restHub.post(ApiUrls.migrationToPublic,{
        body:{
            formId:formId
        }
    }).then((res) => {
        if(res.code==200){
            dispatch(migrationToPublicSuccess());
            Message.success('已放入公共作品中');
        }
        else if(res.code==401){
            location.href = '//my.workec.com/form';
        }
        else{
            Message.error(res.msg);
        }
    })
};





