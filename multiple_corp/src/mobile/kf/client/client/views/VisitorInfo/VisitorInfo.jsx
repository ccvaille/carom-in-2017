import React, { PropTypes } from 'react';
import WebVisitorInfo from './components/WebVisitorInfo';
import WechatVisitorInfo from './components/WechatVisitorInfo';

class VisitorInfo extends React.Component {
    static propTypes = {
        info: PropTypes.object.isRequired,
        guid: PropTypes.number.isRequired,
    }

    render() {
        const { info, guid, csName } = this.props;
        let infoNode = null;

        // 终端类型 0: 其他; 1: pc; 2: 手机
        switch (info.terminal) {
            case 0:
                infoNode = (
                    <WechatVisitorInfo csName={csName} info={info} guid={guid} />
                );
                break;
            case 1:
            case 2:
                infoNode = (
                    <WebVisitorInfo csName={csName} info={info} guid={guid} />
                );
                break;
            default:
                break;
        }

        return infoNode;
    }
}

export default VisitorInfo;
