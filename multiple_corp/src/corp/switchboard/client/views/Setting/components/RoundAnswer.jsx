import React, { PropTypes } from 'react';

import { Icon, Tooltip } from 'antd';
import className from 'classnames';
class RoundAnswer extends React.Component {

	static propTypes = {
   		
  	}
  	renderFirst = (index) => {
  		return (
			<div className="operate-round-employee">
				<a href="javascript:void 0" 
					onClick={this.props.moveRoundAnswerEmployees.bind(this, 'down', index)}
					className=""><Icon type="arrow-down" /></a>
				<a href="javascript:void 0" 
					onClick={this.props.delRoundAnswerEmployees.bind(this, index)}
					className=""><Icon type="delete" /></a>
			</div>
  		)
  	}
  	renderOnly = (index) => {
  		return (
  			<div className="operate-round-employee">
				<a href="javascript:void 0" 
					onClick={this.props.delRoundAnswerEmployees.bind(this, index)}
					className=""><Icon type="delete" /></a>
			</div>
  			)
  	}
  	renderLast = (index) => {
  		return (
			<div className="operate-round-employee">
				<a href="javascript:void 0" 
					onClick={this.props.moveRoundAnswerEmployees.bind(this, 'up', index)}
					className=""><Icon type="arrow-up" /></a>
				<a href="javascript:void 0" 
					onClick={this.props.delRoundAnswerEmployees.bind(this, index)}
					className=""><Icon type="delete" /></a>
			</div>
  		)
  	}
  	renderOperate = (index) => {
  		return (
	  		<div className="operate-round-employee">
		  		<a href="javascript:void 0" 
					onClick={this.props.moveRoundAnswerEmployees.bind(this, 'up', index)}
					className=""><Icon type="arrow-up" /></a>
				<a href="javascript:void 0" 
					onClick={this.props.moveRoundAnswerEmployees.bind(this, 'down', index)}
					className=""><Icon type="arrow-down" /></a>
				<a href="javascript:void 0" 
					onClick={this.props.delRoundAnswerEmployees.bind(this, index)}
					className=""><Icon type="delete" /></a>
			</div>
		)
  	}
	render() {
		const {
			activeType,
			employee,
			intervalTime
		} = this.props.mode2Info
		return (
			<div 
				className={className("deploy-box", "right", {"active": this.props.mode})}
				onClick={this.props.toggleMode.bind(this, 1)}>
				<h2 className="head">模式二：轮转接听（多号码接听）</h2>
				<div className="person-container">
			    	<span className="left-side">接听人员设置:</span> 
			    	<button
			       		className="select-emp"
			        	onClick={this.props.showSelectEmployee}
			    	>
			        	+选择员工
			    	</button>
			    	{
			    		employee.length ?
			    		<ul className="person">
			        	{
			        		employee.map((item, index, arr) => {
			        			return (
									<li key={index}>
										<Tooltip 
							            	placement="left" 
							            	arrowPointAtCenter={true}
							            	title={item.f_phone}
							            	trigger="hover"
							            	overlayClassName="question-tip">
							            		<span className="person-span">{item.f_uname}</span>
    									</Tooltip>
										{
											index !== 0 ? (
												index !== arr.length -1 ? 
													this.renderOperate(index) :
														this.renderLast(index)
											) : (arr.length === 1 ? 
												this.renderOnly(index) : 
															this.renderFirst(index))
										}
									</li>
			        			)
			        		})
			        	}
			    		</ul> : null
			    	}
			    	
				</div>
				<div className="modal-container">
				    <span className="left-side">接听模式设置:</span>
				    <label className="label-radio radio">
				        <input
				            type="radio"
				            name="num2" 
				            checked={activeType === 3}
				            onChange={this.props.radioChangeMode2.bind(this, 3)}/>
				            <span></span>
				        <div>
				            <span>顺序&nbsp;&nbsp;&nbsp;&nbsp;以固定顺序依次振铃</span>
				            <Tooltip 
				            	placement="top" 
				            	arrowPointAtCenter={true}
				            	title="每次呼入都第一个电话先振铃，遇忙才转到第二个电话"
				            	trigger="hover"
				            	overlayClassName="question-tip">
      								<Icon type="question-circle" className="question-icon"/>
    						</Tooltip>

				        </div>    
				    </label>
				    <label className="label-radio radio">
				        <input
				            type="radio"
				            name="num2" 
				            checked={activeType === 4}
				            onChange={this.props.radioChangeMode2.bind(this, 4)} />
				            <span></span>
				        <div>
				            <span>轮序&nbsp;&nbsp;&nbsp;&nbsp;轮流选择振铃坐席</span>
				            <Tooltip 
				            	placement="bottom" 
				            	arrowPointAtCenter={true}
				            	title="第一次呼叫第一个电话先振铃，第二次呼入第二个电话先振铃，如此类推"
				            	trigger="hover"
				            	overlayClassName="question-tip">
      								<Icon type="question-circle" className="question-icon"/>
    						</Tooltip>
				        </div>    
				    </label>
				</div>
				<div className="time-container">
				    <span className="left-side">超时设置:</span>
				    <p>
				        当电话振铃超过
				        <input
				            type="text"
				            onChange={e => { this.props.changeIntervalTime(e) }}
				            // disabled={configureType !== 1}
				            value={intervalTime} />
				        秒时，转入下一个坐席
				    </p>
				</div>
				<div className="right-top-icon">
				</div>
			</div>
		)
	}
}
export default RoundAnswer;