import Event from './Event';
import { EVENT_TYPES, WINDOW_MODES } from './const';

import { addEvent, addClass, removeClass, $ } from '../utils';
import tpls from '../tpls';

let webim;

export default class Session extends Event {
    constructor(opts = {}) {
        super();
        this.initVars(opts);
        this.initTpls();
        this.initSessionWindow();
        this.bindEvents();
    }
    initVars(opts) {
        webim = opts.webim;
        this.mode = opts.mode || 1;
        this.parent = opts.parent;
        this.id = opts.id;
        this.sendToId = opts.sendToId;
        this.msgs = [];
        this.unreadNums = 0;
        this.isFocusing = false;
        // tpls
        this.sessionTpl = tpls.sessionTpl;
        this.msgBoardTpl = tpls.msgBoardTpl;
        // dom nodes
        this.$tabContainer = opts.tabContainer;
        this.$windowContainer = opts.windowContainer;

        this.txSession = new webim.Session(
            webim.SESSION_TYPE.C2C,
            this.sendToId,
            this.sendToId,
            '',
            Math.round(new Date().getTime() / 1000)
        );
    }
    initSessionWindow() {
        this.$window = document.createElement('div');
        this.$window.id = `ec--session-${this.sendToId}`;
        this.$window.innerHTML = this.sessionTpl({

        });

        this.$msgsContainer = $('msg-list', this.$window);
        this.$input = $('msg-input', this.$window);
        this.$sendBtn = $('send-btn', this.$window);
        this.$windowContainer.appendChild(this.$window);
    }
    initTpls() {
        const { sessionTpl, smallSessionTpl, msgBoardTpl, smallMsgBoardTpl } = tpls;

        switch (this.mode) {
            case WINDOW_MODES.STANDARD:
                return {
                    session: sessionTpl,
                    msgBoard: msgBoardTpl,
                };
            case WINDOW_MODES.SMALL:
            default:
                return {
                    session: smallSessionTpl,
                    msgBoard: smallMsgBoardTpl,
                };
        }
    }
    bindEvents() {
        window.ec_cs.on(EVENT_TYPES.ON_MESSAGE, (msg) => {
            const fromId = msg.getSession().id();
            if (fromId === this.sendToId) {
                this.addMsg(msg);
            }
            if (this.isFocusing) {
                this.setRead();
                this.updateUnreadNum(0);
            } else {
                this.updateUnreadNum(this.unreadNums + 1);
            }
        });

        addEvent(this.$input, 'keydown', (e) => {
            if (e.keyCode === 13) this.sendTextMsg();
        });
        addEvent(this.imgFile, 'change', () => {
            this.uploadImg(this.imgFile);
        });
    }
    sendTextMsg(text) {
        const msg = new webim.Msg(
            this.txSession,
            true,
            -1,
            Math.round(Math.random() * 4294967296),
            Math.round(new Date().getTime() / 1000),
            this.id,
            webim.C2C_MSG_SUB_TYPE.COMMON
        );
        msg.addText(new webim.Msg.Elem.Text(text));

        webim.sendMsg(msg, (re) => {
            this.addMsg(msg);
        }, (re) => {
            console.log(re);
        });
    }
    uploadImg(file) { // todo :: tx兼容IE8/9
        const opts = {
            file,
            From_Account: this.id,
            To_Account: this.sendToId,
            businessType: webim.UPLOAD_PIC_BUSSINESS_TYPE.C2C_MSG,
            onProgressCallBack: (re) => {
                console.log(re);
            },
        };
        webim.uploadPic(opts, (re) => {
            this.sendImgMsg(re);
        }, (re) => {
            console.log(re);
        });
    }
    sendImgMsg(msgImgs) {
        const msg = new webim.Msg(
            this.txSession,
            true,
            -1,
            Math.round(Math.random() * 4294967296),
            Math.round(new Date().getTime() / 1000),
            this.id,
            webim.C2C_MSG_SUB_TYPE.COMMON
        );

        msg.addImage(this.makeImgMsgs(msgImgs));

        webim.sendMsg(msg, (re) => {
            this.addMsg(msg);
        }, (re) => {
            console.log(re);
        });
    }
    makeImgMsgs(msgImgs) {
        const imgMsg = new webim.Msg.Elem.Images(msgImgs.File_UUID);
        for (let i in msgImgs.URL_INFO) {
            const img = msgImgs.URL_INFO[i];
            let type;
            switch (img.PIC_TYPE) {
                case 1://原图
                    type = 1;//原图
                    break;
                case 2://小图（缩略图）
                    type = 3;//小图
                    break;
                case 4://大图
                    type = 2;//大图
                    break;
                default:
                    type = 3;
                    break;
            }
            const newImg = new webim.Msg.Elem.Images.Image(type, img.PIC_Size, img.PIC_Width, img.PIC_Height, img.DownUrl);
            imgMsg.addImage(newImg);
        }
        return imgMsg;
    }
    getHistoryMsgs() {
        const lastMsgTime = 0; // 分页 todo::要记录下来 上一次拉取的最后一条的时间
        const msgKey = '';
        const opts = {
            Peer_Account: this.id,
            MaxCnt: 20, // 每页拉取消息条数
            LastMsgTime: lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
            MsgKey: msgKey,
        };

        webim.getC2CHistoryMsgs(opts, (re) => {
            // console.log(re);
            re.MsgList.forEach((msg) => {
                this.addMsg(msg);
            });
            // console.log()
        }, (re) => {
            console.log(re);
        });
    }
    updateUnreadNum(unreadNums) { // 新消息过来的时候 如果不是当前聊天的 未读消息+1
        this.unreadNums = unreadNums;
        this.$unreadMsgEle.innerText = unreadNums;
        if (!this.isFocusing) {
            this.unreadMsgEle.hide();
        }
    }
    setRead() {
        webim.setAutoRead(this.session, true, true);
        // this.updateUnreadNum(0);
    }
    // 切换到当前session
    focus() {
        this.$window.show();
        addClass(this.$tab, 'active');
    }
    blur() {
        this.$window.hide();
        removeClass(this.$tab, 'active');
    }
    addMsg(msg) {
        this.msgs.push(msg);

        const $tempWrapper = document.createElement('ul');
        $tempWrapper.innerHTML = parseTpl(this.msgTpl, {});
        this.$msgsContainer.appendChild($tempWrapper.childNode);
    }
    remove() { // 对方退出登录（系统消息）
        this.$tabContainer(this.$tab);
        this.$windowContainer.removeChild(this.$window);
        this.parent.removeSession(this.sendToId);
    }
}
