var React = require('react');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            rand: new Date().getTime() + Math.random(),
            value: this.props.defaultValue || ''
        }
    },
    onFocus: function (e, name) {
        (this.props.onFocus || function () {})(e);
    },
    onBlur: function (e, name) {
        (this.props.onBlur || function () {})(e, name);
    },
    onChange: function (e, name) {
        this.setState({
            value: e.target.value
        });
        (this.props.onChange || function () {})(e);
    },
    onTipClick: function (name) {
        (this.props.onTipClick || function () {})(name);
    },
    changeCodeImage: function () {
        this.props.changeCodeImage();
    },
    render: function () {
        var value = this.props.value;
        var config = this.props.config;
        var inputClassName = this.props.inputClassname || '';

        return (
            <div className={ 'field field-' + config.name + (config.pass ? '' : ' error') + ' ' +inputClassName } key={ config.name }>
                <label style={config.name === 'note' ? { verticalAlign: 'top' } : null}>{
                    config.validateConfig.isRequired ? this.props.prefixEle : null
                }{ config.label }</label>
                {
                    config.type === 'textarea' ?
                    <textarea name={ config.name }
                        ref={ config.name }
                        value={value}
                        onChange={ function (e) { this.onChange(e, config.name) }.bind(this) }
                        onFocus={ function (e) { this.onFocus(e, config.name) }.bind(this) }
                        onBlur={ function (e) { this.onBlur(e, config.name) }.bind(this) }
                    >
                    </textarea>
                    : <input type={ config.type || 'text' }
                        name={ config.name }
                        ref={ config.name }
                        value={value}
                        onChange={ function (e) { this.onChange(e, config.name) }.bind(this) }
                        onFocus={ function (e) { this.onFocus(e, config.name) }.bind(this) }
                        onBlur={ function (e) { this.onBlur(e, config.name) }.bind(this) }
                    />
                }
                {
                    config.name === 'code' ?
                    <img
                        className="code"
                        src={ '//kf.ecqun.com/index/message/captcha?t=' + this.props.codeRandomParam }
                        width="115"
                        height="30"
                        onClick={ this.changeCodeImage }
                    />
                    : null
                }
                {
                    config.tip ?
                    <div className="ec--tip" onClick={ this.onTipClick.bind(this, config.name) }>
                        { config.tip }
                    </div>
                    : null
                }
                {
                    config.placeholder && !this.state.value ?
                    <div className="input-placeholder">
                        { config.placeholder }
                    </div>
                    : null
                }
            </div>
        );
    }
});
