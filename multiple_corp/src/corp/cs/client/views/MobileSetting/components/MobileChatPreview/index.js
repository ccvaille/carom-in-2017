import { connect } from 'react-redux';
import MobileChatPreview from './MobileChatPreview';

const mapStateToProps = ({ chatSetting, locale }) => ({
    mobileChatSetting: chatSetting.mobile,
    localeKey: locale,
});

export default connect(mapStateToProps)(MobileChatPreview);
