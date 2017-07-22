import fetch from '../util/fetch';

export const changeCategoryTab = (index, type) => {
    return {
        type,
        index
    }
}

export const changeTimeTab = (index, type) => {
    return {
        type,
        index
    }
}

export const changeBeginAndEnd = (type, obj) => {
    return {
        type,
        obj
    }
}

export const changeType = (action, value, type) => {
    return {
        type: action,
        data: {
            value,
            type
        }
    }
}

 export const fetchTodayData = (isexport=0) => {
     return (dispatch, getState) => {
        const oldState = getState();
        fetch("https://my.workec.com/work/telcount/gettoday", "post", {
            users: oldState.dailyData.selected,
            export: isexport
        }).then(json => { 
            if(isexport == 0 && json.code == 200) {
                dispatch({
                    type: "CHANGE_TODAY_DATA",
                    data: json
                });  
            } else if(isexport == 1) {
                dispatch({
                    type: "CHANGE_EXPORT_MSG",
                    exportData: json
                });
            }      
        });
     }
}

 export const fetchHistoryData = (isexport=0) => {
     return (dispatch, getState) => {
        const oldState = getState();
        fetch("https://my.workec.com/work/telcount/gethistory", "post", {
            startdate: oldState.historyData.startdate,
            enddate: oldState.historyData.enddate,
            calltype: oldState.historyData.callMode,
            phonetype: oldState.historyData.callCategory,
            timetype: oldState.historyData.callTimeType,
            users: oldState.historyData.selected,
            export: isexport
        }).then(json => { 
            if(isexport == 0 && json.code == 200) {
                dispatch({
                    type: "CHANGE_HISTORY_DATA",
                    data: json
                });  
            } else if(isexport == 1) {
                dispatch({
                    type: "CHANGE_EXPORT_MSG",
                    exportData: json
                });
            }      
        });
     }
}

 export const fetchRankData = (isexport=0) => {
     return (dispatch, getState) => {
        const oldState = getState();
        fetch("https://my.workec.com/work/telcount/getucount", "post", {
            startdate: oldState.employeeData.startdate,
            enddate: oldState.employeeData.enddate,
            // type: oldState.employeeData.tabIndex - 1,
            users: oldState.employeeData.selected,
            export: isexport
        }).then(json => { 
            if(isexport == 0 && json.code == 200) {
                dispatch({
                    type: "CHANGE_RANK_DATA",
                    data: json
                });
                dispatch({
                    type: "CHANGE_RANK_SORT",
                    key: 'callpercent',
                    option: 'down'
                })  
            } else if(isexport == 1) {
                dispatch({
                    type: "CHANGE_EXPORT_MSG",
                    exportData: json
                });
            }    
        });
     }
}

export const changeSelect = (actionType, operate) => {
    if(operate.type == "add"){
        return {
            type: actionType,
            operate: "add",
            obj: operate.obj
        }
    }else if(operate.type == "del"){
        return {
            type: actionType,
            operate: "del",
            index: operate.index
        }
    }else{
        return {
            type: actionType,
            operate: "clear"
        }        
    }
}

export const clearData = (type) => {
    return {
        type
    }
}

export const changeRankSort = (key, type) => {
    return {
        type: "CHANGE_RANK_SORT",
        key,
        option: type
    }
}

export const changePi = (index) => {
    return {
        type: "CHANGE_RANK_PI",
        index
    }
}
