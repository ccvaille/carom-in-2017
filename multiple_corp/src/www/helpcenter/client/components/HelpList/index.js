import React, { Component, PropTypes } from 'react';
import { Link,withRouter } from 'react-router';
import { Pagination } from 'antd';
import { classnames } from 'classnames'
import './index.less'


class HelpList extends Component {
    static propoTypes = {
        helpList: PropTypes.array.isRequired
    }

    render() {
        const { helpList, params, related, flag, onChange, page } = this.props;
        var html = '';
        if(!flag) return (<ul></ul>);

        var pagination = '';
        if (!related && page.total > 1) {
            pagination = (
                <Pagination total={ page.total * 10 } defaultPageSize={10} onChange={ onChange } current={ page.curpage }/>
            )
        }

        var title;
        var classname = "title";
        if(JSON.stringify(params) === "{}") {
            title = "热点问题";
        } else if(related) {
            title = helpList[0] ? '相关问题：' : '暂无相关问题'
        } else if(this.props.params.keyword != undefined) {
            title = helpList[0] ? '' : '暂无搜索结果'
        } else {
            title = helpList[0] ? helpList[0].second_cname : "暂无相关帮助"
        }

        if(!helpList[0]) {
            classname = "no-help"
        }

        return (
            <ul className="help-list">
                <div className={classname}>{title}</div>
                {helpList.map((help, i) => 
                    <li key={i}><Link to={"/tech/helpinfo?cat=" + help.f_category + "&kid=" + help.f_id}>{(page.curpage - 1) * 10 + i + 1}. {help.f_title}</Link></li>
                )
                }
                {pagination}
            </ul>
        )
    }
}

export default withRouter(HelpList)