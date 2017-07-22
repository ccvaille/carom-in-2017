import { message } from 'antd';


//统一检查后台返回的json状态码
function checkCode(state, json) {
    if (!json) {
        return;
    }
    if (json.code == 401) {
        window.location.href = "https://www.workec.com/login?from=" + window.location.href;
        return;
    } else if (json.code != 0 && json.code != 200 && state.list.length != 0) {
        message.error(json.msg);
    }
    return json;
}

//通用消息处理方法
function commonMessageReady(state, newState, action) {
    var json = action.json;
    var index = json.data.length - 2;
    var list = json.data.reverse().concat(newState.list);
    if (index <= -1) {
        index = 1;
    }
    if (list.length <= 1) {
        index = list.length - 1;
    }
    if (json.code == 401) {
        return state;
    }
    if (json.code != 0) {//后台出错
        newState.loading = false;
    } else {
        newState = Object.assign({}, state, {
            userid: json.userid || '',
            list: list,
            end: json.page.end,
            loading: false,
            curpage: json.page.curpage,
            needShowIndex: index
        });
    }
    if (json.code != 0 && newState.list.length == 0) {
        newState.emptyError = true;
    } else {
        newState.emptyError = false;
    }
    return newState;
}


export { checkCode, commonMessageReady }
