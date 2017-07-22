import Event from './Event';
import Session from './Session';

import { parseTpl } from '../utils/parseTpl';

import { EVENT_TYPES } from '../modules/const';

const EC_CS = window.EC_CS;

export default class SessionWindow extends Event {
    constructor(opts) {
        super();
        this.init(opts);
        this.bindEvents();
    }
    init(opts) {
        this.id = opts.id;
        this.tpl = opts.tpl;
        this.sessions = {};
        this.currentSession = undefined;
    }
    bindEvents() {
        // 新访客
        EC_CS.on(EVENT_TYPES.ON_NEW_SESSION, (sendToId) => {
            this.createSession(sendToId);
        });
    }
    createWindow() {
        this.wrapper = document.createElement('div');
        this.wrapper.innerHTML = parseTpl(this.tpl, {

        });
    }
    createSession(sendToId) {
        this.sessions[id] = new Session({
            id: this.id, // other session info
            sendToId,
        });
    }
    sendTextMsg(msg) {
        this.currentSession.sendTextMsg(msg);
    }
    sendImgMsg(file) {
        this.currentSession.sendImgMsg(file);
    }
    switchTo(id) {
        for (let i in this.sessions) {
            if (i !== id) {
                this.sessions[i].blur();
            }
        }
        this.currentSession = this.sessions[id];
        this.currentSession.focus();
    }
}
