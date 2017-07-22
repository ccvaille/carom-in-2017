import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CsGroupsActions from 'actions/csGroups';
import GroupSidebar from './GroupSidebar';

const mapStateToProps = ({ csGroups }) => ({ ...csGroups });

const mapDispatchToProps = dispatch => bindActionCreators(CsGroupsActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(GroupSidebar);
