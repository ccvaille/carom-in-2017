import React, { PropTypes } from 'react';

class InviteBoxSet extends React.Component {
    static propTypes = {
        title: PropTypes.string.isRequired,
        previewSide: PropTypes.element.isRequired,
        settingFormSide: PropTypes.element.isRequired,
        getInviteSetting: PropTypes.func.isRequired,
        activeTab: PropTypes.string.isRequired,
    }

    componentDidMount() {
        const { getInviteSetting, activeTab } = this.props;
        if (activeTab !== 'embed') {
            getInviteSetting(activeTab);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            (nextProps.activeTab && this.props.activeTab) &&
            nextProps.activeTab !== this.props.activeTab
        ) {
            if (nextProps.activeTab !== 'embed') {
                this.props.getInviteSetting(nextProps.activeTab);
            }
        }
    }

    render() {
        return (
            <div className="cs-access-setting invitebox-setting">
                <div className="title">{this.props.title}</div>
                <div className="preview-side">{this.props.previewSide}</div>
                <div className="setting-side">{this.props.settingFormSide}</div>
            </div>
        );
    }
}

export default InviteBoxSet;
