import React, { PropTypes } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import classNames from 'classnames';
import './date-picker.less';

class RangeDatePicker extends React.Component {
    static propTypes = {
        show: PropTypes.bool.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        disableEndDate: PropTypes.func,
        disableStartDate: PropTypes.func,
    }

    static defaultProps = {
        show: false,
        onDateSelectDone: () => {},
        disableEndDate: null,
        disableStartDate: null,
    }

    state = {
        startValue: null,
        endValue: null,
    };

    onChange = (field, value) => {
        this.setState({
            [field]: value,
        }, () => {
            const { startValue, endValue } = this.state;
            if (startValue && endValue) {
                this.props.onDateSelectDone({
                    start: startValue,
                    end: endValue,
                });
            }
        });
    }

    onStartChange = (value) => {
        this.onChange('startValue', value);
    }

    onEndChange = (value) => {
        this.onChange('endValue', value);
    }

    disabledStartDate = (startValue) => {
        // const today = moment();
        // const isLeap = today.isLeapYear();
        // const isLastLeap = yearAgo.isLeapYear();
        // let leapDays = 0;
        const { disableStartDate } = this.props;
        const endValue = this.state.endValue;
        const yearAgo = moment().subtract(1, 'years').subtract(1, 'days');
        const dayAgo = moment().subtract(1, 'days');

        // if (isLeap || isLastLeap) {
        //     leapDays = 1;
        // }

        if (!startValue) {
            return false;
        }

        if (!endValue) {
            if (disableStartDate && typeof disableStartDate === 'function') {
                return startValue.isBefore(yearAgo) || disableStartDate(startValue);
            }
            return startValue.isBefore(yearAgo) || dayAgo.isBefore(startValue);
        }

        const isSameMonth = endValue.isSame(startValue.valueOf(), 'month');
        // eslint-disable-next-line max-len
        const result = startValue.isBefore(yearAgo) || !isSameMonth || startValue.valueOf() > endValue.valueOf() || dayAgo.isBefore(startValue);
        if (disableStartDate && typeof disableStartDate === 'function') {
            return result && disableStartDate(startValue);
        }
        return result;
    }

    disabledEndDate = (endValue) => {
        const { disableEndDate } = this.props;
        const startValue = this.state.startValue;
        const yearAgo = moment().subtract(1, 'years').subtract(1, 'days');
        const dayAgo = moment().subtract(1, 'days');

        if (!endValue) {
            return false;
        }

        if (!startValue) {
            // return endValue.isBefore(yearAgo);
            if (disableEndDate && typeof disableEndDate === 'function') {
                return endValue.isBefore(yearAgo) || disableEndDate(endValue);
            }
            return endValue.isBefore(yearAgo) || dayAgo.isBefore(endValue);
        }

        // if (!endValue || !startValue) {
        //     return false;
        // }

        const isSameMonth = startValue.isSame(endValue.valueOf(), 'month');
        // eslint-disable-next-line max-len
        const result = !isSameMonth || endValue.valueOf() < startValue.valueOf() || dayAgo.isBefore(endValue);

        if (disableEndDate && typeof disableEndDate === 'function') {
            return result && disableEndDate(endValue);
        }
        return result;
    }

    render() {
        const classes = classNames({
            'range-date-picker': true,
            show: this.props.show,
        });

        return (
            <div className={classes}>
                <DatePicker
                    style={{ width: 140, marginRight: 7 }}
                    placeholder="起始时间"
                    format="YYYY-MM-DD"
                    disabledDate={this.disabledStartDate}
                    onChange={this.onStartChange}
                />
                <span className="divider" />
                <DatePicker
                    style={{ width: 140, marginLeft: 7 }}
                    placeholder="截止时间"
                    format="YYYY-MM-DD"
                    disabledDate={this.disabledEndDate}
                    onChange={this.onEndChange}
                />
            </div>
        );
    }
}

export default RangeDatePicker;
