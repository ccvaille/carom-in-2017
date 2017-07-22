/*eslint-disable*/
var React = require('react');

module.exports = React.createClass({
    render: function () {
        var msgContent = this.props.msg.msgContent;
        return (
            <li className="custom-msg">{ (msgContent) }</li>
        );
    }
});
