import React, { PropTypes } from 'react';

import {Icon} from 'antd';
import className from 'classnames';

class NoRoundAnswer extends React.Component {

	render() {
		const {
			activeType,
		} = this.props.mode1Info;
		return (
			<div className={className("deploy-box", {"active": !this.props.mode})}
				onClick={this.props.toggleMode.bind(this, 0)}>

	            <h2 className="head">模式一：无轮转接听</h2>
	            <label className="label-radio" >
	                <input
	                    type="radio"
	                    name="num" 
	                    checked={activeType === 1}
	                    onChange={this.props.radioChangeMode1.bind(this, 1)} />
	                    <span></span>
	                <div className="content">

	                    <h3>请根据公司的业务需要进行业务逻辑配置</h3>
	                    <p className="">
	                        1、云总机号码在客户回拨给销售人员时回拨给最后一名联系的销售人员
	                    </p>
	                    <p className="">
	                        2、如果无销售人员拨打过，回拨给指定号码
	                    </p>
	                    <input
	                        type="text"
	                        placeholder="请输入指定号码"
	                        disabled={this.props.mode1Info[1].f_uname || activeType === 2}
	                        // disabled={this.props.configureType !== 1}
	                        value={this.props.mode1Info[1].f_phone}
	                        onChange={e => this.props.mode1InfoPhone(e, 1)}/>
	                        {
	                        	!this.props.mode1Info[1].f_uname ?
	                        	<button
	                        		className="select-emp no-round-add-user"
	                        		disabled={activeType === 2}
	                        		id="add-user-1"
	                        		onClick={this.props.showNoRoundAddUser.bind(this, 1, 'add-user-1')} >
	                        		+选择员工
	                    		</button>:
	                    		<a 	href="javascript:void 0"
	                    			className={className('mode-add-user', {'disabled': activeType === 2})}
									disabled={activeType === 2}>

										<span>{this.props.mode1Info[1].f_uname}</span>
										<Icon type="close" 
											onClick={this.props.resetMode1InfoUser.bind(this, 1)}/>
	                    		</a>

	                        }
	                    
	                </div>

	            </label>
	            <label className="label-radio">
	                <input
	                    type="radio"
	                    name="num" 
	                    checked={activeType === 2}
	                    onChange={this.props.radioChangeMode1.bind(this, 2)}/>
	                    <span></span>
	                <div className="content">

	                    <h3>云总机号码在客户回拨给销售人员时总是回拨给某一指定号码</h3>
	                    <input
	                        type="text"
	                        placeholder="请输入指定号码"
	                        disabled={this.props.mode1Info[2].f_uname || activeType === 1}
	                        // disabled={this.props.configureType !== 1}
	                        value={this.props.mode1Info[2].f_phone}
	                        onChange={e => this.props.mode1InfoPhone(e, 2)} />
                        {
                        	!this.props.mode1Info[2].f_uname ?
                        	<button
                        		className="select-emp no-round-add-user"
                        		id="add-user-2"
                        		disabled={activeType === 1}
                        		onClick={this.props.showNoRoundAddUser.bind(this, 2, 'add-user-2')}
                       		>
                        		+选择员工
                    		</button>:
                    		<a 	href="javascript:void 0"
                    			className={className('mode-add-user', {'disabled': activeType === 1})}
								disabled={activeType === 1}>

								<span>{this.props.mode1Info[2].f_uname}</span>
								<Icon type="close" 
									onClick={this.props.resetMode1InfoUser.bind(this, 2)}/>
                    		</a>

                        }
	                </div>
	            </label>
	            <p className="dsp">
	                说明：回拨可设置指定号码或者员工账号，如果为员工账号，则由该
	                员工的手机账号作为接听号码。
	            </p>
	            <div className="right-top-icon">
	            </div>
	        </div>
		)
	}
}
export default NoRoundAnswer;