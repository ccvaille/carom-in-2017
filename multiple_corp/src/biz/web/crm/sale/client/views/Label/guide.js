import React, { PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Row, Col, Icon, Menu, Dropdown, Button, Checkbox, Radio, Popover, Modal } from 'antd';
import { Link } from 'react-router';
import Cookie from 'react-cookie';
import './index.less'



class Guide extends React.Component {
    componentWillMount() {
        this.text = <span className="old-company-title">回到旧版，使用更多功能<i className="close" onClick={ this.saveWelcome.bind(this) }></i></span>;
        this.content = (
            <div className="old-company-content">
                <p>新版企业管理目前只对CRM的功能进行了迁移，如果您需要使用其他企业功能，点击这里，可以返回到旧版企业管理。</p>
                <div className="ant-modal-footer">
                    <button type="button" className="ant-btn ant-btn-primary ant-btn-lg" onClick={ this.saveWelcome.bind(this) } >确 定</button>
                </div>
            </div>
        );
        this.setState({
            "isWelcome": false
        });
    }
    componentDidMount() {
        const  { dispatch } = this.props;
        var isFirstLogin = Cookie.load('isWelcome');
        if (!isFirstLogin) {
            this.setState({
                "isWelcome": true,
                "visible":true
            });
            dispatch({
                type: 'GUIDE_WELCOME',
                data: true
            })

        }
    }
    saveWelcome() {
        const  { dispatch } = this.props;
        Cookie.save('isWelcome', "true", {
            expires: new Date(Date.now() + 30 * 24 * 3600000)
        });
        this.setState({
            "isWelcome": false
        });
        dispatch({
            type: 'GUIDE_WELCOME',
            data: false
        })
    }

    render() {
        return (
            <div>
                {
                    /*

                    this.state.isWelcome ?
                    <div className="old-company-guideBg" >
                        <Popover overlayClassName="old-company-guide" placement="rightTop"  title={this.text} visible={this.state.visible} content={this.content} trigger="click">
                            <Button className="back-btn"></Button>
                        </Popover>
                    </div> :''
    
                    */
                   
                }
            </div>

        )
    }
}
function mapStateToProps(state) {
    const {postsByReddit} = state;
    return {postsByReddit}
}
export default connect(mapStateToProps)(Guide);
