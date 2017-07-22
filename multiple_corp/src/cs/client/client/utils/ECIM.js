import { displayError } from '~comm/utils';

export default class ECIM {
    constructor(corpid) {
        this.init(corpid);
        this.bindEvents();
    }
    init(corpid) {
        const isSecure = window.location.protocol === 'https:';
        this.socket = new WebSocket(`${isSecure ? 'wss:' : 'ws:'}//eckf.workec.com/ws?CorpID=${corpid}`);
        this.reqs = {};
    }
    bindEvents() {
        this.socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            const req = this.reqs[msg.SeqID];

            if (msg.ErrorCode || !req) {
                displayError(msg.ErrorInfo);
                return;
            }
            req.callback(msg);
            if (req.timeout) {
                clearTimeout(req.timeout);
                req.timeout = undefined;
            }
            delete this.reqs[msg.SeqID];
        };
    }
    send(data, callback = () => {}) {
        const seqid = Date.now() + Math.floor(Math.random() * 1000000);
        this.reqs[seqid] = {
            ...data,
            SeqID: seqid,
            callback,
            // times: 0,
            // timeout: setTimeout(() => {
            //     if (this.reqs[seqid].times > 3) {
            //         console.log('重连失败', this.reqs[seqid]);
            //         return;
            //     }
            //     this.reqs[seqid].times += 1;
            //     this.doSend(data, seqid);
            // }, 15000),
        };
        this.doSend(data, seqid);
    }
    doSend(data, seqid) {
        this.socket.send(JSON.stringify({
            ...data,
            SeqID: seqid,
        }));
    }
    close() {
        this.socket.close();
        this.socket = null;
    }
}
