import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import THeadWithIcon from 'components/THeadWithIcon';
import { setIsShowVisitorPathDetail } from '../../actions/chat';

class VisitorPath extends React.Component {
    static propTypes = {
        chat: React.PropTypes.object.isRequired,
        dispatch: React.PropTypes.func.isRequired,
    }
    toggleDetials = () => {
        const { isShowVisitorPathDetial } = this.props.chat;
        this.props.dispatch(setIsShowVisitorPathDetail(!isShowVisitorPathDetial));
    }
    renderDetials() {
        const { txguid, visitorPaths } = this.props.chat;
        const pathData = visitorPaths[txguid] || [];
        const pathTr = pathData.map(path => (
            <tr key={Math.random()}>
                <td>
                    <div className="td-wrapper" title={`${path.f_date} ${moment(path.f_time).format('HH:mm:ss')}`}>
                        {`${path.f_date} ${moment(path.f_time).format('HH:mm:ss')}`}
                    </div>
                </td>
                <td className="page-info">
                    <div className="td-wrapper">
                        <p className="link-url">
                            <a
                                className="page-title"
                                href={path.f_url}
                                target="_blank"
                                title={path.f_title}
                            >{path.f_title}</a>
                        </p>
                        <p className="link-url" title={path.f_type ? path.f_type_txt : path.f_url}>
                            {
                                path.f_type === 0 ?
                                    <span>{path.f_url}</span>
                                    : <span>{path.f_type_txt}</span>
                            }
                        </p>
                    </div>
                </td>
                <td>
                    <div className="td-wrapper">
                        {
                            path.f_stay_time === '0秒' ?
                            '' : path.f_stay_time
                        }
                    </div>
                </td>
            </tr>
        ));
        return (
            pathData ? (<div className="path-detail">
                <table>
                    <col width="30%" />
                    <col width="40%" />
                    <col width="30%" />
                    <thead>
                        <tr>
                            <th>
                                <THeadWithIcon
                                    theadContent="访问时间"
                                    popContent="访客访问网页的时间"
                                />
                            </th>
                            <th>
                                <THeadWithIcon
                                    theadContent="访问页面"
                                    popContent="访客访问的网页"
                                />
                            </th>
                            <th>
                                <THeadWithIcon
                                    theadContent="停留时长"
                                    popContent="访客在当前网页停留时间"
                                />
                            </th>
                        </tr>
                    </thead>
                </table>
                <div className="scroll-wrapper">
                    <table>
                        <col width="30%" />
                        <col width="40%" />
                        <col width="30%" />
                        <tbody>
                            {pathTr}
                        </tbody>
                    </table>
                </div>
            </div>) : null
        );
    }
    render() {
        const { txguid, guests, isShowVisitorPathDetial, visitorPaths } = this.props.chat;
        const currentGuest = guests[txguid] || {};
        const pathData = visitorPaths[txguid];
        return (
            pathData && pathData.length ? <div className="visitor-path">
                <p className="abstract">
                    正在访问
                    <a className="path-link" href={currentGuest.visitUrl} target="_blank">{ currentGuest.title }</a>
                    {
                        pathData && pathData.length ?
                            <a
                                onClick={this.toggleDetials}
                                role="button"
                                tabIndex="0"
                            >
                                <Icon type={isShowVisitorPathDetial ? 'up' : 'down'} />
                            </a>
                            : null
                    }
                </p>
                {
                    isShowVisitorPathDetial ? this.renderDetials() : null
                }
            </div> : null
        );
    }
}

export default connect((state) => {
    const { chat } = state;
    return {
        chat,
    };
})(VisitorPath);
