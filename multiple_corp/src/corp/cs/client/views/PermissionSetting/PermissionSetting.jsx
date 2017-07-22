import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import PermissionSettingDetail from 'views/PermissionSettingDetail';
import GroupSidebar from './components/GroupSidebar';

class PermissionSetting extends React.Component {
    static propTypes = {
        router: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
    }

    componentWillMount() {
        const { groupid } = this.props.location.query;
        if (!groupid) {
            this.props.router.push({
                pathname: '/kf/index',
                query: {
                    groupid: 'all',
                },
            });
        }
    }

    // componentDidUpdate(prevProps) {
    //     if (prevProps.csGroups.length > 0) {
    //         this.props.router.push({
    //             pathnname: '/kf/index',
    //             query: {
    //                 groupid: prevProps.csGroups[0].f_id,
    //             },
    //         });
    //     }
    // }

    render() {
        return (
            <div className="cs-permission-setting clearfix" style={{ padding: 20 }}>
                <GroupSidebar
                    activeGroup={this.props.location.query.groupid || 'all'}
                    routerReplace={this.props.router.replace}
                />
                <PermissionSettingDetail
                    currentGroup={this.props.location.query.groupid || 'all'}
                />
            </div>
        );
    }
}

export default withRouter(PermissionSetting);
