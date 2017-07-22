import React, { Component, PropTypes } from "react";
import { Button, Icon, Modal } from 'antd';
import Table from '../../components/Table';

import {connect} from 'react-redux'
import { exportData } from '../../actions';
import './index.less';

class DetailTable extends Component {
    state = {
        showAll: false,
        visible: false
    }

    changeShowState = () => {
        this.setState({
            showAll: this.state.showAll ? false : true
        })
    }

    componentWillReceiveProps = (nextProps) => {
        const exportData = nextProps.exportData;
        if(nextProps.ischange == this.props.ischange) {
            return;
        }
        if(exportData.error) {
            if(exportData.max){
                Modal.info({
                    title: '您今天的导出次数已经达到上限，如有需要<br>请明天再来吧~',
                    okText: '确定',
                    width: 380,
                });
            }else{
                layerAlert("添加导出任务失败！");
            }
            return false;
        }

        if(exportData.id){
            if(exportData.status !=2 ){
                Modal.info({
                    title: '您有相同的导出任务正在导出中！您可以去<a href="/work/export/log" target="_blank">我的导出</a>页面查看导出进度和下载。',
                    okText: '确定',
                    width: 380,
                });
            }else{
                Modal.confirm({
                    title: '您之前已经导出过相同的数据，可以在此直接下载。',
                    okText: '下载',
                    onOk: function() {
                        window.open('/work/export/down?id=' + exportData.id);
                    },
                    cancelText: '取消',
                    width: 380,
                });
            }
        }else{
            Modal.success({
                title: exportData.msg,
                okText: '确定',
                width: 380,
            });
        }
    }

    showModal = () => {
        if(this.props.data.isempty) {
            Modal.info({
                title: '没有数据可导出，请更换条件后再试！',
                okText: '确定',
                width: 380,
            });
        } else {
            this.setState({
                ...this.state,
                visible: true,
            });
        }
        
    }

    handleOk = () => {
        this.setState({
            ...this.state,
            visible: false,
        }, function() {
            if(!this.props.data.isempty) {
                this.props.fetchExportData(1);
            }
        });
    }
    handleCancel = () => {
        this.setState({
            ...this.state,
            visible: false,
        });
    }

    render() {
        const { data, type } = this.props;

        let table_data = [];
        let title = [];
        let isempty = data ? data.isempty : 0;
        let text = [];
        if(type == 0 && data) {
            title = ['时间', '接通率', '通话时长', '拨打次数', '联系人数量', '平均通话时长'];
            table_data = data.table;
            text[0] = '隐藏无数据时间';
            text[1] = '展示无数据时间';
        } else if(type == 1 && data) {
            title = ['名称', '接通率', '通话时长', '拨打次数', '联系人数量', '平均通话时长'];
            table_data = data.table;
            text[0] = '隐藏无数据员工';
            text[1] = '展示无数据员工';
        }
        let show_flag = false; //是否展示隐藏显示按钮
        for(let i = 0, j = table_data.length; i < j; i++) {
            if(table_data[i][3] == 0) {
                show_flag = true;
                break;
            }
        }
        const table_data_all = table_data;
        const table_data_not_all = table_data.map(function(item, index) {
            if(item[3] != 0) return item
        });
        return (
            <div>
                <div className="title">
                    <span>电话联系统计表</span>
                    {
                        data ?
                        <Button icon="download" onClick={ this.showModal } >导出数据</Button> : 
                        <Button icon="download" disabled>导出数据</Button>
                    }
                    <Modal title="温馨提示"
                        iconType="question-circle"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        okText="确定"
                        width="380"
                        cancelText="取消" >
                        { <div>您需要前往<a href="/work/export/log" target="_blank">我的导出</a>页面查看导出进度和下载。确认继续导出吗？</div> }
                    </Modal>
                </div>
                <Table title={ title } data={ this.state.showAll ? table_data_all : table_data_not_all } isempty={ isempty }/>
                {
                    !isempty && show_flag ? <span className="link-btn" onClick={ this.changeShowState }>{ this.state.showAll ? text[0] : text[1] }</span> : ''
                }
            </div>
        )
    }
}


DetailTable.PropTypes = {
    data: PropTypes.object.isRequired,
    type: PropTypes.number.isRequired,
}

const mapStateToProps = (state) => {
    return {
        exportData: state.exportData.exportData,
        ischange: state.exportData.ischange
    }
};

export default connect(mapStateToProps)(DetailTable);