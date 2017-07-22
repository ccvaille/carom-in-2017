import React, { PropTypes } from 'react';
import {Icon} from 'antd';

class EmployeeRight extends React.Component {

    static propTypes = {
        
    }
    componentDidMount = () => {
       
    }
    render() {
        const rightedEmployees = this.props.rightedEmployees; //员工授权;
        return (
            <div >
                <div className="head btn-box">
                    <span>员工授权</span>:
                    <button
                        className="select-emp employee-right-content"
                        onClick={this.props.initEmployees}
                    >
                        +选择员工
                    </button>
                </div>
                <div className="content">
                    {
                        rightedEmployees && rightedEmployees.map((item, index) => {
                            return (
                                <a href="javascript:void 0" 
                                    key={index} 
                                    className="label"
                                    onClick={this.props.delRightedEmployees.bind(this, item)}>
                                        <span>{item.name}</span>
                                        <Icon type="close" className="cancel"/>
                                </a>  
                            );
                        })   
                    }
                </div>
                <p>进行员工授权后，已授权的成员可以使用该云总机号码了，一个员工只能授权一个总机号码。</p>
            </div>
        )
    }
}
export default EmployeeRight;
