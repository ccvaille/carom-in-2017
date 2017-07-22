/*eslint-disable*/
var React = require('react');
var SendKeyWrapper = require('../SendKeyWrapper');
var domUtils = require('../../utils/dom');
var arrowDownImg = require('../../images/arrow-down.png');

var isMobile = /(iPhone|iPod|Android|ios)/i.test(window.navigator.userAgent);


module.exports = React.createClass({
    showSendSettingWrapper: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var sendSettingWrapperVisible = this.props.sendSettingWrapperVisible;

        if (sendSettingWrapperVisible) {
            this.props.changeSendSettingWrapper(false);
        } else {
            this.props.changeSendSettingWrapper(true);
        }

    },
    setSendType: function (e) {
        e.preventDefault();
        e.stopPropagation();

        var sendSettingWrapper = this.refs.sendSettingWrapper;
        var typeItems = sendSettingWrapper.childNodes;
        var keyIndex;

        typeItems.forEach(function (item) {
            if (e.target === item || e.target.parentNode === item) {
                item.className = 'type-item checked';
                keyIndex = item.getAttribute('data-key-index');
            } else {
                item.className = 'type-item';
            }
        });

        domUtils.localStorageFix.setItem('sendSettingKey', keyIndex);
        sendSettingWrapper.style.display = 'none';
    },
    closeMsgBorad: function () {
        this.props.close.closeMsgBorad();
    },
    selectSettingType: function (keyIndex) {
        domUtils.localStorageFix.setItem('sendSettingKey', keyIndex);
    },
    render: function () {
        var localeKey = this.props.localeKey;
        var sendWrapperV = {display: this.props.sendSettingWrapperVisible ? 'block' : 'none'}
        var sendSettingKey = 1;
        var keyIndexTime;
        sendSettingKey = domUtils.localStorageFix.getItem('sendSettingKey') * 1;
        keyIndexTime = domUtils.localStorageFix.getItem('keyIndexTime');

        if (!keyIndexTime) {
            sendSettingKey += 1;
            domUtils.localStorageFix.setItem('keyIndexTime', new Date().getTime());
            domUtils.localStorageFix.setItem('sendSettingKey', sendSettingKey * 1);
        }

        // console.log(this.props.close, 'props')
        var closeHtml = this.props.close.showClose ? (
            <span
            className="btn btn-cancel"
            style={{ marginRight: 10, paddingLeft: 0, paddingRight: 0 }}
            href="javascript:;"
            onClick={this.closeMsgBorad}
            >
                {localeKey.close}
            </span>
        ) : '';

        return (
            <div className="btns">
                {closeHtml}
                {
                    isMobile ?
                    <span className="btn btn-blue btn-send ">
                        <span className="btn-text" onClick={ this.props.sendTextMsg } >
                            {localeKey.send}
                            </span>
                    </span> :
                    <span className="btn btn-blue btn-send btn-add-icon"
                       href="javascript:;">
                        <span className="btn-text" onClick={ this.props.sendTextMsg } >
                            {localeKey.send}
                            </span>
                        <span  className="border-icon" onClick={this.showSendSettingWrapper}>
                            <img  src={arrowDownImg} alt="" />
                        </span>
                    </span>
                }
                <SendKeyWrapper
                    changeSendSettingWrapper={this.props.changeSendSettingWrapper}
                    sendSettingWrapperVisible={this.props.sendSettingWrapperVisible}
                    localeKey={localeKey}
                    sendSettingKey={sendSettingKey}
                    selectSettingType={this.selectSettingType}
                />

            </div>
        )
    }
})
