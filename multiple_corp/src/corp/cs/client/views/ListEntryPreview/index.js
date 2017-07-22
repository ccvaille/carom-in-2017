import { connect } from 'react-redux';
import ListEntryPreview from './ListEntryPreview';

const mapStateToProps = ({ entrySetting, locale }) => ({
    listTheme: entrySetting.pc.listTheme,
    systemThemeNumber: entrySetting.pc.systemThemeNumber,
    groupTextColor: entrySetting.pc.groupTextColor,
    listBackground: entrySetting.pc.listBackground,
    customerServices: entrySetting.customerServices,
    localeKey: locale,
});

export default connect(mapStateToProps)(ListEntryPreview);
