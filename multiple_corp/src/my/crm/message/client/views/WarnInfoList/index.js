import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import WarnInfoList from './WarnInfoList';
import { getWarnList,setWarnComment} from '../../action/action'

function mapStateToProps({ datas }) {
    return {
        wranList: datas.wranList,
        iswranListLoading: datas.iswranListLoading,
        isWranListLoadOver: datas.isWranListLoadOver,
        isWranlistLoadLess:datas.isWranlistLoadLess,
        wranListPageIndex: datas.wranListPageIndex,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        wranActions: bindActionCreators({
            getWarnList,setWarnComment
        }, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WarnInfoList);
