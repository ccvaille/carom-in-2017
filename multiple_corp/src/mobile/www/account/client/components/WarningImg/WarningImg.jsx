import React from 'react';
import warningImg from 'images/warning.png';
import successImg from 'images/success.png';
import './warning-img.less';

const WarningImg = ({ type }) => (
    <div className="warning-wrapper">
        <img src={type === 1 ? successImg : warningImg} alt="" />
    </div>
);

export default WarningImg;
