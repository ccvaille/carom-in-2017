import React from 'react';
import Sidebar from '../../components/Sidebar';
import {connect} from 'react-redux';
import {fetchRole,routerChange} from '../../actions/indexAction'
import 'antd/dist/antd.less';

// import '../../../../comm/ec-antd-form/dist/antd.less';
import '../../../ec-antd-form/dist/antd.less';

import './index.less';

class Index extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        //获取鉴权的接口
        let fetchRole = this.props.fetchRole;
        fetchRole();
    }

    componentWillReceiveProps(nextProps,nextState){
        let props = nextProps;
    }

    onRouterChange = (router) =>{
        this.props.routerChange(router);
    }

    render() {
        let {role,router} = this.props;
        return (
            <div className="index-wrapper">
                <Sidebar role={role} router={router} onRouterChange = {this.onRouterChange.bind(this)}/>
                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => (
    state.indexReducer
);

const mapDispatchToProps = (dispatch) => {
    return {
        fetchRole: () => {
            dispatch(fetchRole())
        },
        routerChange: (payload) => {
            dispatch(routerChange(payload))
        }
    }
};

export default connect(mapStateToProps,mapDispatchToProps)(Index)


