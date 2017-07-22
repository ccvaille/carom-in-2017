import React, { PropTypes } from 'react';
import './index.less';

import { withRouter } from 'react-router';
import { ActivityIndicator } from 'antd-mobile';

class H5Detail extends React.Component {
	constructor(props) {
        super(props);
    }
	componentWillMount = () => {
		const { formId, dataId } = this.props.params;
    	const { h5FormDetailActions, h5FormDetailReducers } = this.props;

		h5FormDetailActions.getDataDetail({
			formId,
			dataId,
		});
	}
    componentWillReceiveProps = () => {
        const { h5FormDetailReducers } = this.props;
        if (window.__ec_bridge__ && window.__ec_native__) {
            __ec_bridge__.setTitle({
                title: '数据详情'
            }, (result, error) => {
                if (result.code === 0) {
                    console.log('我要更新title了哟');
                }
            });
        }

    }
	renderType105 = (item) => {
		return (
			<ul className="ans-ul">
				{
					item.answer.length ?
					<li>
						<i className="iconfont icon-dian"></i>
						{
							item.answer[0].picUrl ? 
							<img src={item.answer[0].picUrl+'?x-oss-process=image/resize,m_fill,w_200,h_150'} className="option-img"/> :
							null
						}
						<p>{item.answer[0].val}</p>
					</li> :
					<li>
						<p>---</p>
					</li>
				}
			</ul>
		)
	}
	renderType106 = (item) => {
		return (
			item.answer.length ?
			<ul className="ans-ul">
				{
					item.answer.map((element, index) => {
						return (
							<li key={'li-type' + index}>
								<i className="iconfont icon-dian"></i>
								{
									element.picUrl ? 
									<img src={element.picUrl+'?x-oss-process=image/resize,m_fill,w_200,h_150'} className="option-img"/> :
									null
								}
								<p>{element.val || '---'}</p>
							</li>
						)
					})
				}
			</ul> :
			<ul className="ans-ul">
				<li>
					<p>---</p>
				</li>
			</ul>
		)
	}
	renderType205 = (item) => {
		return (
			<ul className="ans-ul pay-ul">
				<li>
					<i className="iconfont icon-dian"></i>
					<p className="money">{ item.money }</p>
				</li>
				<li>
					<i className="iconfont icon-dian hide"></i>
					<p className={
						item.payState ? 'blue' : 'red'
					}>
						支付状态 :<span>{ item.payState ? '已支付' : '未支付' }</span>
					</p>
				</li>
				<li>
					<i className="iconfont icon-dian hide"></i>
					<p>微信昵称 :<span>{ item.wxUser || '---'}</span></p>
				</li>

				<li>
					<i className="iconfont icon-dian hide"></i>
					<p>商户订单号 :<span>{ item.tradeNo || '---' }</span></p>
				</li>
			</ul>
		)
	}
	renderTypeOther = (item) => {
		return (
			<ul className="ans-ul">
				<li>
					<p>{ item.answer || '---' }</p>
				</li>
			</ul>
		)
	}
	render = () => {
		const {
			detailData,
            isDetailLoading

		} = this.props.h5FormDetailReducers;
		return (
			<div className="form-detail">
				<div className="head">
					<h2>{detailData.form.title}</h2>
					<p>
						<span>{detailData.form.commitTime}</span>
					</p>
				</div>
				<div className="content">
					<ul className="detail-list">
					{
						detailData.detail &&
						detailData.detail.map((item, index) => {
							return (
								<li
									key={index}
									className="detail-list-item">
                                    {
                                        item.question ?
                                            <p className="qs">{item.question}</p> :
                                                null
                                    }

									{
										item.type !== 105 ? (
											item.type !== 106 ? (
												item.type !== 205 ? (
													this.renderTypeOther(item)
												) : this.renderType205(item)
											) : this.renderType106(item)
										) : this.renderType105(item)
									}
								</li>
							)
						})
					}
					</ul>
				</div>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={isDetailLoading}/>
			</div>
		)
	}
}

export default withRouter(H5Detail);
