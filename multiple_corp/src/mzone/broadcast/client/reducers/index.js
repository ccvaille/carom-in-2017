import { Fetch_Members, Fetch_Broadcast_List, Fetch_Broadcast_Detail, Remove_Broadcast, Clear_Editor_State, Recall_Broadcast, Search_Members } from '../actions'

const listInitialState = {
    broadcastList: [],
    noMoreData: false,
    noData: false,
    curPage: 1,
    filter: 1
}

const editInitialState = {
    membersData: [],
    searchMembers: [],
    searchValue: '',
    broadcastDetail: {},
    reEdit: false
}

function broadcastList(state = listInitialState, action) {
    switch (action.type) {
        case Fetch_Broadcast_List:
            return {
                ...state,
                ...action,
                broadcastList: action.curPage == 1 ? action.broadcastList : state.broadcastList.concat(action.broadcastList)
            }
        case Remove_Broadcast:
            return {
                ...state,
                broadcastList: state.broadcastList.filter(function(item) {
                    return item.f_id != action.id
                })
            }
        case Recall_Broadcast:
            let broadcastList = state.broadcastList;
            let actIndex, actItem;
            for(let item of broadcastList) {
                if(item.f_id == action.id) {
                    actItem = item;
                    actIndex = broadcastList.indexOf(item);
                    break;
                }
            }
            actItem.f_mtime = action.recallTime;
            actItem.f_status = 3;
            broadcastList = broadcastList.filter(function(item, index) {
                return actIndex != index
            });
            broadcastList.unshift(actItem);
            return {
                ...state,
                broadcastList: broadcastList
            }
        default:
            return state
    }
}

function broadcastEdit(state = editInitialState, action) {
    switch (action.type) {
        case Fetch_Members:
            return {
                ...state,
                membersData: action.membersData
            }
        case Fetch_Broadcast_Detail:
            return {
                ...state,
                broadcastDetail: action.broadcastDetail,
                reEdit: true
            }
        
        case Search_Members:
            return {
                ...state,
                searchMembers: action.searchMembers,
                searchValue: action.searchValue
            }
        case Clear_Editor_State:
            return editInitialState
        default:
            return state
    }
}

export default {
    broadcastList,
    broadcastEdit
};