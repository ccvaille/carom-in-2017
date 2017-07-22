import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import shortid from 'shortid';
import './headers.less';

const menuDelta = 122;
const baseDelta = 26;

class Headers extends React.Component {
    static propTypes = {
        menus: PropTypes.array.isRequired,
        haveUnread: PropTypes.bool.isRequired,
        setAlreadyRead: PropTypes.func.isRequired,
        activeRoute: PropTypes.string.isRequired,
        activeMenu: PropTypes.number.isRequired,
        updateActiveMenu: PropTypes.func.isRequired,
    }

    componentWillReceiveProps(nextProps) {
        if (
            nextProps.menus.length !== this.props.menus.length ||
            nextProps.activeRoute !== this.props.activeRoute
        ) {
            nextProps.menus.forEach((menu, i) => {
                if (nextProps.activeRoute.indexOf(menu.link) > -1) {
                    this.props.updateActiveMenu(i);
                }
            });
        }
    }

    onMenuClick = (link) => {
        const { haveUnread, setAlreadyRead } = this.props;
        if (link === '/kf/client/chat' && haveUnread) {
            setAlreadyRead();
        }
    }

    render() {
        const { menus, haveUnread } = this.props;
        const inkBarPosition = (this.props.activeMenu * menuDelta) + baseDelta;
        const menuNode = menus.map((menu, i) => (
            <li key={shortid.generate()}>
                <Link
                    to={menu.link}
                    title={menu.title}
                    activeClassName="active"
                    onClick={() => this.onMenuClick(menu.link)}
                >
                    {
                        menu.link === '/kf/client/chat' && haveUnread
                        ?
                            <span className="unread-dot" />
                        : null
                    }
                    <i className={`icon icon-${menu.icon}`} />
                    <span className="menu-title">{menu.title}</span>
                </Link>
            </li>
        ));

        return (
            <div className="cs-header clearfix">
                <div
                    className="menu-ink-bar"
                    style={{
                        transform: `translate3d(${inkBarPosition}px, 0px, 0px)`,
                    }}
                />
                <div className="menu-wrapper">
                    <ul className="menus clearfix">{menuNode}</ul>
                </div>
            </div>
        );
    }
}

export default Headers;
