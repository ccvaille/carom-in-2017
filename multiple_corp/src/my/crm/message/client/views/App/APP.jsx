import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import NotFound from '~comm/components/NotFound';
import urlConfig from '../../config';

class App extends React.Component {
    static propTypes = {
        children: PropTypes.object,
        router: PropTypes.object,
    }
    isHaveThisItem = (id) => {
        if (this.props.shownMenus.length <= 0) return false;
        for (let i = 0, len = this.props.shownMenus.length; i < len; i++) {
            if (id == this.props.shownMenus[i]) {
                return true;
            }
        }
        return false;
    }
    componentDidMount() {
        let query = this.props.location.query;
        if (query.menu) {
            this.props.action.getMenuShow(query.menu.split(','));
        } else
            this.props.action.getMenuShow();

        this.props.action.getWarnIsHave();
    }
    isHaveThisPath = (pathname) => {
        let id = 0;
        if (pathname == urlConfig.warnInfoList || pathname == urlConfig.customerBackDetail) id = 2;
        if (pathname == urlConfig.shareRequestList) id = 1;
        return this.isHaveThisItem(id);
    }
    showPoint() {
        let result = '';
        if (this.props.location.pathname == urlConfig.warnInfoList || this.props.location.pathname == urlConfig.customerBackDetail) {
            result += 'tab active ';
        } else {
            result += 'tab ';
        }
        if (this.props.isHaveWrans) {
            result += 'point';
        }
        return result;
    }
    render() {
        let mainView = null;
        if (this.isHaveThisPath(this.props.location.pathname)) {
            mainView = this.props.children;
        } else {
            if (this.props.shownMenus.length > 0)
                mainView = <NotFound />;
        }
        return (
            <div>
                <div className="tab_host">
                    <div>
                        {
                            this.isHaveThisItem(1) ? <Link to={urlConfig.shareRequestList} className={(this.props.location.pathname == urlConfig.shareRequestList) ? 'tab active' : 'tab'}>
                                同事的共享请求</Link> : null
                        }
                        {
                            this.isHaveThisItem(2) ? <Link to={urlConfig.warnInfoList} className={this.showPoint()}>客户收回通知</Link> : null
                        }
                    </div>
                </div>
                {
                    mainView
                }
            </div>);
    }
}

export default App;
