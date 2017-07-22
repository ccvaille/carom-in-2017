import React, { PropTypes } from 'react';
import moment from 'moment';
import { dateFormat } from 'constants/shared';

const today = moment().format(dateFormat);

const StatsGraphTitle = ({ title, startDate, endDate }) => (
    <div className="graph-title">
        <p>{title}</p>
        <p>{startDate} ~ {endDate}</p>
    </div>
);

StatsGraphTitle.defaultProps = {
    title: '',
    startDate: today,
    endDate: today,
};

StatsGraphTitle.propTypes = {
    title: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string.isRequired,
};

export default StatsGraphTitle;
