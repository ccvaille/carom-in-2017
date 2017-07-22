import { Input, Tooltip } from 'antd';
import React from 'react';
import './index.less';

function formatNumber(value) {
    value += '';
    const list = value.split('.');
    const prefix = list[0].charAt(0) === '-' ? '-' : '';
    let num = prefix ? list[0].slice(1) : list[0];
    let result = '';
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    return `${prefix}${result}${list[1] ? `.${list[1]}` : ''}`;
}

export default class NumericInput extends React.Component {
    onChange = (e) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]{0,2})?$/;
        // const reg = /^(?!0+(?:\.0+)?$)(?:[1-9]\d*|0)(?:\.\d{1,2})?$/;
        if ( value === '' || value === '-'||(!isNaN(value) && reg.test(value))) {
            if(value === ''||parseFloat(value)<=100000000){
                this.props.onChange(value);
            }
        }
    }

    onBlur = () => {
        const { value, onBlur, onChange } = this.props;
        if (value.length>0&&(value.charAt(value.length - 1) === '.' || value === '-')) {
            onChange({ value: value.slice(0, -1) });
        }
        if (onBlur) {
            onBlur();
        }
    }
    render() {
        const { value } = this.props;
        const title = (
            <span className="numeric-input-title">
                {value !== '-' ? formatNumber(value) : '-'}
              </span>
        );
        return (
            <Tooltip
                trigger={['focus']}
                title={title}
                placement="topLeft"
                overlayClassName="numeric-input"
            >
                <Input
                    {...this.props}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    placeholder=""
                    maxLength="25"
                />
            </Tooltip>
        );
    }
}
