import React, { PropTypes } from 'react';
import './center-footer.less';

class CenterModalFooter extends React.Component {
    static propTypes = {
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        okClassName: PropTypes.string,
        cancelClassName: PropTypes.string,
        onlyCancel: PropTypes.bool,
        onlyOk: PropTypes.bool,
        okText: PropTypes.string,
        cancelText: PropTypes.string,
    }

    static defaultProps = {
        onlyCancel: false,
        onlyOk: false,
        onOk() {},
        onCancel() {},
        okClassName: '',
        cancelClassName: '',
        okText: '确定',
        cancelText: '取消',
    }

    render() {
        const {
            onOk,
            onCancel,
            okClassName,
            cancelClassName,
            onlyCancel,
            onlyOk,
            okText,
            cancelText
        } = this.props;

        return (
            <div className="center-footer">
                {
                    onlyCancel
                    ?
                    null
                    :
                    <button
                        className={`ok ${okClassName}`}
                        onClick={onOk}
                    >
                        <span className="loading" />
                        {okText}
                    </button>
                }

                {
                    onlyOk
                    ?
                    null
                    :
                    <button
                        className={`cancel ${cancelClassName}`}
                        onClick={onCancel}
                    >
                        {cancelText}
                    </button>
                }
            </div>
        );
    }
}

export default CenterModalFooter;
