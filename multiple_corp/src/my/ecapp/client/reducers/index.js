import { combineReducers } from 'redux';
import { message } from 'antd';
import { actions } from '../actions';
import { checkCode, commonMessageReady } from './comm';
import {default as ecteamData} from './ectem';
import {default as crmmsgData} from './crmmsg';
import {default as shareData} from './share';
import {default as h5Data} from './h5';
import {default as broadcastData} from './broadcast';


//广播消息
export function broadCastToAllPage(json) {
    if (window.PVFunction && window.ECBridge) {
        var param = {
            command: 503,
            callback: function (command, data) { },
            json: JSON.stringify(json)
        }
        // window.alert(param.json);
        window.ECBridge.exec(param);
    }
}


//将两个reducer合并成一个reducer,也就将全局的state加上postsByReddit,selectedReddit两个属性，每个属性都有自己的state
const rootReducer = combineReducers({
    ecteamData: ecteamData,
    crmmsgData,
    broadcastData,
    h5Data,
    shareData
});

export default rootReducer
