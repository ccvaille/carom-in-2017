import { connect } from 'react-redux';
import MinimizeEntryPreview from './MinimizeEntryPreview';

const mapStateToProps = ({ entrySetting, locale }) => ({
    listTheme: entrySetting.pc.listTheme,
    systemThemeNumber: entrySetting.pc.systemThemeNumber,
    groupButtonColor: entrySetting.pc.groupButtonColor,
    minimizeBackground: entrySetting.pc.minimizeBackground,
    localeKey: locale,
});

export default connect(mapStateToProps)(MinimizeEntryPreview);
