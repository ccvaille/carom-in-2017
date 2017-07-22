var React = require('react');
require('../utils/trim');

var TextInput = React.createClass({
    getInitialState: function () {
        return {
            value: '',
            focus: this.props.focus || false,
            isTipShowen: false
        }
    },
    componentDidMount: function () {
        if(this.state.focus) this.refs.inputEle.focus();
    },
    onFocus: function () {
        this.setState({
            focus: true
        });
    },
    onBlur: function () {
        this.setState({
            focus: false
        });

        this.props.blurCallback && this.props.blurCallback();
    },
    onKeydown: function () {
        if(e.keyCode === 13){
            this.props.enter && this.props.enter();
            e.preventDefault();
        }
    },
    validate: function (){
        var result = {
            pass: true
        };
        var tipResult = {};
        if(validateConfig.require && !val){
            // 为空
            result.pass = false;
            result.errorType = 'REQUIRE';

            tipResult.showTip = true;
            tipResult.tipType = 'error';
            tipResult.tipText = validateConfig.tip.REQUIRE;

            this.props.actions.showInputTip(tipResult, validateConfig.tipRef || name);
        } else if(validateConfig.regExp && !validateConfig.regExp.test(val)){
            // 格式错误
            result.pass = false;
            result.errorType = 'REGEXP';

            tipResult.showTip = true;
            tipResult.tipType = 'error';
            tipResult.tipText = validateConfig.tip.REGEXP;

            this.props.actions.showInputTip(tipResult, validateConfig.tipRef || name);
        } else {
            this.props.actions.hideInputTip(name);
        }

        this.props.actions.setValidateResult(result, name);

        setTimeout(function (){
            this.props.actions.hideInputTip(name);
        }.bind(this), 2000);

        return result.pass;
    },
    render: function () {
        var name = this.props.name,
            isRequired = this.props.validateConfig.isRequired;

        return (
            <p className="field">
                <label>
                    {
                        isRequired ? <em>*</em> : null
                    }
                    { label }
                </label>
                <input type="text" name={ name } ref="input" />
                {
                    this.props.children()
                }
                {
                    this.state.isTipShowen ? <div className="ec--tip">{ this.state.tipText }</div> : null
                }
            </p>
        );
    }
});
