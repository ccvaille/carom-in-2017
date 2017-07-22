import fetch from 'isomorphic-fetch'
import Cookie from 'react-cookie';
import {message, Button} from 'antd';
import Message from '../components/Message'
export const REQUEST_POSTS = 'REQUEST_POSTS'
export const RECEIVE_POSTS = 'RECEIVE_POSTS'
export const SELECT_REDDIT = 'SELECT_REDDIT'
export const INVALIDATE_REDDIT = 'INVALIDATE_REDDIT'
//获取企业是否开通新标签
export const GETCORP_STATUS = 'GETCORP_STATUS'
//弹层显示还是隐藏
export const SWICH_VISIBLE = 'SWICH_VISIBLE';

//所有获取到数据后的错误信息处理函数


function analysis(json, sucCallback, errorCallback, completeCallback) {
    //if(json.status && json.status !== 200){
    //Message.error("系统错误，请稍后再试!");
    completeCallback && completeCallback();
    if (!json) {
        return;
    } else if (!json.code) {
        return;
    }
    if (json.code == 200) {
        sucCallback();
       
    } else if (json.code !== 200 && json.code != 20600) {
        Message.error(json.msg);
    }

}
function fetchNew(url, type, body) {
    var reqHeader = {
        credentials: 'include',
        method: type,
        mode: 'cors',
        headers: {
            
        }
    };
    // var reqHeader = {
    //     credentials: 'include',
    //     method: type,
    //     headers: {}
    // };
    reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
    if (reqHeader.method === "post") {

        reqHeader.headers['Content-Type'] = 'application/json';
        // reqHeader.headers['Accept'] = 'application/x-www-form-urlencoded';
        // reqHeader.headers['Access-Control-Allow-Methods'] = 'POST, PATCH, PUT, OPTIONS';
        reqHeader.headers["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
        // body["_token"] = Cookie.load('XSRF-TOKEN');
        // reqHeader.body = '';
        // for (let prop in body) {
        //     if (body.hasOwnProperty(prop)) {
        //          reqHeader.body += '&' + prop + '=' + body[prop];
        //     }
        // }
        // reqHeader.body =  reqHeader.body.substring(1, reqHeader.body.length);
        reqHeader.body = JSON.stringify(body);
        // reqHeader.body["X-XSRF-TOKEN"] = Cookie.load('XSRF-TOKEN');
    }
    return fetch(url, reqHeader).then(res => {
        if (res.status === 401) {
            location.href = "//corp.workec.com";
        } else if (res.status === 403) {
            return Promise.reject({ msg: '您没有权限！'});
            // Message.error('您没有权限！');
        } else if (res.status === 500) {
            return Promise.reject({ msg: '服务器内部错误，请稍后再试！'});
            // Message.error('服务器内部错误，请稍后再试！');
        } else if (res.status === 404) {
            return Promise.reject({ msg: '接口返回错误！'});
            // Message.error('接口返回错误！');
        } else if (res.status === 501) {
            location.href = '//corp.workec.com';
        }
        return res.json();
       
    }).catch(err => {
        const { msg } = err;
        if (msg) {
            Message.error(msg);
        } else {
            Message.error('操作失败，请稍后再试！');
        }
    })
}
export function swichVisible(isVisibel, key) {
    return {
        type: SWICH_VISIBLE,
        isVisibel: isVisibel,
        key: key
    }
}
export function getCorpStatus() {
    return {
        type: GETCORP_STATUS
    }
}
function receivePostsStatus(json) {
    return {
        type: GETCORP_STATUS,
        posts: json.data
    }
}
//标签状态
function fetchStatus(type) {
    return dispatch => {
        // dispatch(getCorpStatus())
        // return fetchNew('https://biz.workec.com/crm/tag', 'get')//include
        //     .then(json => {
        //         //todo 暂时前端控制展示内容
        //         if (document.cookie.indexOf('debugNew=1') >= 0) {
        //             json.data.type = 1;
        //         } else if (document.cookie.indexOf('debugNew=0') >= 0) {
        //             json.data.type = 0;
        //         }
                // dispatch(receivePostsStatus(json));
                 dispatch(receivePostsStatus({
                    data: {
                        type: 1
                    }
                 }));
                // if (json.data.type == 1) {//新
                dispatch(getGroupList());
            //     } else {
            //         //获取所有旧标签
            //         //获取临时保存的数据
            //         // dispatch(getAllOldLabel());
            //         dispatch(getTmpOldData());
            //     }
            // })
    }
}

export function fetchCorpStatus(type) {
    return (dispatch, getState) => {
        return dispatch(fetchStatus(type))
    }
}

//设置标签状态
export function setStep(step) {
    return (dispatch, getState) => {
        return dispatch(fetchSetStep(step))
    }
}
function fetchSetStep(step) {
    var url = 'https://biz.workec.com/crm/tag/setstep';
    return dispatch => {

        return fetchNew(url, 'post', {step: step})
            .then(json => {
                analysis(json, ()=> {
                   dispatch(receivePostsStatus({
                        data: {
                           type: 0,
                           step: step
                       }
                   }))
                }, () => {
                    Message.error('操作失败，请稍后再试！')
                })
            })
    }
}
//获取标签分组列表；
export const GETGROUP_LIST = 'GETGROUP_LIST'

function receiveGroupList(json) {
    return {
        type: GETGROUP_LIST,
        list: json.data
    }
}

function fetchGroupList(isActive) {
    return dispatch => {
        return fetchNew('https://biz.workec.com/crm/taggroup/show', 'get')
            .then(json => {
                analysis(json, ()=> {
                    dispatch(receiveGroupList(json));
                    if (!isActive) {
                        dispatch(getActiveLabel({
                            gid: json.data.groups[0].f_group_id
                        }));
                        dispatch(setSelectGroupName(json.data.groups[0].f_group_name));
                        dispatch({
                            type: 'LOAD_COMPONENT',
                            data: true
                        })
                    }
                    
                })
            })
    }
}

export function getGroupList(isActive) {
    return (dispatch, getState) => {
        return dispatch(fetchGroupList(isActive))
    }
}

//获取标签组下面的标签
export const GET_ACTIVE_LABEL = 'GET_ACTIVE_LABEL';
export function getActiveLabel(data, bool) {
    return (dispatch, getState) => {
        return dispatch(fetchActiveLabel(data, bool));
    }
}
function fetchActiveLabel(data, bool) {
    var url = 'https://biz.workec.com/crm/tag/show?gid=' + data.gid;
    return dispatch => {
        return fetchNew(url, 'get', data)
            .then(json => {
                analysis(json, ()=> {
                    dispatch({
                        type: GET_ACTIVE_LABEL,
                        data: json.data
                    });
                    if (!bool) {
                        dispatch({
                            type: 'SWITCH_MANAGEMODAL',
                            data: false
                        });
                    } 
                   
                })
            });
    }
}
//新增标签
export const ADD_LABEL = 'ADD_LABEL';
function fetchAddLabel(data) {
    // var url = 'https://biz.workec.com/crm/tag/add?gid='+ data.gid +'&name=' + data.name;
    var url = 'https://biz.workec.com/crm/tag/add';
    return dispatch => {

        return fetchNew(url, 'post', data)
            .then(json => {
                analysis(json, ()=> {
                    Message.success(json.msg);
                    dispatch({
                        type: ADD_LABEL,
                        data: json.data
                    })
                    dispatch(fetchComplete('isNewLabelVisible'));
                    dispatch(setInputValue('newLableName', ''));
                }, () => {
                    // dispatch(fetchComplete('isNewLabelVisible'))
                    if (json.code == 20600) {
                        dispatch({
                            type: 'CHANGE_LEFT_WARN',
                            data: {
                                showCreateLabelTip: -3,
                                createLabelTipText: json.msg
                            }
                        })
                    } else {
                        Message.error(json.msg);
                        dispatch(fetchComplete('isNewLabelVisible'));
                        dispatch(setInputValue('newLableName', ''));
                    }
                   
                }, () => {
                    dispatch(fetchComplete('isPosting'));
                });
            });
    }
}
export function addLabel(obj) {
    return (dispatch, getState) => {
        dispatch(fetchPend('isNewLabelVisible'));
        return dispatch(fetchAddLabel(obj))
    }
}

//标签移动
export const MOVE_LABEL = 'MOVE_LABEL';
export function moveLabel(data) {

    return (dispatch, getState) => {
        return dispatch(postMoveLabel(data))
    }
}

function postMoveLabel(data) {
    let url = 'https://biz.workec.com/crm/tag/move';
    return dispatch => {
        return fetchNew(url, 'post', data)
            .then(json => {
                analysis(json, ()=> {
                    dispatch({
                        type: MOVE_LABEL,
                        data: data
                    })
                })
            })
    }
}
//标签编辑
export const EDIT_LABEL = 'EDIT_LABEL';
export function editLabel(data) {

    return (dispatch, getState) => {
        dispatch(fetchPend('isEditLabelVisibel'));
        return dispatch(postEditLabel(data))
    }
}
function postEditLabel(data) {

    var url = 'https://biz.workec.com/crm/tag/edit';
    return dispatch => {
        return fetchNew(url, 'post', data)
            .then(json => {
                analysis(json, ()=> {
                    Message.success(json.msg);
                    dispatch({
                        type: EDIT_LABEL,
                        data: data
                    });
                    dispatch(fetchComplete('isEditLabelVisibel'));
                }, () => {
                    if (json.code == 20600) {
                        dispatch({
                            type: 'CHANGE_LEFT_WARN',
                            data: {
                                showModifyLabelTip: -3,
                                modifyLabelTipText: json.msg
                            } 
                        })
                    } else {
                        Message.error(json.msg);
                        dispatch(fetchComplete('isEditLabelVisibel'));
                    }
                }, () => {
                    dispatch(fetchComplete('isPosting'));
                })
            })

    }
}

//标签删除
export const DEL_LABEL = 'DEL_LABEL';
export function delLabel(data) {
    return (dispatch, getState) => {
        return dispatch(postDelLabel(data));
    }
}
function postDelLabel(data) {
    var url = 'https://biz.workec.com/crm/tag/del';
    return dispatch => {
        return fetchNew(url, 'post', {id: data.id})
            .then(json => {
                analysis(json, () => {
                    Message.success(json.msg);
                    dispatch({
                        type: DEL_LABEL,
                        data: data
                    })
                })
            })
    }
}
//标签颜色
export const COLOR_LABEL = 'COLOR_LABEL';
// export function colorLabel(data) {
//     return (dispatch, getState) => {
//         console.log(1)
//     }
// }

//添加分组
export const ADD_GROUP = 'ADD_GROUP';
function PostAddLabelGroup(groupName) {
    return dispatch => {
        return fetchNew('https://biz.workec.com/crm/taggroup/add', 'post', {name: groupName})
            .then(json => {
                analysis(json, ()=> {
                    Message.success(json.msg);
                    dispatch(fetchComplete('isNewGroupVisible'));
                    if (!json.data.f_style) {
                        json.data.f_style = 'c1';
                    }
                    dispatch({
                        type: ADD_GROUP,
                        data: json.data
                    });
                    dispatch({
                        type: 'SWITCH_MANAGEMODAL',
                        data: false
                    })
                    dispatch(fetchComplete('isNewGroupVisible'));
                    dispatch(setInputValue('groupName', ''));
                }, () => {
                    if (json.code == 20600) {
                        dispatch({
                            type: 'CHANGE_LEFT_WARN',
                            data: {
                                showCreateGroupTip: -3,
                                createGroupTipText: json.msg
                            }
                        });
                    } else {
                        Message.error(json.msg);
                        dispatch(fetchComplete('isNewGroupVisible'));
                        dispatch(setInputValue('groupName', ''));
                    }
                }, () => {
                    dispatch(fetchComplete('isPosting'));
                })
            })
    }
}
export function addLabelGroup(groupName) {
    return (dispatch, getState) => {
        dispatch(fetchPend('isNewGroupVisible'));
        return dispatch(PostAddLabelGroup(groupName))
    }
}


//分组名编辑
export const EDIT_GROUP = 'EDIT_GROUP';
export function editGroup(data) {

    return (dispatch, getState) => {
        dispatch(fetchPend('isEditGroupVisibel'));
        return dispatch(postEditGroup(data));
    }
}
function postEditGroup(data) {

    var url = 'https://biz.workec.com/crm/taggroup/edit';
    return (dispatch, getState) => {
        if(data.name === data.prevName) {
            return dispatch(fetchComplete('isEditGroupVisibel'))
        }
        
        var isSelectGroup = (data.prevName === getState().postsByReddit.selectGroupName);
        data.prevName && (delete data.prevName);

        return fetchNew(url, 'post', data)
            .then(json => {
                analysis(json, () => {
                    Message.success(json.msg);
                    dispatch({
                        type: EDIT_GROUP,
                        data: data
                    });
                   
                    // dispatch(fetchComplete('isPosting'));
                    if (isSelectGroup) {
                        var newList = getState().postsByReddit.groupList.groups;
                        var index = newList.findIndex((item, index) => {
                            return data.name === item.f_group_name;
                        });
                        newList[index] && dispatch(selectGroupAct(newList[index], true));
                    }
                    dispatch(setInputValue('editGroupName', ''));
                    dispatch(fetchComplete('isEditGroupVisibel'));
                }, () => {
                    if (json.code == 20600) {
                        dispatch({
                            type: 'CHANGE_LEFT_WARN',
                            data: {
                                showModifyGroupTip: -3,
                                modifyGroupTipText: json.msg
                            }
                        })
                    } else {
                        Message.error(json.msg);
                        dispatch(fetchComplete('isEditGroupVisibel'));
                    }
                }, () => {
                    dispatch(fetchComplete('isPosting'));
                }
            )
        })
    }
}
//删除分组
export const DEL_GROUP = 'DEL_GROUP';
function PostDelGroup(data) {
    var url = 'https://biz.workec.com/crm/taggroup/del';
    return (dispatch, getState) => {
        return fetchNew(url, 'post', {id: data.id})
            .then(json => {
                analysis(json, ()=> {
                    Message.success(json.msg);
                    dispatch({
                        type: DEL_GROUP,
                        data: {id: data.id, name: data.name}
                    })
                    dispatch({
                        type: 'SWITCH_MANAGEMODAL',
                        data: false
                    })
                    var state = getState();
                    var groups = state.postsByReddit.groupList.groups;
                    if (data.name == state.postsByReddit.selectGroupName) {
                        if(groups && groups[0]) {
                            dispatch(selectGroupAct(groups[0]));
                        } else {
                            dispatch(setSelectGroupName(''));
                        }
                    }

                }, () => {
                    if (json.code == 20600) {
                        // dispatch({
                        //     type: 'DELGROUP_MODAL',
                        //     data: true
                        // })
                        Message.error(json.msg);
                    } else {
                        Message.error(json.msg);
                    }

                })
            })
    }

}
export function delGroup(data) {
    return (dispatch, getState) => {
        return dispatch(PostDelGroup(data))
    }
}

//移动分组

export const MOVE_GROUP = 'MOVE_GROUP';
function PostMOVEGroup(data) {
    return dispatch => {

        return fetchNew('https://biz.workec.com/crm/taggroup/move', 'post', data.sortData)
            .then(json => {
                analysis(json, ()=> {
                    dispatch({
                        type: MOVE_GROUP,
                        data: data.arr
                    })
                })
            })
    }
}
export function moveGroup(data) {
    return (dispatch, getState) => {
        return dispatch(PostMOVEGroup(data))
    }
}
//设置是否允许多选
export const AGREE_MULTI_CHOICE = 'AGREE_MULTI_CHOICE';
export function agreeMultiChoice(data) {
    return (dispatch, getState) => {
        return dispatch(fetchAgreeMultiChoice(data))
    }
}

function fetchAgreeMultiChoice(data) {
    let url = 'https://biz.workec.com/crm/taggroup/setmulti';
    return dispatch => {

        return fetchNew(url, 'post', data)
            .then(json => {
                analysis(json, ()=> {
                    dispatch({
                        type: AGREE_MULTI_CHOICE,
                        data: data
                    });
                    Message.success('操作成功！');
                })
            })
    }
}
/*==========================拖拽排序====================================*/
export const SORT_GROUP_LABEL = 'SORT_GROUP_LABEL';
export function dragSortLabel(data) {
    return (dispatch, getState) => {
        return dispatch(fetchDragSortLabel(data))
    }
}
function fetchDragSortLabel(data) {
    var url = 'https://biz.workec.com/crm/tag/dragsort';
    return dispatch => {
        return fetchNew(url, 'post', data)
            .then(json => {
                if (json.code !== 200) {
                    Message.success('操作失败，请稍后再试！');
                    dispatch(getActiveLabel({
                        gid: data.groupId
                    }));
                }
                
            }, () => {
                Message.success('操作失败，请稍后再试！');
                dispatch(getActiveLabel({
                    gid: data.groupId
                }));
            })
    }
}
export function dragSortGroup(data) {
    return (dispatch, getState) => {
        return dispatch(fetchDragSortGroup(data))
    }
}
function fetchDragSortGroup(data) {
    return dispatch => {
        return fetchNew('https://biz.workec.com/crm/taggroup/move', 'post', data)
            .then(json => {
                analysis(json, () => {
                    if (json.code !== 200) {
                        Message.success('操作失败，请稍后再试！');
                    }
                    // dispatch({
                    //     type: MOVE_GROUP,
                    //     data: data.arr
                    // })
                }, () => {
                    Message.error('操作失败，请稍后再试！');
                    dispatch(getGroupList(true));
                })
            })
    }
}
/*==========================end====================================*/
/*==========================批量管理====================================*/
//删除
export const MULTI_DEL_LABEL = 'MULTI_DEL_LABEL';
export function multiDelLabel(data) {
    return (dispatch, getState) => {
        return dispatch(fetchMultiDelLabel(data))
    }
}
function fetchMultiDelLabel(data) {
    return dispatch => {
        return fetchNew('https://biz.workec.com/crm/tag/multidel', 'post', data)
            .then(json => {
                analysis(json, () => {
                    dispatch(swichVisible(false, 'isConfirmMultiDelLabel'));
                    if (json.code == 200) {
                        Message.success('操作成功');
                        dispatch({
                            'type': MULTI_DEL_LABEL,
                            'data': data
                        })

                    } else {
                        Message.error('操作失败，请稍后再试！');
                    }
                   
                }, () => {
                    dispatch(swichVisible(false, 'isConfirmMultiDelLabel'));
                    Message.success('操作失败，请稍后再试！');
                    dispatch(getGroupList(true));
                })
            })
    }  
}

//设置分组
export const SET_GROUP = 'SET_GROUP';
function fetchMultiSetGroup(data) {
    var url = 'https://biz.workec.com/crm/tag/setgroup';
    return dispatch => {
        return fetchNew(url, 'post', data)
            .then(json => {
                analysis(json, ()=> {
                    if (json.code) {
                        Message.success('操作成功！');
                        dispatch({
                            'type': SET_GROUP,
                            'data': data
                        })
                    } else {
                        Message.error('操作失败，请稍后再试！');
                    }
                    dispatch({
                        type: 'GET_SETGROUPNAME',
                        data: ''
                    });
                    dispatch(swichVisible(false, 'isSetGroupVisible'));

                }, () => {
                    Message.error('操作失败，请稍后再试！');
                    dispatch(swichVisible(false, 'isSetGroupVisible'));
                    dispatch({
                        type: 'GET_SETGROUPNAME',
                        data: ''
                    });
                })   
            })
    }
} 
export function multiSetGroup(data) {
    return (dispatch, getState) => {
        return dispatch(fetchMultiSetGroup(data))
    }
}

//关闭轮播
export function closeGuide() {
    return (dispatch, getState) => {
        return dispatch(fetchCloseGuide())
    }
}
function fetchCloseGuide() {
     var url = 'https://biz.workec.com/crm/taggroup/closeguide';
    return dispatch => {
        return fetchNew(url, 'post', {})
            .then(json => {
                analysis(json, () => {
                    if (json.code == 200) {
                        dispatch(swichVisible(false, 'isShowGuide'));
                    }

                })   
            })
    }
}
/*==========================end====================================*/
export const SELECT_COLOR = 'SELECT_COLOR';
export function selectColor(data) {
     return (dispatch, getState) => {
        return dispatch(fetchSelectColor(data))
    }
}
function fetchSelectColor(data) {
    var url = 'https://biz.workec.com/crm/taggroup/setcolor';
    return dispatch => {
        return fetchNew(url, 'post', data)
            .then(json => {
                analysis(json, () => {
                    Message.success(json.msg);
                    dispatch({
                        type: SELECT_COLOR,
                        data: data
                    })
                })
            })
    }
}
//存选中的label或者group的id；
export const STORAGE_REQUIRE_EDIT = 'STORAGE_REQUIRE_EDIT';
export function requireEdit(data) {
    return {
        type: STORAGE_REQUIRE_EDIT,
        data: data
    }
}

//FETCH正在发送，与发送结束
export const FETCH_PEND = 'FETCH_PEND';
export const FETCH_COMPLETE = 'FETCH_COMPLETE';
function fetchPend(type) {
    return {
        type: 'FETCH_PEND',
        data: {
            type: type
        }
    }
}
function fetchComplete(type) {
    return {
        type: 'FETCH_COMPLETE',
        data: {
            type: type
        }
    }
}

//获取旧标签已经分配过的数据
export const GET_TMP_OLDDATA = 'GET_TMP_OLDDATA';
function getTmpOldData() {
    return (dispatch, getState) => {
        return dispatch(fetchGetTmpOldData())
    }
}
function fetchGetTmpOldData() {
    var url = 'https://biz.workec.com/crm/tag/gettmpdata';
    return dispatch => {
        return fetchNew(url, 'get')
            .then(json => {
                analysis(json, ()=> {
                    dispatch({
                        type: GET_TMP_OLDDATA,
                        data: json
                    });
                    dispatch({
                        type: 'LOAD_COMPONENT',
                        data: true
                    })
                    json.data[0] && dispatch(setSelectGroupName(json.data[0].f_group_name))
                   
                })
            })
    }
}

//获取所有的旧标签
export const ALL_Old_LABEL = 'ALL_Old_LABEL';
function getAllOldLabel() {
    return (dispatch, getState) => {
        return dispatch(fetchGetAllOldLabel())
    }
}
function fetchGetAllOldLabel() {
    var url = 'https://biz.workec.com/crm/tag/getoldtags';
    return dispatch => {
        return fetchNew(url, 'get')
            .then(json => {
                analysis(json, ()=> {
                    dispatch({
                        type: ALL_Old_LABEL,
                        data: json.data
                    })
                })
            })
    }
}
//临时数据保存
export function fetchSaveOldData(data) {
    var url = 'https://biz.workec.com/crm/tag/settmpdata';
    fetchNew(url, 'post', data)
        .then(json => {
            analysis(json, ()=> {
                // dispatch({
                //     type: SAVE_Old_LABEL,
                //     data: json.data
                // })
            })
        })
}

//对旧标签与分组的操作
export const OPERATE_OLDDATA = 'OPERATE_OLDDATA';
function operateOldData(data) {
    return (dispatch, getState) => {
        return dispatch(fetchOldGroupList())
    }
}
export const GET_ACTIVE_OLDLABEL = 'GET_ACTIVE_OLDLABEL';//获取旧标签下面的分组
export const CREATE_GROUP_OLD = 'CREATE_GROUP'; //旧标签分组创建
export const DEL_GROUP_OLD = 'DEL_GROUP_OLD';   //旧标签分组删除
export const MOVE_GROUP_OLD = 'MOVE_GROUP_OLD'; //就标签分组移动
export const EDIT_GROUP_OLD = 'EDIT_GROUP_OLD'; //已分配的旧标签分组编辑
export const DEL_LABEL_OLD = 'DEL_LABEL_OLD'; //已分配的旧标签删除
export const MOVE_LABEL_OLD = 'MOVE_LABEL_OLD'; //已分配的旧标签移动
export const OLDLABLE_TO_GROUP = 'OLDLABLE_TO_GROUP'; //分配旧标签
export const SET_SELECT_GROUPNAME = 'SET_SELECT_GROUPNAME'; //设置选中的分组id
export const SET_SELECT_LABELNAME = 'SET_SELECT_LABELNAME'; //设置选中的labelid
export function setSelectGroupName(selectGroupName) {
    return {
            type: SET_SELECT_GROUPNAME,
            selectGroupName: selectGroupName
        }
}
export function setSelectLabelName(selectLabelName) {
    return {
            type: SET_SELECT_LABELNAME,
            selectLabelName: selectLabelName
        }
}
export function operateType(data) {
    // return (dispatch, getState) => {
    //     dispatch({
    //         type: data.type,
    //         data: data.data
    //     })
    //     return dispatch(SAVE_Old_LABEL())
    // }
    return {
         type: data.type,
         data: data.data
    }

}

const SET_LABEL_CTRL_INDEX = 'SET_LABEL_CTRL_INDEX';
// export function setLabelCtrlIndex(index) {
//     return {
//         type: SET_LABEL_CTRL_INDEX,
//         index: index
//     }
// }
export function updateTag(data) {
    var url = 'https://biz.workec.com/crm/tag/updatetag';
    fetchNew(url, 'post', data)
        .then(json => {
            analysis(json, ()=> {
                Message.success('恭喜您！升级成功');
                setTimeout(() => {
                    location.reload();
                }, 2000);
               
            }, () => {
                Message.error('升级失败，请稍后再试！')
            })
        })
}

export function selectGroupAct(item, bool) {
    return (dispatch, getState) => {
        const {type} = getState().postsByReddit.corpData;
        dispatch(setSelectGroupName(item.f_group_name));
        //显示右侧的删除，修改分组getLabel
        dispatch(swichVisible(true, 'isRightEditOrDelGroupVisble'));
        dispatch({
            type: 'CANCEL_MULTI',
            data: item.f_ismore ? true :  false
        })
        if (type) {
            dispatch(getActiveLabel({
                gid: item.f_group_id
            }, bool));
        } else {
            dispatch(operateType({
                type: 'GET_ACTIVE_OLDLABEL',
                data: item.f_group_name
            }))
            fetchSaveOldData({
                gtag: getState().postsByReddit.groupList
            });
        }
    }
}

export const SET_INPUT_VALUE = 'SET_INPUT_VALUE';
export function setInputValue(name, value) {
    return {
        type: SET_INPUT_VALUE,
        name: name,
        value: value
    }
}