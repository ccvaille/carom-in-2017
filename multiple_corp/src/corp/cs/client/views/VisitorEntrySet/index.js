import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getEntrySetting, getServices } from 'actions/entrySetting';
import VisitorEntrySet from './VisitorEntrySet';

const mapDispatchToProps = dispatch => ({
    getEntrySetting: bindActionCreators(getEntrySetting, dispatch),
    getServices: bindActionCreators(getServices, dispatch),
});

export default connect(null, mapDispatchToProps)(VisitorEntrySet);
