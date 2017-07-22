import React, { PropTypes } from 'react';
import classNames from 'classnames';
import shortid from 'shortid';
import './time-filter.less';

const times = [{
    title: '今天',
}, {
    title: '昨天',
}, {
    title: '过去7天',
}, {
    title: '过去30天',
}, {
    title: '自定义',
}];

class TimeFilterTab extends React.Component {
    static propTypes = {
        onDateChange: PropTypes.func.isRequired,
        className: PropTypes.string,
    }

    static defaultProps = {
        className: '',
    }

    state = {
        activeTime: 0,
    }

    onDateChange = (type) => {
        this.setState({
            activeTime: type,
        });

        this.props.onDateChange(type);
    }

    render() {
        const timeNodes = times.map((time, i) => {
            const classes = classNames({
                active: this.state.activeTime === i,
            });
            return (
                <li
                    key={shortid.generate()}
                    onClick={() => this.onDateChange(i)}
                >
                    <a className={classes}>{time.title}</a>
                </li>
            );
        });

        return (
            <ul
                className={`time-filter-tab clearfix ${this.props.className}`}
            >
                {timeNodes}
            </ul>
        );
    }
}

export default TimeFilterTab;
