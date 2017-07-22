import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomerBackDetail from './CustomerBackDetail';
import {
    getWarnDetail,
    loadWarnMore,
    resetWarnMore,
    setWarnComment,
} from '../../action/action';

function mapStateToProps({ datas }) {
    return {
        wranDetail: datas.wranDetail,
        wranDetailPageIndex: datas.wranDetailPageIndex,
        isWranDetailLoadOver: datas.isWranDetailLoadOver,
        isWranDetailLoading: datas.isWranDetailLoading,
        isWranDetailLoadLess:datas.isWranDetailLoadLess,
        wranDetailCounter: datas.wranDetailCounter,
        wranDetailLoseNumber:datas.wranDetailLoseNumber,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        wranAction: bindActionCreators({ 
            getWarnDetail, 
            loadWarnMore, 
            resetWarnMore,
            setWarnComment
        }, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerBackDetail);
