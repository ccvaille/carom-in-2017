import React from 'react';
import classNames from 'classnames';
import { getWindowHeight } from '~comm/utils';
import './footer.less';

class Footer extends React.Component {
    state = {
        isFixed: false,
    }

    componentDidMount() {
        window.addEventListener('resize', this.onHeightChange);
        this.onHeightChange();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onHeightChange);
    }

    onHeightChange = () => {
        this.setState({
            isFixed: getWindowHeight() > 825,
        });
    }

    render() {
        const footerClass = classNames({
            'biz-footer': true,
            'biz-footer-fixed': this.state.isFixed,
        });

        return (
            <div className={footerClass}>
                <span>
                    全国服务电话：400-0060-100 Copyright © 2008-2016 workec.com, All Rights Reserved.粤ICP备09049701号
                </span>
            </div>
        );
    }
}

export default Footer;
