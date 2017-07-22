import React, { PropTypes } from 'react';
import './index.less';

import { Link } from 'react-router';
import { withRouter } from 'react-router';

import Sidebar from '../../components/Sidebar';
import MessageContent from './components/MessageContent';

import {
    Icon,
    Tooltip,
    Popover,
    Button,
    Modal,
} from 'antd';

class Message extends React.Component {

    constructor(props) {
        super(props);
    }
    componentWillMount = () => {
        const { messageActions, messageReducers } = this.props;
        messageActions.getRole();
    }
    render = () => {

        const {
            isRoleLoading, //是否正在拉取权限
            isRoleLoaded //权限是否拉取过
        } = this.props.messageReducers;

        const image = {
            src: require('../../styles/image/ec-loading.gif')
        };
        return (
            !isRoleLoaded ?
                <div className="loading-content">
                    <img src={image.src} className=""/>
                </div> :
                    <div className="message">
                        <Sidebar activeName="message"/>
                        <MessageContent />
                    </div>
        )
    }

}

export default withRouter(Message);
