var React = require('react');

var MobileHeader = React.createClass({
    returnPage: function() {
        if (!this.props.isLeavingMsg) {
            this.props.endUpSession();
        }
        window.history.go(-1);
    },
    render: function() {
        var csInfo = this.props.csInfo;
        var talkTitle = this.props.talkTitle;
        return (
            <div className={"header" + ' ' + (this.props.className || '')}>
                {
                    document.referrer ? (
                        <div className="return" onClick={this.returnPage}>
                            <i className="arrow-left icon"></i>
                        </div>
                    ) : null
                }
                <div className="name">
                    <p>{csInfo.name}</p>
                </div>
            </div>
        );
    }
});

module.exports = MobileHeader;
