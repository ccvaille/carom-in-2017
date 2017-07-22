import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLocale } from 'actions/locale';
import AccessSetting from './AccessSetting';

const mapDispatchToProps = dispatch => ({
    setLocale: bindActionCreators(setLocale, dispatch),
});

export default connect(null, mapDispatchToProps)(AccessSetting);
