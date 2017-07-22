import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { browserHistory } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import store from "./store";

import "antd-mobile/dist/antd-mobile.less";
// import '../../../../comm/public/mobile-svg/iconfont.css';
import 'styles/mobile.less';

const history = syncHistoryWithStore(browserHistory, store);
const FastClick = require('fastclick');
//处理移动端300ms延时click问题
FastClick.attach(document.body);


document.addEventListener('touchmove',(e)=>{
    if((e.target.className.indexOf('am-modal-wrap')>-1)||(e.target.className.indexOf('am-activity-indicator-toast')>-1)||(e.target.className.indexOf('am-modal-transparent')>-1)||(e.target.parentNode.className.indexOf('am-modal-transparent')>-1)||(e.target.parentNode.parentNode.className.indexOf('am-modal-transparent')>-1)||(e.target.parentNode.parentNode.parentNode.className.indexOf('am-modal-transparent')>-1)||(e.target.parentNode.parentNode.parentNode.parentNode.className.indexOf('am-modal-transparent')>-1)||(e.target.parentNode.parentNode.parentNode.parentNode.parentNode.className&&e.target.parentNode.parentNode.parentNode.parentNode.parentNode.className.indexOf('am-modal-transparent')>-1)){
        e.preventDefault();
    }
},true);

const render = () => {
    // eslint-disable-next-line global-require
    const Routes = require("./routes").default;
    ReactDOM.render(
        <Provider store={store}>
            <Routes history={history} />
        </Provider>,
        document.getElementById("root")
    );
};

if (module.hot) {
    module.hot.accept("./routes", () => {
        render();
    });
}

render();
