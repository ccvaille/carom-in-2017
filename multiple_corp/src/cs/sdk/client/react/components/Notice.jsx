var React = require('react');
var connect = require('react-redux').connect;

var noticeActs = require('../actions/notice');
var eventsUtil = require('../utils/events');

var Notice = React.createClass({
    getInitialState: function () {
        return {
            isShowingNotice: false,
            isShowNoticeIcon: false
        }
    },
    componentDidMount: function () {
        this.props.dispatch(noticeActs.showNotice(this.props.notice.noticeContent))

        var noticeContent = this.refs.noticeContent;
        if (noticeContent) {
            var noticeHeight = noticeContent.offsetHeight;

            if (noticeHeight > 16) {
                this.setState({
                    isShowNoticeIcon: true
                })
            }
        }
    },
    onClick: function () {
        this.props.dispatch(noticeActs.hideNotice());
    },
    showNoticeDetail: function (e) {
        eventsUtil.stopPropagation(e);
        eventsUtil.preventDefault(e);
        // console.log('hello');

        var noticeWrapper = this.refs.noticeWrapper;
        var noticeContent = this.refs.noticeContent;
        var noticeHeight = noticeContent.offsetHeight;
        var noticeWrapperHeight = noticeHeight + 10;

        if (this.state.isShowingNotice) {
            noticeWrapper.style.height = '';
            this.setState({
                isShowingNotice: false
            });
        } else {
            noticeWrapper.style.height = noticeWrapperHeight + 'px';
            noticeWrapper.style.lineHeight = '24px';
            this.setState({
                isShowingNotice: true
            })
        }
    },

    //
    render: function () {
        var isShowingNotice = this.state.isShowingNotice;
        var content = this.props.notice.noticeContent;

        var isShowIcon = (this.state.isShowNoticeIcon) ? true : false;
        var contentNode = null;

        if (content) {
            contentNode = (
                <p className="notice"  ref="noticeWrapper" style={this.props.style || null}>
                    <i className="notice-icon"></i>
                    {
                        isShowIcon ? (<a className={isShowingNotice ? "open-notice opened" : "open-notice"} href="javascipt:;" onClick={this.showNoticeDetail}></a>)
                        : ''
                    }
                    <span className="notice-content" ref="noticeContent">{content}</span>
                </p>
            );
        }

        return contentNode;
    }
});

module.exports = connect(function (state) {
    return {
        notice: state.notice
    };
})(Notice);
