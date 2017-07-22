import React from 'react'
import { Link } from 'react-router';
import {Button} from 'antd'
import './index.less';
import classNames from 'classnames';

class Sidebar extends React.Component {
	componentWillMount() {

	}

    componentDidMount() {

    }

    handleLinkClick(router){
        let currentRouter = this.props.router;
        if(router!==currentRouter){
            this.props.onRouterChange(router);
        }
    }
	render() {
        const {role,...others} = this.props;
        const deptCls = classNames({
            'hide':!role.deptRead
        });

		return (
			<div className="sidebar">
                <a className="create-btn" href="//my.workec.com/form/index/design">新建</a>
                <div className="my-form">
                    <div className="title">
                        <i className="icon iconfont">&#xe659;</i>
                        <span className="no-icon">我的作品</span>
                    </div>
                    <ul className="no-icon-panel">
                        <li><Link onClick={this.handleLinkClick.bind(this,1)} to="/ecform/index/unpublished" activeClassName="active"><span>草稿箱</span></Link></li>
                        <li><Link onClick={this.handleLinkClick.bind(this,2)} to="/ecform/index/published" activeClassName="active"><span>已发布</span></Link></li>
                    </ul>
                </div>
                <ul className="icon-panel">
                    <li>
                        <Link onClick={this.handleLinkClick.bind(this,3)} to="/ecform/index/public" activeClassName="active">
                            <i className="icon iconfont">&#xe612;</i>
                            <span>公共作品</span>
                        </Link>
                    </li>
                    <li className={deptCls}>
                        <Link onClick={this.handleLinkClick.bind(this,4)} to="/ecform/index/team" activeClassName="active">
                            <i className="icon iconfont">&#xe65a;</i>
                            <span>团队作品</span>
                        </Link>
                    </li>
                </ul>
                {
                    role.publicAssistant ? (role.ecVer && (role.ecVer-0 < 10000) ?
                    <div className="my-public">
                        <p>限时免费体验</p>
                        <a href="https://html.workec.com/my/public"
                        >
                            <Button>
                                公众号助手Beta
                            </Button>
                        </a>
                    </div> : null
                   ) : null
                }
               
			</div>
		)
	}
}
export default Sidebar
