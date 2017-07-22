import { connect } from 'react-redux';
import EntryPreview from './EntryPreview';

const mapStateToProps = ({ entrySetting, locale }) => ({
    pcEntrySetting: entrySetting.pc,
    localeKey: locale,
});

export default connect(mapStateToProps)(EntryPreview);
