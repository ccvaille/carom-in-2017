import React, { PropTypes } from 'react';
import WebVisitorInfo from './WebVisitorInfo';
import WechatVisitorInfo from './WechatVisitorInfo';
import GuestTypes from '~cscommon/consts/guestTypes';

class VisitorInfo extends React.Component {
    static propTypes = {
        info: PropTypes.object.isRequired,
        guid: PropTypes.number.isRequired,
    }

    render() {
        const { info, guid, csName } = this.props;
        let infoNode = null;

        if (info.visitortype === GuestTypes.WEB) {

            // 终端类型 0: 其他; 1: pc; 2: 手机
            switch (info.terminal) {
                case 1:
                case 2:
                    infoNode = (
                        <WebVisitorInfo csName={csName} info={info} guid={guid} />
                    );
                    break;
                default:
                    break;
            }
        } else if (info.visitortype === GuestTypes.WX) {
            infoNode = (
                    <WechatVisitorInfo csName={csName} info={info} guid={guid} />
                );
        }

        return infoNode;
    }
}

export default VisitorInfo;
