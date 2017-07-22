import React, { PropTypes } from 'react';
import { withRouter } from 'react-router';
import ecFailImg from 'images/ec-fail.png';
import ReplySidebar from './components/ReplySidebar';
import './quickreply.less';

class QuickReply extends React.Component {
    static propTypes = {
        params: PropTypes.shape({
            id: PropTypes.string,
        }).isRequired,
        router: PropTypes.object.isRequired,
        // eslint-disable-next-line react/require-default-props
        children: PropTypes.element,
    }

    state = {
        activeType: '1',
    }

    render() {
        return (
            <div className="cs-quickreply">
                <ReplySidebar
                    routerPush={this.props.router.push}
                    activeId={Number(this.props.params.id) || 0}
                />
                {
                    this.props.params.id
                    ?
                    this.props.children
                    :
                    <div className="empty-detail">
                        <div className="empty">
                            <img alt="暂无快捷回复语" src={ecFailImg} />
                            <p>暂无快捷回复语</p>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

export default withRouter(QuickReply);
