import { connect } from 'react-redux';
import MobileEntryPreview from './MobileEntryPreview';

const mapStateToProps = ({ entrySetting, locale }) => ({
    mobileEntrySetting: entrySetting.mobile,
    localeKey: locale,
});

export default connect(mapStateToProps)(MobileEntryPreview);
