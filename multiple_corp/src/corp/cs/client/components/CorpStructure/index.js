import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CorpActions from 'actions/corpStructure';
import CorpStructure from './CorpStructure';

const mapStateToProps = ({ corpStructure }) => ({
    corpStructure,
});

const mapDispatchToProps = (dispatch) => ({
    corpActions: bindActionCreators(CorpActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(CorpStructure);
