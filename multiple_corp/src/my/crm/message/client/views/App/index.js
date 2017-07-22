import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import App from './APP';
import { getWarnIsHave,getMenuShow } from '../../action/action';

function mapStateToProps({ datas }) {
    return {
        isHaveWrans: datas.isHaveWrans,
        shownMenus:datas.shownMenus,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        action: bindActionCreators({ getWarnIsHave,getMenuShow}, dispatch),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
