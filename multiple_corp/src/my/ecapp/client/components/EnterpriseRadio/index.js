import React from 'react';
import { connect } from 'react-redux';
import '../ECTeam/index.less'


class EnterpriseRadio extends React.Component {

    pvCB(command, data) {
        console.log(command + ":" + JSON.stringify(data));
    }
    openMore() {
        var url = this.props.data.blog.f_blog_url.replace(/#.*$/, '') + '&hidetab=1';
        this.props.openPV({
            url: url,
            title: "企业广播",
            width: "970",
            height: "700",
            needLogin: "1",
            status: 'max', 
            minButton: '1',
            maxButton: '1', 
            callback: this.pvCB
        });
    }

    openChatWindow(e) {
        e.stopPropagation();
        var data = this.props.data;
        var uid = data.f_from_uid;
        var name = data.f_name;
        this.props.openChatWindow({
            uid: uid,
            name: name,
            type: '1',
            callback: this.pvCB
        });
    }

    foo(e) {
        e.stopPropagation();
    }

    render() {
        var data = this.props.data;
        var userid = this.props.userid;
        return (
            <div className="ecTeam-box h5-box">
                <div className="article-link" >
                    <div className="msg-box" bid={data.bid} f_uid={data.f_uid}>
                        <p className="time">{data.f_create_time}</p>
                        <div className="inner-box" data-href={data.blog.f_blog_url} onClick={() => this.openMore()}>
                            <div className="title">{data.blog.f_blog_title}</div>
                            <p className="from">来自
                                {
                                    data.f_from_uid == userid ?
                                        <a className="noTalk name" onClick={(e) => this.foo(e)} data-href={"showec://3-" + data.f_from_uid}>“{data.f_name}”</a>
                                        :
                                        <a title="发起会话" 
                                            className="name"
                                            data-href={"showec://3-" + data.f_from_uid}
                                            onClick={(e) => this.openChatWindow(e)}>“{data.f_name}”</a>
                                }
                            </p>
                            <div className="content-box article-box" dangerouslySetInnerHTML={{__html: data.blog.f_blog_content}}></div>
                            <p className="btn-bot"><a className="bot-more" data-href={data.blog.f_blog_url}>查看详情</a></p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    //const obj = Object.assign({}, state.historyData);
    const obj = {};
    return obj;
};


EnterpriseRadio.contextTypes = {
    //history: PropTypes.object.isRequired,
    //store: PropTypes.object.isRequired
};

import { default as mapDispatchToProps } from '../../actions/index';

export default connect(mapStateToProps, mapDispatchToProps)(EnterpriseRadio);



