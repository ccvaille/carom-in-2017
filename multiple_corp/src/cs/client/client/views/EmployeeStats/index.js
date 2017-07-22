import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EmployeeStatsActions from 'actions/employeeStats';
import EmployeeStats from './EmployeeStats';

const mapStateToProps = ({ employeeStats }) => ({
    employeeStats,
});

const mapDispatchToProps = dispatch => bindActionCreators(EmployeeStatsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(EmployeeStats);
