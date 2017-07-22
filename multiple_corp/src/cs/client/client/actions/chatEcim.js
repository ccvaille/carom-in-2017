import ECIM from '../utils/ECIM';
import { displayError } from '~comm/utils';

let reconnectStartTime;
let heartBeatTimer;
let timeoutTimer;

export function sendInvite(guid, callback = () => {}) {
    return (dispatch, getState) => {
        const { corpid } = getState().chat;
        window.ecim.send({
            Command: 'Invite',
            Body: {
                VisitorID: guid,
                CorpID: corpid,
            },
        }, callback);
    };
}

// export function switchCs(newCsid, callback = () => {}) {
//     return (dispatch, getState) => {
//         const { corpid, csid, guid } = getState().chat;
//         window.ecim.send({
//             Command: 'Switch',
//             Body: {
//                 CorpID: corpid,
//                 Transfer: csid,
//                 Transfered: newCsid,
//                 VisitorID: guid,
//             },
//         }, callback);
//     };
// }


export function heartbeat() {
    return (dispatch) => {
        heartBeatTimer = setInterval(() => {
            window.ecim.send({
                Command: 'Heart',
                Body: {
                    Content: 'hello',
                },
            }, () => {
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                    timeoutTimer = undefined;
                }
            });

            timeoutTimer = setTimeout(() => {
                if (timeoutTimer) { // 此时还没被清掉
                    // 超时断开
                    clearInterval(heartBeatTimer);
                    clearTimeout(timeoutTimer);
                    timeoutTimer = undefined;
                    // window.ecim = null;
                    dispatch(tryReconnect());
                }
            }, 45000);
        }, 15000);
    };
}

export function closeSocket() {
    return (dispatch) => {
        window.ecim && window.ecim.close();
        clearInterval(heartBeatTimer);
        clearTimeout(timeoutTimer);
    };
}

export function login() {
    return (dispatch, getState) => {
        const { csid, corpid, key } = getState().chat;
        window.ecim.send({
            Command: 'Login',
            Body: {
                UserID: csid,
                CorpID: corpid,
                Templat: 0,
                Key: key,
            },
        }, (msg) => {
            reconnectStartTime = 0;
            dispatch(heartbeat());
        });
    };
}

export function tryReconnect() {
    return (dispatch) => {
        if (!reconnectStartTime) {
            reconnectStartTime = Date.now();
        }
        if (Date.now() - reconnectStartTime <= 5000) {
            setTimeout(() => {
                dispatch(initECIM());
                window.ecim.onopen = (e) => {
                    if (e.type === 'close') {
                        return;
                    }
                    dispatch(login());
                };
            }, 1000);
        } else {
            displayError('网路异常');
            dispatch(chatActs.setLogined(false));
        }
    };
}

export function initECIM() {
    return (dispatch, getState) => {
        const { corpid } = getState().chat;
        const ecim = new ECIM(corpid);
        window.ecim = ecim;

        ecim.socket.onerror = () => {
            displayError('网路异常');
        };
        // dispatch(chatActs.initECIM(ecim));
    };
}

