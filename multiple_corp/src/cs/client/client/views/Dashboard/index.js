import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as DashboardActions from 'actions/dashboard';
import { getServices } from 'actions/customerServices';
import Dashboard from './Dashboard';

const mapStateToProps = ({ dashboard, customerServices }) => ({
    dashboard,
    services: customerServices.services,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    ...DashboardActions,
    getServices,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
