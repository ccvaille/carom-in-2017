import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EntrySettingActions from 'actions/entrySetting';
import { setLocale } from 'actions/locale';
import MobileEntrySetting from './MobileEntrySetting';

const mapStateToProps = ({ entrySetting }) => ({
    mobileEntrySetting: entrySetting.mobile,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    ...EntrySettingActions,
    setLocale,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(MobileEntrySetting);
