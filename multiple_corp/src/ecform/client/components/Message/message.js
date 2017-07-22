import React from 'react';
import {message,Icon} from 'antd';
import Mask from '../Mask';
import ReactDOM from 'react-dom';
message.config({
    duration: 1.5
})
function renderMask(dur=1.5) {
    let mask_dom = document.getElementById('mask_dom');
    if (mask_dom) {
        document.body.removeChild(mask_dom);
    }
    mask_dom = document.createElement('div');
    mask_dom.id = 'mask_dom';
    mask_dom.className = 'mask_dom';
    document.body.appendChild(mask_dom);
    ReactDOM.render(<Mask transparent={false} duration={dur}/>, mask_dom);
}

function success(content, duration) {
    message.success(content, duration);
    renderMask(duration);
}

function error(content, duration) {
    message.error(content, duration);
    renderMask(duration);
}

function info(content, duration) {
    message.info(content, duration);
    renderMask(duration);
}

function warning(content, duration) {
    message.warning(content, duration);
    renderMask(duration);
}
function warn(content, duration) {
    message.warn(content, duration);
    renderMask(duration);
}
function loading(content, duration) {
    message.loading(content, duration);
    renderMask(duration);
}
function config(options) {
    message.config(options)
}
function destroy() {
    message.destroy();
}


export default{
    success: success,
    error: error,
    info: info,
    warning: warning,
    warn: warn,
    loading: loading,
    config: config,
    destroy: destroy,
};
