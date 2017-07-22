import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as actionCreators from '../../actions'
import { Radio, Select } from 'antd';
import './index.less'

class Feedback extends Component {

    state = {
        qstype: 1,
        unqs: 1,
    }

    onSubmit = () => {
        this.setState({
            ...this.state,
            kid: parseInt(this.props.kid)
        }, () => {
            this.props.postFeedback(this.state);
        })
    }

    changeRadio = (e) => {
        this.setState({
            ...this.state,
            qstype: parseInt(e.target.value)
        })
    }

    changeSelect = (value) => {
        this.setState({
            ...this.state,
            unqs: value
        })
    }

    render() {
        const { submit } = this.props;
        const RadioGroup = Radio.Group;
        const Option = Select.Option;

        let html = '';
        if(!submit) {
            html = (
                <div className="feedback">
                    <h2>以上信息是否已解决你的问题？</h2>
                    <RadioGroup onChange={ this.changeRadio } defaultValue="1">
                        <Radio value="1" selected>已解决</Radio>
                        <Radio value="2" className="unsolve">未解决</Radio>
                        <Select onChange={this.changeSelect} defaultValue="1" style={{ width: 150 }} className="reasons">
                            <Option value="-1">请选择原因</Option>
                            <Option value="1" selected>描述不清楚</Option>
                            <Option value="2">操作后未能解决</Option>
                            <Option value="3">对产品功能不满意</Option>
                        </Select>
                    </RadioGroup>
                    <button type="button" onClick={ this.onSubmit }>提交</button>
                </div>
            )
        } else {
            html = (
                <div className="feedback">
                    <div className="suc-msg">提交成功！</div>
                    <div className="thk-msg">非常感谢您的评价！</div>
                </div>
            )
        }
        return (
                <div>{ html }</div>
        )
    }
}

Feedback.propTypes = {
    postFeedback: PropTypes.func.isRequired,
    submit: PropTypes.bool.isRequired,
}

function mapStateToProps(state) {
  return {
    submit: state.feedback.submit
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Feedback)
