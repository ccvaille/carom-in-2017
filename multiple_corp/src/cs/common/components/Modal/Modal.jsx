/*eslint-disable*/
var React = require('react');

module.exports = React.createClass({
    propTypes: {
        visible: React.PropTypes.bool.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        children: React.PropTypes.element.isRequired,
        title: React.PropTypes.string,
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        closable: React.PropTypes.bool,
        wrapClassName: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            width: 520,
            closable: true,
            wrapClassName: ''
        };
    },
    render: function () {
        var style = {
            width: this.props.width,
            height: this.props.height
        };

        var visible = this.props.visible,
            title = this.props.title,
            onCancel = this.props.onCancel,
            closable = this.props.closable,
            wrapClassName = this.props.wrapClassName;

        return (
            visible ?
            <div className={ 'modal-wrapper ' + wrapClassName }>
                <div className="mask"></div>
                <div className="content" style={ style }>
                    {
                        title ? <h2>{ title }</h2> : null
                    }
                    {
                        closable ?
                        <a
                            href="javascript:;"
                            className="modal-close"
                            onClick={ this.props.onCancel }
                        >×</a>
                        : null
                    }
                    <div className="content-body">
                    {
                        this.props.children
                    }
                    </div>
                </div>
            </div>
            : null
        );
    }
});
