import React, { PropTypes } from 'react';
import classNames from 'classnames';
import { Button } from 'antd';
import Clipboard from 'clipboard';
import message from '~comm/components/Message';
import saveCheck from 'img/save-check.png';
import './copy-button.less';

class CopyButton extends React.Component {
    static propTypes = {
        copyText: PropTypes.string.isRequired,
        // isCopied: PropTypes.number.isRequired,
    }

    state = {
        isCopied: 0,
    }

    componentDidMount() {
        this.copyButton = new Clipboard('.copy-button');

        this.copyButton.on('error', () => {
            message.error('浏览器不支持，请手动复制');
        });
    }

    componentWillUnmount() {
        this.copyButton.destroy();
    }

    onCopy = () => {
        this.setState({
            isCopied: 1,
        });

        setTimeout(() => {
            this.setState({
                isCopied: 0,
            });
        }, 2000);
    }

    render() {
        const { copyText } = this.props;
        const { isCopied } = this.state;
        const btnClasses = classNames({
            'copy-button': true,
            copied: isCopied === 1,
        });
        let btnText = '复制';

        switch (isCopied) {
            case 0:
                btnText = '复制';
                break;
            case 1:
                btnText = '已复制';
                break;
            default:
                break;
        }

        return (
            <Button
                type="primary"
                className={btnClasses}
                data-clipboard-action="copy"
                data-clipboard-text={copyText}
                disabled={isCopied === 1}
                onClick={this.onCopy}
            >
                <div style={{ display: 'inline-block' }}>
                    {
                        isCopied === 1
                        ?
                            <img className="success-check" src={saveCheck} alt="" />
                        : null
                    }
                </div>
                {btnText}
            </Button>
        );
    }
}

export default CopyButton;
