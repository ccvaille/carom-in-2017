import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { activePackage } from 'actions/active';
import NotActivePage from './NotActivePage';

const mapStateToProps = ({ active }) => ({
    ...active,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    activePackage,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(NotActivePage);
