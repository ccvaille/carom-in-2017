import React, { PropTypes } from 'react';
import { Button } from 'antd';
import saveCheck from '../../public/images/save-check.png';
import './save-button.less';

class SaveButton extends React.Component {
    static propTypes = {
        isSaved: PropTypes.number.isRequired,
        onSave: PropTypes.func.isRequired,
    }

    render() {
        let saveButton = null;
        switch (this.props.isSaved) {
            case 0:
                saveButton = (
                    <Button
                        type="primary"
                        onClick={this.props.onSave}
                    >
                        保存
                    </Button>
                );
                break;
            case 1:
                saveButton = (
                    <Button
                        className="setting-save-btn setting-saving"
                        disabled
                    >
                        保存中...
                    </Button>
                );
                break;
            case 2:
                saveButton = (
                    <Button
                        type="ghost"
                        className="setting-save-btn setting-saved"
                        disabled
                    >
                        <img className="success-check" src={saveCheck} alt="" />
                        已保存
                    </Button>
                );
                break;
            default:
                break;
        }

        return saveButton;
    }
}

export default SaveButton;
