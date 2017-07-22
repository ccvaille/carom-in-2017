import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as EntrySettingActions from 'actions/entrySetting';
import { setLocale } from 'actions/locale';
import PcEntrySetting from './PcEntrySetting';

const mapStateToProps = ({ entrySetting }) => ({
    pcEntrySetting: entrySetting.pc,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    ...EntrySettingActions,
    setLocale,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(PcEntrySetting);
