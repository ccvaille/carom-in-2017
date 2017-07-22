/*eslint-disable*/
var React = require('react');
var brokenImage = require('~cscommon/images/broken-img.png');
var loadingImage = require('~cscommon/images/loading.gif');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            load: false,
            src: loadingImage,
            width: 0,
            height: 0,
            isLoad: false
        };
    },
    componentDidMount: function () {
        if (this.props.msg.srcs.SmallImage) {
            this.getRectData();
        }
    },
    componentDidUpdate: function (nextProps, nextState) {
        if (nextProps.msg.srcs.SmallImage !== this.props.msg.srcs.SmallImage) {
            this.getRectData();
        }
    },
    getRectData: function () {
        var tempImg = new Image();
        var msg = this.props.msg,
            oriImg = msg.srcs.OriImage,
            smallImg = msg.srcs.SmallImage || oriImg || loadingImage;

        var $wrapper = document.querySelector('.msg-list'),
            wrapperWidth = $wrapper ? $wrapper.clientWidth : window.msgListWrapperWidth,
            maxWidth = Math.round((wrapperWidth - 144) / 2);

        tempImg.onload = function () {
            var width = Math.min(tempImg.width, maxWidth),
                height = Math.round(width * (tempImg.height / tempImg.width));

            this.setState({
                src: smallImg,
                width: width,
                height: height,
                isLoad: true
            });
        }.bind(this);

        tempImg.onerror = function () {
            this.setState({
                src: brokenImage,
                width: 35,
                height: 26,
                isLoad: true
            });
        }.bind(this);

        tempImg.src = smallImg;
    },
    onClick: function () {
        window.sessionImgClicked = true;
    },
    onLoad: function () {
        this.props.onImgMsgLoad && this.props.onImgMsgLoad();
    },
    onError: function () {
        this.refs.img.src = brokenImage;
        this.props.onImgMsgError && this.props.onImgMsgError();
    },
    render: function () {
        var msg = this.props.msg,
            oriImg = msg.srcs.OriImage,
            smallImg = msg.srcs.SmallImage || oriImg || loadingImage;

        var href = oriImg;
        if (typeof window.PVFunction === 'function') {
            href = 'javascript:ecShowImg(\'' + oriImg + '\')';
        }

        return (
            <p>
                <a href={ href } target="_blank" onClick={ this.onClick }>
                    <img
                        ref="img"
                        src={ this.state.src }
                        onLoad={ this.onLoad }
                        onError={ this.onError }
                    />
                </a>
            </p>
        );
    }
});
