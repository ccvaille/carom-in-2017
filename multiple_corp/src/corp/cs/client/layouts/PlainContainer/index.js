import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { simulateLogin } from 'actions/auth';
import PlainContainer from './PlainContainer';

const mapDispatchToProps = (dispatch) => ({
    simulateLogin: bindActionCreators(simulateLogin, dispatch),
});

export default connect(null, mapDispatchToProps)(PlainContainer);
