/*eslint-disable*/
var React = require('react');

module.exports = React.createClass({
    onSend: function () {
        var onSendFn = this.props.onSend;
        if (onSendFn && typeof onSendFn ==='function') {
            onSendFn();
        }
    },
    onCancel: function () {
        var onCancelFn = this.props.onCancel;
        if (onCancelFn && typeof onCancelFn ==='function') {
            onCancelFn();
        }
    },
    render: function () {
        var src = this.props.src;
        // var href = src;
        // if (typeof window.PVFunction === 'function') {
        //     href = 'javascript:ecShowImg(\'' + src + '\')';
        // }
        var wh = window.innerHeight || (document.body || document.documentElement).clientHeight;
        var maxImgContentHeight = wh - 300;
        return (
            <div className="preview-paste-img-wrapper">
                <p
                    className="img-container"
                    style={ { maxHeight: maxImgContentHeight } }
                >
                    <img src={src} />
                </p>
                <p className="ctrls">
                    <a className="btn btn-cancel" onClick={ this.onCancel }>取消</a>
                    <a className="btn btn-send-pic" onClick={ this.onSend }>发送</a>
                </p>
            </div>
        );
    }
});
