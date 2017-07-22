import React from 'react';
import { connect } from 'react-redux';
import '../ECTeam/index.less'


class H5marketing extends React.Component {

    pvCB(command, data) {
        console.log(command + ":" + JSON.stringify(data));
    }
    openMore() {
        var url = this.props.data.form_info.share_url;
        // return;
        this.props.openPV({
            url: url,
            title: this.props.data.form_info.share_title,
            width: "970",
            height: "700",
            needLogin: "1",
            maxButton: "1",
            minButton: "1",
            status: 'max',
            callback: this.pvCB
        });
    }
    openChatWindow(e) {
        e.stopPropagation();
        var data = this.props.data;
        var uid = data.f_from_uid;
        var name = data.publisher;
        this.props.openChatWindow({
            uid: uid,
            name: name,
            type: '1',
            callback: this.pvCB
        });
    }

    render() {
        var data = this.props.data;
        var userid = this.props.userid;
        var url = /default.png$/ig.test(data.form_info.share_pic) ? "//www.staticec.com/my/ecapp/image/h5default.png" : data.form_info.share_pic;

        return (
            data.f_type != 2 ?
                <div className="ecTeam-box h5-box">
                    <div className="msg-box">
                        <p className="time">{data.f_time}</p>
                        <div className="inner-box" data-href={data.form_info.share_url} target="_blank" onClick={() => this.openMore()}>
                            <div className="title">{data.form_info.share_title}</div>
                            {
                                data.publisher ?
                                    <p className="from">来自
                                    {
                                        data.f_from_uid == userid ?
                                            <a className="no-hand name" data-href={"showec://3-" + data.f_from_uid} >“{data.publisher}”</a>
                                            :
                                            <a  className="name"
                                                title="发起会话"
                                                data-href={"showec://3-" + data.f_from_uid}
                                                onClick={(e) => this.openChatWindow(e)}>“{data.publisher}”</a>
                                    }
                                    </p> : null
                            }

                            <p className="content-box">
                                <div className="img-show">
                                    <img src={url} alt=""/>
                                </div>
                                <div className="article-box">
                                {
                                    data.f_type == 1 ? data.f_desc : data.f_content
                                }
                                </div>
                            </p>
                            <p className="btn-bot"><a className="bot-more" data-href={data.form_info.share_url} target="_blank" onClick={() => this.openMore()}>查看详情</a></p>
                        </div>
                    </div>
                </div> :
                <div className="ecTeam-box h5-box">
                    <div className="msg-box">
                        <p className="time">{data.f_time}</p>
                        <div className="inner-box" data-href={data.form_info.share_url} onClick={() => this.openMore()}>
                            <div className="title">收到1条新反馈</div>
                            <p className="content-box">
                                <div className="feedback">
                                    <ul>
                                        <li>
                                            <p className="fl">作品标题：</p>
                                            <p className="fr one">{data.f_title}</p>
                                        </li>
                                        <li>
                                            <p className="fl">反馈内容：</p>
                                            <p className="fr two">{data.f_content}</p>
                                        </li>
                                    </ul>
                                </div>
                            </p>
                            <p className="btn-bot"><a className="bot-more" data-href={data.form_info.share_url} target="_blank" onClick={() => this.openMore()}>查看详情</a></p>
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


H5marketing.contextTypes = {
    //history: PropTypes.object.isRequired,
    //store: PropTypes.object.isRequired
};

import { default as mapDispatchToProps } from '../../actions/index';

export default connect(mapStateToProps, mapDispatchToProps)(H5marketing);
