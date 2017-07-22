import React, { PropTypes } from 'react';

class ChatBoxSet extends React.Component {
    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        previewSide: PropTypes.element.isRequired,
        settingFormSide: PropTypes.element.isRequired,
        getChatSetting: PropTypes.func.isRequired,
    }

    componentDidMount() {
        const { getChatSetting, activeTab } = this.props;
        if (activeTab !== 'embed') {
            getChatSetting(activeTab);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            (nextProps.activeTab && this.props.activeTab) &&
            nextProps.activeTab !== this.props.activeTab
        ) {
            if (nextProps.activeTab !== 'embed') {
                this.props.getChatSetting(nextProps.activeTab);
            }
        }
    }

    render() {
        return (
            <div className="cs-access-setting chatbox-setting clearfix">
                <div className="title">{this.props.title}</div>
                <div className="preview-side">{this.props.previewSide}</div>
                <div className="setting-side">{this.props.settingFormSide}</div>
            </div>
        );
    }
}

export default ChatBoxSet;
