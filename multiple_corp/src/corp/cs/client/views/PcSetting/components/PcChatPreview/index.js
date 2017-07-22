import { connect } from 'react-redux';
import PcChatPreview from './PcChatPreview';

const mapStateToProps = ({ chatSetting, locale }) => ({
    pcChatSetting: chatSetting.pc,
    localeKey: locale,
});

export default connect(mapStateToProps)(PcChatPreview);
