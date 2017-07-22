import React, { PropTypes } from 'react';
import { Button } from 'antd';
import arrowDownImg from 'img/arrow-down.png';
import locale from '../../locale';
import './send-button.less';

const SendButton = ({ localeKey, themeColor }) => (
    <div className="send-btn">
        <Button
            className="main-btn"
            style={{
                backgroundColor: themeColor,
                borderColor: themeColor,
            }}
        >
            <span className="send-text">{locale[localeKey].send}</span>
            <span className="set-icon">
                <img src={arrowDownImg} alt="" />
            </span>
        </Button>
        <div className="send-setting-wrapper">
            <div className="type-item checked">
                <i className="icon icon-check" />
                <span className="type-text">按Enter键发消息</span>
            </div>
            <div className="type-item">
                <i className="icon icon-check" />
                <span className="type-text">按Enter键发消息</span>
            </div>
        </div>
    </div>
);

SendButton.propTypes = {
    localeKey: PropTypes.string.isRequired,
    themeColor: PropTypes.string.isRequired,
};

export default SendButton;
