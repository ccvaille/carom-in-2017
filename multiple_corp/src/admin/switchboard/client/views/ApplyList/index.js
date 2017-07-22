import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as ApplyListActions from 'actions/applyList';
import ApplyList from './ApplyList';

const mapStateToProps = ({ applyList }) => ({
  applyList,
});

const mapDispatchToProps = (dispatch) => ({
  applyListActions: bindActionCreators(ApplyListActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ApplyList);
