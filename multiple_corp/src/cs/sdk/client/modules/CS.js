import '../core/ec_im';
import Event from './Event';
import Session from './Session';
import { ajax, addEvent } from '../utils';
import { EVENT_TYPES, WINDOW_MODES } from './const';

const isMobile = false;

window.ec_cs = {
    __proto__: new Event(),
    init(opts) {
        this.initRootEle();
        this.initVars(opts);
        this.bindEvents();
        // this.initEcim();
    },
    initRootEle() {
        this.rootEle = document.createElement('div');
        document.body.appendChild(this.rootEle);
    },
    initVars(opts) {
        this.isGettingSig = false;
        this.isLogined = false;
        this.config = opts;
        this.sessions = {}; // 列表模式可以切换客服
    },
    bindEvents() {
        // 在entrance中触发
        this.on(EVENT_TYPES.ON_SHOW_SESSION, (sendToId) => {
            this.sendToId = sendToId;

            if (this.isGettingSig) return;

            if (this.isLogined) {
                this.initSession(this.sendToId);
                return;
            }
            // 初始化流程
            this.getSig().then((loginInfo) => {
                this.initTxim(loginInfo).then(() => {
                    this.txim.login();
                });
            });
            this.getKfInfo(this.sendToId);
        });
        this.on(EVENT_TYPES.ON_TXIM_LOGIN, () => {
            this.isLogined = true;
            this.initSession(this.sendToId);
        });
    },
    initEcim() {
        require.ensure(['../core/ec_im'], (require) => {
            const ECIM = require('../core/ec_im').ECIM;
            this.ecim = new ECIM(this.config);
        });
    },
    initTxim(loginInfo) {
        return new Promise((resolve) => {
            require.ensure([
                '../../../common/lib/spark-md5',
                '../../../common/lib/base64',
                '../../../common/lib/json2',
                '../../../common/lib/webim1.7.0',
                '../core/tx_im',
            ], () => {
                require('../../../common/lib/spark-md5');
                require('../../../common/lib/base64');
                require('../../../common/lib/json2');
                const webim = require('../../../common/lib/webim1.7.0').default;
                const TXIM = require('../core/tx_im').TXIM;

                this.txim = new TXIM({
                    webim,
                    loginInfo,
                });
                this.webim = webim;

                resolve();
            });
        });
    },
    initSession(sendToId = 'window') {
        let session = this.sessions[sendToId];
        if (!session) {
            session = this.sessions[sendToId] = new Session({
                parent: this,
                webim: this.webim,
                sendToId,
                windowContainer: this.rootEle,
                mode: this.config.mode,
            });
        }
        this.currentSession = session;
    },
    getSig() {
        return new Promise((resolve) => {
            if (this.config.loginInfo) {
                resolve(this.config.sig);
                return;
            }
            this.isGettingSig = true;
            ajax.post('https://kf.ecqun.com/index/talk/getsig', {
                corpid: window.corpid,
                guid: this.config.guid,
            }, (re) => {
                this.isGettingSig = false;
                const { sig, appid, accountType } = re.data;
                const loginInfo = {
                    identifier: this.config.guid,
                    userSig: sig,
                    accountType,
                    sdkAppID: appid,
                };
                this.config.loginInfo = loginInfo;

                resolve(loginInfo);
            });
        });
    },
    getKfInfo(sendToId) {
        return new Promise((resolve) => {
            ajax.get('https://kf.ecqun.com/index/talk/getcsinfo', {
                corpid: window.corpid,
                csid: sendToId,
            }, (re) => {
                resolove(re);
            });
        });
    },
    updateKf(id) {
        this.sendToId = id;
        this.currentSession.close();
        this.getKfInfo().then(() => {
            this.initSession(this.sendToId);
        });
    },
};
