import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ShareRequestList from './ShareRequestList';
import {
    getShareList,
    toggleShareLoading,
    setShareRequestComment,
    setAllShareRequestComments
} from '../../action/action';

function mapStateToProps({datas}){
    return {
        shareList: datas.shareList,
        isShareListLoading: datas.isShareListLoading,
        isShareListLoadOver: datas.isShareListLoadOver,
        isShareListLoadLess:datas.isShareListLoadLess,
        shareListPageIndex: datas.shareListPageIndex,
    }
}

function mapDispatchToProps(dispatch){
    return {
        shareActions:bindActionCreators({
            getShareList,
            toggleShareLoading,
            setShareRequestComment,
            setAllShareRequestComments},dispatch),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(ShareRequestList);
