import React from 'react';
import { dateFormat, today } from 'constants/shared';

function statisticsHOC(WrappedComponent, options = {}) {
    const {
        updateParamsFnName,
        getDataFnName,
        successFn,
        dateTypeKey = 'date',
        dataType = 0, // 0 对象 1 数组
    } = options;
    return class StatisticsHOC extends React.Component {
        state = {
            datePickerVisible: false,
            expandDelta: 0,
        }

        componentWillUnmount() {
            this.props[updateParamsFnName]({
                [dateTypeKey]: 0,
                startDate: today,
                endDate: today,
                pickerStart: today,
                pickerEnd: today,
                page: 1,

                pagination: {
                    current: 1,
                },
            });
            let data = {
                page: 1,
                data: [],
                pageInfo: {
                    total: 0,
                    per_page: 10,
                    current_page: 1,
                },
            };
            if (dataType === 1) {
                data = [];
            }

            this.props[successFn]({
                data,
            });
        }

        onToggleDatePicker = (show, delta) => {
            this.setState({
                datePickerVisible: show,
                expandDelta: delta,
            });
        }

        onDateSelectDone = (dates) => {
            const { start, end } = dates;

            if (
                this.props[updateParamsFnName] &&
                typeof this.props[updateParamsFnName] === 'function'
            ) {
                this.props[updateParamsFnName]({
                    [dateTypeKey]: 4,
                    startDate: start.format(dateFormat),
                    endDate: end.format(dateFormat),
                    pickerStart: start.format(dateFormat),
                    pickerEnd: end.format(dateFormat),
                    page: 1,
                });

                if (
                    this.props[getDataFnName] &&
                    typeof this.props[getDataFnName] === 'function'
                ) {
                    this.props[getDataFnName]();
                } else {
                    console.error('pass right getdata fn name');
                }
            } else {
                console.error('pass right updateparams fn name');
            }
        }

        render() {
            return (
                <WrappedComponent
                    onToggleDatePicker={this.onToggleDatePicker}
                    onDateSelectDone={this.onDateSelectDone}
                    {...this.props}
                    {...this.state}
                />
            );
        }
    };
}

export default statisticsHOC;
