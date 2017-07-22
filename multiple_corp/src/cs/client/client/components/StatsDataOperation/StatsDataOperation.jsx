import React, { PropTypes } from 'react';
import moment from 'moment';
import { Button } from 'antd';
import { datePickerHeight, dateFormat } from 'constants/shared';
import TimeFilterTab from 'components/TimeFilterTab';
import RangeDatePicker from 'components/RangeDatePicker';

class StatsDataOperation extends React.Component {
    static propTypes = {
        updateParams: PropTypes.func.isRequired,
        getData: PropTypes.func.isRequired,
        datePickerVisible: PropTypes.bool.isRequired,
        toggleVisible: PropTypes.func.isRequired,
        onExport: PropTypes.func.isRequired,
        dateTypeKey: PropTypes.string.isRequired,
        onDateSelectDone: PropTypes.func.isRequired,
        csFilter: PropTypes.element,
        timeTabClassName: PropTypes.object,
        needExport: PropTypes.bool.isRequired,
        disableEndDate: PropTypes.func,
        disableStartDate: PropTypes.func,
        onDateChange: PropTypes.func.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string.isRequired,
    };

    static defaultProps = {
        dateTypeKey: 'date',
        timeTabClassName: '',
        csFilter: null,
        needExport: true,
        disableEndDate: null,
        disableStartDate: null,
    }

    onDateNotCustom = (startDate, endDate, index) => {
        const { updateParams, getData, dateTypeKey } = this.props;
        updateParams({
            [dateTypeKey]: index,
            startDate,
            endDate,
            page: 1,
        });

        getData();
    }

    onDateChange = (index) => {
        const {
            toggleVisible,
            onDateChange,
            startDate,
            endDate,
        } = this.props;
        if (onDateChange && typeof onDateChange === 'function') {
            onDateChange();
        }

        toggleVisible(false, 0);
        switch (index) {
            case 0: {
                const value = moment().format(dateFormat);
                this.onDateNotCustom(value, value, index);
                break;
            }

            case 1: {
                const start = moment().subtract(1, 'd').format(dateFormat);
                this.onDateNotCustom(start, start, index);
                break;
            }
            case 2: {
                const end = moment().subtract(1, 'd').format(dateFormat);
                const start = moment().subtract(7, 'd').format(dateFormat);
                this.onDateNotCustom(start, end, index);
                break;
            }
            case 3: {
                const end = moment().subtract(1, 'd').format(dateFormat);
                const start = moment().subtract(30, 'd').format(dateFormat);
                this.onDateNotCustom(start, end, index);
                break;
            }
            case 4: {
                toggleVisible(true, datePickerHeight);
                if (startDate && endDate) {
                    this.onDateNotCustom(startDate, endDate, index);
                }
                break;
            }
            default:
                break;
        }
    }

    render() {
        return (
            <div className="data-operation">
                <div className="cs-with-time clearfix">
                    {this.props.csFilter}
                    <TimeFilterTab
                        className={this.props.timeTabClassName}
                        onDateChange={this.onDateChange}
                    />
                </div>
                {
                    this.props.needExport
                    ?
                        <Button type="ghost" onClick={this.props.onExport}>导出数据</Button>
                    : null
                }

                <RangeDatePicker
                    show={this.props.datePickerVisible}
                    onDateSelectDone={this.props.onDateSelectDone}
                    disableEndDate={this.props.disableEndDate}
                    disableStartDate={this.props.disableStartDate}
                />
            </div>
        );
    }
}

export default StatsDataOperation;
