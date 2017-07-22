import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as NumberListActions from 'actions/numberList';
import NumberList from './NumberList';

const mapStateToProps = ({ numberList }) => ({
  numberList,
});

const mapDispatchToProps = (dispatch) => ({
  numberListActions: bindActionCreators(NumberListActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(NumberList);
