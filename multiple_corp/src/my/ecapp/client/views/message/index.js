import React, { PropTypes } from 'react';
import { Router, browserHistory, Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'

import Cookie from 'react-cookie';
import { DatePicker, Popover, Select } from 'antd';

import CrmMessage from '../../components/CrmMessage';
import EcTeam from '../../components/ECTeam';
import EnterpriseRadio from '../../components/EnterpriseRadio';
import H5marketing from '../../components/H5marketing';

import ReactEcharts from 'echarts-for-react';
//import './index.less';

import {default as mapDispatchToProps} from '../../actions/index';


class Message extends React.Component {

    componentWillMount() {

        this.setState({
            json: {
                list: [{}, {}, {}, {}]
            }
        })
    }

    render() {


        return (
            <div>
                <div className="testApp">
                    {this.props.children}
                </div>
            </div>
        );
    }
}


const mapStateToProps = (state) => {
    //const obj = Object.assign({}, state.historyData);
    // return {
    //     shareData: state.shareData
    // }
    return {};
};

Message.contextTypes = {
    //history: PropTypes.object.isRequired,
    //store: PropTypes.object.isRequired
};


export default connect(mapStateToProps, mapDispatchToProps)(Message);
