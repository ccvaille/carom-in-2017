import React, { PropTypes } from 'react';

class VisitorEntrySet extends React.Component {
    static propTypes = {
        getEntrySetting: PropTypes.func.isRequired,
        getServices: PropTypes.func.isRequired,
        activeTab: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        previewSide: PropTypes.element.isRequired,
        settingFormSide: PropTypes.element.isRequired,
    }

    componentDidMount() {
        const { getEntrySetting, getServices, activeTab } = this.props;
        if (activeTab !== 'embed') {
            getEntrySetting(activeTab);
        }

        if (activeTab === 'pc') {
            getServices();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (
            (nextProps.activeTab && this.props.activeTab) &&
            nextProps.activeTab !== this.props.activeTab
        ) {
            if (nextProps.activeTab !== 'embed' && nextProps.activeTab !== 'wechat') {
                this.props.getEntrySetting(nextProps.activeTab);
            }
        }
    }

    render() {
        return (
            <div className="cs-access-setting visitor-entry-setting clearfix">
                <div className="title">{this.props.title}</div>
                <div className="preview-side">{this.props.previewSide}</div>
                <div className="setting-side">{this.props.settingFormSide}</div>
            </div>
        );
    }
}

export default VisitorEntrySet;
