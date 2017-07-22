import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { Menu, Icon } from 'antd';
import './side-menu.less';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

const menuKeys = [{
    parent: 'source',
    child: ['search', 'keyword', 'externalurl'],
}, {
    parent: 'visitor',
    child: ['district', 'browser', 'device'],
}, {
    parent: 'link',
    child: ['link/visit', 'link/from'],
}, {
    parent: 'cs',
    child: ['conversion', 'efficiency', 'conversation/period'],
}, {
    parent: 'employeeDynamic',
    child: ['employee'],
}];

class SideMenu extends React.Component {
    static propTypes = {
        activeRoute: PropTypes.string.isRequired,
    }

    state = {
        openKeys: [],
    }

    componentWillMount() {
        const { activeRoute } = this.props;

        menuKeys.forEach((key) => {
            if (key.child.indexOf(activeRoute) > -1) {
                this.setState({
                    openKeys: this.state.openKeys.concat([key.parent]),
                });
            }
        });
    }

    render() {
        return (
            <Menu
                mode="inline"
                selectedKeys={[this.props.activeRoute]}
                defaultOpenKeys={this.state.openKeys}
            >
                <MenuItem key="overview">
                    <Link to="/kf/client/statistics/overview">概况</Link>
                </MenuItem>
                <SubMenu
                    key="source"
                    title={<div className="menu-title clearfix"><span>来源分析</span><Icon type="right" /></div>}
                >
                    <MenuItem key="search">
                        <Link to="/kf/client/statistics/search">搜索引擎</Link>
                    </MenuItem>
                    <MenuItem key="keyword">
                        <Link to="/kf/client/statistics/keyword">关键词</Link>
                    </MenuItem>
                    <MenuItem key="externalurl">
                        <Link to="/kf/client/statistics/externalurl">外部链接</Link>
                    </MenuItem>
                </SubMenu>

                <SubMenu
                    key="visitor"
                    title={<div className="menu-title clearfix"><span>访客分析</span><Icon type="right" /></div>}
                >
                    <MenuItem key="district">
                        <Link to="/kf/client/statistics/district">地区</Link>
                    </MenuItem>
                    <MenuItem key="browser">
                        <Link to="/kf/client/statistics/browser">浏览器</Link>
                    </MenuItem>
                    <MenuItem key="device">
                        <Link to="/kf/client/statistics/device">上网终端</Link>
                    </MenuItem>
                </SubMenu>

                <SubMenu
                    key="link"
                    title={<div className="menu-title clearfix"><span>页面分析</span><Icon type="right" /></div>}
                >
                    <MenuItem key="link/visit">
                        <Link to="/kf/client/statistics/link/visit">受访页面</Link>
                    </MenuItem>
                    <MenuItem key="link/from">
                        <Link to="/kf/client/statistics/link/from">来路页面</Link>
                    </MenuItem>
                </SubMenu>

                <SubMenu
                    key="cs"
                    title={<div className="menu-title clearfix"><span>客服对话</span><Icon type="right" /></div>}
                >
                    <MenuItem key="conversion">
                        <Link to="/kf/client/statistics/conversion">访客转化</Link>
                    </MenuItem>
                    <MenuItem key="efficiency">
                        <Link to="/kf/client/statistics/efficiency">客服效率</Link>
                    </MenuItem>
                    <MenuItem key="conversation/period">
                        <Link to="/kf/client/statistics/conversation/period">对话时段</Link>
                    </MenuItem>
                </SubMenu>

                <SubMenu
                    key="employeeDynamic"
                    title={<div className="menu-title clearfix"><span>员工动态</span><Icon type="right" /></div>}
                >
                    <MenuItem key="employee">
                        <Link to="/kf/client/statistics/employee">员工动态</Link>
                    </MenuItem>
                </SubMenu>
            </Menu>
        );
    }
}

export default SideMenu;
