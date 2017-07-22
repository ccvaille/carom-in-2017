import * as actionTypes from '../action/actionType';

const defaultStore = {
    shownMenus: [],//显示的菜单：1：共享请求 2：预警消息

    iswranListLoading: false,//预警信息列表是否在加载中
    isWranListLoadOver: false, //预警信息列表是否加载完了
    isWranListLoadLess: false, //预警信息列表加载不到一页
    wranListPageIndex: 1, //预警信息列表页数
    wranList: [],//预警信息列表
    isHaveWrans: false, //是否有预警信息

    isWranDetailLoading: false,//预警信息详情是否加载中
    isWranDetailLoadOver: false,//预警信息详情是否加载完了
    isWranDetailLoadLess: false, //预警信息列表加载不到一页
    wranDetailPageIndex: 1, //预警信息详情列表页数
    wranDetail: [], //预警详情列表
    wranDetailCounter: 0,//无用，通知组件渲染用.
    wranDetailLoseNumber:0, //预警信息详情掉单人数

    isShareListLoading: false, //共享请求信息是否加载中
    isShareListLoadOver: false, //共享请求信息是否加载完了
    isShareListLoadLess: false, //预警信息列表加载不到一页
    shareListPageIndex: 1, //共享请求页码
    shareList: [], //共享请求列表


}

function messageReducers(state = defaultStore, action) {
    switch (action.type) {
        //加载预警信息列表
        case actionTypes.LOAD_WARN_LIST: {
            let result;
            if (action.data.pageIndex == 1)
                result = {
                    ...state,
                    wranList: action.data.list,
                    wranListPageIndex: 1
                };
            else result = {
                ...state,
                wranList: state.wranList.concat(action.data.list),
                wranListPageIndex: action.data.pageIndex,
            }
            result.isWranListLoadOver = action.data.list.length <= 0 && result.wranListPageIndex > 1;
            result.isWranListLoadLess = action.data.list.length < 5 && result.wranListPageIndex == 1;
            return result;
        }
        //加载需要显示的菜单项目
        case actionTypes.LOAD_MENU_SHOW:
            return {
                ...state,
                shownMenus: action.menus,
            }
        //加载是否有新预警提示
        case actionTypes.LOAD_WARN_EXIST:
            return {
                ...state,
                isHaveWrans: action.isHave,
            }
        //设置预警信息加载情况
        case actionTypes.TOGGLE_WARN_LIST_LOADING:
            return {
                ...state,
                iswranListLoading: action.isShow,
            }
        //获取预警信息详情
        case actionTypes.LOAD_WARN_DETAIL: {
            let result;
            action.data.detail.users.forEach(function (item) {
                if (item.lose_number > 2) {
                    item.isCrmOver = false;
                    item.crmIndex = 0;
                }
            });
            if (action.data.pageIndex == 1)
                result = {
                    ...state,
                    wranDetail: action.data.detail.users,
                    wranDetailPageIndex: 1,
                    wranDetailLoseNumber:action.data.detail.lose_number,
                }; 
            else result = {
                ...state,
                wranDetail: state.wranDetail.concat(action.data.detail.users),
                wranDetailPageIndex: action.data.pageIndex,
            }
            result.isWranDetailLoadOver = action.data.detail.users.length <= 0 && result.wranDetailPageIndex > 1;
            result.isWranDetailLoadLess = action.data.detail.users.length < 6 && result.wranDetailPageIndex == 1;
            
            return result;
        }
        //设置预警详情加载情况
        case actionTypes.TOGGLE_WARN_DETAIL_LOADING:
            return {
                ...state,
                isWranDetailLoading: action.isShow,
            }
        //加载预警详情单项更多客户
        case actionTypes.LOAD_WARN_DETAIL_MORE: {
            let list = state.wranDetail;
            list.forEach(function (item) {
                if (item.user_id == action.data.id) {
                    if (action.data.list.length < 5) {
                        item.isCrmOver = true;
                    } 
                    item.crms = item.crms.concat(action.data.list);
                    item.crmIndex = action.data.pageIndex;
                }
            });
            return {
                ...state,
                wranDetail: list,
                wranDetailCounter: state.wranDetailCounter + 1,
            };
        }
        //重置预警详情单项更多客户
        case actionTypes.RESET_WARN_DETAIL_MORE: {
            let list = state.wranDetail;
            list.forEach(function (item) {
                if (item.user_id == action.id) {
                    item.crms.length = 2;
                    item.isCrmOver = false;
                    item.crmIndex = 0;
                }
            });
            return {
                ...state,
                wranDetail: list,
                wranDetailCounter: state.wranDetailCounter + 1,
            };
        }
        //获取共享请求列表
        case actionTypes.LOAD_SHARE_LIST: {
            let result;
            if (action.data.pageIndex == 1)
                result = {
                    ...state,
                    shareList: action.data.list,
                    shareListPageIndex: 1
                };
            else result = {
                ...state,
                shareList: state.shareList.concat(action.data.list),
                shareListPageIndex: action.data.pageIndex,
            }
            result.isShareListLoadOver = action.data.list.length <= 0 && result.shareListPageIndex > 1;
            result.isShareListLoadLess = action.data.list.length < 5 && result.shareListPageIndex == 1;
            return result;
        }
        //切换共享请求加载状态
        case actionTypes.TOGGLE_SHARE_LIST_LOADING: {
            return {
                ...state,
                isShareListLoading: action.isShow,
            }
        }
        default: return state;
    }
}

export default messageReducers;