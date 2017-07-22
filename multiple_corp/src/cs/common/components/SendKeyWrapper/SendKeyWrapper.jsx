var React = require('react');

module.exports = React.createClass({
    setSendType: function (e, keyIndex) {
        var e = e || window.event;
        e.preventDefault();
        e.stopPropagation();

        // console.log(e, 'e', keyIndex)
        var sendSettingWrapper = this.refs.sendSettingWrapper;
        // var keyIndex;

        // localStorage.setItem('sendSettingKey', keyIndex);
        this.props.selectSettingType(keyIndex);

        sendSettingWrapper.style.display = 'none';
        this.props.changeSendSettingWrapper(false);
    },

    render: function() {
        var sendWrapperV = {display: this.props.sendSettingWrapperVisible ? 'block' : 'none'};
        var localeKey = this.props.localeKey;
        var sendSettingKey = this.props.sendSettingKey * 1;

        return (
            <div
                className="send-setting-wrapper"
                ref="sendSettingWrapper"
                style={sendWrapperV}
            >
                <div
                    className={sendSettingKey === 1 ? "type-item checked" : "type-item"}
                    ref="typeItem"
                    onClick={
                        function (e) {
                            this.setSendType(e, 1);
                        }.bind(this)
                    }
                    data-key-index="1"
                >
                    <span className="icon icon-check"></span>
                    <span className="type-text">{localeKey.enter}</span>
                </div>
                <div
                    className={sendSettingKey === 2 ? "type-item checked" : "type-item"}
                    ref="typeItem"
                    onClick={
                        function (e) {
                            this.setSendType(e, 2);
                        }.bind(this)
                    }
                    data-key-index="2"
                >
                    <span className="icon icon-check"></span>
                    <span className="type-text">{localeKey.ctrlEnter}</span>
                </div>
            </div>
        )
    }
})
