import restHub from '../util/restHub';
import ApiUrls from '../constants/ApiUrls';
import * as ActionTypes from '../constants/ActionTypes';
// import {Message} from 'antd'
import {getSerializedObject} from '../util/utils';
import Cookie from 'react-cookie';
import Message from '../components/Message'

//获取成员列表成功
export const fetchMembersSuccess = (payload)=>({
    type: ActionTypes.FETCH_MEMBERS_SUCCESS,
    payload
});


//获取成员列表接口
export const fetchMembers = ()=>dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    restHub.get(ApiUrls.getCrop + '?with_staff=1&t=role').then((res) => {
        if (res && res.ret == 200) {
            dispatch(fetchMembersSuccess(res.data));
        }
        else {
            Message.error('服务器异常');
        }
    })
};

//获取部门列表接口
export const fetchDepts = ()=>dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    restHub.get(ApiUrls.getCrop + '?t=role').then((res) => {
        if (res && res.ret == 200) {
            dispatch({
                type:ActionTypes.FETCH_DEPTS_SUCCESS,
                payload:res.data
            });
        }
        else {
            Message.error('服务器异常');
        }
    })
};


//获取单条目标
export const getGoal =(params={})=> dispatch => {
    return restHub.postForm(ApiUrls.getTarget,{
        body:params
    }).then((res) => {
        if (res && res.code == 200) {
            dispatch({
                type:ActionTypes.GET_GOAL_SUCCESS,
                payload:res.data
            });
        }
        else {
            Message.error('服务器异常');
        }
    })
};

//设置单条目标
export const setGoal =(params={})=> dispatch => {
    return restHub.postForm(ApiUrls.setTarget,{
        body:params
    }).then((res) => {
        if (res && res.code == 200) {
            dispatch({
                type:ActionTypes.SET_GOAL_SUCCESS,
            });
            Message.success('保存成功');
        }
        else {
            Message.error('保存失败，请稍后重试！');
        }
    })
};


//查看所有目标
export const fetchAllGoal = (params = {}) => dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getAllTarget, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:ActionTypes.FETCH_ALLGOAL_SUCCESS,
                payload:res.data
            });
        }
        else if (res.code == 401) {
            location.href = '//my.workec.com/form';
        }
        else {
            Message.error(res.msg);
        }
    })
}

//查看所有目标
export const fetchGoalStat = (params = {}) => dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getGoalStat, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:ActionTypes.FETCH_GOAL_STAT_SUCCESS,
                payload:res.data
            });
        }
        else if (res.code == 401) {
            location.href = '//my.workec.com/form';
        }
        else {
            Message.error(res.msg);
        }
    })
}

//查看年完成率
export const fetchYearRate = (params = {}) => dispatch => {
    dispatch({
            type:ActionTypes.FETCH_YEAR_RATE_SUCCESS,
            payload:[]
    });
    return restHub.postForm(ApiUrls.getYearRate, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:ActionTypes.FETCH_YEAR_RATE_SUCCESS,
                payload:res.data
            });
        }
        else if (res.code == 401) {
            location.href = '//my.workec.com/form';
        }
        else {
            Message.error(res.msg);
        }
    })
}

//销售漏斗首页数据
export const fetchFunnelData = (params = {}) => dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getFunnelData, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:ActionTypes.FETCH_FUNNEL_DATE_SUCCESS,
                payload:res.data
            });
        }
        else if (res.code == 401) {
            location.href = '//my.workec.com/form';
        }
        else {
            Message.error(res.msg);
        }
    })
}


//单据列表数据
export const fetchBillData = (params = {}) => dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getBillData, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:ActionTypes.FETCH_BILL_DATA_SUCCESS,
                payload:res.data
            });
        }
        else if (res.code == 401) {
            location.href = '//my.workec.com/form';
        }
        else {
            Message.error(res.msg);
        }
    })
}

//查看员工贡献排行
export const fetchUserRankData = (params = {}) => dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getUserRank, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:ActionTypes.FETCH_USER_RANK_SUCCESS,
                payload:res.data
            });
        }
        else if (res.code == 401) {
            location.href = '//my.workec.com/form';
        }
        else {
            Message.error(res.msg);
        }
    })
}

//查看部门贡献排行
export const fetchDeptRankData = (params = {}) => dispatch => {
    dispatch({
        type:ActionTypes.FETCHING
    });
    return restHub.postForm(ApiUrls.getDeptRank, {
        body: params
    }).then((res) => {
        if (res.code == 200) {
            dispatch({
                type:ActionTypes.FETCH_DEPT_RANK_SUCCESS,
                payload:res.data
            });
        }
        else if (res.code == 401) {
            location.href = '//my.workec.com/form';
        }
        else {
            Message.error(res.msg);
        }
    })
}



