import React, { PropTypes } from "react";
import {Link} from 'react-router';

import { Modal, Table, Tooltip, Message } from 'antd';
import EmployeeRight from './components/EmployeeRight.jsx';
import "./setting.less";

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SettingActions from 'actions/switchboardSetting';
import * as CommonModalActions from 'actions/commonModal';

class MobileSetting extends React.Component {
    static propTypes = {
        settingActions: PropTypes.object.isRequired,
        switchboardSetting: PropTypes.object.isRequired,
        commonModal: PropTypes.object.isRequired,
        commonModalActions: PropTypes.object.isRequired
    };
    componentWillMount = () => {
      
    }
    changePage = (pagination) => {
        this.getMobile(pagination.current, pagination.pageSize);
    }
    getMobile = (page, pageSize=10) => {
        this.props.settingActions.getMobileAllocation({
            page: page,
            per: pageSize
        });
    }
    componentDidMount() {
        // this.props.settingActions.getSetting();
        //获取号码配置
       this.getMobile(1);
       
    }
    //员工授权初始化
    initEmployees = () => {
        let that = this;
        jq('.employee-right-content').ztree({
            url: '//api.workec.com/usercenter/usergroup/corpstruct?with_staff=1&callback',
            callback: that.selectEmployees          
        });
    } 
    selectEmployees = (nodeId, name, type, isauth) => {
       
        if (type >> 0) {
            return false;
        }
        if (isauth >> 0) {
            Message.error('该员工已被授权');
            return false
        }
        const { rightedEmployees } = this.props.switchboardSetting;
        let index = rightedEmployees.findIndex((item) => {
            return (item.nodeId-0) === (nodeId-0);
        })
        if (index == -1) {
            this.props.settingActions.setRightedEmployees({
                nodeId: nodeId,
                name: name,
                type: type,
                operateType: 'add'
            })
        }
    }
    delRightedEmployees = (obj) => {
        obj.operateType = 'reduce';
        this.props.settingActions.setRightedEmployees(obj);
    }
    sumbitRightedEmployees = () => {
        const { settingActions, switchboardSetting } = this.props;
        settingActions.sumbitRightedEmployees(switchboardSetting.rightedEmployeeId);
    }
    //号码配置授权员工弹层
    toggleRightedEmployee = (id) => {
        if (!id) {
            this.props.settingActions.setRightedEmployees({operateType: 'reduce'});
        } else {
            this.props.settingActions.getRightedEmployees(id);
        }
        this.props.settingActions.toggleRightedEmployee(id);
    }
    //切换业务配置显示
    toggleSetting = (id) => {
        if (id) {
            this.getSetting(id);
        } 
        this.props.settingActions.toggleSetting(id);
    }
    //获取业务配置
    getSetting = (id) => {
        const { settingActions } = this.props;
        settingActions.getSettingInfo(id);
    }
    render() {
        const {
            errorText
        } = this.props.commonModal;
        const {
            configureType,
            typeOneNumber,
            typeTwoNumber,
            mobileSource,
            totalMobileSource,
            showSetting,
            rightedEmployees,//具体授权员工
            rightedEmployeeId//授权员工显示与否

        } = this.props.switchboardSetting;
        const columns = [{
            title: 'EC云总机号码',
            dataIndex: 'f_number',
            key: 'f_number'
        },{
            title: '到期时间',
            dataIndex: 'f_expire_time',
            key: 'f_expire_time'
        },{
            title: '使用人员授权',
            dataIndex: 'auth',
            key: 'auth',
            width: '20%',
            height: '40px',
            render: (arr) => {
                return (
                    <span className="user_service">
                    {
                        !arr.length ? '--' : 
                        arr.map((item, index) => {
                            
                            return index === arr.length - 1 ? item.f_uname :
                                item.f_uname + ';'
                        })
                    }
                    </span>
                )
            }
            
        },{
            title: '最近操作人',
            dataIndex: 'f_operater',
            width:'15%',
            key: 'f_operater'
        },{
            title: '操作时间',
            dataIndex: 'f_operate_time',
            key: 'f_operate_time'
        },{
            title: '操作',
            render: (text, record) => {
                return (
                    <div>
                        <a 
                            href='javascript:void 0;' 
                            className="mobile"
                            onClick={this.toggleRightedEmployee.bind(this, record.f_id)} >
                                授权
                        </a>
                        <a 
                            href='javascript:void 0;' 
                            className="mobile"
                            onClick={this.toggleSetting.bind(this, record.f_id)} >
                                业务配置
                        </a>
                    </div>
                )
            }
        }];
        return (
           
            <div className="switchboard-setting">
                <div className="inner-box">
                    <div className="succeed-tips">
                        恭喜， 您的企业云呼总机功能现在可以正常使用了！
                    </div>

                    <ul className="deploy-nav">
                        <li className="active">
                            号码配置
                        </li>
                    </ul>
                    <div className="mobile-allocation">
                        <Table 
                            dataSource={mobileSource}
                            columns={columns} 
                            bordered={true}
                            onChange={this.changePage}
                            pagination={{
                                "pageSize": 10,
                                "total": totalMobileSource - 0 || 0,
                                "showQuickJumper": true     
                            }}/>
                        <p className="billing">计费方式为：消费金额=（A路时长）*单价；注：A路接通即开始扣费（使用云呼拨出后，A路接通，即使B路没有接通也会产生费用。）</p>
                    </div>

                    <Modal
                        className="modal-right-employee"
                        title="员工授权"
                        wrapClassName="vertical-center-modal"
                        visible={rightedEmployeeId ? true : false}
                        width={400}
                        onOk={this.sumbitRightedEmployees}
                        onCancel={this.toggleRightedEmployee.bind(this, '')} >
                            <EmployeeRight 
                                delRightedEmployees={this.delRightedEmployees}
                                rightedEmployees={rightedEmployees}
                                initEmployees={this.initEmployees} />
                    </Modal>
                </div>
                   
            </div>
        );
    }
}

const mapStateToProps = ({ switchboardSetting, commonModal }) => ({
  switchboardSetting,
  commonModal,
});

const mapDispatchToProps = (dispatch) => ({
  settingActions: bindActionCreators(SettingActions, dispatch),
  commonModalActions: bindActionCreators(CommonModalActions, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(MobileSetting);
