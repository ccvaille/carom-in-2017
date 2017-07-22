import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as WhitelistActions from 'actions/whitelist';
import Whitelist from './Whitelist';

const mapStateToProps = ({ whitelist }) => ({
  whitelist,
});

const mapDispatchToProps = (dispatch) => ({
  whitelistActions: bindActionCreators(WhitelistActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Whitelist);
