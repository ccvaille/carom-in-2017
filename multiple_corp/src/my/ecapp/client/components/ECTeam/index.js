import React from 'react';
import { connect } from 'react-redux';
import './index.less'


class ECTeam extends React.Component {

    pvCB(command, data) {
        console.log(command + ":" + JSON.stringify(data));
    }
    openMore() {
        var url = this.props.data.f_url;
        console.log(url);
        window.open(url,'_blank');
        return;

        this.props.openPV({
            url: url,
            title: this.props.data.f_title,
            width: "970",
            height: "700",
            needLogin: "1",
            status: 'max',
            callback: this.pvCB
        });
    }

    render() {
        const { data } = this.props;
        return (
            <div className="ecTeam-box">
                <div className="msg-box">
                    <p className="time">{data.f_recive_time}</p>
                    <div className="inner-box" onClick={() => this.openMore()}>
                        <p className="header">公告</p>
                        <p className="title">{data.f_title}</p>
                        <div className="content-box" >
                            {
                                 data.cover_path != '' ?
                                 <div className="img-show">
                                    <img src={ data.cover_path } alt=""/>
                                </div>
                                :
                                ''
                             }
                            <div className="article-box" dangerouslySetInnerHTML={{__html: data.f_desc}}></div>
                        </div>
                        <p className="btn-bot"><a className="bot-more" data-href={data.f_url} target="_blank">查看详情</a></p>
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


ECTeam.contextTypes = {
    //history: PropTypes.object.isRequired,
    //store: PropTypes.object.isRequired
};

import { default as mapDispatchToProps } from '../../actions/index';

export default connect(mapStateToProps, mapDispatchToProps)(ECTeam);



