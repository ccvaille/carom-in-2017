import React from 'react';
import { message } from 'antd';
import Mask from '../Mask';
import ReactDOM from 'react-dom';
import './message.less';

message.config({
  duration: 1.5,
});

function renderMask(dur = 1.5) {
  let maskDom = document.getElementById('mask_dom');
  if (maskDom) {
    document.body.removeChild(maskDom);
  }
  maskDom = document.createElement('div');
  maskDom.id = 'mask_dom';
  maskDom.className = 'mask_dom';
  document.body.appendChild(maskDom);
  ReactDOM.render(<Mask transparent={false} duration={dur} />, maskDom);
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
  message.config(options);
}
function destroy() {
  message.destroy();
}

export default{
  success,
  error,
  info,
  warning,
  warn,
  loading,
  config,
  destroy,
};
