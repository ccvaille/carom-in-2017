import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CustomEarlyWarn from './CustomEarlyWarn';
import {
    showEarlyWarn,
    loadAllUsers,
    changeCheckedUsers,
    changeNoticNum,
    getEarlyWarn,
    setEarlyWarn
} from '../../actions';

function mapStateToProps({ datas }) {
    return {
        isEarlyWarnShow: datas.isEarlyWarnShow,
        earlyWarnSendLoading:datas.earlyWarnSendLoading,
        isEarlyWarnEmpty:datas.isEarlyWarnEmpty,
        checkedEarlyWarnUsers: datas.checkedEarlyWarnUsers,
        earlyWarnUserNum: datas.earlyWarnUserNum,
        allUserData: datas.allUserData,
    }
}

function mapDispatchToProps(dispach) {
    return {
        ruleActions: bindActionCreators({
            showEarlyWarn,
            loadAllUsers,
            changeCheckedUsers,
            changeNoticNum,
            getEarlyWarn,
            setEarlyWarn
        }, dispach),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(CustomEarlyWarn);
